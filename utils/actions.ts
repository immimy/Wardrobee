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
import { revalidatePath, revalidateTag } from 'next/cache';
import { collectProductUpdate, collectProductCreate } from './form';
import db from './db';
import { deleteImage, uploadImage } from './supabase';
import { Prisma, ProductVariant, ShippingAddress } from '@prisma/client';
import { getMockAddress, getMockProduct, uploadMockImage } from './mock';

const client = await clerkClient();

export const getAuthUser = async () => {
  const { userId, sessionClaims } = await auth();
  if (!userId) return redirect('/');
  return { userId, role: (sessionClaims?.metadata.role || 'user') as AllRoles };
};

const isAuthorizedUser = (
  user: Awaited<ReturnType<typeof getAuthUser>>,
  authorized: { roles?: AllRoles[]; dbUserId?: string }
) => {
  // Check if user is the owner
  if (authorized.dbUserId && authorized.dbUserId === user.userId) return;
  // Check if user role is given permission
  if (authorized.roles && authorized.roles.includes(user.role)) return;
  throw new Error('Unauthorized to perform this action.');
};

const renderError = async (error: unknown): Promise<FormState> => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred.',
    type: 'error',
  };
};

export const demoLogin = async (role: 'user' | 'moderator') => {
  const client = await clerkClient();
  let userId = '';
  if (role === 'user') userId = process.env.USER_ID!;
  if (role === 'moderator') userId = process.env.MOD_ID!;
  const token = await client.signInTokens.createSignInToken({
    userId,
    expiresInSeconds: 60 * 60 * 24 * 7, // one week
  });
  redirect(token.url);
};

/////////////////////// Actions ///////////////////////

export const updateProfile = async (formData: FormData): Promise<void> => {
  try {
    const { userId } = await getAuthUser();
    if (userId === process.env.USER_ID || userId === process.env.MOD_ID)
      throw new Error(
        'Demo accounts are restricted from updating their usernames.'
      );
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
    if (userId === process.env.USER_ID || userId === process.env.MOD_ID)
      throw new Error(
        'Demo accounts are restricted from closing their accounts.'
      );
    await client.users.deleteUser(userId);
  } catch (error) {
    if (!(error instanceof Error))
      throw new Error('Failed to close an account');
    throw error;
  }
};

export const fetchAllProducts = async (searchParams: {
  [key: string]: string | undefined;
}) => {
  const { search, cursor, promotion, bestseller, featured, creatorId } =
    searchParams;
  const limit = Number(searchParams.limit) || 9;
  let orderBy: { [key: string]: string }[] = [{ id: 'desc' }];

  // Filter conditions
  let whereConditions = {};
  if (creatorId) {
    whereConditions = { ...whereConditions, creatorId };
  }
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
    orderBy = [{ totalSales: 'desc' }, ...orderBy];
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
  const user = await currentUser();
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
      favorites: { where: { userId: user?.id }, select: { id: true } },
    },
  });
  return product;
};

