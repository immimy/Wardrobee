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
import AddressForm from './AddressForm';
import { ShippingAddress } from '@/lib/generated/prisma';
import FormContainer from '../form/FormContainer';
import { toast } from 'sonner';

type ParamsType = { shippingAddress: ShippingAddress };

function UpdateAddressModal({ shippingAddress }: ParamsType) {
  const [open, setOpen] = useState(false);

  const updateAddressAction = async (formState: any, formData: FormData) => {
    try {
      await updateAddress(formData);
      toast.success('Shipping address is updated.');
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='ghost' size='icon'>
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
              defaultValue={shippingAddress}
              disableDefaultUpdate={shippingAddress.isDefault}
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
