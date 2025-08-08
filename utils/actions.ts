'use server';

import { clerkClient, currentUser, auth } from '@clerk/nextjs/server';
import { Roles } from '@/types/globals';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { FormState, HaveCreator, ProductCategory } from './types';
import { redirect } from 'next/navigation';
import {
  allProductVariantsSchema,
  imageSchema,
  productSchema,
  productUpdateSchema,
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
  const user = await currentUser();
  if (!user) return redirect('/');
  return user;
};

const authorizeRoles = async (
  ...role: Array<Roles>
): Promise<{ userId: string; userRole: Roles }> => {
  const { sessionClaims, userId } = await auth();
  const userRole = sessionClaims?.metadata.role;
  if (!userId || !userRole || !role.includes(userRole))
    throw new Error('Unauthorized to perform this action.');
  return { userId, userRole: userRole };
};

// Admin are enable to perform all actions.
// Moderator can only perform an action on their asset.
const authorizeCreatorOrAdmin = async (
  data: HaveCreator
): Promise<{ userId: string; userRole: Roles }> => {
  const { userId, userRole } = await authorizeRoles('admin', 'moderator');
  if (userRole !== 'admin' && data.creator !== userId)
    throw new Error('Unauthorized to perform this action.');
  return { userId, userRole: userRole };
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
    const { id: userId } = await getAuthUser();
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
    const { id: userId } = await getAuthUser();
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
    // Only allow admin or moderator to perform an action.
    const { userId } = await authorizeRoles('admin', 'moderator');
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
      data: { creator: userId, ...validatedProduct },
    });
    // Create multiple product variants
    const validatedProductVariants = validatedVariants.map((variant) => {
      return { productId, creator: userId, ...variant };
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
  // Check if product is present.
  const productId = formData.get('productId') as string;
  const dbProduct = await db.product.findUnique({ where: { id: productId } });
  if (!dbProduct) throw new Error(`No product with id ${productId}.`);
  // Only allow admin or moderator who own the asset to perform an action.
  const { userId } = await authorizeCreatorOrAdmin(dbProduct);
  // Input validation
  const category = formData.get('category') as ProductCategory;
  const data = validateWithZodSchema(
    singleProductVariantSchema(category),
    Object.fromEntries(formData)
  );
  // Create product variant
  await db.productVariant.create({
    data: { productId, creator: userId, ...data },
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
  const productId = formData.get('productId') as string;
  const image = formData.get('image') as File;
  // Check if product is present.
  const dbProduct = await db.product.findUnique({ where: { id: productId } });
  if (!dbProduct) throw new Error(`No product with id ${productId}`);
  const oldUrl = dbProduct.image;
  // Only allow admin or moderator who own the asset to perform an action.
  await authorizeCreatorOrAdmin(dbProduct);
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
    // Check if product is present.
    const productId = formData.get('id') as string;
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id ${productId}.`);
    // Only allow admin or moderator who own the asset to perform an action.
    await authorizeCreatorOrAdmin(dbProduct);
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
  // Check if product variant is present.
  const variantId = formData.get('id') as string;
  const dbVariant = await db.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!dbVariant) throw new Error(`No product option with id ${variantId}.`);
  // Only allow admin or moderator who own the asset to perform an action.
  await authorizeCreatorOrAdmin(dbVariant);
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
    // Check if product is present.
    const productId = formData.get('productId') as string;
    formData.delete('productId');
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id ${productId}.`);
    // Only allow admin or moderator who own the asset to perform an action.
    await authorizeCreatorOrAdmin(dbProduct);

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
    // Check if product is present.
    const dbProduct = await db.product.findUnique({ where: { id: productId } });
    if (!dbProduct) throw new Error(`No product with id ${productId}.`);
    // Only allow admin or moderator who own the asset to perform an action.
    await authorizeCreatorOrAdmin(dbProduct);
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
    // Check if product variant is present.
    const dbVariant = await db.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!dbVariant) throw new Error(`No product details with id ${variantId}.`);
    // Only allow admin or moderator who own the asset to perform an action.
    await authorizeCreatorOrAdmin(dbVariant);

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

export const addToCartAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  const data = Object.fromEntries(formData);
  console.log(data);

  return { message: 'test add product to cart', type: 'default' };
};
