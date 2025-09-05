'use client';

import { UserType } from '@/utils/types';
import { useUser } from '@clerk/nextjs';
import { RefObject, useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';

type ContextType = {
  isMountRef: RefObject<number>;
  isLoaded: boolean;
  user: UserType;
};
const UserContext = createContext<undefined | ContextType>(undefined);
export const useUserContext = () => {
  const state = useContext(UserContext);
  if (!state) throw new Error('useUserContext must be used in UserProvider');
  return state;
};

type ParamsType = { children: React.ReactNode };
function UserProvider({ children }: ParamsType) {
  const isMountRef = useRef(0);
  const { isLoaded, user: clerkUser } = useUser();
  const [user, setUser] = useState<typeof clerkUser>(undefined);

  useEffect(() => {
    if (!isLoaded) return;
    isMountRef.current += 1;
    setUser(clerkUser);
  }, [clerkUser]);

  return (
    <UserContext value={{ isMountRef, isLoaded, user }}>{children}</UserContext>
  );
}
export default UserProvider;
