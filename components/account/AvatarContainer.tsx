'use client';

import ImageInput from '../form/ImageInput';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import AvatarImage from '../global/AvatarImage';
import { useUser } from '@clerk/nextjs';
import { FormState } from '@/utils/types';
import { toastError, validateAvatar } from '@/utils/clientFunctions';
import { redirect } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { setUser } from '@/lib/features/user/userSlice';
import { toast } from 'sonner';

function AvatarContainer() {
  const { user, isLoaded } = useUser();
  const dispatch = useAppDispatch();
  if (isLoaded && !user) return redirect('/');

  const updateAvatarAction = async (
    formState: FormState,
    formData: FormData
  ) => {
    try {
      // Demo guard
      if (user?.username === 'user' || user?.username === 'moderator')
        throw new Error(
          'Demo accounts are restricted from updating theirs avatars.'
        );

      const file = formData.get('avatar');
      const validatedFile = validateAvatar(file);
      // Update profile image (Clerk API)
      const { publicUrl: image } = await user!.setProfileImage({
        file: validatedFile,
      });
      // Update user state
      dispatch(setUser({ image }));
      toast.success('Avatar is updated.');
    } catch (error) {
      if (error instanceof Error) return toastError(error);
      toast.error('Failed to update avatar');
    }
  };

  const deleteAvatarAction = async () => {
    try {
      // Demo guard
      if (user?.username === 'user' || user?.username === 'moderator')
        throw new Error(
          'Demo accounts are restricted from deleting theirs avatars.'
        );

      // Delete profile image (Clerk API)
      user!.setProfileImage({ file: null });
      // Update user state
      dispatch(setUser({ image: null }));
      toast.success('Avatar is deleted.');
    } catch (error) {
      if (error instanceof Error) return toastError(error);
      toast.error('Failed to delete avatar');
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
