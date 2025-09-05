import { cn } from '@/lib/utils';

type ParamsType = {
  field: string;
  value: string | number;
  uppercase?: boolean;
  className?: string;
};

function TextField({ field, value, uppercase, className }: ParamsType) {
  return (
    <div
      className={cn(
        'grid place-items-center text-sm tracking-wider',
        className
      )}
    >
      <span className='mb-1 uppercase font-semibold'>{field}</span>
      <p className='text-shadow-muted-foreground'>
        {uppercase ? String(value).toUpperCase() : value}
      </p>
    </div>
  );
}
export default TextField;
