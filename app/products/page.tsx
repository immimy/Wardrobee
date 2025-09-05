import Container from '@/components/global/Container';
import ProductsContainer from '@/components/products/ProductsContainer';

function ProductsPage() {
  return (
    <section className='py-8'>
      <Container>
        <ProductsContainer />
      </Container>
    </section>
  );
}
export default ProductsPage;