export const createProduct = async (formData: FormData) => {
  const user = await getAuthUser();
  // Only allow admin or moderator to perform an action.
  isAuthorizedUser(user, { roles: ['admin', 'moderator'] });

  // Collect input data by fieldset
  const result = collectProductCreate(formData);
  const { product } = result;
  delete result['product'];

  // Input validation
  // 1. Product validation
  // 1.1) Image
  const rawFile = product.image as File;
  validateWithZodSchema(imageSchema, rawFile);
  // 📑 Mock data layer (image) 📑
  let imageUrl = '';
  if (user.role !== 'admin') {
    imageUrl = await uploadMockImage();
  } else {
    imageUrl = await uploadImage(rawFile);
  }
  // 1.2) Data
  const validatedProduct = validateWithZodSchema(productSchema, {
    ...product,
    image: imageUrl,
  });
  // 📑 Mock data layer (name, description) 📑
  if (user.role !== 'admin') {
    Object.assign(validatedProduct, { name: getMockProduct('name') as string });
    if (product.description) {
      Object.assign(validatedProduct, {
        description: getMockProduct('description') as string,
      });
    }
  }

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

  // Create product with total product stock
  const newProduct = await db.product.create({
    data: {
      creatorId: user.userId,
      ...validatedProduct,
      totalStock,
      variants: {
        createMany: {
          data: validatedVariants.map((item) => ({
            ...item,
            creatorId: user.userId,
          })),
        },
      },
    },
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
    select: { creatorId: true, image: true, name: true, description: true },
  });
  if (!dbProduct) throw new Error(`No product with id: "${productId}"`);
  // Only allow admin or creator who own the asset to perform an action.
  isAuthorizedUser(user, { roles: ['admin'], dbUserId: dbProduct.creatorId });
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
    // 📑 Mock data layer (image) 📑
    if (user.role !== 'admin') {
      imageUrl = await uploadMockImage();
    } else {
      imageUrl = await uploadImage(file);
    }
    // Delete the old image from database storage
    await deleteImage(dbProduct.image);
  }
  // 1.2) Data
  const product = validateWithZodSchema(productUpdateSchema, {
    ...rawProduct,
    image: imageUrl,
  });
  // 📑 Mock data layer (name, description) 📑
  if (dbProduct.name !== product.name && user.role !== 'admin') {
    Object.assign(product, { name: getMockProduct('name') as string });
  }
  if (
    product.description &&
    (dbProduct.description ?? '') !== (product.description ?? '') &&
    user.role !== 'admin'
  ) {
    Object.assign(product, {
      description: getMockProduct('description') as string,
    });
  }

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
    select: { image: true, name: true, description: true },
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
  const [updatedProduct] = await Promise.all([
    dbUpdateProduct,
    ...dbCreateVariants,
    ...dbUpdateVariants,
    dbDeleteVariants,
  ]);
  // Revalidate path
  // 1. Homepage
  if (product.featured) revalidatePath('/');
  // Return updated data to show that input has been successfully updated and replaced with mock data.
  return updatedProduct;
};

export const deleteProducts = async (formData: FormData) => {
  const productIds = formData.getAll('productId') as string[];
  const user = await getAuthUser();
  // Check if product is present.
  const dbProducts = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, creatorId: true, image: true },
  });
  if (!dbProducts.length)
    throw new Error(`No product with id: "${productIds.concat(', ')}"`);
  // Only allow admin or creator who own the asset to perform an action.
  const creator = new Set(dbProducts.map((item) => item.creatorId));
  if (creator.size > 1) {
    isAuthorizedUser(user, { roles: ['admin'] });
  } else {
    isAuthorizedUser(user, {
      roles: ['admin'],
      dbUserId: dbProducts[0].creatorId,
    });
  }
  // Remove product from database
  await deleteImage(dbProducts.map((item) => item.image));
  await db.product.deleteMany({ where: { id: { in: productIds } } });
  // Revalidate paths
  // 1. Homepage
  revalidatePath('/');
};

export const fetchAllAddresses = async (userId: string) => {
  const addresses = await db.shippingAddress.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    omit: { userId: true },
  });
  return addresses;
};

export const createAddress = async (
  formData: FormData
): Promise<Omit<ShippingAddress, 'userId'>> => {
  // Only login user can perform an action
  const { userId } = await getAuthUser();
  // Input validation
  const rawData = Object.fromEntries(formData);
  const data = validateWithZodSchema(shippingAddressSchema, rawData);
  // Limit address to 3
  const dbAddresses = await db.shippingAddress.findMany({
    where: { userId },
    select: { id: true, isDefault: true },
  });
  if (dbAddresses.length > 2)
    throw new Error('Shipping address is limited to 3');
  // 📑 Mock data layer 📑
  Object.assign(data, {
    receiver: getMockAddress('receiver'),
    address: getMockAddress('address'),
    phoneNumber: getMockAddress('phoneNumber'),
  });
  // The first address must be default.
  if (dbAddresses.length < 1) {
    data.isDefault = true;
  } else if (data.isDefault) {
    // Ensure only 1 default address per 1 userId
    const defaultAddress = dbAddresses.find((item) => item.isDefault === true);
    if (defaultAddress) {
      await db.shippingAddress.update({
        where: { id: defaultAddress.id },
        data: { isDefault: false },
      });
    }
  }
  // Crete shipping address
  const shippingAddress = await db.shippingAddress.create({
    data: { userId, ...data },
    omit: { userId: true },
  });
  // Revalidate tag
  revalidateTag(`${userId}-all-addresses`);

  return shippingAddress;
};

