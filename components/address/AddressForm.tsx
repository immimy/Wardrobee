import FormInput from '../form/FormInput';
import FormCheckbox from '../form/FormCheckbox';
import FormContainer from '../form/FormContainer';
import AddressTextarea from './AddressTextarea';
import MapContainer from './MapContainer';
import { ActionFunction } from '@/utils/types';
import { ShippingAddress } from '@/lib/generated/prisma';

import { createContext, useContext } from 'react';

type ContextType = { addressId: string };
const AddressFormContext = createContext<undefined | ContextType>(undefined);
export const useAddressFormContext = () => useContext(AddressFormContext);

type ParamsType = {
  addressId: string;
  action: ActionFunction;
  defaultValue?: ShippingAddress;
  disableDefaultUpdate?: boolean;
};

function AddressForm({
  addressId,
  action,
  defaultValue,
  disableDefaultUpdate,
}: ParamsType) {
  return (
    <AddressFormContext.Provider value={{ addressId }}>
      <FormContainer id='address-form' action={action}>
        {defaultValue?.id && (
          <input type='hidden' name='id' defaultValue={defaultValue.id} />
        )}
        <FormInput
          type='text'
          name='receiver'
          defaultValue={defaultValue?.receiver}
        />
        <FormInput
          type='text'
          name='phoneNumber'
          labelText='phone number'
          defaultValue={defaultValue?.phoneNumber}
        />
        <MapContainer />
        <AddressTextarea id={addressId} defaultValue={defaultValue?.address} />
        {/* Fix Bug */}
        {/* Cause: Disable change of isDefault field from true to false. */}
        {defaultValue?.isDefault && (
          <input type='hidden' name='isDefault' defaultValue='true' />
        )}
        <FormCheckbox
          name='isDefault'
          labelText='Set this address as default'
          className='py-4 mx-auto w-fit'
          defaultChecked={defaultValue?.isDefault}
          disabled={disableDefaultUpdate}
        />
      </FormContainer>
    </AddressFormContext.Provider>
  );
}
export default AddressForm;
