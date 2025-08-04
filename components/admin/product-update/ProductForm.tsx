'use client';

import FormInput from '@/components/form-control/FormInput';
import FormCheckbox from '@/components/form-control/FormCheckbox';
import FormSelect from '@/components/form-control/FormSelect';
import FormTextarea from '@/components/form-control/FormTextarea';
import { useUpdateProductContext } from './UpdateProductLayout';
import SubmitButton from '@/components/form/SubmitButton';
import FormContainer from '@/components/form/FormContainer';
import { updateProductAction } from '@/utils/actions';
import { PRODUCT_BRAND } from '@/utils/constants';

function ProductForm() {
  const { product } = useUpdateProductContext()!;
  return (
    <FormContainer action={updateProductAction}>
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
            isLabel
            name='brand'
            labelText='brand'
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
    </FormContainer>
  );
}
export default ProductForm;
