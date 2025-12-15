import { priceFormatter } from '@/utils/format';
import { OrderItem } from '@prisma/client';

type ParamsType = { shippingFee: number; orderItems: OrderItem[] };

function OrderSummaryContainer({ shippingFee, orderItems }: ParamsType) {
  // Calculate order summary
  const { totalQuantity, subtotal } = orderItems.reduce<{
    [key: string]: number;
  }>(
    (acc, item) => {
      const { quantity, total } = item;
      return {
        totalQuantity: acc.totalQuantity + quantity,
        subtotal: acc.subtotal + Number(total),
      };
    },
    { totalQuantity: 0, subtotal: 0 }
  );
  return (
    <ul className='p-4 tracking-wider font-bold *:not-first:flex *:not-first:justify-between *:pb-1 *:last:border-t *:last:py-2 *:*:font-semibold *:last:text-chart-3'>
      <li>
        Item{totalQuantity > 1 && 's'}
        <span className='ml-2.5 text-chart-3'>&#40;{totalQuantity}&#41;</span>
      </li>
      <li>
        Subtotal
        <span>{priceFormatter(subtotal)}</span>
      </li>
      <li>
        Shipping
        <span>{priceFormatter(shippingFee)}</span>
      </li>
      <li>
        Order Total:
        <span>{priceFormatter(subtotal + shippingFee)}</span>
      </li>
    </ul>
  );
}
export default OrderSummaryContainer;
