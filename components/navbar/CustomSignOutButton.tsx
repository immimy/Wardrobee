'use client';

import { loadingUser } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';
import { SignOutButton } from '@clerk/nextjs';

function CustomSignOutButton() {
  const dispatch = useAppDispatch();
  return (
    <SignOutButton>
      <button
        onClick={() => dispatch(loadingUser())}
        className='w-full hover:cursor-pointer'
      >
        Sign out
      </button>
    </SignOutButton>
  );
}
export default CustomSignOutButton;
