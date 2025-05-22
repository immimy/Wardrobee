import { LiaSearchPlusSolid } from 'react-icons/lia';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function NavSearch() {
  return (
    <div className='hidden md:flex md:items-center bg-secondary rounded'>
      <Label htmlFor='search'>
        <LiaSearchPlusSolid className='size-5 mx-2' />
      </Label>
      <Input type='search' id='search' name='search' />
    </div>
  );
}
export default NavSearch;
