'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { FormState } from './types';
import { redirect } from 'next/navigation';
import { userSchema, validateWithZodSchema } from './schemas';
import { revalidatePath } from 'next/cache';

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
