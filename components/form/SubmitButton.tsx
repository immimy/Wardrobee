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
  icon?: React.ReactElement;
  variant?: VariantParam;
  size?: SizeParam;
  className?: string;
  disabled?: boolean;
  formId?: string;
};

function SubmitButton({
  text,
  icon,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  formId,
}: ParamsType) {
  const { pending } = useFormStatus();
  return (
    <Button
      form={formId}
      type='submit'
      variant={variant}
      size={size}
      disabled={disabled || pending}
      className={cn(
        'capitalize tracking-tight font-semibold hover:cursor-pointer',
        className
      )}
    >
      {pending ? <LoadingContainer /> : icon || text || 'submit'}
    </Button>
  );
}
export default SubmitButton;
