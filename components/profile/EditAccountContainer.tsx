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
import { renderError } from '@/utils/actions';
import { redirect, useRouter } from 'next/navigation';

const convertToBase64AndSetImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
  });

function EditAccountContainer() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <LoadingContainer />;
  if (!user) return redirect('/');
  const username = user.username || '';

  const updateAvatar = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    const file = formData.get('avatar') as File;
    try {
      const image = await convertToBase64AndSetImage(file);
      await user.setProfileImage({ file: image });
      await user.reload();
      return { message: 'Update avatar successfully.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  const deleteAvatar = async (): Promise<FormState> => {
    try {
      await user.setProfileImage({ file: null });
      await user.reload();
      return { message: 'Delete avatar successfully.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  const updateUserProfile = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    const username = formData.get('username') as string;
    try {
      await user.update({ username });
      await user.reload();
      router.refresh();
      return { message: 'Update profile successfully.', type: 'success' };
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
          <FormContainer action={updateAvatar}>
            <ImageInput name='avatar' />
            <SubmitButton text='update avatar' className='w-full' />
          </FormContainer>
          <FormContainer action={deleteAvatar}>
            <SubmitButton
              text='delete avatar'
              variant='link'
              className='text-destructive w-full'
            />
          </FormContainer>
        </div>
      </div>
      {/* Username Update */}
      <FormContainer action={updateUserProfile}>
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
