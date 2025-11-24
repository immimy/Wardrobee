'use server';

import { clerkClient, auth, currentUser } from '@clerk/nextjs/server';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { AllRoles, CartType, FormState, ProductCategory } from './types';
import { redirect } from 'next/navigation';
import {
  allProductVariantsSchema,
  cartItemSchema,
  imageSchema,
  optionalImageSchema,
  productSchema,
  productUpdateSchema,
  shippingAddressSchema,
  userSchema,
  validateWithZodSchema,
} from './schemas';
import { revalidatePath } from 'next/cache';
import { collectProductUpdate, collectProductCreate } from './form';
import db from './db';
import { deleteImage, uploadImage } from './supabase';
import { ProductVariant } from '@prisma/client';
import { undefined } from 'zod/v4';

const client = await clerkClient();

const getAuthUser = async () => {
  const { userId, sessionClaims } = await auth();
  if (!userId) return redirect('/');
  return { userId, role: (sessionClaims?.metadata.role || 'user') as AllRoles };
};

const authorizeRoles = async (
  authorizedRoles: Array<AllRoles>,
  user: Awaited<ReturnType<typeof getAuthUser>>
) => {
  if (!authorizedRoles.includes(user.role))
    throw new Error('Unauthorized to perform this action.');
};

const authorizeOwnerOrAdmin = async (
  dbUserId: string,
  user: Awaited<ReturnType<typeof getAuthUser>>
) => {
  if (user.role === 'admin') return;
  if (dbUserId !== user.userId)
    throw new Error('Unauthorized to perform this action.');
};

const authorizeOwner = async (
  dbUserId: string,
  user: Awaited<ReturnType<typeof getAuthUser>>
) => {
  if (dbUserId !== user.userId)
    throw new Error('Unauthorized to perform this action.');
};

const renderError = async (error: unknown): Promise<FormState> => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred.',
    type: 'error',
  };
};

/////////////////////// Actions ///////////////////////

export const updateProfile = async (formData: FormData): Promise<void> => {
  try {
    const { userId } = await getAuthUser();
    const rawData = Object.fromEntries(formData);
    const data = validateWithZodSchema(userSchema, rawData);
    await client.users.updateUser(userId, { ...data });
  } catch (error) {
    if (isClerkAPIResponseError(error) && error.status === 422) {
      throw new Error('Duplicate username, please try other values.');
    }
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const { userId } = await getAuthUser();
    await client.users.deleteUser(userId);
  } catch (error) {
    throw error;
  }
};

export const fetchAllProducts = async (searchParams: {
  [key: string]: string | undefined;
}) => {
  const { search, cursor, promotion, bestseller, featured } = searchParams;
  const limit = Number(searchParams.limit) || 9;
  let orderBy: { [key: string]: string }[] = [
    { createdAt: 'desc' },
    { id: 'desc' },
  ];

  // Filter conditions
  let whereConditions = {};
  if (search) {
    whereConditions = {
      ...whereConditions,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        {
          brand: { contains: search, mode: 'insensitive' },
        },
      ],
    };
  }
  if (promotion) {
    whereConditions = {
      ...whereConditions,
      variants: { some: { discount: { gt: 0 } } },
    };
  }
  if (bestseller) {
    orderBy = [{ totalSales: 'desc' }];
  }
  if (featured) {
    whereConditions = { ...whereConditions, featured: true };
  }
  // Cursor-based pagination
  const pagination:
    | { skip: 1; take: number; cursor: { id: string } }
    | { take: number } = cursor
    ? {
        skip: 1, // Skip the cursor
        take: limit + 1,
        cursor: { id: cursor },
      }
    : { take: limit + 1 };

  // Data query
  const products = await db.product.findMany({
    ...pagination,
    where: whereConditions,
    include: {
      variants: {
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          size: true,
          color: true,
          discount: true,
          stock: true,
        },
      },
    },
    orderBy,
  });

  // Data response
  const resp = {
    data: products.length > limit ? products.slice(0, -1) : products,
    // `nextCursor` is null when reaching the end
    nextCursor:
      products.length > limit ? products[products.length - 2].id : null,
  };
  return resp;
};

