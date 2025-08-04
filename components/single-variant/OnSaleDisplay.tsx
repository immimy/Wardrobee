import { Label } from '@/components/ui/label';
import TextDisplay from './TextDisplay';

type ParamsType = {
  isOnSale: boolean;
  discount: number;
};

function OnSaleDisplay({ isOnSale, discount }: ParamsType) {
  return (
    <div className='flex gap-x-6'>
      {/* On sale */}
      <div className='mb-4 flex flex-col'>
        <Label className='mb-1 capitalize tracking-tight text-base'>
          on sale
        </Label>
        <div className='grow grid place-items-center'>
          <button
            type='button'
            className={`bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${
              isOnSale && 'bg-primary dark:bg-primary dark:border-primary'
            }`}
          >
            <span
              className={`bg-background dark:bg-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform translate-x-0 ${
                isOnSale &&
                'dark:bg-primary-foreground translate-x-[calc(100%-2px)]'
              }`}
            />
          </button>
        </div>
      </div>
      {/* Discount */}
      <TextDisplay
        label='discount'
        value={String(discount) + '%'}
        className={`invisible ${isOnSale && 'visible'}`}
      />
    </div>
  );
}
export default OnSaleDisplay;
