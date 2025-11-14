'use client';

import { loadingUser } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';

type ParamsType = { children: React.ReactNode };
function LoadingUserButton({ children }: ParamsType) {
  const dispatch = useAppDispatch();
  return <button onClick={() => dispatch(loadingUser())}>{children}</button>;
}
export default LoadingUserButton;
