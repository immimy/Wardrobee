// WARNING:
// Regardless of uncontrolled input, this checkbox will always persist the value after form submission.

'use client';

import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

type ParamsType = {
  name: string;
  labelText?: string;
  labelPosition?: 'top' | 'right';
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  switchClassName?:string
};

function SwitchToggle({
  name,
  labelText,
  labelPosition = 'right',
  defaultChecked,
  checked,
  onChange,
  className,
  disabled,
  switchClassName
  
}: ParamsType) {
  return (
    <div
      className={cn(
        `
        ${labelPosition === 'top' && 'mb-4 text-center'}
        ${labelPosition === 'right' && 'flex flex-row items-center gap-2'}
        `,
        className
      )}
    >
      <Label
        htmlFor={name}
        className={`
         ${
           labelPosition === 'top' && 'mb-1 capitalize tracking-tight text-base'
         }
         ${labelPosition === 'right' && 'text-sm font-normal'}
        `}
      >
        {labelText ?? name}
      </Label>
      <Switch
        id={name}
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={switchClassName}
        
      />
    </div>
  );
}
export default SwitchToggle;