export const updateAddress = async (formData: FormData) => {
  const user = await getAuthUser();
  // Check if address is present
  const addressId = formData.get('id') as string;
  const dbAddress = await db.shippingAddress.findUnique({
    where: { id: addressId },
  });
  if (!dbAddress)
    throw new Error(`No shipping address with id: "${addressId}"`);
  // Only allow user who own the asset to perform an action.
  isAuthorizedUser(user, { dbUserId: dbAddress.userId });
  // Input validation
  const data = validateWithZodSchema(
    shippingAddressSchema,
    Object.fromEntries(formData)
  );
  // 📑 Mock data layer 📑
  if (dbAddress.receiver !== data.receiver) {
    Object.assign(data, { receiver: getMockAddress('receiver') });
  }
  if (dbAddress.address !== data.address) {
    Object.assign(data, { address: getMockAddress('address') });
  }
  if (dbAddress.phoneNumber !== data.phoneNumber) {
    Object.assign(data, { phoneNumber: getMockAddress('phoneNumber') });
  }

  // Ensure only 1 default address per 1 userId
  if (data.isDefault) {
    const dbDefault = await db.shippingAddress.findFirst({
      where: { userId: user.userId, isDefault: true },
      select: { id: true },
    });
    if (dbDefault) {
      await db.shippingAddress.update({
        where: { id: dbDefault.id },
        data: { isDefault: false },
      });
    }
  }
  // Update address
  const updateAddress = await db.shippingAddress.update({
    where: { id: addressId },
    data: { ...data },
    omit: { userId: true },
  });
  // Revalidate tag
  revalidateTag(`${user.userId}-all-addresses`);
  return updateAddress;
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
    isAuthorizedUser(user, { dbUserId: dbAddress.userId });
    // Remove address from database
    await db.shippingAddress.delete({ where: { id: addressId } });
    //  Revalidate tag
    revalidateTag(`${user.userId}-all-addresses`);
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
  // Revalidate tag
  revalidateTag(`${user.id}-cart`);
  return returnData;
};

export const fetchCart = async (userId: string): Promise<CartType> => {
  const cart = await getMyCart(userId);
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
  // Revalidate tag
  revalidateTag(`${user.id}-cart`);
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
  // Revalidate tag
  revalidateTag(`${user.id}-cart`);
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
  // Revalidate tag
  revalidateTag(`${user.id}-cart`);
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
  // Revalidate tag
  revalidateTag(`${user.id}-cart`);
};

export const checkout = async (formData: FormData) => {
  const { userId } = await getAuthUser();
  const addressId = formData.get('addressId') as string;

  // Validate shipping address
  const dbShippingAddress = await db.shippingAddress.findUnique({
    where: { id: addressId },
  });
  if (!dbShippingAddress) throw new Error('Please provide a shipping address');
  // Validate cart items
  const cart = await db.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: { productVariant: { include: { product: true } } },
      },
    },
  });
  if (!cart?.cartItems) throw new Error('Your cart is empty.');

  const shippingFee = 100;
  const shippingAddress = [
    dbShippingAddress.receiver,
    `(${dbShippingAddress.phoneNumber})`,
    dbShippingAddress.address,
  ].join('\r\n');
  // Create new empty order
  const order = await db.order.create({
    data: {
      userId,
      shippingAddress,
      shippingFee,
      clientSecret: 'client secret',
      paymentIntentId: 'payment intent id',
    },
    select: { id: true },
  });
  // Place several order items in parallel
  // Use transaction and row-level lock to avoid overselling issue.
  let allTransactions: Promise<{ id: string }>[] = [];
  for (const cartItem of cart.cartItems) {
    const { quantity } = cartItem;
    const dbProductVariant = cartItem.productVariant;
    const dbProduct = cartItem.productVariant.product;

    const transaction = db.$transaction(async (tx) => {
      // Row-level lock (via FOR UPDATE clause)
      const dbData = await tx.$queryRaw<
        {
          discount: number;
          stock: number;
        }[]
      >(Prisma.sql`SELECT discount, stock FROM "ProductVariant" 
        WHERE id = ${dbProductVariant.id} FOR UPDATE`);

      if (!dbData?.length) throw new Error('Invalid product');
      if (dbData[0].stock < 1) throw new Error('Product is out of stock.');

      // Ensure placed quantity doesn't exceed stock
      const { stock, discount } = dbData[0];
      const validQuantity = stock < quantity ? stock : quantity;
      const total = validQuantity * (dbProduct.price * (1 - discount / 100));

      // Create order item (Snapshot)
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: order.id,
          productVariantId: dbProductVariant.id,
          productId: dbProduct.id,
          productImage: dbProduct.image,
          productName: dbProduct.name,
          productSize: dbProductVariant.size,
          productColor: dbProductVariant.color,
          price: dbProduct.price,
          discount,
          quantity: validQuantity,
          total,
        },
        select: { id: true },
      });

      // Update stock and sales (Both Product and Variant)
      await tx.productVariant.update({
        where: { id: dbProductVariant.id },
        data: {
          stock: { decrement: validQuantity },
          sales: { increment: validQuantity },
          product: {
            update: {
              totalStock: { decrement: validQuantity },
              totalSales: { increment: validQuantity },
            },
          },
        },
      });

      return orderItem;
    });
    // Collect all transactions
    allTransactions = [...allTransactions, transaction];
  }
  // Await for all order items no matter what the results
  // Users will always succeed on placing an order with valid items.
  const orderItems = await Promise.allSettled(allTransactions);
  const isAtLeastOneSuccess = orderItems.some(
    (item) => item.status === 'fulfilled'
  );
  // If order items is less than 1
  if (!isAtLeastOneSuccess) {
    // Remove order from database
    await db.order.delete({ where: { id: order.id } });
    throw new Error('Failed to place an order');
  }

  // Clearing cart
  await db.cart.delete({ where: { id: cart.id } });
  // Revalidate homepage
  revalidatePath('/');
  // Revalidate cart (Checkout Page)
  revalidateTag(`${userId}-cart`);
};

