'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import LoadingContainer from '../global/LoadingContainer';

type VariantParam =
  | 'default'
  | 'link'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | null
  | undefined;
type SizeParam = 'default' | 'sm' | 'lg' | 'icon' | null | undefined;

type ParamsType = {
  text?: string;
  icon?: React.ReactNode;
  variant?: VariantParam;
  size?: SizeParam;
  className?: string;
  form?: string;
};

function SubmitButton({
  text,
  icon,
  variant,
  size,
  className,
  form,
}: ParamsType) {
  const { pending } = useFormStatus();
  return (
    <Button
      form={form}
      variant={variant ?? 'default'}
      size={size ?? 'default'}
      disabled={pending}
      className={cn(
        'capitalize tracking-tight font-semibold hover:cursor-pointer',
        className
      )}
    >
      {pending ? <LoadingContainer /> : text ?? icon ?? 'submit'}
    </Button>
  );
}
export default SubmitButton;
