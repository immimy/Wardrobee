// WARNING:
// <Select> UI of Shadcn/ui doesn't correspond with the <select> value after form submission.
// Due to the form behavior that will refresh the page after submitting, the <select> element will also be reset to its default value.
// Causing <Select> UI to display the current selection while the <select> value is reset to the default.

// GUIDANCE:
// Whenever using a <select> element with form submission, instead of using form action, we'll use onSubmit with prevent default to handle form submission.

'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { capitalizeFirstLetter } from '@/utils/format';
import { coerceFormValue } from '@/utils/clientFunctions';

type ParamsType = {
  name: string;
  value?: string | number;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
  placeholder: string;
  labelText?: string;
  frameworks: string[] | number[];
  className?: string;
  disabled?: boolean;
  uppercase?: boolean;
  hideLabel?: boolean;
};

function FormSelect({
  name,
  value,
  onChange,
  defaultValue,
  placeholder,
  labelText,
  frameworks,
  className,
  disabled,
  uppercase,
  hideLabel,
}: ParamsType) {
  return (
    <div className={cn('mb-4', className)}>
      {!hideLabel && (
        <Label
          htmlFor={name}
          className='mb-1 capitalize tracking-tight text-base'
        >
          {labelText || name}
        </Label>
      )}
      <Select
        name={name}
        value={coerceFormValue(value)}
        onValueChange={onChange}
        defaultValue={coerceFormValue(defaultValue)}
        disabled={disabled}
        required
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className='capitalize'>
              {labelText || name}
            </SelectLabel>
            {frameworks.map((framework) => {
              return (
                <SelectItem
                  key={`${name}:${framework}`}
                  value={String(framework).toLowerCase()}
                >
                  {uppercase
                    ? String(framework).toUpperCase()
                    : capitalizeFirstLetter(framework)}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
export default FormSelect;
