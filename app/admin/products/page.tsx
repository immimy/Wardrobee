import { fetchAllProducts } from '@/utils/actions';
import NotFoundContainer from '@/components/global/NotFoundContainer';
import { Suspense } from 'react';
import CardsSkeleton from '@/components/skeleton/CardsSkeleton';
import InfiniteScroll from '@/components/global/InfiniteScroll';

type ParamsType = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

async function AdminProductsPage({ searchParams }: ParamsType) {
  // Query params
  const queryParams = await searchParams;
  const search = queryParams.search || '';
  const limit = queryParams.limit || '9';
  // Pre-fetch products data
  const products = await fetchAllProducts({ limit });

  if (products.data.length < 1) {
    return <NotFoundContainer />;
  }
  return (
    <section className='mt-4 md:mt-8'>
      <Suspense fallback={<CardsSkeleton number={9} />}>
        <InfiniteScroll
          key={search}
          search={search}
          limit={limit}
          products={products}
          isAdmin
        />
      </Suspense>
    </section>
  );
}
export default AdminProductsPage;
