'use client';

import ImageContainer from '@/components/global/ImageContainer';
import ImageInput from '@/components/form/ImageInput';
import { Button } from '@/components/ui/button';
import { toastError } from '@/utils/clientFunctions';
import { useProductUpdateContext } from './ProductProvider';
import { ChangeEventHandler, MouseEventHandler } from 'react';

function ImageFieldset() {
  const { productForm, setImage } = useProductUpdateContext();

  const imageChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      const file = e.currentTarget.files?.[0];
      if (!file) return;
      // File size must not exceed the body size limit for Server Actions.
      if (file.size > 0.5 * 1024 * 1024) {
        e.currentTarget.value = '';
        throw new Error('File size must not exceed 0.5MB');
      }
      // Update image preview
      setImage(URL.createObjectURL(file));
    } catch (error) {
      return toastError(error);
    }
  };
  const clearImageHandler: MouseEventHandler<HTMLButtonElement> = () => {
    // Clear image preview
    setImage('');
    // Clear image input
    (document.getElementById('product-image') as HTMLInputElement).value = '';
  };

  return (
    <fieldset className='md:mb-4 grid md:grid-cols-[auto_1fr] gap-y-2 gap-x-8 items-center'>
      <ImageContainer
        alt='product image'
        src={productForm.image}
        className='h-52 w-52 md:w-64 md:h-64 transition-all place-self-center'
      />
      <div className='md:max-w-88'>
        <ImageInput
          id='product-image'
          name='product[image]'
          labelText='product image'
          onChange={imageChangeHandler}
          required={false}
        />
        <Button
          type='button'
          variant='link'
          className='text-destructive w-full capitalize font-medium tracking-wide hover:cursor-pointer'
          onClick={clearImageHandler}
        >
          cancel image update
        </Button>
      </div>
    </fieldset>
  );
}
export default ImageFieldset;
