'use client';

import FormInput from '@/components/form/FormInput';
import FormCheckbox from '@/components/form/FormCheckbox';
import FormSelect from '@/components/form/FormSelect';
import FormTextarea from '@/components/form/FormTextarea';
import { PRODUCT_BRAND, PRODUCT_CATEGORY } from '@/utils/constants';
import { useProductUpdateContext } from './ProductProvider';
import { ProductCategory } from '@/utils/types';

function ProductFieldset() {
  const { productForm, setProductData } = useProductUpdateContext();
  return (
    <fieldset className='mt-4'>
      {/* NAME */}
      <FormInput
        type='text'
        name='product[name]'
        labelText='product name'
        value={productForm.name}
        onChange={(e) => setProductData('name', e.currentTarget.value)}
      />
      {/* BRAND */}
      <FormSelect
        name='product[brand]'
        labelText='product brand'
        placeholder='choose brand'
        frameworks={PRODUCT_BRAND}
        value={productForm.brand}
        onChange={(value) => setProductData('brand', value)}
      />
      {/* DESCRIPTION */}
      <FormTextarea
        name='product[description]'
        labelText='product description'
        value={productForm.description}
        onChange={(e) => setProductData('description', e.currentTarget.value)}
      />
      {/* PRICE */}
      <FormInput
        type='text'
        name='product[price]'
        labelText='product price'
        value={productForm.price}
        onChange={(e) => setProductData('price', e.currentTarget.value)}
      />
      {/* FEATURED */}
      <FormCheckbox
        name='product[featured]'
        labelText='Is featured on the home page?'
        className='justify-center border border-ring py-3 mb-4'
        checked={productForm.featured}
        onChange={(checked) => setProductData('featured', checked)}
      />
      {/* CATEGORY */}
      <FormSelect
        name='product[category]'
        labelText='product category'
        placeholder='choose category'
        frameworks={PRODUCT_CATEGORY}
        value={productForm.category}
        onChange={(value: string) =>
          setProductData('category', value as ProductCategory)
        }
      />
    </fieldset>
  );
}
export default ProductFieldset;
