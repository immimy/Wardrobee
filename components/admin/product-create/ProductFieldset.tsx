'use client';

import ImageContainer from '@/components/global/ImageContainer';
import FormInput from '@/components/form/FormInput';
import FormCheckbox from '@/components/form/FormCheckbox';
import FormSelect from '@/components/form/FormSelect';
import FormTextarea from '@/components/form/FormTextarea';
import ImageInput from '@/components/form/ImageInput';
import { PRODUCT_BRAND } from '@/utils/constants';
import { BsCardImage } from 'react-icons/bs';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { useProductCreateContext } from './ProductProvider';

function ProductFieldset() {
  // Image preview state
  const { product, setProductState } = useProductCreateContext();
  const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    // File size must not exceed 0.5 MB.
    if (file.size > 1024 * 1024 * 0.5) {
      e.currentTarget.value = '';
      toast.error('Image size exceed 0.5 MB');
      return;
    }
    // Preview image before uploading
    setProductState({ image: URL.createObjectURL(file) });
  };

  return (
    <fieldset>
      {/* IMAGE */}
      <div className='md:mb-4 grid md:grid-cols-[auto_1fr] gap-y-2 gap-x-8 items-center'>
        {product.image ? (
          <ImageContainer
            alt='product image'
            src={product.image}
            className='h-52 w-52 md:w-64 md:h-64 transition-all place-self-center'
          />
        ) : (
          <div className='h-52 w-52 md:w-64 md:h-64 transition-all grid place-items-center bg-card border-dashed border-4 border-border rounded-2xl text-card-foreground mx-auto'>
            <span className='self-end'>
              <BsCardImage className='text-6xl' />
            </span>
            <h6 className='capitalize self-start tracking-tight'>no image</h6>
          </div>
        )}
        <div className='md:max-w-88'>
          <ImageInput
            name='product[image]'
            labelText='product image'
            onChange={fileInputChangeHandler}
          />
        </div>
      </div>
      {/* NAME */}
      <FormInput type='text' name='product[name]' labelText='product name' />
      {/* BRAND */}
      <FormSelect
        name='product[brand]'
        labelText='brand'
        placeholder='choose brand'
        frameworks={PRODUCT_BRAND}
      />
      {/* DESCRIPTION */}
      <FormTextarea
        name='product[description]'
        labelText='product description'
      />
      {/* PRICE */}
      <FormInput type='text' name='product[price]' labelText='product price' />
      {/* FEATURED */}
      <FormCheckbox
        name='product[featured]'
        labelText='Is featured on the home page?'
        className='justify-center border border-ring py-3'
      />
    </fieldset>
  );
}
export default ProductFieldset;
