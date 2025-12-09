import CreateAddressModal from '../address/CreateAddressModal';
import Title from '../global/Title';
import AddressList from '../address/AddressList';
import { FetchAllAddressesType } from '@/utils/types';

type ParamsType = { addresses: FetchAllAddressesType };

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
