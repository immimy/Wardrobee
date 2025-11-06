import { Toaster } from 'sonner';
import StoreProvider from '@/components/providers/StoreProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';

type ParamsType = { children: React.ReactNode };
function Providers({ children }: ParamsType) {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <Toaster />
    </StoreProvider>
  );
}
export default Providers;
