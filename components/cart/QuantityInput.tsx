'use client';

import { ChangeEventHandler } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector, useSetCartItem } from '@/lib/hooks';
import { setCartState } from '@/lib/features/cart/cartSlice';

type ParamsType = {
  cartItemId: string;
  className?: string;
};

function QuantityField({ cartItemId, className }: ParamsType) {
  const dispatch = useAppDispatch();
  const setCartItem = useSetCartItem();
  const cartState = useAppSelector((store) => store.cart);

  // Get cart item data
  const cartItem = cartState.cartItems[cartItemId];
  const { variantId, quantity } = cartItem.state;
  const stock = cartItem.options.find(
    (option) => option.id === variantId
  )!.stock;

  // Plus/Minus button
  const changeQuantity = async (mode: 'plus' | 'minus') => {
    const input = document.getElementById(
      `${cartItemId}[quantity]`
    ) as HTMLInputElement;
    const oldQty = Number(input.value);

    // Alert item deletion when quantity < 1
    if (mode === 'minus' && oldQty === 1) {
      dispatch(
        setCartState({ removeItemOpen: true, removeItemId: cartItemId })
      );
      return;
    }
    // Prevent user to add quantity more than the stock
    if (mode === 'plus' && oldQty === stock) {
      toast.warning(
        'You have reached the maximum stock limit for this product.'
      );
      return;
    }

    // Change quantity input value
    let newQty: number = 0;
    switch (mode) {
      case 'plus': {
        newQty = oldQty + 1;
        break;
      }
      case 'minus': {
        newQty = oldQty - 1;
        break;
      }
    }
    // Set cart item value
    setCartItem(cartItemId, { variantId, quantity: newQty });
  };

  // Directly type quantity input
  const typeQuantity: ChangeEventHandler<HTMLInputElement> = (e) => {
    // Prevent negative value & over selling
    const input = Number(e.currentTarget.value);
    const isExceedStock = input >= stock;
    const newQuantity = isNaN(input) ? 1 : isExceedStock ? stock : input;
    // Set cart item value
    setCartItem(cartItemId, { variantId, quantity: newQuantity });
    // Alert maximum stock limit
    if (isExceedStock) toast.warning('You have reached the stock limit.');
  };
  return (
    <div
      className={cn(
        'grid place-items-center text-sm tracking-wider',
        className
      )}
    >
      <span className='mb-1 uppercase font-semibold'>quantity</span>
      <div className='flex'>
        {/* Minus quantity */}
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-6 w-3 rounded-r-none'
          onClick={() => changeQuantity('minus')}
        >
          <FaMinus className='px-1' />
        </Button>
        {/* Quantity input */}
        <Input
          type='text'
          id={`${cartItemId}[quantity]`}
          name='quantity'
          value={quantity}
          onChange={typeQuantity}
          className='min-w-min max-w-16 h-6 rounded-none text-center read-only:text-input'
        />
        {/* Plus quantity */}
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-6 w-3 rounded-l-none'
          onClick={() => changeQuantity('plus')}
        >
          <FaPlus className='px-1' />
        </Button>
      </div>
    </div>
  );
}
export default QuantityField;
