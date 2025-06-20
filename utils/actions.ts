'use server';

import { clerkClient, currentUser, auth } from '@clerk/nextjs/server';
import { Roles } from '@/types/globals';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { FormState, HaveCreator, ProductCategory } from './types';
import { redirect } from 'next/navigation';
import {
  productSchema,
  userSchema,
  validateProductVariant,
  validateWithZodSchema,
} from './schemas';
import { revalidatePath } from 'next/cache';
import { convertFormDataByFieldset } from './form';
import db from './db';

const client = await clerkClient();

export const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) return redirect('/');
  return user;
};

const checkRole = async (
  ...role: Array<Roles | undefined>
): Promise<{ userId: string; userRole: Roles }> => {
  const { sessionClaims, userId } = await auth();
  const userRole = sessionClaims?.metadata.role;
  if (!userId || !userRole || !role.includes(userRole))
    throw new Error('Unauthorized to perform this action.');
  return { userId, userRole: userRole };
};

// Admin are enable to perform all actions.
// Moderator can only perform an action on their asset.
const verifyCreatorOrAdmin = async (data: HaveCreator): Promise<void> => {
  const { userId, userRole } = await checkRole('admin', 'moderator');
  if (userRole !== 'admin' && data.creator !== userId)
    throw new Error('Unauthorized to perform this action.');
};

export const renderError = async (error: unknown): Promise<FormState> => {
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
    const validatedData = validateWithZodSchema(userSchema, rawData);
    await client.users.updateUser(userId, { ...validatedData });
    revalidatePath('/dashboard/profile');
    return { message: 'Update profile successfully.', type: 'success' };
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
      variants: { where: { stock: { gt: 0 } }, take: 1 },
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
    include: { variants: true },
  });
  return product;
};

export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    // Only allow admin or moderator to perform an action.
    const { userId } = await checkRole('admin', 'moderator');

    // Collect input data by fieldset
    const { nestedFormData } = convertFormDataByFieldset(formData);
    const { product } = nestedFormData;
    delete nestedFormData['product'];

    // Input validation
    // 1. Product validation
    const validatedProduct = validateWithZodSchema(productSchema, product);
    const { category } = validatedProduct;
    // 2. Product variant validation
    const validatedVariants = validateProductVariant(
      Object.values(nestedFormData),
      category
    )!;

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

    return { message: 'Create product successfully.', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
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
    await verifyCreatorOrAdmin(dbProduct);

    // Input validation
    const validatedProduct = validateWithZodSchema(
      productSchema,
      Object.fromEntries(formData)
    );
    // Update product
    await db.product.update({
      where: { id: productId },
      data: validatedProduct,
    });
    return { message: 'Update product successfully.', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductVariantAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  try {
    // Check if product variant is present.
    const productVariantId = formData.get('id') as string;
    const dbVariant = await db.productVariant.findUnique({
      where: { id: productVariantId },
    });
    if (!dbVariant)
      throw new Error(`No product details with id ${productVariantId}.`);
    // Only allow admin or moderator who own the asset to perform an action.
    await verifyCreatorOrAdmin(dbVariant);

    const category = formData.get('category') as ProductCategory;
    const validatedVariant = validateProductVariant(
      [Object.fromEntries(formData)],
      category
    )![0];
    // Sales figure update is not allowed.
    delete validatedVariant['sales'];
    const { productId } = await db.productVariant.update({
      where: { id: productVariantId },
      data: validatedVariant,
    });
    // Update total product stock
    await db.product.update({
      where: { id: productId },
      data: {
        totalStock: {
          decrement: dbVariant.stock,
          increment: validatedVariant.stock,
        },
      },
    });
    return { message: 'Update product details successfully.', type: 'success' };
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
    await verifyCreatorOrAdmin(dbProduct);

    await db.product.delete({ where: { id: productId } });
    return { message: 'Delete product successfully.', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteProductVariant = async (prevState: {
  productVariantId: string;
}): Promise<FormState> => {
  const { productVariantId } = prevState;
  try {
    // Check if product variant is present.
    const dbVariant = await db.productVariant.findUnique({
      where: { id: productVariantId },
    });
    if (!dbVariant)
      throw new Error(`No product details with id ${productVariantId}.`);
    // Only allow admin or moderator who own the asset to perform an action.
    await verifyCreatorOrAdmin(dbVariant);

    const productId = dbVariant.productId;
    // Delete product variant
    await db.productVariant.delete({ where: { id: productVariantId } });

    // Update total product stock
    await db.product.update({
      where: { id: productId },
      data: {
        totalStock: {
          decrement: dbVariant.stock,
        },
      },
    });

    return { message: 'Delete product details successfully.', type: 'success' };
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
