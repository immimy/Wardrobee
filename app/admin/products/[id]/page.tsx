import ProductProvider from '@/components/admin/product-update/ProductProvider';
import { Button } from '@/components/ui/button';
import { fetchSingleProduct } from '@/utils/actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { HiOutlineChevronDoubleLeft } from 'react-icons/hi';
import ProductImageForm from '@/components/admin/product-update/ProductImageForm';
import ProductForm from '@/components/admin/product-update/ProductForm';
import VariantsContainer from '@/components/admin/product-update/VariantsContainer';

type AdminProductParams = { params: Promise<{ id: string }> };

async function AdminProductPage({ params }: AdminProductParams) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);
  if (!product) return redirect('/dashboard/admin/products');
  return (
    <section className='pt-4 pb-16 px-8'>
      {/* Back to previous page */}
      <Button asChild variant='secondary' size='sm' className='mb-6'>
        <Link
          href={'/admin/products'}
          className='flex gap-x-2 items-center uppercase tracking-wider'
        >
          <span>
            <HiOutlineChevronDoubleLeft />
          </span>
          back
        </Link>
      </Button>
      {/* Update product form */}
      <ProductProvider product={product}>
        <div className='grid gap-y-6'>
          {/* Product Image */}
          <ProductImageForm />
          {/* Product */}
          <ProductForm />
          {/* Variants */}
          <VariantsContainer />
        </div>
      </ProductProvider>
    </section>
  );
}
export default AdminProductPage;
