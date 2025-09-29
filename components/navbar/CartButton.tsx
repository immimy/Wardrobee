'use client';

import { Button } from '../ui/button';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import CartItemList from '../cart/CartItemList';
import { IoCart } from 'react-icons/io5';
import { isObjectEmpty } from '@/utils/clientFunctions';
import RemoveItemModal from '../cart/RemoveItemModal';
import LoadingContainer from '../global/LoadingContainer';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import { useAppDispatch, useAppSelector, useClearCart } from '@/lib/hooks';
import { setCartState } from '@/lib/features/cart/cartSlice';

function CartButton() {
  const clearCart = useClearCart();
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((store) => store.cart);
  const { isLoading, cartOpen, cartItems, subtotal, totalQuantity } = cartState;

  return (
    <>
      {/* Remove cart item alert modal */}
      <RemoveItemModal />
      {/* Cart modal */}
      <Popover
        open={cartOpen}
        onOpenChange={(cartOpen) => dispatch(setCartState({ cartOpen }))}
      >
        {/* Cart button */}
        <PopoverTrigger asChild>
          <Button
            size='icon'
            className='rounded-full relative hover:cursor-pointer disabled:cursor-not-allowed'
          >
            <IoCart />
            <span className='absolute -top-1.5 -left-1.5 text-xs font-light bg-destructive text-white shadow-sm shadow-destructive size-5 rounded-full grid place-items-center'>
              {isLoading ? <LoadingContainer /> : totalQuantity}
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
                onClick={() => dispatch(setCartState({ cartOpen: false }))}
              >
                <Link href='/cart'>View Cart</Link>
              </Button>
              {/* Clear cart button */}
              <FormContainer action={clearCart}>
                <SubmitButton
                  text='clear cart'
                  variant='link'
                  className='w-full text-destructive'
                />
              </FormContainer>
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
export default CartButton;
