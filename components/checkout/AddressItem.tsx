import { FaLocationDot } from 'react-icons/fa6';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import DeleteAddressButton from '../address/DeleteAddressButton';
import UpdateAddressModal from '../address/UpdateAddressModal';
import { useCheckoutProviderContext } from './CheckoutProvider';
import { ShippingAddressType } from '@/utils/types';

type ParamsType = {
  data: ShippingAddressType;
  isDisplay?: boolean;
};
function AddressItem({ data, isDisplay }: ParamsType) {
  const { receiver, address, phoneNumber, isDefault } = data;
  const { shippingAddress, setShippingAddress } = useCheckoutProviderContext();

  return (
    <Alert className='relative'>
      {isDisplay && <FaLocationDot />}
      <AlertTitle className='flex justify-between items-center'>
        <h6>{receiver}</h6>
        {isDefault && (
          <Badge
            variant='secondary'
            className='uppercase font-bold tracking-wider'
          >
            default
          </Badge>
        )}
      </AlertTitle>
      <AlertTitle>{['( ', phoneNumber, ' )']}</AlertTitle>
      <AlertDescription className='whitespace-pre-wrap'>
        {address}
      </AlertDescription>
      {!isDisplay && (
        <div
          className={`absolute ${
            isDefault ? 'bottom-0' : 'top-3.5'
          } -translate-y-1/3 right-3 flex gap-x-2`}
        >
          {/* Delete Address Button */}
          {!isDefault && data.id !== shippingAddress?.id && (
            <DeleteAddressButton id={data.id} />
          )}
          {/* Edit Address Button */}
          <UpdateAddressModal
            data={data!}
            state={shippingAddress}
            dispatch={setShippingAddress}
            disableDefaultUpdate
            isDemo
          />
        </div>
      )}
    </Alert>
  );
}
export default AddressItem;
