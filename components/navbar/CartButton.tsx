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
import {
  clearDeletedCartItems,
  setCartState,
} from '@/lib/features/cart/cartSlice';
import DeletedCartItemList from '../cart/DeletedCartItemList';

function CartButton() {
  const clearCart = useClearCart();
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((store) => store.cart);
  const {
    isLoading,
    cartOpen,
    cartItems,
    subtotal,
    totalQuantity,
    deletedCartItems,
  } = cartState;
  const isCartEmpty = isObjectEmpty(cartItems);

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
          className='bg-background text-foreground md:min-w-fit max-w-screen md:max-w-md w-full'
        >
          {/* CONTENT LISTS */}
          <ul className='overflow-y-auto max-h-[calc(100vh-250px)]'>
            {/* DELETED CART ITEMS */}
            {!isObjectEmpty(deletedCartItems) && (
              <div className='border-b pb-2 w-full'>
                <Button
                  size='sm'
                  variant='link'
                  className='text-destructive/70 capitalize hover:cursor-pointer tracking-wider block mx-auto'
                  onClick={() => dispatch(clearDeletedCartItems())}
                >
                  clear history
                </Button>
                {Object.entries(deletedCartItems).map(([key, item]) => (
                  <DeletedCartItemList key={key} cartItem={item} />
                ))}
              </div>
            )}
            {/* CART ITEMS */}
            {isCartEmpty ? (
              // No cart items
              <p className='text-center py-2 md:px-16 tracking-widest italic'>
                Your cart is empty.
              </p>
            ) : (
              // With cart items
              <>
                {/* CART ITEMS */}
                {Object.keys(cartItems).map((id) => {
                  return <CartItemList key={id} cartItemId={id} />;
                })}
              </>
            )}
          </ul>
          {/* CONTENT BOTTOM */}
          {!isCartEmpty && (
            <>
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
                <Link href='/checkout'>Checkout</Link>
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
