import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import AddressItem from './AddressItem';
import { ShippingAddressType } from '@/utils/types';
import { useCheckoutProviderContext } from './CheckoutProvider';

function AddressRadioGroup() {
  const { dbAddresses, shippingAddress, setShippingAddress } =
    useCheckoutProviderContext();

  const selectAddress = (newAddress: ShippingAddressType) => {
    setShippingAddress(newAddress);
    // Collapse shipping address accordion
    document.getElementById('shipping-address')?.click();
    // Users select non-default address,
    // asking users if they want to set this address as default.
    if (!newAddress.isDefault) {
      document.getElementById('default-address-alert')?.click();
    }
  };

  return (
    <RadioGroup name='address' defaultValue={shippingAddress?.id}>
      {dbAddresses.map((item) => {
        return (
          <div key={item.id} className='flex items-center gap-x-3'>
            <RadioGroupItem
              value={item.id}
              id={item.id}
              onClick={() => selectAddress(item)}
            />
            <Label htmlFor={item.id} className='grow'>
              <AddressItem data={item} />
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
export default AddressRadioGroup;
