import { IoSunny } from 'react-icons/io5';
import { Button } from '../ui/button';

function ToggleTheme() {
  return (
    <Button variant='default' size='icon' className='rounded-full'>
      <IoSunny />
    </Button>
  );
}
export default ToggleTheme;
