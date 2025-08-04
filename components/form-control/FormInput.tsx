'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

type ParamsType = {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
};

function FormInput({
  type,
  name,
  labelText,
  defaultValue,
  placeholder,
  className,
}: ParamsType) {
  const initialValue =
    typeof defaultValue === 'number'
      ? String(defaultValue)
      : defaultValue ?? '';
  const [value, setValue] = useState(initialValue);

  return (
    <div className={cn('mb-4', className)}>
      <Label
        htmlFor={name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText ?? name}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
}
export default FormInput;
