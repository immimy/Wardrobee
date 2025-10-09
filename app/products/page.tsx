import Container from '@/components/global/Container';
import ProductsContainer from '@/components/products/ProductsContainer';

type ParamsType = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};
async function ProductsPage({ searchParams }: ParamsType) {
  const { search } = await searchParams;
  return (
    <section className='py-8'>
      <Container>
        <ProductsContainer search={search} />
      </Container>
    </section>
  );
}
export default ProductsPage;
