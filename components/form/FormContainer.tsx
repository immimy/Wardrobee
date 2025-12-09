'use client';

import { ActionFunction, FormState } from '@/utils/types';
import { FormEventHandler, useActionState, useEffect } from 'react';
import { toast } from 'sonner';

const initialState: FormState = {
  message: '',
  type: 'default',
};

type ParamsType = {
  children: React.ReactNode;
  action: ActionFunction;
  onChange?: FormEventHandler;
  id?: string;
  className?: string;
};

function FormContainer({
  children,
  action,
  onChange,
  id,
  className,
}: ParamsType) {
  const [state, formAction] = useActionState(action, initialState);
  useEffect(() => {
    if (state?.message) {
      switch (state?.type) {
        case 'success':
          toast.success(state?.message);
          return;
        case 'error':
          toast.error(state?.message);
          return;
        case 'default':
          toast(state?.message);
          return;
        default:
          const never: never = state?.type;
          throw new Error(`Invalid toast type : ${never}`);
      }
    }
  }, [state]);
  return (
    <form id={id} action={formAction} onChange={onChange} className={className}>
      {children}
    </form>
  );
}
export default FormContainer;
