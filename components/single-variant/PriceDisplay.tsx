import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { priceFormatter } from '@/utils/format';

type ParamsType = {
  label: string;
  value: string | number | undefined;
  isOnSale: boolean;
  price: number;
  className?: string;
};

function TextDisplay({ label, value, isOnSale, price, className }: ParamsType) {
  return (
    <div className={cn('mb-4', className)}>
      <Label className='mb-1 capitalize tracking-tight text-base'>
        {label}
      </Label>
      <p className='relative text-center'>
        {value}
        <span
          className={`${
            !isOnSale && 'hidden'
          } absolute top-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 text-xs line-through text-muted-foreground`}
        >
          {priceFormatter(price)}
        </span>
      </p>
    </div>
  );
}
export default TextDisplay;
