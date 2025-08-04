'use client';

import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { useState } from 'react';

type ParamsType = {
  name: string;
  defaultChecked?: boolean;
  labelText: string;
  className?: string;
  disabled?: boolean;
};

function FormCheckbox({
  name,
  defaultChecked = false,
  labelText,
  className,
  disabled,
}: ParamsType) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <div className={cn('mb-4 flex flex-col', className)}>
      <Label id={name} className='mb-1 capitalize tracking-tight text-base'>
        {labelText}
      </Label>
      <div className='grow grid place-items-center'>
        <button
          type='button'
          className={`-translate-y-1.5 relative bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${
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
            disabled={disabled}
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
export default FormCheckbox;
