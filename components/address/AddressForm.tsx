import FormInput from '../form/FormInput';
import FormCheckbox from '../form/FormCheckbox';
import AddressTextarea from './AddressTextarea';
import { ShippingAddressType } from '@/utils/types';

type ParamsType = {
  defaultValue?: ShippingAddressType;
  disableDefaultUpdate?: boolean;
};

function AddressForm({ defaultValue, disableDefaultUpdate }: ParamsType) {
  return (
    <>
      {defaultValue?.id && (
        <input type='hidden' name='id' defaultValue={defaultValue.id} />
      )}
      {/* Receiver */}
      <FormInput
        type='text'
        name='receiver'
        defaultValue={defaultValue?.receiver}
      />
      {/* Phone number */}
      <FormInput
        type='text'
        name='phoneNumber'
        labelText='phone number'
        defaultValue={defaultValue?.phoneNumber}
      />
      {/* Address */}
      <AddressTextarea defaultValue={defaultValue?.address} />
      {/* Is Default Address? */}
      <FormCheckbox
        name='isDefault'
        labelText='Set this address as default'
        className={`py-4 mx-auto w-fit ${disableDefaultUpdate && 'hidden'}`}
        defaultChecked={defaultValue?.isDefault}
        isPreventPointerEvent={disableDefaultUpdate || defaultValue?.isDefault}
      />
    </>
  );
}
export default AddressForm;
