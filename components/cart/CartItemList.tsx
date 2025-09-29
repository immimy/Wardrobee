import Image from 'next/image';
import CartItemForm from './CartItemForm';
import { FaXmark } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { useTransition } from 'react';
import LoadingContainer from '../global/LoadingContainer';
import {
  useAppSelector,
  useCancelUpdateCartItem,
  useRemoveCartItem,
} from '@/lib/hooks';

type ParamsType = { cartItemId: string };

function CartItemList({ cartItemId }: ParamsType) {
  const removeCartItem = useRemoveCartItem();
  const cancelUpdate = useCancelUpdateCartItem();
  const [isPending, startTransition] = useTransition();
  const cartState = useAppSelector((store) => store.cart);

  // Get cart item data
  const cartItem = cartState.cartItems[cartItemId];
  const isUpdating = cartItem.isUpdating;
  const { image, name } = cartItem.data;
  const { variantId } = cartItem.state;
  const stock = cartItem.options.find(
    (option) => option.id === variantId
  )!.stock;

  return (
    <li>
      <div className='py-6 md:py-4 flex flex-wrap gap-x-4 md:gap-x-10 items-center relative'>
        {/* Remove cart item button */}
        <Button
          size='icon'
          className='absolute top-3 right-2 z-10 size-6 hover:cursor-pointer'
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              removeCartItem(cartItemId);
            });
          }}
        >
          {isPending ? <LoadingContainer /> : <FaXmark />}
        </Button>
        {/* Product image */}
        <figure className='size-20 md:size-16 overflow-hidden rounded'>
          <Image
            src={image}
            alt={name}
            className='w-auto'
            width={80}
            height={80}
          />
        </figure>
        {/* Cart item details */}
        <div className='grow relative'>
          {/* Cart item form */}
          <CartItemForm cartItemId={cartItemId} />
          {/* Display stock quantity when < 20 items */}
          {stock < 20 && (
            <span className='absolute uppercase text-sm tracking-wide font-medium text-destructive left-1/2 -translate-x-3 -bottom-5.5'>
              {stock} item{stock > 1 && 's'} in stock
            </span>
          )}
        </div>
      </div>
      {/* Submit & Cancel Button */}
      <div
        className={`py-2 ${
          isUpdating ? 'block' : 'hidden'
        } flex justify-end gap-x-2 border-b-0`}
      >
        <Button
          type='submit'
          form={cartItemId}
          size='sm'
          variant='secondary'
          className='tracking-widest hover:cursor-pointer'
        >
          Confirm Update
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='tracking-widest hover:cursor-pointer'
          onClick={() => cancelUpdate(cartItemId)}
        >
          Cancel
        </Button>
      </div>
    </li>
  );
}
export default CartItemList;
