import Container from '@/components/global/Container';
import NotFoundContainer from '@/components/global/NotFoundContainer';
import { fetchAllProducts } from '@/utils/actions';
import { Suspense } from 'react';
import CardsSkeleton from '@/components/skeleton/CardsSkeleton';
import InfiniteScroll from '@/components/global/InfiniteScroll';

type ParamsType = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

async function ProductsPage({ searchParams }: ParamsType) {
  // Query params
  const queryParams = await searchParams;
  const search = queryParams.search || '';
  const limit = queryParams.limit || '9';
  // Pre-fetch products data
  const products = await fetchAllProducts({ search, limit });

  return (
    <section className='py-8'>
      <Container>
        {products.data.length < 1 ? (
          <NotFoundContainer />
        ) : (
          <Suspense fallback={<CardsSkeleton number={9} />}>
            <InfiniteScroll
              key={search}
              search={search}
              limit={limit}
              products={products}
            />
          </Suspense>
        )}
      </Container>
    </section>
  );
}
export default ProductsPage;
