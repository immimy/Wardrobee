import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type ParamsType = { type: 'product' | 'address'; className?: string };
function MockAlert({ type, className }: ParamsType) {
  return (
    <Alert variant='destructive' className={className}>
      <AlertCircleIcon />
      <AlertTitle>
        Input Restrictions Applied
        <span className='text-destructive tracking-wider ml-1.5'>
          (Demo Mode)
        </span>
      </AlertTitle>
      <AlertDescription>
        {type === 'product' && 'Image, name, and description'}
        {type === 'address' && 'All address'} inputs are restricted and replaced
        with mock data for demonstration purposes.
      </AlertDescription>
    </Alert>
  );
}
export default MockAlert;
