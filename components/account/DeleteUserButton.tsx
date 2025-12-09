'use client';

import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';
import { useClerk } from '@clerk/nextjs';
import { deleteAccount } from '@/utils/actions';
import { useAppDispatch } from '@/lib/hooks';
import { loadingUser } from '@/lib/features/user/userSlice';
import { toast } from 'sonner';

function DeleteUserButton() {
  const dispatch = useAppDispatch();
  const { signOut } = useClerk();
  const deleteUserAction = async () => {
    try {
      deleteAccount();
      dispatch(loadingUser());
      signOut({ redirectUrl: '/' });
      toast.success('Account is closed.');
    } catch {
      toast.error('Failed to close an account');
    }
  };
  return (
    <FormContainer action={deleteUserAction}>
      <div className='p-4 pt-0 mx-auto max-w-96'>
        <SubmitButton
          text='delete account'
          variant='destructive'
          className='uppercase font-medium tracking-wide w-full'
        />
      </div>
    </FormContainer>
  );
}
export default DeleteUserButton;
