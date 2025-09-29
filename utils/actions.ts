'use server';

import { clerkClient, auth, currentUser } from '@clerk/nextjs/server';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { AllRoles, CartType, FormState, ProductCategory } from './types';
import { redirect } from 'next/navigation';
import {
  allProductVariantsSchema,
  cartItemSchema,
  imageSchema,
  productSchema,
  productUpdateSchema,
  shippingAddressSchema,
  singleProductVariantSchema,
  userSchema,
  validateWithZodSchema,
} from './schemas';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { convertFormDataByFieldset } from './form';
import db from './db';
import { deleteImage, uploadImage } from './supabase';
import { ProductVariant } from '@/lib/generated/prisma';

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

export const clearUnstableCache = async () => {
  revalidateTag('cart');
  revalidateTag('addresses');
};

/////////////////////// Actions ///////////////////////

export const updateProfileAction = async (
  formState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const { userId } = await getAuthUser();
    const rawData = Object.fromEntries(formData);
    const data = validateWithZodSchema(userSchema, rawData);
    await client.users.updateUser(userId, { ...data });
    revalidatePath('/dashboard/profile');
    return { message: 'Profile is updated.', type: 'success' };
  } catch (error) {
    if (isClerkAPIResponseError(error) && error.status === 422) {
      return {
        message: 'Duplicate username, please try other values.',
        type: 'error',
      };
    }
    return renderError(error);
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

export const fetchAllProducts = async () => {
  const products = await db.product.findMany({
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
    orderBy: [
      { totalSales: 'desc' },
      { totalStock: 'desc' },
      { updatedAt: 'desc' },
    ],
  });
  return products;
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

export const createProductAction = async (
  formState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Only allow admin or moderator to perform an action.
    await authorizeRoles(['admin', 'moderator'], user);

    // Collect input data by fieldset
    const { nestedFormData } = convertFormDataByFieldset(formData);
    const { product } = nestedFormData;
    delete nestedFormData['product'];

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
      allProductVariantsSchema(category),
      Object.values(nestedFormData)
    );

    // Create product
    const { id: productId } = await db.product.create({
      data: { creatorId: user.userId, ...validatedProduct },
    });
    // Create product variant one by one to ensure ordering
    for (const variant of validatedVariants) {
      await db.productVariant.create({
        data: { productId, creatorId: user.userId, ...variant },
      });
    }
    // Update total product stock
    const totalStock = validatedVariants.reduce(
      (total, variant) => total + variant.stock,
      0
    );
    await db.product.update({ where: { id: productId }, data: { totalStock } });
  } catch (error) {
    return renderError(error);
  }
  return redirect('/admin/products');
};

export const createProductVariant = async (formData: FormData) => {
  const user = await getAuthUser();
  // Check if product is present.
  const productId = formData.get('productId') as string;
  const dbProduct = await db.product.findUnique({ where: { id: productId } });
  if (!dbProduct) throw new Error(`No product with id: "${productId}"`);
  // Only allow user who own the asset to perform an action.
  await authorizeOwner(dbProduct.creatorId, user);
  // Input validation
  const category = formData.get('category') as ProductCategory;
  const data = validateWithZodSchema(
    singleProductVariantSchema(category),
    Object.fromEntries(formData)
  );
  // Create product variant
  await db.productVariant.create({
    data: { productId, creatorId: user.userId, ...data },
  });
  // Update total product stock
  await db.product.update({
    where: { id: productId },
    data: { totalStock: { increment: data.stock } },
  });
  // Revalidate current path
  revalidatePath(`${productId}`);
};

export const updateProductImage = async (
  formData: FormData
): Promise<string> => {
  const user = await getAuthUser();

  const productId = formData.get('productId') as string;
  const image = formData.get('image') as File;
  // Check if product is present.
  const dbProduct = await db.product.findUnique({ where: { id: productId } });
  if (!dbProduct) throw new Error(`No product with id: "${productId}"`);
  const oldUrl = dbProduct.image;
  // Only allow admin or creator who own the asset to perform an action.
  await authorizeOwnerOrAdmin(dbProduct.creatorId, user);
  // Input validation
  const file = validateWithZodSchema(imageSchema, image);
  // Update product image
  const newUrl = await uploadImage(file);
  await db.product.update({
    where: { id: productId },
    data: { image: newUrl },
  });
  //  Delete old image from database storage
  await deleteImage(oldUrl);
  return newUrl;
};

