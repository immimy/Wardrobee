'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type VariantParam =
  | 'default'
  | 'link'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | null
  | undefined;

function SubmitButton({
  text,
  variant,
  className,
}: {
  text?: string;
  variant?: VariantParam;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant={variant}
      size='default'
      disabled={pending}
      className={cn(
        'capitalize tracking-tight font-semibold hover:cursor-pointer',
        className
      )}
    >
      {pending ? (
        <>
          <Loader2 className='animate-spin' />
          loading
        </>
      ) : (
        text ?? 'submit'
      )}
    </Button>
  );
}
export default SubmitButton;
