'use client';

import { usePathname } from 'next/navigation';
import CartButton from './CartButton';

function CartContainer() {
  // Hide cart button in Cart & Checkout page
  const pathname = usePathname();
  const hidden = ['/cart', '/checkout'].filter((route) =>
    pathname.startsWith(route)
  );
  if (hidden.length > 0) return null;

  return <CartButton />;
}
export default CartContainer;
