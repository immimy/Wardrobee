'use client';

import { Button } from '../ui/button';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import CartItemList from '../cart/CartItemList';
import { IoCart } from 'react-icons/io5';
import { useOptimistic, useTransition } from 'react';
import { useCartContext } from '../providers/CartProvider';
import { isObjectEmpty, sumSubtotalAndQuantity } from '@/utils/clientFunctions';
import { createContext, useContext } from 'react';
import { CartStateType, OptimisticAction } from '@/utils/types';
import { deleteCartItem, updateCartItem } from '@/utils/actions';
import { toast } from 'sonner';
import RemoveItemModal from '../cart/RemoveItemModal';
import LoadingContainer from '../global/LoadingContainer';

type ContextType = {
  isPending: boolean;
  optimisticState: CartStateType;
  addOptimistic: (action: OptimisticAction) => void;
  updateCartItemAction: (cartItemId: string) => void;
  cancelRemoveCartItemAction: (formData: FormData) => void;
  removeCartItemAction: (cartItemId: string) => void;
};
const OptimisticCartContext = createContext<undefined | ContextType>(undefined);
export const useOptimisticCartContext = () => {
  const state = useContext(OptimisticCartContext);
  if (!state)
    throw new Error(
      'useOptimisticCartContext must be used in CartButton Component'
    );
  return state;
};

function CartButton() {
  const [isPending, startTransition] = useTransition();
  const cart = useCartContext();
  const { cartState, setCartState, updateCartState, isLoaded } = cart;
  const { cartOpen } = cartState;

  const [optimisticState, addOptimistic] = useOptimistic(
    cartState,
    (state, value: OptimisticAction) => {
      const { cartItemId, variantId, quantity, isReCalc } = value;
      // Cart item's optimistic response
      let cartItem = state.cartItems[cartItemId];
      cartItem.state.variantId = variantId;
      cartItem.state.quantity = quantity;
      const newState = {
        ...state.cartItems,
        [cartItemId]: cartItem,
      };
      // Re-calculate subtotal and total quantity
      if (isReCalc) {
        const { subtotal, totalQuantity } = sumSubtotalAndQuantity(newState);
        return { ...state, cartItems: newState, subtotal, totalQuantity };
      }
      // Default return (Not re-calculate subtotal and total quantity)
      return { ...state, cartItems: newState };
    }
  );
  const { subtotal, totalQuantity, cartItems } = optimisticState;

  // Update cart item action
  const updateCartItemAction = async (cartItemId: string) => {
    const form = document.getElementById(cartItemId) as HTMLFormElement;
    const formData = new FormData(form);
    try {
      // Update cart item in database
      const cart = await updateCartItem(formData);
      const { cartItems, subtotal, totalQuantity } = cart;
      toast.success('Updated cart item');
      // Update cart state
      setCartState({ ...cartState, cartItems, subtotal, totalQuantity });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    }
  };

  // Cancel remove cart item action
  const cancelRemoveCartItemAction = async(formData: FormData) => {
      try {
        // Update cart item in database
        const cart = await updateCartItem(formData);
        const { cartItems, subtotal, totalQuantity } = cart;
        toast.success('Updated cart item');
        // Update cart state
        setCartState({
          ...cartState,
          cartItems,
          subtotal,
          totalQuantity,
          // Close remove cart item modal
          removeItemOpen: false,
          removeItemId: '',
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An error occurred';
        toast.error(message);
      }
  };

  // Remove cart item action
  const removeCartItemAction = (cartItemId: string) => {
    startTransition(async () => {
      try {
        // Delete cart item from database
        const cart = await deleteCartItem(cartItemId);
        const { cartItems, subtotal, totalQuantity } = cart;
        toast.success('Removed cart item from the cart');
        // Update cart state
        setCartState({
          ...cartState,
          cartItems,
          subtotal,
          totalQuantity,
          // Close remove cart item modal
          removeItemOpen: false,
          removeItemId: '',
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An error occurred';
        toast.error(message);
        // Close remove cart item modal
        updateCartState('removeItemOpen', false);
      }
    });
  };

  return (
    <OptimisticCartContext
      value={{
        isPending,
        optimisticState,
        addOptimistic,
        updateCartItemAction,
        cancelRemoveCartItemAction,
        removeCartItemAction,
      }}
    >
      {/* Remove cart item alert modal */}
      <RemoveItemModal />
      {/* Cart modal */}
      <Popover
        open={cartOpen}
        onOpenChange={() => updateCartState('cartOpen', !cartOpen)}
      >
        {/* Cart button */}
        <PopoverTrigger asChild>
          <Button
            size='icon'
            className='rounded-full relative hover:cursor-pointer disabled:cursor-not-allowed'
          >
            <IoCart />
            <span className='absolute -top-1.5 -left-1.5 text-xs font-light bg-destructive text-white shadow-sm shadow-destructive size-5 rounded-full grid place-items-center'>
              {isLoaded ? totalQuantity : <LoadingContainer />}
            </span>
          </Button>
        </PopoverTrigger>
        {/* Cart modal */}
        <PopoverContent
          sideOffset={16}
          align='end'
          className='bg-background text-foreground md:min-w-fit md:max-w-md w-full'
        >
          {isObjectEmpty(cartItems) ? (
            // No cart items
            <p className='text-center md:px-16 tracking-widest italic'>
              Your cart is empty.
            </p>
          ) : (
            // With cart items
            <>
              {/* Cart Items List */}
              <ul className='*:border-b md:*:border-b-0'>
                {Object.keys(cartItems).map((id) => {
                  return <CartItemList key={id} cartItemId={id} />;
                })}
              </ul>
              {/* Subtotal */}
              <span className='py-4 float-end text-md font-medium tracking-wider underline'>
                Subtotal: {subtotal}
              </span>
              {/* Navigate to cart page */}
              <Button
                asChild
                size='sm'
                className='w-full font-medium tracking-wider'
                onClick={() => updateCartState('cartOpen', false)}
              >
                <Link href='/cart'>View Cart</Link>
              </Button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </OptimisticCartContext>
  );
}
export default CartButton;
