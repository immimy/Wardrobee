'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { FormState } from './types';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const client = await clerkClient();

export const getUserId = async () => {
  const { userId } = await auth();
  if (!userId) return redirect('/');
  return userId;
};

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

export const deleteUserAction = async (prevState: {
  userId: string;
}): Promise<FormState> => {
  const { id: userId } = await getAuthUser();
  try {
    await client.users.deleteUser(userId);
  } catch (error) {
    return renderError(error);
  }
  redirect('/');
};

export const updateUserProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  const { id: userId } = await getAuthUser();
  const username = formData.get('username') as string;
  const params = { username };
  try {
    await client.users.updateUser(userId, params);
    revalidatePath('/dashboard/profile');
  } catch (error) {
    return renderError(error);
  }
  return { message: 'Update profile successfully.', type: 'success' };
};

export const changePasswordAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  return { message: 'Change password successfully.', type: 'success' };
};
