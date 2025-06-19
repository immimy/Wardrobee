import { fetchAllProducts } from '@/utils/actions';
import ProductCard from './ProductCard';
import Image from 'next/image';
import notFoundImg from '@/public/images/notFound.svg';

async function ProductsContainer() {
  const products = await fetchAllProducts();

  if (products.length < 1) {
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

  return (
    <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {products.map((product) => {
        return <ProductCard key={product.id} {...product} />;
      })}
    </div>
  );
}
export default ProductsContainer;
