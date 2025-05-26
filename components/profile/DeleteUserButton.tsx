'use client';

import { useUser } from '@clerk/nextjs';
import LoadingContainer from '../global/LoadingContainer';
import { redirect } from 'next/navigation';
import { FormState } from '@/utils/types';
import { renderError } from '@/utils/actions';
import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';

function DeleteUserButton() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <LoadingContainer />;
  if (!user) return redirect('/');

  const deleteUser = async (): Promise<FormState> => {
    try {
      await user.delete();
      window.history.pushState(null, '', '/');
      return { message: 'Delete account successfully.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  return (
    <FormContainer action={deleteUser}>
      <SubmitButton
        text='delete account'
        variant='destructive'
        className='uppercase font-medium tracking-wide'
      />
    </FormContainer>
  );
}
export default DeleteUserButton;
