import { fetchAllProducts } from '@/utils/actions';
import { unstable_noStore } from 'next/cache';
import ProductCarousel from './ProductCarousel';
import NoProductFound from '../global/NotFoundContainer';

async function BestSellerProducts() {
  unstable_noStore();
  const limit = '30';
  const bestseller = await fetchAllProducts({
    bestseller: 'on',
    limit,
  });

  return (
    <>
      {bestseller.data.length ? (
        <ProductCarousel products={bestseller} />
      ) : (
        <NoProductFound className='py-4' />
      )}
    </>
  );
}
export default BestSellerProducts;
