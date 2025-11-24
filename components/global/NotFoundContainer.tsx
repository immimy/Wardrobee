import Image from 'next/image';
import notFoundImg from '@/public/images/notFound.svg';
import { cn } from '@/lib/utils';

type ParamsType = { className?: string };
function NoProductFound({ className }: ParamsType) {
  return (
    <div className={cn('py-16 grid place-items-center gap-y-2', className)}>
      <Image
        src={notFoundImg}
        alt='Not found image'
        className='w-44 h-40 md:w-52 md:h-60'
      />
      <h4 className='text-xl md:text-2xl tracking-tight text-primary'>
        No product found...
      </h4>
    </div>
  );
}
export default NoProductFound;
