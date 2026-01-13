'use client';

import SubmitButton from '../form/SubmitButton';
import { useClerk } from '@clerk/nextjs';
import { deleteAccount } from '@/utils/actions';
import { useAppDispatch } from '@/lib/hooks';
import { loadingUser } from '@/lib/features/user/userSlice';
import { toast } from 'sonner';
import { FormEventHandler } from 'react';
import { toastError } from '@/utils/clientFunctions';

function DeleteUserButton() {
  const dispatch = useAppDispatch();
  const { signOut } = useClerk();
  const deleteUserAction: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await deleteAccount();
      dispatch(loadingUser());
      signOut({ redirectUrl: '/' });
      toast.success('Account is closed.');
    } catch (error) {
      return toastError(error);
    }
  };
  return (
    <form onSubmit={deleteUserAction}>
      <div className='p-4 pt-0 mx-auto max-w-96'>
        <SubmitButton
          text='delete account'
          variant='destructive'
          className='uppercase font-medium tracking-wide w-full'
        />
      </div>
    </form>
  );
}
export default DeleteUserButton;
