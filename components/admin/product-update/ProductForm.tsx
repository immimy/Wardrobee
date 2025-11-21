'use client';

import { FormEventHandler } from 'react';
import ImageFieldset from './ImageFieldset';
import ProductFieldset from './ProductFieldset';
import { toastError } from '@/utils/clientFunctions';
import { useProductUpdateContext } from './ProductProvider';
import VariantsFieldsetContainer from './VariantsFieldsetContainer';
import { updateProduct } from '@/utils/actions';
import SubmitButton from '@/components/form/SubmitButton';
import { useAllProductsSWRInfinite } from '@/utils/swr';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function ProductForm() {
  const router = useRouter();
  const { mutate } = useAllProductsSWRInfinite();
  const {
    setImage,
    product: { id },
    productForm: { category },
  } = useProductUpdateContext();

  const updateProductHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      // Update product to database
      await updateProduct(formData);
      toast.success('Updated product successfully!');
      // Clear all products cache on SWR without revalidation
      mutate(undefined, { revalidate: false });
      return router.push('/admin/products');
    } catch (error) {
      // Clear image preview
      setImage('');
      return toastError(error);
    }
  };

  return (
    <form onSubmit={updateProductHandler}>
      <input type='hidden' name='product[id]' value={id} />
      {/* Product Image */}
      <ImageFieldset />
      {/* Product */}
      <ProductFieldset />
      {/* Variants */}
      <VariantsFieldsetContainer key={category} />
      <SubmitButton text='submit update product' className='w-full mt-4' />
    </form>
  );
}
export default ProductForm;
