'use client';

import { useState } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type ParamsType = {
  name: string;
  labelText?: string;
  defaultValue?: string;
};

function FormTextarea({ name, labelText, defaultValue }: ParamsType) {
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <div className='mb-4'>
      <Label
        htmlFor={name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText ?? name}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
}
export default FormTextarea;
