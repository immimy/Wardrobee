import Image from 'next/image';
import notFoundImg from '@/public/images/notFound.svg';

function NoProductFound() {
  return (
    <div className='pt-16 grid place-items-center h-80'>
      <div className='mx-auto text-center'>
        <figure className='relative'>
          <Image src={notFoundImg} alt='' className='w-[33vw] max-w-64' />
        </figure>
        <h4 className='mt-4 text-xl md:text-2xl tracking-tight text-primary'>
          No product found...
        </h4>
      </div>
    </div>
  );
}
export default NoProductFound;