export const fetchSingleProduct = async (id: string) => {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          size: true,
          color: true,
          discount: true,
          stock: true,
        },
      },
    },
  });
  return product;
};

export const createProduct = async (formData: FormData) => {
  const user = await getAuthUser();
  // Only allow admin or moderator to perform an action.
  await authorizeRoles(['admin', 'moderator'], user);

  // Collect input data by fieldset
  const result = collectProductCreate(formData);
  const { product } = result;
  delete result['product'];

  // Input validation
  // 1. Product validation
  // 1.1) Image
  const rawFile = product.image as File;
  const file = validateWithZodSchema(imageSchema, rawFile);
  const imageUrl = await uploadImage(file);
  // 1.2) Data
  const validatedProduct = validateWithZodSchema(productSchema, {
    ...product,
    image: imageUrl,
  });
  const { category } = validatedProduct;
  // 2. Product variant validation
  const validatedVariants = validateWithZodSchema(
    allProductVariantsSchema({ category }),
    Object.values(result)
  );
  // Calculate total stock
  const totalStock = validatedVariants.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  const newProduct = await db.$transaction(async (tx) => {
    // Create product with total product stock
    const newProduct = await tx.product.create({
      data: { creatorId: user.userId, ...validatedProduct, totalStock },
      include: {
        variants: {
          where: { stock: { gt: 0 } },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            size: true,
            color: true,
            discount: true,
            stock: true,
          },
        },
      },
    });
    // Create product variant one by one to ensure ordering
    for (const variant of validatedVariants) {
      await tx.productVariant.create({
        data: { productId: newProduct.id, creatorId: user.userId, ...variant },
      });
    }
    return newProduct;
  });
  // Revalidate homepage
  if (newProduct.featured) revalidatePath('/');
  // Return new created product
  return newProduct;
};

export const updateProduct = async (formData: FormData) => {
  const user = await getAuthUser();
  // Check if product is present.
  const productId = formData.get('product[id]') as string;
  const dbProduct = await db.product.findUnique({
    where: { id: productId },
    select: { creatorId: true, image: true },
  });
  if (!dbProduct) throw new Error(`No product with id: "${productId}"`);
  // Only allow admin or creator who own the asset to perform an action.
  await authorizeOwnerOrAdmin(dbProduct.creatorId, user);
  // Collect form data
  const {
    product: rawProduct,
    createdVariants,
    updatedVariants,
    deletedVariants,
  } = collectProductUpdate(formData);
  // Input validation
  // 1. Product validation
  // 1.1) Image
  const rawFile = rawProduct.image as File;
  const file = validateWithZodSchema(optionalImageSchema, rawFile);
  let imageUrl = '';
  if (file.size) {
    // Update product image
    imageUrl = await uploadImage(file);
    // Delete the old image from database storage
    await deleteImage(dbProduct.image);
  }
  // 1.2) Data
  const product = validateWithZodSchema(productUpdateSchema, {
    ...rawProduct,
    image: imageUrl,
  });
  // 2. Created variants validation
  const createVariants = validateWithZodSchema(
    allProductVariantsSchema({ category: product.category }),
    createdVariants
  );
  // 3. Updated variants validation
  const updateVariants = validateWithZodSchema(
    allProductVariantsSchema({ category: product.category, requiredId: true }),
    updatedVariants
  );

  // Calculate new total product stock
  let newTotalStock = updateVariants.reduce((acc, item) => acc + item.stock, 0);
  if (createVariants) {
    newTotalStock += createVariants.reduce((acc, item) => acc + item.stock, 0);
  }

  // Update data to database
  // Update product data and total stock
  const dbUpdateProduct = db.product.update({
    where: { id: productId },
    data: { ...product, totalStock: newTotalStock },
  });
  // Create variants
  let dbCreateVariants: Promise<ProductVariant>[] = [];
  if (createVariants.length) {
    for (const variant of createVariants) {
      dbCreateVariants = [
        ...dbCreateVariants,
        db.productVariant.create({
          data: { productId: product.id, creatorId: user.userId, ...variant },
        }),
      ];
    }
  }
  // Update variants
  let dbUpdateVariants: Promise<ProductVariant>[] = [];
  if (updateVariants.length) {
    for (const variant of updateVariants) {
      dbUpdateVariants = [
        ...dbUpdateVariants,
        db.productVariant.update({
          where: { id: variant.id },
          data: { ...variant },
        }),
      ];
    }
  }
  // Delete variants
  const dbDeleteVariants = deletedVariants.length
    ? db.productVariant.deleteMany({
        where: { id: { in: deletedVariants } },
      })
    : undefined;

  // Resolve all requests
  await Promise.all([
    dbUpdateProduct,
    ...dbCreateVariants,
    ...dbUpdateVariants,
    dbDeleteVariants,
  ]);
  // Revalidate path
  // 1. Single product page
  revalidatePath(`/products/${productId}`);
  // 2. Homepage
  if (product.featured) revalidatePath('/');
};

