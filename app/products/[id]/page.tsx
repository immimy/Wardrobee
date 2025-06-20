import { fetchSingleProduct } from '@/utils/actions';
import ProductContainer from '@/components/product/ProductContainer';
import NotFoundContainer from '@/components/global/NotFoundContainer';

type ProductPageParams = { params: Promise<{ id: string }> };

async function ProductPage({ params }: ProductPageParams) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);

  if (!product) return <NotFoundContainer />;

  return (
    <div className=''>
      <ProductContainer product={product} />
    </div>
  );
}
export default ProductPage;
