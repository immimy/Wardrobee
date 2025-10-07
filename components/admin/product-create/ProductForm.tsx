'use client';

import { createProduct } from '@/utils/actions';
import ProductFieldset from './ProductFieldset';
import VariantFieldset from './VariantsFieldset';
import SubmitButton from '../../form/SubmitButton';
import { toastError } from '@/utils/clientFunctions';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function ProductForm() {
  const router = useRouter();

  const createProductHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await createProduct(formData);
      toast.success('Product created');
      return router.push('/admin/products');
    } catch (error) {
      return toastError(error);
    }
  };

  return (
    <form onSubmit={createProductHandler}>
      <div className='grid gap-y-4'>
        <ProductFieldset />
        <VariantFieldset />
      </div>
      <SubmitButton text='create product' className='w-full' />
    </form>
  );
}
export default ProductForm;
