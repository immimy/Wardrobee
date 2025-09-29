// BUG: Using Shancn Select as an uncontrolled input,
// after submitting the form, the form input value will be reset to its default value,
// but the select UI shown to the user doesn't correspond to input value.

// PURPOSE USAGE: Used in case we want to display select UI and don't perform a form submission.

'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAppSelector, useSetCartItem } from '@/lib/hooks';

type ParamsType = {
  cartItemId: string;
  className?: string;
};

function SizeSelect({ cartItemId, className }: ParamsType) {
  const setCartItem = useSetCartItem();
  const cartState = useAppSelector((store) => store.cart);
  // Get cart item data
  const cartItem = cartState.cartItems[cartItemId];
  const { variantId, quantity } = cartItem.state;
  const frameworks = cartItem.options;
  return (
    <div
      className={cn(
        'grid place-items-center text-sm tracking-wider',
        className
      )}
    >
      <span className='mb-1 uppercase font-semibold'>Size</span>
      <Select
        name='productVariantId'
        value={variantId}
        onValueChange={(value) =>
          setCartItem(cartItemId, { variantId: value, quantity })
        }
      >
        <SelectTrigger size='sm' className='w-fit'>
          <SelectValue placeholder='select size' />
        </SelectTrigger>
        <SelectContent className='min-w-0'>
          <SelectGroup>
            <SelectLabel>Size</SelectLabel>
            {frameworks.map((framework) => {
              return (
                <SelectItem key={framework.id} value={framework.id}>
                  {framework.size!.toUpperCase()}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
export default SizeSelect;
