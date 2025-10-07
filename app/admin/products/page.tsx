import { fetchAllProducts } from '@/utils/actions';
import NotFoundContainer from '@/components/global/NotFoundContainer';
import ProductCard from '@/components/admin/products/ProductCard';

async function AdminProductsPage() {
  const products = await fetchAllProducts();
  if (products.length < 1) {
    return <NotFoundContainer />;
  }
  return (
    <section className='mt-4 md:mt-8'>
      <div className='grid gap-6 grid-cols-auto'>
        {products.map((product) => {
          return <ProductCard key={product.id} {...product} />;
        })}
      </div>
    </section>
  );
}
export default AdminProductsPage;
