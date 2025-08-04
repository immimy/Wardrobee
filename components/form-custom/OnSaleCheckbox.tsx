'use client';

import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction } from 'react';

type ParamsType = {
  name: string;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
};

function OnSaleCheckbox({ name, isChecked, setIsChecked }: ParamsType) {
  return (
    <div className='mb-4 flex flex-col'>
      <Label id={name} className='mb-1 capitalize tracking-tight text-base'>
        on sale
      </Label>
      <div className='grow grid place-items-center'>
        <button
          type='button'
          className={`relative bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${
            isChecked && 'bg-primary dark:bg-primary dark:border-primary'
          }`}
        >
          <input
            type='checkbox'
            id={name}
            name={name}
            checked={isChecked}
            onChange={(e) => setIsChecked(e.currentTarget.checked)}
            className='absolute inset-0 appearance-none'
          />
          <span
            className={`bg-background dark:bg-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform translate-x-0 ${
              isChecked &&
              'dark:bg-primary-foreground translate-x-[calc(100%-2px)]'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
export default OnSaleCheckbox;
