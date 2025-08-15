import { ShippingAddress } from '@/lib/generated/prisma';
import { Badge } from '../ui/badge';
import { FaLocationDot } from 'react-icons/fa6';
import UpdateAddressModal from './UpdateAddressModal';
import DeleteAddressButton from './DeleteAddressButton';

type ParamsType = { addresses: Array<ShippingAddress> };

function AddressList({ addresses }: ParamsType) {
  if (addresses.length < 1) return null;

  return (
    <ul className='flex flex-col gap-y-1.5'>
      {addresses.map((item) => {
        const { receiver, address, phoneNumber, isDefault } = item;
        return (
          <li
            key={item.id}
            data-default={isDefault}
            className='w-full border px-6 py-4 rounded-md data-[default=true]:order-first flex gap-x-3'
          >
            <FaLocationDot className='text-chart-3 shrink-0' />
            <div>
              <h6 className='font-bold text-chart-3'>
                {receiver} — <span>{phoneNumber}</span>
              </h6>
              <p>{address}</p>
              {isDefault && (
                <Badge
                  variant='outline'
                  className='mt-2 uppercase font-bold text-xs tracking-widest text-chart-3 border-chart-3'
                >
                  default
                </Badge>
              )}
            </div>
            <div className='grow flex gap-x-0.5 justify-end'>
              {!isDefault && <DeleteAddressButton id={item.id} />}
              <UpdateAddressModal shippingAddress={item} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
export default AddressList;
