'use client';

import Title from '@/components/global/Title';
import DeleteUserButton from '@/components/account/DeleteUserButton';
import { useUser, useClerk } from '@clerk/nextjs';
import LoadingContainer from '@/components/global/LoadingContainer';
import { redirect } from 'next/navigation';
import AvatarContainer from '@/components/account/AvatarContainer';
import { FormState } from '@/utils/types';
import { renderError, deleteAccount } from '@/utils/actions';
import UsernameContainer from '@/components/account/UsernameContainer';

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
      const maxUploadSize = 1024 * 1024 * 0.5; //0.5MB
      const maxUploadSizeText = '0.5MB';

      if (!file || !(file instanceof File)) {
        return { message: 'Please provide file.', type: 'error' };
      }
      if (!file.type.startsWith('image/')) {
        return { message: 'Only accept image file.', type: 'error' };
      }
      if (file.size > maxUploadSize) {
        return {
          message: `File size must be less than ${maxUploadSizeText}.`,
          type: 'error',
        };
      }

      await user.setProfileImage({ file });
      await user.reload();

      return { message: 'Update avatar successfully.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  const deleteAvatarAction = async (): Promise<FormState> => {
    try {
      await user.setProfileImage({ file: null });
      await user.reload();
      return { message: 'Delete avatar successfully.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  const deleteUserAction = async (): Promise<FormState> => {
    const result = await deleteAccount();
    if (result.type === 'error') {
      return result;
    }
    signOut({ redirectUrl: '/' });
    return result;
  };

  return (
    <div className='p-4'>
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
