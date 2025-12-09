'use client';

import { updateAddress } from '@/utils/actions';
import SubmitButton from '../form/SubmitButton';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { FaPencil } from 'react-icons/fa6';
import { Dispatch, SetStateAction, useState } from 'react';
import AddressForm from './AddressForm';
import FormContainer from '../form/FormContainer';
import { toast } from 'sonner';
import { FormState, ShippingAddressType } from '@/utils/types';
import { ShippingAddressState } from '../checkout/CheckoutProvider';

type ParamsType = {
  data: ShippingAddressType;
  state?: ShippingAddressState;
  dispatch?: Dispatch<SetStateAction<ShippingAddressState>>;
  disableDefaultUpdate?: boolean;
};

function UpdateAddressModal({
  data,
  state,
  dispatch,
  disableDefaultUpdate,
}: ParamsType) {
  const [open, setOpen] = useState(false);

  const updateAddressAction = async (
    formState: FormState,
    formData: FormData
  ) => {
    try {
      // Checkout page with selected shipping address state
      if (dispatch && state?.id === data.id) {
        // Optimistic update
        dispatch({ ...data, ...Object.fromEntries(formData) });
      }
      // Update address to database
      await updateAddress(formData);
      toast.success('Shipping address is updated.');
      // Close modal
      setOpen(false);
    } catch {
      // Checkout page with selected shipping address state
      if (dispatch && state?.id === data.id) {
        // Rollback
        dispatch(data);
      }
      toast.error('Failed to update an address');
      // Close modal
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='hover:cursor-pointer'
        >
          <FaPencil />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className='p-4 sm:p-6 md:p-8'>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
        </DialogHeader>
        <FormContainer action={updateAddressAction}>
          {/* Content */}
          <div className='overflow-y-scroll max-h-[450px]'>
            <AddressForm
              key={data.id}
              defaultValue={data}
              disableDefaultUpdate={disableDefaultUpdate}
            />
          </div>
          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton text='update shipping address' className='w-auto' />
          </DialogFooter>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}
export default UpdateAddressModal;
