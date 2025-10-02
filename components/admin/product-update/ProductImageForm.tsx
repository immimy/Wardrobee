'use client';

import ImageContainer from '@/components/global/ImageContainer';
import ImageInput from '@/components/form/ImageInput';
import { useState } from 'react';
import { useUpdateProductContext } from './UpdateProductLayout';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/form/SubmitButton';
import FormContainer from '@/components/form/FormContainer';
import { updateProductImage } from '@/utils/actions';
import { FormState } from '@/utils/types';
import { renderError } from '@/utils/clientFunctions';

function ProductImageForm() {
  const { product } = useUpdateProductContext()!;

  const [image, setImage] = useState<string>(product.image);
  const [isUpdated, setIsUpdated] = useState(false);

  const updateProductImageAction = async (
    formState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const file = formData.get('image') as File;
      // File size must not exceed the body size limit for Server Actions.
      if (file.size > 0.5 * 1024 * 1024) {
        throw new Error('File size must not exceed 0.5MB');
      }
      // Update product image
      const url = await updateProductImage(formData);
      setImage(url);
      setIsUpdated(false);
      return { message: 'Update image successfully', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  return (
    <FormContainer action={updateProductImageAction}>
      <div className='md:mb-4 grid md:grid-cols-[auto_1fr] gap-y-2 gap-x-8 items-center'>
        <ImageContainer
          alt='product image'
          src={image}
          className='h-52 w-52 md:w-64 md:h-64 transition-all place-self-center'
        />
        <div className='md:max-w-88'>
          <input type='hidden' name='productId' value={product.id} />
          {isUpdated ? (
            <>
              <ImageInput name='image' labelText='product image' />
              <SubmitButton text='update product image' className='w-full' />
              <Button
                type='button'
                variant='link'
                className='text-destructive w-full capitalize font-medium tracking-wide'
                onClick={() => setIsUpdated(false)}
              >
                cancel image update
              </Button>
            </>
          ) : (
            <Button
              type='button'
              onClick={() => setIsUpdated(true)}
              className='w-full capitalize font-medium tracking-wide'
            >
              change product image
            </Button>
          )}
        </div>
      </div>
    </FormContainer>
  );
}
export default ProductImageForm;
