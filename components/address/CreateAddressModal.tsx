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
import AddressForm from './AddressForm';
import { toast } from 'sonner';
import FormContainer from '../form/FormContainer';
import { FormState } from '@/utils/types';

function CreateAddressModal() {
  const [open, setOpen] = useState(false);

  const createAddressAction = async (
    formState: FormState,
    formData: FormData
  ) => {
    try {
      await createAddress(formData);
      toast.success('Shipping address is added.');
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      setOpen(false);
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
      <DialogContent aria-describedby={undefined} className='p-4 sm:p-6 md:p-8'>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
        </DialogHeader>
        <FormContainer action={createAddressAction}>
          {/* Content */}
          <div className='overflow-y-scroll max-h-[450px]'>
            <AddressForm />
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
