'use client';

import FormInput from '@/components/form/FormInput';
import FormCheckbox from '@/components/form/FormCheckbox';
import FormSelect from '@/components/form/FormSelect';
import FormTextarea from '@/components/form/FormTextarea';
import SubmitButton from '@/components/form/SubmitButton';
import { updateProduct } from '@/utils/actions';
import { PRODUCT_BRAND } from '@/utils/constants';
import { useProductUpdateContext } from './ProductProvider';
import { FormEventHandler } from 'react';
import { toastError } from '@/utils/clientFunctions';
import { toast } from 'sonner';

function ProductForm() {
  const { product } = useProductUpdateContext();

  const updateProductHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await updateProduct(formData);
      toast.success('Product updated');
    } catch (error) {
      return toastError(error);
    }
  };

  return (
    <form onSubmit={updateProductHandler}>
      <div className='mt-4 flex flex-col gap-y-6'>
        {/* Form Input */}
        <fieldset>
          <input type='hidden' name='id' value={product.id} />
          {/* NAME */}
          <FormInput
            type='text'
            name='name'
            labelText='product name'
            defaultValue={product.name}
          />
          {/* BRAND */}
          <FormSelect
            name='brand'
            placeholder='choose brand'
            frameworks={PRODUCT_BRAND}
            defaultValue={product.brand}
          />
          {/* DESCRIPTION */}
          <FormTextarea
            name='description'
            labelText='product description'
            defaultValue={product.description ?? ''}
          />
          {/* PRICE */}
          <FormInput
            type='text'
            name='price'
            labelText='product price'
            defaultValue={product.price}
          />
          {/* FEATURED */}
          <FormCheckbox
            name='featured'
            labelText='Is featured on the home page?'
            className='justify-center border border-ring py-3'
            defaultChecked={product.featured}
          />
        </fieldset>
        {/* Submit Button */}
        <SubmitButton text='update product' />
      </div>
    </form>
  );
}
export default ProductForm;
