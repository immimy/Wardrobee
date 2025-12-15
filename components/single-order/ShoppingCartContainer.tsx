import { cn } from '@/lib/utils';
import { OrderItem } from '@prisma/client';
import SingleOrderItem from './SingleOrderItem';

type ParamsType = { className?: string; orderItems: OrderItem[] };
function ShoppingCartContainer({ className, orderItems }: ParamsType) {
  return (
    <ul
      className={cn(
        '*:mb-1.5 md:overflow-y-auto md:max-h-[calc(100vh-250px)]',
        className
      )}
    >
      {orderItems.map((item, index) => {
        return <SingleOrderItem key={index} orderItem={item} />;
      })}
    </ul>
  );
}
export default ShoppingCartContainer;
