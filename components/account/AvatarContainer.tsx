'use client';

import ImageInput from '../form/ImageInput';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import AvatarImage from '../global/AvatarImage';
import { useUser } from '@clerk/nextjs';
import { FormState } from '@/utils/types';
import { renderError, validateAvatar } from '@/utils/clientFunctions';
import { redirect } from 'next/navigation';
import LoadingContainer from '../global/LoadingContainer';

function AvatarContainer() {
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
      return { message: 'Avatar is updated.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  const deleteAvatarAction = async (): Promise<FormState> => {
    try {
      await user.setProfileImage({ file: null });
      await user.reload();
      return { message: 'Avatar is deleted.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };
  return (
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
  );
}
export default AvatarContainer;
