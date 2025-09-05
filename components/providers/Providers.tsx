import { Toaster } from '@/components/ui/sonner';
import CartProvider from './CartProvider';
import UserProvider from './UserProvider';
import { fetchCart } from '@/utils/actions';

type ParamsType = { children: React.ReactNode };

async function Providers({ children }: ParamsType) {
  const cartPromise = fetchCart();
  return (
    <>
      <UserProvider>
        <CartProvider cartPromise={cartPromise}>{children}</CartProvider>
      </UserProvider>
      <Toaster />
    </>
  );
}
export default Providers;
