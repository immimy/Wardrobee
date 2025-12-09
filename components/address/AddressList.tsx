import { Badge } from '../ui/badge';
import { FaLocationDot } from 'react-icons/fa6';
import UpdateAddressModal from './UpdateAddressModal';
import DeleteAddressButton from './DeleteAddressButton';
import { cn } from '@/lib/utils';
import { FetchAllAddressesType } from '@/utils/types';

type ParamsType = {
  addresses: FetchAllAddressesType;
  className?: string;
};

function AddressList({ addresses, className }: ParamsType) {
  if (addresses.length < 1) return null;

  return (
    <ul className={cn('flex flex-col gap-y-3', className)}>
      {addresses.map((item) => {
        const { receiver, address, phoneNumber, isDefault } = item;
        return (
          <li
            key={item.id}
            data-default={isDefault}
            className='min-w-fit w-full border px-6 py-4 rounded-md data-[default=true]:order-first'
          >
            <div className='grid grid-cols-[auto_1fr_auto] grid-rows-[repeat(3,auto)]'>
              {/* Icon */}
              <FaLocationDot className='text-chart-3 row-span-3' />
              {/* Name & Phone number & Address */}
              <div className='row-span-2 col-span-2 px-4'>
                <h6 className='font-bold text-chart-3'>{receiver}</h6>
                <h6 className='font-bold text-chart-3'>{phoneNumber}</h6>
                <p className='whitespace-pre-line'>{address}</p>
              </div>
              {/* Default badge */}
              {isDefault && (
                <Badge
                  variant='outline'
                  className='mx-4 mt-2 uppercase font-bold text-xs tracking-widest text-chart-3 border-chart-3'
                >
                  default
                </Badge>
              )}
              {/* Delete button & Update Button */}
              <div className='col-start-3 flex gap-x-1'>
                {!isDefault && <DeleteAddressButton id={item.id} />}
                <UpdateAddressModal data={item} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
export default AddressList;
