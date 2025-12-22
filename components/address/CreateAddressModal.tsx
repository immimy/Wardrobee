'use client';

import { createAddress } from '@/utils/actions';
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
import { MdOutlineAddLocationAlt } from 'react-icons/md';
import { Dispatch, SetStateAction, useState } from 'react';
import AddressForm from './AddressForm';
import { toast } from 'sonner';
import FormContainer from '../form/FormContainer';
import { FormState } from '@/utils/types';
import { ShippingAddressState } from '../checkout/CheckoutProvider';
import MockAlert from '../global/MockAlert';
import { toastError } from '@/utils/clientFunctions';

type ParamsType = {
  disableDefaultUpdate?: boolean;
  state?: ShippingAddressState;
  dispatch?: Dispatch<SetStateAction<ShippingAddressState>>;
};

function CreateAddressModal({
  disableDefaultUpdate,
  state,
  dispatch,
}: ParamsType) {
  const [open, setOpen] = useState(false);

  const createAddressAction = async (
    formState: FormState,
    formData: FormData
  ) => {
    try {
      // Create address to database
      const shippingAddress = await createAddress(formData);
      toast.success('Shipping address is added.');
      // Update selected shipping address state (Checkout Page)
      if (dispatch && !state) dispatch({ ...shippingAddress });
      setOpen(false);
    } catch (error) {
      toastError(error);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full font-medium tracking-wider'>
          <span>
            <MdOutlineAddLocationAlt />
          </span>
          Add Shipping Address
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className='p-4 sm:p-6 md:p-8'>
        {/* Mock alert */}
        <MockAlert type='address' />
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
        </DialogHeader>
        <FormContainer action={createAddressAction}>
          {/* Content */}
          <div className='overflow-y-auto max-h-[calc(100vh-60px)]'>
            <AddressForm disableDefaultUpdate={disableDefaultUpdate} />
          </div>
          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton text='add shipping address' className='w-auto' />
          </DialogFooter>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}
export default CreateAddressModal;
