'use client';

import { useState } from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

type ParamsType = {
  name: string;
  labelText?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function ColorInput({
  name,
  labelText,
  defaultValue,
  placeholder,
  disabled,
  className,
}: ParamsType) {
  const [value, setValue] = useState(defaultValue || '#000');

  return (
    <div className={cn('mb-4', className)}>
      <Label
        htmlFor={name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText ?? name}
      </Label>
      <input
        type='color'
        id={name}
        name={name}
        placeholder={placeholder}
        required
        disabled={disabled}
        className='h-10 w-12 rounded-xl shadow-2xs'
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
}
export default ColorInput;
