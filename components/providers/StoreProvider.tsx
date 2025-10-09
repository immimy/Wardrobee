'use client';

import { initializeCart } from '@/lib/features/cart/cartSlice';
import { loadingUser, setUser } from '@/lib/features/user/userSlice';
import { AppStore, makeStore } from '@/lib/store';
import { isHookLoaded } from '@/utils/clientFunctions';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

type ParamsType = {
  children: React.ReactNode;
};
function StoreProvider({ children }: ParamsType) {
  const { user } = useUser();
  const { sessionClaims } = useAuth();

  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(loadingUser());
  }

  // Initialize the store with the user information
  useEffect(() => {
    if (!storeRef.current) return;
    if (isHookLoaded(user) && isHookLoaded(sessionClaims)) {
      storeRef.current.dispatch(initializeCart());
      storeRef.current.dispatch(
        setUser({
          username: user?.username,
          image: user?.imageUrl,
          role: sessionClaims?.metadata?.role || 'user',
        })
      );
    }
  }, [user, sessionClaims]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
export default StoreProvider;
