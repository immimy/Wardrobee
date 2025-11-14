'use client';

import { initializeCart } from '@/lib/features/cart/cartSlice';
import { loadingUser, setUser } from '@/lib/features/user/userSlice';
import { AppStore, makeStore } from '@/lib/store';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

type ParamsType = {
  children: React.ReactNode;
};
function StoreProvider({ children }: ParamsType) {
  // Reference for the component's first mount
  const isMounted = useRef(false);

  const { user } = useUser();
  const { sessionClaims } = useAuth();

  // Create the store instance the first time this renders
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(loadingUser());
  }

  useEffect(() => {
    // Guard: Return if the user info is not loaded
    if (user === undefined || sessionClaims === undefined) return;
    // Guard: Return if the user doesn't perform login or logout
    // If this is not the first render, ensure the user info is already updated to the latest after logging out or logging out
    // (Avoid unnecessarily triggering logic below twice)
    const store = storeRef.current!.getState();
    if (
      isMounted.current &&
      Boolean(store.user.username) === Boolean(user?.username)
    )
      return;

    // Refresh cart
    // Ensure that each of products in the cart is not stale
    storeRef.current!.dispatch(initializeCart());
    // Set user info state
    storeRef.current!.dispatch(
      setUser({
        username: user?.username,
        image: user?.imageUrl,
        role: sessionClaims?.metadata?.role || 'user',
      })
    );

    // Update reference for component's mount
    if (!isMounted.current) isMounted.current = true;
    return;
  }, [user, sessionClaims]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
export default StoreProvider;
