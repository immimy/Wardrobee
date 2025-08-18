'use server';

import { clerkClient, auth, currentUser } from '@clerk/nextjs/server';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { AllRoles, FormState, ProductCategory } from './types';
import { redirect } from 'next/navigation';
import {
  allProductVariantsSchema,
  imageSchema,
  productSchema,
  productUpdateSchema,
  shippingAddressSchema,
  singleProductVariantSchema,
  userSchema,
  validateWithZodSchema,
} from './schemas';
import { revalidatePath } from 'next/cache';
import { convertFormDataByFieldset } from './form';
import db from './db';
import { deleteImage, uploadImage } from './supabase';

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

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const { userId } = await getAuthUser();
    const rawData = Object.fromEntries(formData);
    const data = validateWithZodSchema(userSchema, rawData);
    await client.users.updateUser(userId, { ...data });
    revalidatePath('/dashboard/profile');
    return { message: 'Profile updated', type: 'success' };
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
        take: 1,
        orderBy: { numberId: 'asc' },
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
    include: { variants: { orderBy: { numberId: 'asc' } } },
  });
  return product;
};

export const createProductAction = async (
  prevState: any,
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
      data: { creator: user.userId, ...validatedProduct },
    });
    // Create multiple product variants
    const validatedProductVariants = validatedVariants.map((variant) => {
      return { productId, creator: user.userId, ...variant };
    });
    await db.productVariant.createMany({
      data: validatedProductVariants,
    });
    // Update total product stock
    const totalStock = validatedProductVariants.reduce(
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
  if (!dbProduct) throw new Error(`No product with id ${productId}.`);
  // Only allow user who own the asset to perform an action.
  await authorizeOwner(dbProduct.creator, user);
  // Input validation
  const category = formData.get('category') as ProductCategory;
  const data = validateWithZodSchema(
    singleProductVariantSchema(category),
    Object.fromEntries(formData)
  );
  // Create product variant
  await db.productVariant.create({
    data: { productId, creator: user.userId, ...data },
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
  if (!dbProduct) throw new Error(`No product with id ${productId}`);
  const oldUrl = dbProduct.image;
  // Only allow admin or creator who own the asset to perform an action.
  await authorizeOwnerOrAdmin(dbProduct.creator, user);
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
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if product is present.
    const productId = formData.get('id') as string;
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id ${productId}.`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbProduct.creator, user);
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
  if (!dbVariant) throw new Error(`No product option with id ${variantId}.`);
  // Only allow admin or creator who own the asset to perform an action
  await authorizeOwnerOrAdmin(dbVariant.creator, user);
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
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if product is present.
    const productId = formData.get('productId') as string;
    formData.delete('productId');
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id ${productId}.`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbProduct.creator, user);

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
        data: { productId, creator: dbProduct.creator, ...data },
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

export const deleteProduct = async (prevState: {
  productId: string;
}): Promise<FormState> => {
  const { productId } = prevState;
  try {
    const user = await getAuthUser();
    // Check if product is present.
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id ${productId}.`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbProduct.creator, user);
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
    if (!dbVariant) throw new Error(`No product details with id ${variantId}.`);
    // Only allow admin or creator who own the asset to perform an action.
    await authorizeOwnerOrAdmin(dbVariant.creator, user);

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
  // Revalidate path
  revalidatePath('/dashboard/profile');
  revalidatePath('/cart');
};

export const updateAddress = async (formData: FormData): Promise<void> => {
  const user = await getAuthUser();
  // Check if address is present
  const addressId = formData.get('id') as string;
  const dbAddress = await db.shippingAddress.findUnique({
    where: { id: addressId },
  });
  if (!dbAddress) throw new Error(`No shipping address with id ${addressId}`);
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
  // Revalidate path
  revalidatePath('/dashboard/profile');
  revalidatePath('/cart');
};

export const deleteAddress = async (addressId: string): Promise<FormState> => {
  try {
    const user = await getAuthUser();
    // Check if address is present
    const dbAddress = await db.shippingAddress.findUnique({
      where: { id: addressId },
    });
    if (!dbAddress) throw new Error(`No shipping address with id ${addressId}`);
    // Only allow user who own the asset to perform an action.
    await authorizeOwner(dbAddress.userId, user);
    // Remove address from database
    await db.shippingAddress.delete({ where: { id: addressId } });
    revalidatePath('/dashboard/profile');
    revalidatePath('/cart');
    return { message: 'Deleted shipping address', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchCart = async () => {
  const user = await currentUser();
  if (!user) return null;
  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    include: { cartItems: { include: {} } },
  });
  return cart;
};

export const addToCartAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  const data = Object.fromEntries(formData);
  console.log(data);

  return { message: 'test add product to cart', type: 'default' };
};