export const deleteProductAction = async (
  productId: string
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if product is present.
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id: "${productId}"`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbProduct.creatorId, user);
    // Remove product from database
    await deleteImage(dbProduct.image);
    await db.product.delete({ where: { id: productId } });
    // Revalidate path
    revalidatePath(`/products/${productId}`);
    return { message: 'Product deleted', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAllAddresses = async () => {
  const { userId } = await getAuthUser();
  const addresses = await db.shippingAddress.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
  return addresses;
};

export const createAddress = async (formData: FormData): Promise<void> => {
  // Only login user can perform an action
  const { userId } = await getAuthUser();
  // Input validation
  const rawData = Object.fromEntries(formData);
  const data = validateWithZodSchema(shippingAddressSchema, rawData);
  // Limit address to 3
  const numOfShippingAddress = await db.shippingAddress.count({
    where: { userId },
  });
  if (numOfShippingAddress === 3)
    throw new Error('Shipping address is limited to 3');
  // The first address must be default.
  if (numOfShippingAddress < 1) {
    data.isDefault = true;
  } else {
    // Ensure only 1 default address per 1 userId
    if (data.isDefault) {
      const oldDefault = await db.shippingAddress.findFirst({
        where: { userId, isDefault: true },
      });
      oldDefault &&
        (await db.shippingAddress.update({
          where: { id: oldDefault.id },
          data: { isDefault: false },
        }));
    }
  }
  // Crete shipping address
  await db.shippingAddress.create({ data: { userId, ...data } });
  // ⚠️ Revalidate tag
};

export const updateAddress = async (formData: FormData): Promise<void> => {
  const user = await getAuthUser();
  // Check if address is present
  const addressId = formData.get('id') as string;
  const dbAddress = await db.shippingAddress.findUnique({
    where: { id: addressId },
  });
  if (!dbAddress)
    throw new Error(`No shipping address with id: "${addressId}"`);
  // Only allow user who own the asset to perform an action.
  await authorizeOwner(dbAddress.userId, user);
  // Input validation
  const data = validateWithZodSchema(
    shippingAddressSchema,
    Object.fromEntries(formData)
  );
  // Ensure only 1 default address per 1 userId
  if (data.isDefault) {
    const oldDefault = await db.shippingAddress.findFirst({
      where: { userId: user.userId, isDefault: true },
    });
    oldDefault &&
      (await db.shippingAddress.update({
        where: { id: oldDefault.id },
        data: { isDefault: false },
      }));
  }
  // Update address
  await db.shippingAddress.update({
    where: { id: addressId },
    data: { ...data },
  });
  // ⚠️ Revalidate tag
};

export const deleteAddressAction = async (
  addressId: string
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if address is present
    const dbAddress = await db.shippingAddress.findUnique({
      where: { id: addressId },
    });
    if (!dbAddress)
      throw new Error(`No shipping address with id: "${addressId}"`);
    // Only allow user who own the asset to perform an action.
    await authorizeOwner(dbAddress.userId, user);
    // Remove address from database
    await db.shippingAddress.delete({ where: { id: addressId } });
    // ⚠️ Revalidate tag
    return { message: 'Deleted shipping address', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

const getMyCart = (userId: string) => {
  return db.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        orderBy: { createdAt: 'asc' },
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  variants: {
                    // Only select available products
                    where: { stock: { gt: 0 } },
                    select: {
                      id: true,
                      size: true,
                      color: true,
                      discount: true,
                      stock: true,
                    },
                    orderBy: { createdAt: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};
const emptyCart = {
  cartItems: {},
  subtotal: 0,
  totalQuantity: 0,
  deletedCartItems: {},
};
// Validate cart items and provide cart items data
export const refreshCart = async (): Promise<CartType> => {
  const user = await currentUser();
  if (!user) return emptyCart;
  const cart = await getMyCart(user.id);
  if (!cart || cart.cartItems.length < 1) return emptyCart;

  let returnData: CartType = { ...emptyCart };

  for (let cartItem of cart.cartItems) {
    const variantId = cartItem.productVariantId;
    const options = cartItem.productVariant.product.variants;
    const index = options.findIndex((option) => option.id === variantId);

    // Avoiding stale cart items
    // Case 1: Cart item is valid.
    if (index !== -1) {
      const stock = options[index].stock;
      // Update cart item quantity if stock is less than quantity.
      if (stock < cartItem.quantity) {
        await db.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: stock },
        });
        cartItem.quantity = stock;
      }
      // Formatting cart items
      const product = cartItem.productVariant.product;
      returnData.cartItems = {
        ...returnData.cartItems,
        [cartItem.id]: {
          data: {
            productId: product.id,
            image: product.image,
            name: product.name,
            category: product.category as ProductCategory,
            price: product.price,
          },
          state: {
            variantId,
            quantity: cartItem.quantity,
          },
          options,
        },
      };
      // Calculating subtotal and total quantity
      const { quantity } = cartItem;
      const { discount } = cartItem.productVariant;
      const { price } = product;
      const sellingPrice = price * (1 - discount / 100);
      returnData.subtotal = returnData.subtotal + quantity * sellingPrice;
      returnData.totalQuantity = returnData.totalQuantity + quantity;
    } else {
      // Case 2: Cart item is invalid.
      // (Product variant is out of stock.)
      await db.cartItem.delete({ where: { id: cartItem.id } });
      // Formatting deleted cart items
      const product = cartItem.productVariant.product;
      const productVariant = cartItem.productVariant;
      returnData.deletedCartItems = {
        ...returnData.deletedCartItems,
        [cartItem.id]: {
          variantId,
          image: product.image,
          name: product.name,
          category: product.category as ProductCategory,
          price: product.price,
          size: productVariant.size,
          color: productVariant.color,
          discount: productVariant.discount,
        },
      };
    }
  }
  // ⚠️ Clear cart cache;
  return returnData;
};

export const fetchCart = async (): Promise<CartType> => {
  const user = await currentUser();
  if (!user) return emptyCart;
  const cart = await getMyCart(user.id);
  if (!cart || cart.cartItems.length < 1) return emptyCart;

  let returnData: CartType = { ...emptyCart };

  for (let cartItem of cart.cartItems) {
    const variantId = cartItem.productVariantId;
    const options = cartItem.productVariant.product.variants;
    // Formatting cart items
    const product = cartItem.productVariant.product;
    returnData.cartItems = {
      ...returnData.cartItems,
      [cartItem.id]: {
        data: {
          productId: product.id,
          image: product.image,
          name: product.name,
          category: product.category as ProductCategory,
          price: product.price,
        },
        state: {
          variantId,
          quantity: cartItem.quantity,
        },
        options,
      },
    };
    // Calculating subtotal and total quantity
    const { quantity } = cartItem;
    const { discount } = cartItem.productVariant;
    const { price } = product;
    const sellingPrice = price * (1 - discount / 100);
    returnData.subtotal = returnData.subtotal + quantity * sellingPrice;
    returnData.totalQuantity = returnData.totalQuantity + quantity;
  }

  return returnData;
};

export const clearCart = async () => {
  const user = await currentUser();
  if (!user) throw new Error('Please log in before performing an action');
  // Delete all cart items related to the user
  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!cart) throw new Error('No cart related with the user');
  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
  // ⚠️ Clear cart cache;
};

export const addToCart = async (formData: FormData) => {
  // Check if user log in
  const user = await currentUser();
  if (!user)
    throw new Error('Please log in before adding an item to the cart.');
  // Input validation
  const data = validateWithZodSchema(
    cartItemSchema,
    Object.fromEntries(formData)
  );
  // Check if product is still available
  const dbProductVariant = await db.productVariant.findUnique({
    where: { id: data.productVariantId },
    select: { stock: true },
  });
  if (!dbProductVariant)
    throw new Error(`Invalid product id: "${data.productVariantId}"`);
  const { stock } = dbProductVariant;
  // Ensure there is only one cart per each users
  let cart: { id: string } | null;
  cart = await db.cart.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!cart) {
    cart = await db.cart.create({
      data: { userId: user.id },
      select: { id: true },
    });
  }
  // Check if item is already in the cart
  const dbCartItem = await db.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productVariantId: data.productVariantId,
    },
    select: { quantity: true },
  });
  // Cart item quantity must not exceed product stock.
  const newQuantity = dbCartItem
    ? dbCartItem.quantity + data.quantity
    : data.quantity;
  const isExceedStock = newQuantity > stock;
  const ensuredQuantity = isExceedStock ? stock : newQuantity;
  // Update to the existing cart item or Create new one
  const {
    id,
    productVariantId: variantId,
    quantity,
  } = await db.cartItem.upsert({
    where: {
      cartId_productVariantId: {
        cartId: cart.id,
        productVariantId: data.productVariantId,
      },
    },
    update: { quantity: ensuredQuantity },
    create: {
      cartId: cart.id,
      productVariantId: data.productVariantId,
      quantity: ensuredQuantity,
    },
  });
  // Return data
  const returnData = {
    cartItemId: id,
    state: { variantId, quantity },
  };
  // ⚠️ Clear cart cache;
  return { returnData };
};

export const updateCartItem = async (formData: FormData) => {
  // Check if user log in
  const user = await currentUser();
  if (!user)
    throw new Error('Please log in before updating an item in the cart.');
  // Input validation
  const cartItemId = formData.get('id') as string;
  const { productVariantId, quantity } = validateWithZodSchema(
    cartItemSchema,
    Object.fromEntries(formData)
  );
  // Check if product is still available
  const dbProductVariant = await db.productVariant.findUnique({
    where: { id: productVariantId },
    select: { stock: true },
  });
  if (!dbProductVariant)
    throw new Error(`Invalid product id: "${productVariantId}"`);
  const { stock } = dbProductVariant;
  // Check if cart item is available
  const dbCartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    select: { cartId: true },
  });
  if (!dbCartItem) throw new Error(`No cart item with id: "${cartItemId}"`);

  let isExceedStock: boolean;
  let returnData: {
    cartItemId: string;
    state: { variantId: string; quantity: number };
  };
  const dbProductInCart = await db.cartItem.findFirst({
    where: {
      cartId: dbCartItem.cartId,
      productVariantId,
      id: { not: cartItemId },
    },
    select: { id: true, quantity: true },
  });
  // 1. Product is already in the cart.
  if (dbProductInCart) {
    const newQuantity = dbProductInCart.quantity + quantity;
    isExceedStock = newQuantity > stock;
    const ensuredQuantity = isExceedStock ? stock : newQuantity;
    // Using transaction to guarantee either succeed or fail as a whole
    const [cartItem] = await db.$transaction([
      // Update existing cart item
      db.cartItem.update({
        where: { id: dbProductInCart.id },
        data: { quantity: ensuredQuantity },
      }),
      // Delete incoming cart item
      db.cartItem.delete({ where: { id: cartItemId } }),
    ]);

    returnData = {
      cartItemId: cartItem.id,
      state: {
        variantId: cartItem.productVariantId,
        quantity: cartItem.quantity,
      },
    };
  } else {
    // 2. Product is NOT in the cart.
    isExceedStock = quantity > stock;
    const ensuredQuantity = isExceedStock ? stock : quantity;
    const cartItem = await db.cartItem.update({
      where: { id: cartItemId },
      data: {
        productVariantId,
        quantity: ensuredQuantity,
      },
    });

    returnData = {
      cartItemId: cartItem.id,
      state: {
        variantId: cartItem.productVariantId,
        quantity: cartItem.quantity,
      },
    };
  }

  // ⚠️ Revalidate tag
  return {
    returnData,
  };
};

export const deleteCartItem = async (id: string) => {
  // Check if user log in
  const user = await currentUser();
  if (!user)
    throw new Error('Please log in before updating an item in the cart.');
  // Check if cart item is present
  const dbCartItem = await db.cartItem.findUnique({ where: { id } });
  if (!dbCartItem) throw new Error(`No cart item with id: "${id}"`);
  // Remove cart item from database
  await db.cartItem.delete({ where: { id } });
  // ⚠️ Clear cart cache;
};

// ⚠️⚠️📢 DEV
export const checkoutAction = async (userId: string) => {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: { cartItems: true },
  });
  if (!cart?.cartItems) return;
  // Create new order
  const order = await db.order.create({
    data: {
      userId,
      shippingAddress: 'some address',
      shippingFee: 50,
      subtotal: 0.0,
      total: 0.0,
      clientSecret: 'client secret',
      paymentIntentId: 'payment intent id',
    },
  });
  let checks: Promise<void>[] = [];
  // Use transaction and row-level lock mode to avoid overselling issue.
  for (const cartItem of cart.cartItems) {
    const { productVariantId, quantity } = cartItem;

    // BEGIN
    // Lock product variant until
    const check = db.$transaction(async (tx) => {
      const dbProductVariant = (await tx.$queryRaw`
        SELECT * FROM ProductVariant
        WHERE id = ${productVariantId}
        FOR UPDATE`) as ProductVariant;
      if (!dbProductVariant) throw new Error(`Invalid product`);
      if (dbProductVariant.stock < quantity) return;
      // Create order item
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: dbProductVariant.productId,
          productVariantId: productVariantId,
          productImage: 'image url',
          productName: 'product name',
          productSize: 'product size',
          productColor: 'product color',
          unitPrice: 0, // original price
          discountAmount: 0,
          quantity: cartItem.quantity,
          total: 0,
        },
      });
      // Update product variant stock
      await tx.productVariant.update({
        where: { id: dbProductVariant.id },
        data: { stock: { decrement: quantity } },
      });
    });
    // COMMIT

    // Collect promise
    checks = [...checks, check];
  }

  // await all stock check
  await Promise.all(checks);

  // Check if order items more than zero
  const confirmOrder = await db.order.findUnique({
    where: { id: order.id },
    include: { OrderItems: true },
  });
  if (!confirmOrder?.OrderItems || confirmOrder.OrderItems.length < 1) {
    db.order.delete({ where: { id: order.id } });
    throw new Error('Failed to place an order');
  }
};
