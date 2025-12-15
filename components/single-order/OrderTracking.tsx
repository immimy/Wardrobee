import { FaCircle, FaRegCircleCheck } from 'react-icons/fa6';
import { orderStatusStep } from '@/utils/links';
import { ORDER_STATUS } from '@/utils/constants';

type ParamsType = { status: string };

function OrderTracking({ status }: ParamsType) {
  const checkedIndex = ORDER_STATUS.findIndex((item) => item === status);
  return (
    <ul className='my-8 md:my-12 flex justify-evenly relative before:absolute before:inset-y-1/3 before:inset-x-0 before:bg-primary'>
      {orderStatusStep.map((item, index) => {
        const Icon = item.icon;
        return (
          <li key={item.text} className='relative'>
            {/* TOP */}
            <span className='text-2xl md:text-4xl absolute -top-full -translate-y-2/3 left-1/2 -translate-x-1/2'>
              <Icon />
            </span>
            {/* MIDDLE */}
            <span className='text-lg md:text-xl relative'>
              <FaCircle />
              <FaRegCircleCheck
                className={`absolute inset-0 text-background opacity-0 ${
                  index <= checkedIndex && 'opacity-100'
                }`}
              />
            </span>
            {/* BOTTOM */}
            <span className='text-sm md:text-md font-semibold tracking-wide absolute -bottom-full translate-y-1/2 left-1/2 -translate-x-1/2'>
              {item.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
export default OrderTracking;
