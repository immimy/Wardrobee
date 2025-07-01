'use client';

import { FormState, ProductWithVariants } from '@/utils/types';
import { createContext, use, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductFieldset from './ProductFieldset';
import { updateProduct } from '@/utils/actions';
import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';
import { renderError } from '@/utils/clientFunctions';
import { Roles } from '@/types/globals';
import { Product, ProductVariant } from '@/lib/generated/prisma';

type ParamsType = {
  role: Roles | 'user';
  product: Promise<ProductWithVariants | null>;
};

const UpdateProductContext = createContext<
  | {
      role: Roles | 'user';
      product: Product;
      variants: Array<ProductVariant>;
    }
  | undefined
>(undefined);
export const useUpdateProductContext = () => useContext(UpdateProductContext);

function UpdateProductForm({ role, product }: ParamsType) {
  const router = useRouter();
  const fetchedProduct = use(product);

  if (!fetchedProduct) {
    router.push('/dashboard/admin/products');
    return null;
  }

  const [controlledProduct, setControlledProduct] =
    useState<Product>(fetchedProduct);
  const [controlledVariants, setControlVariants] = useState(
    fetchedProduct.variants
  );

  const updateProductAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const newProduct = await updateProduct(formData);
      setControlledProduct(newProduct);
      return { message: 'Update product successfully.', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  return (
    <UpdateProductContext.Provider
      value={{ role, product: controlledProduct, variants: controlledVariants }}
    >
      <FormContainer action={updateProductAction}>
        <div className='mt-4 flex flex-col gap-y-6'>
          <ProductFieldset />
          <SubmitButton text='update product' />
        </div>
      </FormContainer>
    </UpdateProductContext.Provider>
  );
}
export default UpdateProductForm;
