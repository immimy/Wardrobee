import { fetchAllProducts } from '@/utils/actions';
import ProductCard from './ProductCard';
import NotFoundContainer from '../global/NotFoundContainer';

type ParamsType = { search: string | undefined };
async function ProductsContainer({ search }: ParamsType) {
  const products = await fetchAllProducts({ search });

  if (products.length < 1) {
    return <NotFoundContainer />;
  }

  return (
    <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
export default ProductsContainer;
