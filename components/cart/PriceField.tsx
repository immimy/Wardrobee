import { cn } from '@/lib/utils';
import { priceFormatter } from '@/utils/format';

type ParamsType = { price: number; discount: number,className?:string };

function PriceField({ price, discount ,className}: ParamsType) {
  const isOnSale = Boolean(discount);
  return (
    <div className={cn('grid place-items-center text-sm tracking-wider',className)}>
      <span className='mb-1 uppercase font-semibold'>Price</span>
      <div className='relative text-shadow-muted-foreground'>
        {/* Sale price */}
        {isOnSale && <p>{priceFormatter(price * (1 - discount / 100))}</p>}
        {/* Regular price */}
        <p
          className={`${
            isOnSale &&
            'line-through text-xs absolute -bottom-1/2 left-1/2 -translate-x-1/2 text-muted-foreground'
          }`}
        >
          {priceFormatter(price)}
        </p>
      </div>
    </div>
  );
}
export default PriceField;
