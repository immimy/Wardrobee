import { fetchAllProducts } from '@/utils/actions';
import NotFoundContainer from '@/components/global/NotFoundContainer';
import { Suspense } from 'react';
import CardsSkeleton from '@/components/skeleton/CardsSkeleton';
import AdminProductsContainer from '@/components/admin/products/AdminProductsContainer';
import AdminProductsProvider from '@/components/admin/products/AdminProductsProvider';

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
    <Suspense fallback={<CardsSkeleton number={9} />}>
      <AdminProductsProvider search={search} products={products}>
        <AdminProductsContainer />
      </AdminProductsProvider>
    </Suspense>
  );
}
export default AdminProductsPage;
