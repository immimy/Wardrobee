import { fetchAllProducts } from '@/utils/actions';
import ProductCard from './ProductCard';
import NotFoundContainer from '../global/NotFoundContainer';

async function ProductsContainer() {
  const products = await fetchAllProducts();

  if (products.length < 1) {
    return <NotFoundContainer />;
  }

  return (
    <div className='grid gap-6 grid-cols-auto'>
      {products.map((product) => {
        return <ProductCard key={product.id} {...product} />;
      })}
    </div>
  );
}
export default ProductsContainer;
