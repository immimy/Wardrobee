import { ShippingAddress } from '@prisma/client';
import CreateAddressModal from '../address/CreateAddressModal';
import Title from '../global/Title';
import AddressList from '../address/AddressList';

type ParamsType = { addresses: Array<ShippingAddress> };

function AddressContainer({ addresses }: ParamsType) {
  return (
    <>
      <Title title='address' />
      <div className='p-4'>
        <AddressList className='mb-2' addresses={addresses} />
        <CreateAddressModal />
      </div>
    </>
  );
}
export default AddressContainer;
