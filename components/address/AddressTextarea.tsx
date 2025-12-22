'use client';

import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type ParamsType = {
  defaultValue?: string;
};

function AddressTextarea({ defaultValue }: ParamsType) {
  return (
    <div className='mb-4 relative'>
      <Label
        htmlFor='address'
        className='mb-1 capitalize tracking-tight text-base'
      >
        address
      </Label>
      <Textarea
        id='address'
        name='address'
        defaultValue={defaultValue}
        required
      />
    </div>
  );
}
export default AddressTextarea;
