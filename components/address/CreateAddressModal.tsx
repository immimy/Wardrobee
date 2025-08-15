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
import { FaHome } from 'react-icons/fa';
import { useState } from 'react';
import { FormState } from '@/utils/types';
import { renderError } from '@/utils/clientFunctions';
import AddressForm from './AddressForm';

function CreateAddressModal() {
  const [open, setOpen] = useState(false);

  const createAddressAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      await createAddress(formData);
      setOpen(false);
      return { message: 'Shipping address is added.', type: 'success' };
    } catch (error) {
      setOpen(false);
      return renderError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full font-medium tracking-wider'>
          <span>
            <FaHome />
          </span>
          Add Shipping Address
        </Button>
      </DialogTrigger>
      <DialogContent className='p-4 sm:p-6 md:p-8'>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
        </DialogHeader>
        {/* Content */}
        <div className='overflow-y-scroll max-h-[450px]'>
          <AddressForm addressId='address' action={createAddressAction} />
        </div>
        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <SubmitButton
            form='address-form'
            text='add shipping address'
            className='w-auto'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CreateAddressModal;
