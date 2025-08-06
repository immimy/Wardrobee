import UpdateProductLayout from '@/components/admin/product-update/UpdateProductLayout';
import LoadingContainer from '@/components/global/LoadingContainer';
import { Button } from '@/components/ui/button';
import { fetchSingleProduct } from '@/utils/actions';
import { getRole } from '@/utils/clerk';
import Link from 'next/link';
import { Suspense } from 'react';
import { HiOutlineChevronDoubleLeft } from 'react-icons/hi';

type AdminProductParams = { params: Promise<{ id: string }> };

async function AdminProductPage({ params }: AdminProductParams) {
  const role = await getRole();
  const { id } = await params;
  const product = fetchSingleProduct(id);

  return (
    <section className='pt-4 pb-16 px-8'>
      {/* Back to previous page */}
      <Button asChild variant='secondary' size='sm' className='mb-6'>
        <Link
          href={'/dashboard/admin/products'}
          className='flex gap-x-2 items-center uppercase tracking-wider'
        >
          <span>
            <HiOutlineChevronDoubleLeft />
          </span>
          back
        </Link>
      </Button>
      {/* Update product form */}
      <Suspense fallback={<LoadingContainer />}>
        <UpdateProductLayout product={product} role={role} />
      </Suspense>
    </section>
  );
}
export default AdminProductPage;
