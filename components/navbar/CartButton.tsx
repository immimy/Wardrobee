import { IoCart } from 'react-icons/io5';
import { Button } from '../ui/button';
import Link from 'next/link';

function CartButton() {
  return (
    <Button asChild variant='default' size='icon' className='rounded-full'>
      <Link href='/cart'>
        <IoCart />
      </Link>
    </Button>
  );
}
export default CartButton;
