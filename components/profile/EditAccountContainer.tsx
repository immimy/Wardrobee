'use client';

import { useUser } from '@clerk/nextjs';
import ImageInput from '../form/ImageInput';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import LoadingContainer from '../global/LoadingContainer';
import { FormState } from '@/utils/types';
import Title from '../global/Title';
import AvatarImage from '../global/AvatarImage';
import { renderError, updateUserProfile } from '@/utils/actions';
import { redirect } from 'next/navigation';

function EditAccountContainer() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <LoadingContainer />;
  if (!user) return redirect('/');
  const username = user.username || '';

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

  const updateProfileAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const result = await updateUserProfile(formData);
      await user.reload();
      return result;
    } catch (error) {
      return renderError(error);
    }
  };

  return (
    <div className='p-4'>
      <Title title='Edit account' className='text-center' />
      {/* Avatar Update */}
      <div className='mt-6 px-4 flex justify-center items-center gap-x-6'>
        <AvatarImage height={128} width={128} className='h-32 w-32 min-w-32' />
        <div className='mb-6'>
          <FormContainer action={updateAvatarAction}>
            <ImageInput name='avatar' />
            <SubmitButton text='update avatar' className='w-full' />
          </FormContainer>
          <FormContainer action={deleteAvatarAction}>
            <SubmitButton
              text='delete avatar'
              variant='link'
              className='text-destructive w-full'
            />
          </FormContainer>
        </div>
      </div>
      {/* Username Update */}
      <FormContainer action={updateProfileAction}>
        <div className='p-4 mx-auto max-w-96'>
          <FormInput
            type='text'
            name='username'
            defaultValue={username}
            placeholder='username'
          />
          <SubmitButton className='w-full' />
        </div>
      </FormContainer>
    </div>
  );
}
export default EditAccountContainer;
