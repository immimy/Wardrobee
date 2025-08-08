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
import { Label } from '@/components/ui/label';
import { capitalizeFirstLetter, lowerCaseString } from '@/utils/format';
import { PRODUCT_CATEGORY } from '@/utils/constants';
import { useCategoryFormContext } from '@/components/admin/product-update/CategoryForm';
import { ProductCategory } from '@/utils/types';

export function CategorySelect() {
  const { category, setCategory } = useCategoryFormContext()!;
  const [open, setOpen] = useState(false);
  return (
    <div className='mb-4'>
      <Label
        htmlFor='category'
        className='mb-1 capitalize tracking-tight text-base'
      >
        category
      </Label>
      <div className='relative'>
        {/* Hidden input */}
        <input
          type='text'
          id='category'
          name='category'
          value={category}
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
            >
              {capitalizeFirstLetter(category) || 'choose category'}
              <ChevronDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit p-0'>
            <Command>
              <CommandList>
                <CommandGroup heading='category'>
                  {PRODUCT_CATEGORY.map((framework) => (
                    <CommandItem
                      key={framework}
                      value={lowerCaseString(framework)}
                      onSelect={(currentValue) => {
                        setCategory(currentValue as ProductCategory);
                        setOpen(false);
                      }}
                    >
                      {capitalizeFirstLetter(framework)}
                      <Check
                        className={cn(
                          'ml-auto',
                          category === framework ? 'opacity-100' : 'opacity-0'
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

export default CategorySelect;
