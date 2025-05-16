import Link from 'next/link';
import { Button } from '../ui/button';
import { RiHomeSmileLine } from 'react-icons/ri';

function HomeButton() {
  return (
    <Button asChild variant='ghost' size='icon' className='rounded-full'>
      <Link href='/'>
        <RiHomeSmileLine className='size-5' />
      </Link>
    </Button>
  );
}
export default HomeButton;
