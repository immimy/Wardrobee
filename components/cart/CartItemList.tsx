import Image from 'next/image';
import CartItemForm from './CartItemForm';
import { useOptimisticCartContext } from '../navbar/CartButton';
import { FaXmark } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { useTransition } from 'react';
import LoadingContainer from '../global/LoadingContainer';

type ParamsType = { cartItemId: string };

function CartItemList({ cartItemId }: ParamsType) {
  const [isPending, startTransition] = useTransition();
  const { optimisticState: cartState, removeCartItemAction } =
    useOptimisticCartContext();
  const cartItem = cartState.cartItems[cartItemId];
  const { image, name } = cartItem.data;
  const { variantId } = cartItem.state;
  const stock = cartItem.options.find(
    (option) => option.id === variantId
  )!.stock;

  return (
    <li className='py-6 md:py-4 flex flex-wrap gap-x-4 md:gap-x-10 items-center relative'>
      {/* Remove cart item button */}
      <Button
        size='icon'
        className='absolute top-3 right-2 z-10 size-6 hover:cursor-pointer'
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            removeCartItemAction(cartItemId);
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
    </li>
  );
}
export default CartItemList;
