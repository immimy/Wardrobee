import { Loader2 } from 'lucide-react';

function LoadingContainer() {
  return (
    <div className='flex justify-center items-center'>
      <Loader2 className='animate-spin' />
    </div>
  );
}
export default LoadingContainer;
