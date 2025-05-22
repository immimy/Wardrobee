'use client';

import { ActionFunction, FormState } from '@/utils/types';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

const initialState: FormState = {
  message: '',
  type: 'default',
};

function FormContainer({
  children,
  action,
}: {
  children: React.ReactNode;
  action: ActionFunction;
}) {
  const [state, formAction] = useActionState(action, initialState);
  useEffect(() => {
    if (state.message) {
      switch (state.type) {
        case 'success':
          toast.success(state.message);
          return;
        case 'error':
          toast.error(state.message);
          return;
        case 'default':
          toast(state.message);
          return;
        default:
          const never: never = state.type;
          throw new Error(`Invalid toast type : ${never}`);
      }
    }
  }, [state]);
  return <form action={formAction}>{children}</form>;
}
export default FormContainer;
