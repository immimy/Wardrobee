import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ParamsType = {
  label: string;
  value: string | number | undefined;
  className?: string;
};

function TextDisplay({ label, value, className }: ParamsType) {
  return (
    <div className={cn('mb-4', className)}>
      <Label className='mb-1 capitalize tracking-tight text-base'>
        {label}
      </Label>
      <p className='text-center'>{value}</p>
    </div>
  );
}
export default TextDisplay;
