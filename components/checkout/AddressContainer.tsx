'use client';

import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';
import AddressItem from './AddressItem';
import AddressRadioGroup from './AddressRadioGroup';
import CreateAddressModal from '../address/CreateAddressModal';
import FormContainer from '../form/FormContainer';
import { checkout } from '@/utils/actions';
import { useCheckoutProviderContext } from './CheckoutProvider';
import { FormState } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/hooks';
import { clearCart, getFreshCart } from '@/lib/features/cart/cartSlice';
import { useAllProductsMutate } from '@/utils/swr';

type ParamsType = {
  className?: string;
};

function AddressContainer({ className }: ParamsType) {
  const { dbAddresses, shippingAddress, setShippingAddress } =
    useCheckoutProviderContext();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allProductsMutate = useAllProductsMutate();

  const checkoutAction = async (formState: FormState, formData: FormData) => {
    try {
      await checkout(formData);
      // Clearing cart store
      dispatch(clearCart({ isCleared: true }));
      // Clear all products cache on SWR without revalidation
      allProductsMutate();
      toast.success('Placed an order successfully');
      // Navigate to orders page
      router.push('/dashboard/orders');
    } catch {
      // Refresh cart
      dispatch(getFreshCart());
      toast.error('Failed to place an order.');
      // Navigate to orders page
      router.push('/dashboard/orders');
    }
  };

  return (
    <>
      {!dbAddresses.length ? (
        <div className='mt-4'>
          <CreateAddressModal
            state={shippingAddress}
            dispatch={setShippingAddress}
          />
        </div>
      ) : (
        <Accordion type='single' collapsible className={className}>
          <AccordionItem value='shipping-address'>
            {/* Selected address display */}
            <AccordionTrigger
              id='shipping-address'
              className='hover:no-underline'
            >
              {/* (Hidden form) Checkout */}
              <FormContainer id='checkout' action={checkoutAction}>
                <input
                  type='hidden'
                  name='addressId'
                  value={shippingAddress?.id}
                />
              </FormContainer>
              {/* Address display */}
              <AddressItem data={shippingAddress!} isDisplay />
            </AccordionTrigger>
            {/* Select other addresses */}
            <AccordionContent>
              {/* Address radio */}
              <AddressRadioGroup />
              {/* Add new address if address is less than 3 */}
              {dbAddresses.length < 3 && (
                <div className='mt-4'>
                  <CreateAddressModal disableDefaultUpdate />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
export default AddressContainer;
