'use client';

import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';

type ParamsType = {
  name: string;
  defaultChecked?: boolean;
  labelText: string;
  className?: string;
  disabled?: boolean;
};

function FormCheckbox({
  name,
  defaultChecked,
  labelText,
  className,
  disabled,
}: ParamsType) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <div className={cn('flex flex-row items-center gap-2', className)}>
      <button
        type='button'
        className={`relative size-4 border border-input rounded-[4px] shadow-xs transition-shadow grid place-items-center dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px] ${
          isChecked &&
          'border-primary bg-primary text-primary-foreground dark:bg-primary dark:border-primary'
        } ${disabled && 'cursor-not-allowed opacity-50'}`}
        onClick={() => setIsChecked(!isChecked)}
      >
        <input
          type='checkbox'
          id={name}
          name={name}
          defaultChecked={defaultChecked}
          className='absolute inset-0 appearance-none'
          disabled={disabled}
        />
        {isChecked && (
          <span className='size-4'>
            <FaCheck className='text-sm' />
          </span>
        )}
      </button>
      <Label id={name} className='text-sm font-normal'>
        {labelText}
      </Label>
    </div>
  );
}
export default FormCheckbox;
