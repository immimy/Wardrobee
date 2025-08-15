'use client';

import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { mapDisplay } from '@/utils/clientFunctions';

type ParamsType = {
  id: string;
  defaultValue?: string;
};

function AddressTextarea({ id, defaultValue }: ParamsType) {
  return (
    <div className='mb-4 relative'>
      <Label htmlFor={id} className='mb-1 capitalize tracking-tight text-base'>
        address
      </Label>
      <Textarea id={id} name='address' defaultValue={defaultValue} />
      <Badge asChild variant='secondary' className='absolute top-0 right-0'>
        <button
          type='button'
          className='hover:bg-primary/50 transition-all'
          onClick={() => mapDisplay(true)}
        >
          Get address from location
        </button>
      </Badge>
    </div>
  );
}
export default AddressTextarea;
