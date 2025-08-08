'use client';

import Title from '@/components/global/Title';
import DeleteUserButton from '@/components/account/DeleteUserButton';
import { useUser, useClerk } from '@clerk/nextjs';
import LoadingContainer from '@/components/global/LoadingContainer';
import { redirect } from 'next/navigation';
import AvatarContainer from '@/components/account/AvatarContainer';
import { FormState } from '@/utils/types';
import { deleteAccount } from '@/utils/actions';
import UsernameContainer from '@/components/account/UsernameContainer';
import { validateAvatar } from '@/utils/clientFunctions';

const renderClientError = (error: unknown): FormState => {
  return {
    message: error instanceof Error ? error.message : 'An error occurred.',
    type: 'error',
  };
};

function AccountPage() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <LoadingContainer />;
  if (!user) return redirect('/');

  const updateAvatarAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const file = formData.get('avatar');
      const validatedFile = validateAvatar(file);
      await user.setProfileImage({ file: validatedFile });
      await user.reload();
      return { message: 'Update avatar successfully.', type: 'success' };
    } catch (error) {
      return renderClientError(error);
    }
  };

  const deleteAvatarAction = async (): Promise<FormState> => {
    try {
      await user.setProfileImage({ file: null });
      await user.reload();
      return { message: 'Delete avatar successfully.', type: 'success' };
    } catch (error) {
      return renderClientError(error);
    }
  };

  const deleteUserAction = async (): Promise<FormState> => {
    try {
      await deleteAccount();
      signOut({ redirectUrl: '/' });
      return { message: 'Closed account already.', type: 'success' };
    } catch (error) {
      return renderClientError(error);
    }
  };

  return (
    <div className='px-4'>
      <Title title='Edit account' className='text-center' />
      <div className='mt-6'>
        <AvatarContainer
          updateAvatarAction={updateAvatarAction}
          deleteAvatarAction={deleteAvatarAction}
        />
        <UsernameContainer />
        <DeleteUserButton deleteUserAction={deleteUserAction} />
      </div>
    </div>
  );
}
export default AccountPage;
