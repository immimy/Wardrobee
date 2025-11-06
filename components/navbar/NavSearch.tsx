'use client';

import { LiaSearchPlusSolid } from 'react-icons/lia';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { ChangeEventHandler } from 'react';

function NavSearch() {
  const { replace } = useRouter();

  const searchHandler: ChangeEventHandler<HTMLInputElement> = (e) =>
    replace(`/products?search=${e.target.value}`);
  const debouncedSearch = useDebouncedCallback(searchHandler, 500);

  return (
    <div className='hidden md:flex md:items-center bg-secondary rounded'>
      <Label htmlFor='search'>
        <LiaSearchPlusSolid className='size-5 mx-2' />
      </Label>
      <Input
        type='search'
        id='search'
        name='search'
        onChange={debouncedSearch}
      />
    </div>
  );
}
export default NavSearch;
