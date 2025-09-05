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
import { capitalizeFirstLetter, lowerCaseString } from '@/utils/format';

type ParamsType = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
  placeholder: string;
  labelText: string;
  frameworks: string[] | number[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  uppercase?: boolean;
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
  required,
  uppercase,
}: ParamsType) {
  return (
    <div className={cn('mb-4', className)}>
      <Select
        name={name}
        value={value}
        onValueChange={onChange}
        defaultValue={defaultValue ? lowerCaseString(defaultValue) : undefined}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{labelText}</SelectLabel>
            {frameworks.map((framework, index) => {
              return (
                <SelectItem key={index} value={String(framework)}>
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
