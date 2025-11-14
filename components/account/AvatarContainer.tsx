'use client';

import ImageInput from '../form/ImageInput';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import AvatarImage from '../global/AvatarImage';
import { useUser } from '@clerk/nextjs';
import { FormState } from '@/utils/types';
import { renderError, validateAvatar } from '@/utils/clientFunctions';
import { redirect } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { setUser } from '@/lib/features/user/userSlice';

function AvatarContainer() {
  const { user, isLoaded } = useUser();
  const dispatch = useAppDispatch();
  if (isLoaded && !user) return redirect('/');

  const updateAvatarAction = async (
    formState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const file = formData.get('avatar');
      const validatedFile = validateAvatar(file);
      // Update profile image (Clerk API)
      const { publicUrl: image } = await user!.setProfileImage({
        file: validatedFile,
      });
      // Update user state
      dispatch(setUser({ image }));
      return { message: 'Avatar is updated.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  const deleteAvatarAction = async (): Promise<FormState> => {
    try {
      // Delete profile image (Clerk API)
      user!.setProfileImage({ file: null });
      // Update user state
      dispatch(setUser({ image: null }));
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
          <SubmitButton
            text='update avatar'
            className='w-full'
            disabled={!isLoaded}
          />
        </FormContainer>
        <FormContainer action={deleteAvatarAction}>
          <SubmitButton
            text='delete avatar'
            variant='link'
            className='text-destructive w-full'
            disabled={!isLoaded}
          />
        </FormContainer>
      </div>
    </div>
  );
}
export default AvatarContainer;
