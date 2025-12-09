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
  isPreventPointerEvent?: boolean;
};

function FormCheckbox({
  name,
  defaultChecked,
  checked,
  onChange,
  labelText,
  className,
  disabled,
  isPreventPointerEvent,
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
        className={`${isPreventPointerEvent && 'pointer-events-none'}`}
        tabIndex={isPreventPointerEvent ? -1 : undefined}
        aria-disabled={isPreventPointerEvent}
      />
      <Label
        htmlFor={isPreventPointerEvent ? '' : name}
        className={`text-sm font-normal ${
          isPreventPointerEvent && 'hover:cursor-not-allowed'
        }`}
      >
        {labelText}
      </Label>
    </div>
  );
}
export default FormCheckbox;
