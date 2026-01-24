import { fetchAllProducts } from '@/utils/actions';
import ProductCarousel from './ProductCarousel';
import NoProductFound from '../global/NotFoundContainer';
import { unstable_noStore } from 'next/cache';

async function FeaturedProducts() {
  unstable_noStore();
  const limit = '9';
  const featured = await fetchAllProducts({
    featured: 'on',
    limit,
  });

  return (
    <>
      {featured.data.length ? (
        <ProductCarousel products={featured} />
      ) : (
        <NoProductFound className='py-4' />
      )}
    </>
  );
}
export default FeaturedProducts;
