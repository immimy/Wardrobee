'use client';

import { ChangeEventHandler, startTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useCartContext } from '../providers/CartProvider';
import { cn } from '@/lib/utils';
import { useOptimisticCartContext } from '../navbar/CartButton';

type ParamsType = {
  cartItemId: string;
  className?: string;
};

function QuantityField({ cartItemId, className }: ParamsType) {
  const { setCartState } = useCartContext();
  const { optimisticState: cartState, addOptimistic } =
    useOptimisticCartContext();
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
      setCartState({
        ...cartState,
        removeItemOpen: true,
        removeItemId: cartItemId,
      });
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
    startTransition(() => {
      // Update optimistic state
      addOptimistic({
        cartItemId,
        variantId,
        quantity: newQty,
        isReCalc: false,
      });
      // Dispatch a quantity change event
      input.dispatchEvent(new Event(cartItemId, { bubbles: true }));
    });
  };

  // Directly type quantity input
  const typeQuantity: ChangeEventHandler<HTMLInputElement> = (e) => {
    startTransition(() => {
      // Prevent negative value & over selling
      const input = Number(e.currentTarget.value);
      let newQuantity = isNaN(input) ? 1 : input > stock ? stock : input;
      // Update optimistic state
      addOptimistic({
        cartItemId,
        variantId,
        quantity: newQuantity,
        isReCalc: false,
      });
      // Dispatch a quantity change event
      e.stopPropagation();
      e.currentTarget.dispatchEvent(new Event(cartItemId, { bubbles: true }));
    });
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
