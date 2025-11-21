import { fetchSingleProduct } from '@/utils/actions';
import ProductContainer from '@/components/product/ProductContainer';
import NotFoundContainer from '@/components/global/NotFoundContainer';
import ProductProvider from '@/components/product/ProductProvider';
import Container from '@/components/global/Container';

// To statically render all paths the first time they're visited
export const dynamic = 'force-static';

type ProductParams = { params: Promise<{ id: string }> };

async function ProductPage({ params }: ProductParams) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);

  if (!product) return <NotFoundContainer />;

  return (
    <ProductProvider product={product}>
      <Container>
        <ProductContainer product={product} />
      </Container>
    </ProductProvider>
  );
}
export default ProductPage;
