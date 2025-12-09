import { updateAddress } from '@/utils/actions';
import { toastError } from '@/utils/clientFunctions';
import { FormEventHandler } from 'react';
import { useCheckoutProviderContext } from './CheckoutProvider';

type ParamsType = {
  children: React.ReactNode;
};

function DefaultAddressForm({ children }: ParamsType) {
  const { shippingAddress, setShippingAddress } = useCheckoutProviderContext();

  const setDefaultAddressHandler: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      // Optimistic response
      if (shippingAddress) {
        setShippingAddress({ ...shippingAddress, isDefault: true });
      }
      // Update address to database
      await updateAddress(formData);
    } catch (error) {
      // Rollback
      if (shippingAddress) {
        setShippingAddress({ ...shippingAddress });
      }
      return toastError(error);
    }
  };

  return (
    <form onSubmit={setDefaultAddressHandler}>
      {/* Update address as default */}
      <fieldset>
        <input type='hidden' name='id' value={shippingAddress?.id} />
        <input
          type='hidden'
          name='receiver'
          value={shippingAddress?.receiver}
        />
        <input type='hidden' name='address' value={shippingAddress?.address} />
        <input
          type='hidden'
          name='phoneNumber'
          value={shippingAddress?.phoneNumber}
        />
        <input type='hidden' name='isDefault' value='on' />
      </fieldset>
      {/* Submit Button */}
      {children}
    </form>
  );
}
export default DefaultAddressForm;