export const fetchAllFavorites = async (searchParams: {
  [key: string]: string | undefined;
}) => {
  const { userId } = await getAuthUser();

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 9;
  const skip = Number(page - 1) * limit;

  const [products, totalFavorites] = await Promise.all([
    db.favorite.findMany({
      skip,
      take: limit,
      where: { userId },
      omit: { userId: true },
      include: {
        product: {
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
        },
      },
      orderBy: { id: 'desc' },
    }),
    db.product.count({
      where: { favorites: { some: { userId } } },
    }),
  ]);

  return {
    data: products,
    meta: {
      page: 1,
      totalPage: Math.ceil(totalFavorites / limit),
      totalCount: totalFavorites,
    },
  };
};

export const fetchMyFavoriteIds = async () => {
  const user = await currentUser();
  if (!user) return [];
  const favorites = await db.favorite.findMany({
    where: { userId: user?.id },
    omit: { userId: true },
    orderBy: { productId: 'asc' }, // For binary search
  });
  return favorites;
};

export const toggleFavorite = async ({
  favoriteId,
  productId,
  pathname,
}: {
  favoriteId?: string;
  productId: string;
  pathname?: string;
}) => {
  const { userId } = await getAuthUser();
  if (favoriteId) {
    // Delete favorite
    await db.favorite.delete({ where: { id: favoriteId } });
    // Revalidate current page
    if (pathname) revalidatePath(pathname);
  } else {
    // Create favorite
    const resp = await db.favorite.create({
      data: { userId, productId },
      omit: { userId: true },
    });
    // Revalidate current page
    if (pathname) revalidatePath(pathname);
    return resp;
  }
};

export const fetchAllOrders = async () => {
  const { userId, role } = await getAuthUser();
  let whereConditions = {};
  if (role === 'user') {
    whereConditions = { userId };
  }
  const orders = await db.order.findMany({
    where: whereConditions,
    omit: { clientSecret: true, paymentIntentId: true },
    include: { orderItems: { select: { total: true } } },
    orderBy: { updatedAt: 'desc' },
  });
  const result = orders.map((item) => {
    const { userId: dbUserId, orderItems, ...rest } = item;
    const total = orderItems.reduce((acc, item) => acc + Number(item.total), 0);
    return { ...rest, orderTotal: total, isOwner: String(dbUserId === userId) };
  });
  return result;
};

export const fetchSingleOrder = async (id: string) => {
  const user = await getAuthUser();
  // Fetch data from the database
  const order = await db.order.findFirst({
    where: { id },
    include: { orderItems: true },
    omit: { clientSecret: true, paymentIntentId: true },
  });
  if (!order) return redirect('/dashboard/orders');
  const { userId, ...returnData } = order;
  // User can only see their orders,
  // but admin and moderator can see all orders.
  isAuthorizedUser(user, {
    roles: ['admin', 'moderator'],
    dbUserId: userId,
  });
  return returnData;
};
