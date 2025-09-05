'use client';

import { FormState } from '@/utils/types';
import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';
import { useClerk } from '@clerk/nextjs';
import { deleteAccount } from '@/utils/actions';
import { renderError } from '@/utils/clientFunctions';

function DeleteUserButton() {
  const { signOut } = useClerk();
  const deleteUserAction = async (): Promise<FormState> => {
    try {
      deleteAccount();
      signOut({ redirectUrl: '/' });
      return { message: 'Account is closed.', type: 'success' };
    } catch (error) {
      return renderError(error);
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
