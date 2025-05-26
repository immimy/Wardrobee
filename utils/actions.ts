'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { FormState } from './types';
import { redirect } from 'next/navigation';

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

export const changePasswordAction = async (
  prevState: any,
  formData: FormData
): Promise<FormState> => {
  return { message: 'Change password successfully.', type: 'success' };
};
