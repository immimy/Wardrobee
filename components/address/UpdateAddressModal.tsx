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
import { useState } from 'react';
import { FormState } from '@/utils/types';
import { renderError, setAddress } from '@/utils/clientFunctions';
import AddressForm from './AddressForm';
import { ShippingAddress } from '@/lib/generated/prisma';

type ParamsType = { shippingAddress: ShippingAddress };

function UpdateAddressModal({ shippingAddress }: ParamsType) {
  const [open, setOpen] = useState(false);

  const updateAddressAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      await updateAddress(formData);
      const addressId = formData.get('id') as string;
      const address = formData.get('address') as string;
      setAddress(addressId, address);
      setOpen(false);
      return { message: 'Shipping address is updated.', type: 'success' };
    } catch (error) {
      setOpen(false);
      return renderError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <FaPencil />
        </Button>
      </DialogTrigger>
      <DialogContent className='p-4 sm:p-6 md:p-8'>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
        </DialogHeader>
        {/* Content */}
        <div className='overflow-y-scroll max-h-[450px]'>
          <AddressForm
            addressId={`${shippingAddress.id}`}
            action={updateAddressAction}
            defaultValue={shippingAddress}
            disableDefaultUpdate={shippingAddress.isDefault}
          />
        </div>
        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <SubmitButton
            form='address-form'
            text='update shipping address'
            className='w-auto'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default UpdateAddressModal;
