'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { FormState, ProductCategory } from './types';
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

export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  // Collect input data by fieldset
  const { nestedFormData } = convertFormDataByFieldset(formData);
  const { product } = nestedFormData;
  delete nestedFormData['product'];

  try {
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
      data: validatedProduct,
    });
    // Create multiple product variants
    const validatedProductVariants = validatedVariants.map((variant) => {
      return { productId, ...variant };
    });
    await db.productVariant.createMany({
      data: validatedProductVariants,
    });

    return { message: 'Create product successfully.', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  const productId = formData.get('productId') as string;
  try {
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
    const variantId = formData.get('id') as string;
    const category = formData.get('category') as ProductCategory;
    const validatedVariant = validateProductVariant(
      [Object.fromEntries(formData)],
      category
    )![0];
    // Sales figure update is not allowed.
    delete validatedVariant['sales'];
    await db.productVariant.update({
      where: { id: variantId },
      data: validatedVariant,
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
    await db.productVariant.delete({ where: { id: productVariantId } });
    return { message: 'Delete product details successfully.', type: 'success' };
  } catch (error) {
    return renderError(error);
  }
};
