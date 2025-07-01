import UpdateProductForm from '@/components/admin/UpdateProductForm';
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
    <section className='mt-4 px-8'>
      <Button asChild variant='secondary' size='sm'>
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
      <Suspense fallback={<LoadingContainer />}>
        <UpdateProductForm product={product} role={role} />
      </Suspense>
    </section>
  );
}
export default AdminProductPage;