export const updateProductAction = async (
  formState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if product is present.
    const productId = formData.get('id') as string;
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id: "${productId}"`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbProduct.creatorId, user);
    // Input validation
    const product = validateWithZodSchema(
      productUpdateSchema,
      Object.fromEntries(formData)
    );
    // Update product
    await db.product.update({
      where: { id: productId },
      data: product,
    });
    return { message: 'Product updated.', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductVariant = async (formData: FormData) => {
  const user = await getAuthUser();
  // Check if product variant is present
  const variantId = formData.get('id') as string;
  const dbVariant = await db.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!dbVariant) throw new Error(`No product option with id: "${variantId}"`);
  // Only allow admin or creator who own the asset to perform an action
  await authorizeOwnerOrAdmin(dbVariant.creatorId, user);
  // Input validation
  const category = formData.get('category') as ProductCategory;
  const variant = validateWithZodSchema(
    singleProductVariantSchema(category),
    Object.fromEntries(formData)
  );
  // Update product variant
  const { productId } = await db.productVariant.update({
    where: { id: variantId },
    data: variant,
  });
  // Update total product stock
  await db.product.update({
    where: { id: productId },
    data: {
      totalStock: { increment: variant.stock - dbVariant.stock },
    },
  });
  // Revalidate current path
  revalidatePath(`${productId}`);
};

export const updateCategoryAndVariantsAction = async (
  formState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if product is present.
    const productId = formData.get('productId') as string;
    formData.delete('productId');
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id: "${productId}"`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbProduct.creatorId, user);

    const category = formData.get('category') as ProductCategory;
    formData.delete('category');
    let newTotalStock: number;
    // 🧦 ACCESSORY Product
    if (category === 'accessory') {
      // Input validation
      const data = validateWithZodSchema(
        singleProductVariantSchema(category),
        Object.fromEntries(formData)
      );
      // Ensure accessory product has only one option
      await db.productVariant.deleteMany({ where: { productId } });
      // Create new variant
      await db.productVariant.create({
        data: { productId, creatorId: dbProduct.creatorId, ...data },
      });
      // Calculate new total stock
      newTotalStock = data.stock;
    } else {
      // 👕 CLOTHES & 👜 BAG Product
      // Input validation
      const { nestedFormData } = convertFormDataByFieldset(formData);
      const data = validateWithZodSchema(
        allProductVariantsSchema(category),
        Object.values(nestedFormData)
      );
      // Update all variants
      data.map(async (item) => {
        const { id } = item!;
        delete item['id'];
        await db.productVariant.update({ where: { id }, data: item });
      });
      // Calculate new total stock
      newTotalStock = data.reduce((acc, item) => acc + item.stock, 0);
    }
    // Update product category and total stock
    await db.product.update({
      where: { id: productId },
      data: { category, totalStock: newTotalStock },
    });

    // Revalidate path
    revalidatePath(`${productId}`);
    return {
      message: 'Updated category and options',
      type: 'success',
    };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteProduct = async (productId: string): Promise<FormState> => {
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
    revalidatePath('/dashboard/admin/products');
    return { message: 'Product deleted', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteProductVariant = async (
  variantId: string
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if product variant is present.
    const dbVariant = await db.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!dbVariant)
      throw new Error(`No product details with id: "${variantId}"`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbVariant.creatorId, user);

    const productId = dbVariant.productId;
    // Delete product variant
    await db.productVariant.delete({ where: { id: variantId } });
    // Update total product stock
    await db.product.update({
      where: { id: productId },
      data: {
        totalStock: {
          decrement: dbVariant.stock,
        },
      },
    });
    // Revalidate current path
    revalidatePath(`${productId}`);
    return { message: 'Product option deleted', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

const getAllAddresses = unstable_cache(
  async (userId) => {
    return db.shippingAddress.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  },
  ['addresses'],
  {
    tags: ['addresses'],
  }
);
export const fetchAllAddresses = async () => {
  const { userId } = await getAuthUser();
  const addresses = await getAllAddresses(userId);
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
  // Revalidate tag
  revalidateTag('addresses');
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
  // Revalidate tag
  revalidateTag('addresses');
};

export const deleteAddress = async (addressId: string): Promise<FormState> => {
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
    // Revalidate tag
    revalidateTag('addresses');
    return { message: 'Deleted shipping address', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

const getMyCart = unstable_cache(
  async (userId) => {
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
  },
  ['cart'],
  { tags: ['cart'] }
);
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
  // Clear cart cache;
  revalidateTag('cart');
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
  // Clear cart cache;
  revalidateTag('cart');
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
  // Clear cart cache;
  revalidateTag('cart');
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
  revalidateTag('cart');
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
  // Clear cart cache;
  revalidateTag('cart');
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
    const check = db.$transaction(async (prisma) => {
      const dbProductVariant = (await prisma.$queryRaw`
        SELECT * FROM ProductVariant
        WHERE id = ${productVariantId}
        FOR UPDATE`) as ProductVariant;
      if (!dbProductVariant) throw new Error(`Invalid product`);
      if (dbProductVariant.stock < quantity) return;
      // Create order item
      await prisma.orderItem.create({
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
      await prisma.productVariant.update({
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
