'use client';

import { priceFormatter } from '@/utils/format';
import TextField from './TextField';
import PriceField from './PriceField';
import { Badge } from '../ui/badge';
import QuantityInput from './QuantityInput';
import { startTransition, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import SizeSelect from './SizeSelect';
import ColorSelect from './ColorSelect';
import { useOptimisticCartContext } from '../navbar/CartButton';

type ParamsType = { cartItemId: string };

function CartItemForm({ cartItemId }: ParamsType) {
  const {
    optimisticState: cartState,
    updateCartItemAction,
    addOptimistic,
  } = useOptimisticCartContext();
  const cartItem = cartState.cartItems[cartItemId];
  const { name, price, category } = cartItem.data;
  const { variantId, quantity } = cartItem.state;
  const frameworks = cartItem.options;
  const { discount } = frameworks.find(
    (framework) => framework.id === variantId
  )!;
  const sellingPrice = price * (1 - discount / 100);

  // Debounce function for update quantity
  const debounce = useDebouncedCallback(() => {
    startTransition(() => {
      addOptimistic({
        cartItemId,
        variantId,
        quantity: quantity === 0 ? 1 : quantity,
        isReCalc: true,
      });
      updateCartItemAction(cartItemId);
    });
  }, 1000);

  // Listen for quantity change event
  useEffect(() => {
    const form = document.getElementById(cartItemId);
    form?.addEventListener(cartItemId, debounce);
    return () => {
      // Remove event listener when element is unmounted
      form?.removeEventListener(cartItemId, () => {});
    };
  }, []);

  return (
    <form id={cartItemId} onChange={() => updateCartItemAction(cartItemId)}>
      <input type='hidden' name='id' defaultValue={cartItemId} />
      {/* Product name */}
      <h6 className='font-semibold mb-1.5 text-primary'>
        {name}
        {Boolean(discount) && (
          <Badge variant='destructive' className='rounded ml-2 h-5'>
            -{discount}%
          </Badge>
        )}
      </h6>
      {/* Other fields */}
      <div className='flex flex-wrap gap-x-6 md:gap-x-8 gap-y-6 justify-end'>
        {/* Size select */}
        {category === 'clothes' && <SizeSelect cartItemId={cartItemId} />}
        {/* Color select */}
        {category === 'bag' && <ColorSelect cartItemId={cartItemId} />}
        {/* Accessory */}
        {category === 'accessory' && (
          <input type='hidden' name='productVariantId' value={variantId} />
        )}
        {/* Price */}
        <PriceField price={price} discount={discount} />
        {/* Quantity input */}
        <QuantityInput cartItemId={cartItemId} />
        {/* Total */}
        <TextField
          field='total'
          value={priceFormatter(sellingPrice * Number(quantity))}
        />
      </div>
    </form>
  );
}
export default CartItemForm;
