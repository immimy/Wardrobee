'use client';

import ImageContainer from '../global/ImageContainer';
import { useUpdateProductContext } from './UpdateProductForm';
import FormInput from '../form/FormInput';
import FormCheckbox from '../form/FormCheckbox';
import FormSelect from '../form/FormSelect';
import { PRODUCT_BRAND, PRODUCT_CATEGORY } from '@/utils/constants';
import FormTextarea from '../form/FormTextarea';

function ProductFieldset() {
  const { role, product } = useUpdateProductContext()!;
  const { name, category, brand, image, description, featured, price } =
    product;

  return (
    <fieldset>
      <input type='hidden' name='id' value={product.id} />
      {/* Temporary Image Update */}
      {role === 'admin' && (
        <div className='md:mb-4 grid md:grid-cols-[auto_1fr] gap-y-2 gap-x-8 items-center'>
          <ImageContainer
            alt='product image'
            src={image}
            className='h-52 w-52 place-self-center'
          />
          <div className='md:max-w-88'>
            <FormInput
              type='text'
              name='image'
              labelText='product image'
              defaultValue={image}
            />
          </div>
        </div>
      )}
      {/* NAME */}
      <FormInput
        type='text'
        name='name'
        labelText='product name'
        defaultValue={name}
      />
      {/* CATEGORY */}
      <input type='hidden' name='category' value={category.toLowerCase()} />
      <FormSelect
        isLabel
        name='category'
        labelText='product category'
        placeholder='choose category'
        itemList={PRODUCT_CATEGORY}
        defaultValue={category.toLowerCase()}
        disabled
      />
      {/* BRAND */}
      <FormSelect
        isLabel
        name='brand'
        labelText='product brand'
        placeholder='choose brand'
        itemList={PRODUCT_BRAND}
        defaultValue={brand.toLowerCase()}
      />
      {/* DESCRIPTION */}
      <FormTextarea
        name='description'
        labelText='product description'
        defaultValue={description ?? ''}
      />

      {/* PRICE */}
      <FormInput
        type='text'
        name='price'
        labelText='product price'
        defaultValue={String(price)}
      />
      {/* FEATURED */}
      <FormCheckbox
        name='featured'
        defaultChecked={featured}
        labelText='Is featured on the home page?'
        className='justify-center border border-ring py-3'
      />
    </fieldset>
  );
}
export default ProductFieldset;
