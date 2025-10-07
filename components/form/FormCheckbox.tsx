// WARNING:
// Regardless of controlled input, this checkbox will always reset to its default value after form submission.

'use client';

import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

type ParamsType = {
  name: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelText: string;
  className?: string;
  disabled?: boolean;
};

function FormCheckbox({
  name,
  defaultChecked,
  checked,
  onChange,
  labelText,
  className,
  disabled,
}: ParamsType) {
  return (
    <div className={cn('flex flex-row items-center gap-2', className)}>
      <Checkbox
        id={name}
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <Label htmlFor={name} className='text-sm font-normal'>
        {labelText}
      </Label>
    </div>
  );
}
export default FormCheckbox;
