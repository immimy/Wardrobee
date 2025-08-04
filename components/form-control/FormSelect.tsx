'use client';

import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { Label } from '../ui/label';
import { capitalizeFirstLetter, lowerCaseString } from '@/utils/format';

type ParamsType = {
  name: string;
  labelText: string;
  placeholder: string;
  frameworks: Array<string | number>;
  defaultValue?: string | number;
  isLabel?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
};

export function FormSelect({
  name,
  labelText,
  placeholder,
  frameworks,
  defaultValue = '',
  isLabel,
  disabled,
  onChange,
  className,
}: ParamsType) {
  const initialValue = lowerCaseString(defaultValue);
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('mb-4', className)}>
      {isLabel && (
        <Label
          htmlFor={name}
          className='mb-1 capitalize tracking-tight text-base'
        >
          {labelText}
        </Label>
      )}
      <div className='relative'>
        {/* Hidden input */}
        <input
          type='text'
          id={name}
          name={name}
          value={value}
          onChange={(e) => console.log(e.currentTarget.value)}
          required
          aria-hidden
          className='appearance-none absolute inset-0 -z-10 focus:outline-0'
        />
        {/* Select UI */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-[200px] justify-between'
              disabled={disabled}
            >
              {capitalizeFirstLetter(value) || placeholder}
              <ChevronDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit p-0'>
            <Command>
              <CommandList>
                <CommandGroup heading={labelText}>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework}
                      value={lowerCaseString(framework)}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                        onChange && onChange(String(currentValue));
                      }}
                    >
                      {capitalizeFirstLetter(framework)}
                      <Check
                        className={cn(
                          'ml-auto',
                          value === framework ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default FormSelect;
