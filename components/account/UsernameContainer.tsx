'use client';

import { FormEventHandler } from 'react';
import FormInput from '../form/FormInput';
import SubmitButton from '../form/SubmitButton';
import { updateProfile } from '@/utils/actions';
import { toastError } from '@/utils/clientFunctions';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/hooks';
import { setUser } from '@/lib/features/user/userSlice';

function UsernameContainer() {
  const dispatch = useAppDispatch();

  const updateProfileHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      // Update profile data
      await updateProfile(formData);
      // Update user state
      dispatch(setUser({ username: formData.get('username') as string }));
      return toast.success('Profile is updated.');
    } catch (error) {
      return toastError(error);
    }
  };

  return (
    <form onSubmit={updateProfileHandler}>
      <div className='p-4 mx-auto max-w-96'>
        <FormInput type='text' name='username' placeholder='username' />
        <SubmitButton className='w-full' />
      </div>
    </form>
  );
}
export default UsernameContainer;
