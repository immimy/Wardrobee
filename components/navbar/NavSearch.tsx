'use client';

import { LiaSearchPlusSolid } from 'react-icons/lia';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

function NavSearch() {
  const { replace } = useRouter();
  const debounce = useDebouncedCallback((search: string) => {
    replace(`/products?search=${search}`);
  }, 1000);
  return (
    <div className='hidden md:flex md:items-center bg-secondary rounded'>
      <Label htmlFor='search'>
        <LiaSearchPlusSolid className='size-5 mx-2' />
      </Label>
      <Input
        type='search'
        id='search'
        name='search'
        onChange={(e) => debounce(e.currentTarget.value)}
      />
    </div>
  );
}
export default NavSearch;
