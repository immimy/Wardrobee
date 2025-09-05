'use client';

import { clearUnstableCache, fetchCart } from '@/utils/actions';
import { CartStateType } from '@/utils/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useUserContext } from './UserProvider';

type CartContextType = {
  isLoaded: boolean;
  cartState: CartStateType;
  setCartState: Dispatch<SetStateAction<CartStateType>>;
  updateCartState: (field: keyof CartStateType, value: any) => void;
};
export const CartContext = createContext<undefined | CartContextType>(
  undefined
);
export const useCartContext = () => {
  const state = useContext(CartContext);
  if (!state) throw new Error('useCartContext must be used in CartProvider');
  return state;
};

const initialCartState = {
  cartOpen: false,
  removeItemOpen: false,
  removeItemId: '',
  cartItems: {},
  totalQuantity: 0,
  subtotal: 0,
  deletedCartItems: {},
};

type ParamsType = {
  children: React.ReactNode;
  cartPromise: ReturnType<typeof fetchCart>;
};
const CartProvider = ({ children, cartPromise }: ParamsType) => {
  // Initial cart when user first enter the app
  const cart = use(cartPromise);

  const { isMountRef, user } = useUserContext();
  const [isLoaded, setIsLoaded] = useState(true);
  const [cartState, setCartState] = useState<CartStateType>({
    ...initialCartState,
    ...cart,
  });

  const updateCartState = (field: keyof CartStateType, value: any) => {
    setCartState((state) => {
      return { ...state, [field]: value };
    });
  };

  useEffect(() => {
    // Prevent cart refresh when user first enter the app
    if (isMountRef.current <= 1) return;

    // Refresh cart when user log in or log out
    setIsLoaded(false);
    const refreshCart = async () => {
      clearUnstableCache();
      const cart = await fetchCart();
      setCartState({ ...cartState, ...cart });
      setIsLoaded(true);
    };
    refreshCart();
  }, [user]);

  return (
    <CartContext value={{ isLoaded, cartState, setCartState, updateCartState }}>
      {children}
    </CartContext>
  );
};
export default CartProvider;
