import FormInput from '../form/FormInput';
import { LiaSearchPlusSolid } from 'react-icons/lia';
import { Label } from '../ui/label';

function NavSearch() {
  return (
    <div className='hidden md:flex md:items-center bg-secondary rounded'>
      <Label htmlFor='search'>
        <LiaSearchPlusSolid className='size-5 mx-2' />
      </Label>
      <FormInput
        type='search'
        name='search'
        defaultValue=''
      />
    </div>
  );
}
export default NavSearch;
