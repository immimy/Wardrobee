import { priceFormatter } from '@/utils/format';
import { CartType } from '@/utils/types';

type ParamsType = { cart: CartType };

function OrderSummaryContainer({ cart }: ParamsType) {
  const shipping = 100;

  return (
    <ul className='p-4 tracking-wider font-bold *:not-first:flex *:not-first:justify-between *:pb-1 *:last:border-t *:last:py-2 *:*:font-semibold *:last:text-chart-3'>
      <li>
        Item{cart.totalQuantity > 1 && 's'}
        <span className='ml-2.5 text-chart-3'>
          &#40;{cart.totalQuantity}&#41;
        </span>
      </li>
      <li>
        Subtotal
        <span>{priceFormatter(cart.subtotal)}</span>
      </li>
      <li>
        Shipping
        <span>{priceFormatter(shipping)}</span>
      </li>
      <li>
        Order Total:
        <span>{priceFormatter(cart.subtotal + shipping)}</span>
      </li>
    </ul>
  );
}
export default OrderSummaryContainer;
