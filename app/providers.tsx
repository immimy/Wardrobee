import { Toaster } from 'sonner';
import StoreProvider from './StoreProvider';

type ParamsType = { children: React.ReactNode };
function Providers({ children }: ParamsType) {
  return (
    <StoreProvider>
      {children}
      <Toaster />
    </StoreProvider>
  );
}
export default Providers;
