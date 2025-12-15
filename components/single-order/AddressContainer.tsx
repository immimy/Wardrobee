import { FaLocationDot } from 'react-icons/fa6';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type ParamsType = {
  shippingAddress: string;
};
function AddressContainer({ shippingAddress }: ParamsType) {
  const [receiver, phoneNumber, address] = shippingAddress.split('\r\n');
  return (
    <Alert className='mt-2'>
      <FaLocationDot />
      <AlertTitle className='flex justify-between items-center'>
        <h6>{receiver}</h6>
      </AlertTitle>
      <AlertTitle>{phoneNumber}</AlertTitle>
      <AlertDescription className='whitespace-pre-wrap'>
        {address}
      </AlertDescription>
    </Alert>
  );
}
export default AddressContainer;
