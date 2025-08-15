import { ShippingAddress } from '@/lib/generated/prisma';
import CreateAddressModal from '../address/CreateAddressModal';
import Title from '../global/Title';
import AddressList from '../address/AddressList';

type ParamsType = { addresses: Array<ShippingAddress> };

function AddressContainer({ addresses }: ParamsType) {
  return (
    <>
      <Title title='address' />
      <div className='p-4'>
        <div className='mx-auto max-w-sm grid gap-y-2'>
          <AddressList addresses={addresses} />
          <CreateAddressModal />
        </div>
      </div>
    </>
  );
}
export default AddressContainer;
