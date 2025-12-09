import SingleCartItem from './SingleCartItem';
import { cn } from '@/lib/utils';
import { CartType } from '@/utils/types';

type ParamsType = { className?: string; cart: CartType };
function ShoppingCartContainer({ className, cart }: ParamsType) {
  return (
    <ul
      className={cn(
        '*:mb-1.5 md:overflow-y-auto md:max-h-[calc(100vh-250px)]',
        className
      )}
    >
      {Object.values(cart.cartItems).map((item, index) => {
        return <SingleCartItem key={index} cartItem={item} />;
      })}
    </ul>
  );
}
export default ShoppingCartContainer;
