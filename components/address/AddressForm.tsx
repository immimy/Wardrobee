import FormInput from '../form/FormInput';
import FormCheckbox from '../form/FormCheckbox';
import AddressTextarea from './AddressTextarea';
import MapContainer from './MapContainer';
import { ShippingAddress } from '@/lib/generated/prisma';

type ParamsType = {
  defaultValue?: ShippingAddress;
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
      {/* Map container */}
      <MapContainer />
      {/* Address */}
      <AddressTextarea defaultValue={defaultValue?.address} />
      {/* Fix Bug */}
      {/* Cause: Disable change of isDefault field from true to false. */}
      {defaultValue?.isDefault && (
        <input type='hidden' name='isDefault' defaultValue='true' />
      )}
      {/* Default address state */}
      <FormCheckbox
        name='isDefault'
        labelText='Set this address as default'
        className='py-4 mx-auto w-fit'
        defaultChecked={defaultValue?.isDefault}
        disabled={disableDefaultUpdate}
      />
    </>
  );
}
export default AddressForm;
