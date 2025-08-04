'use client';

import { ProductWithVariants } from '@/utils/types';
import { createContext, use, useContext } from 'react';
import { redirect } from 'next/navigation';
import { Roles } from '@/types/globals';
import ProductForm from './ProductForm';
import ProductImageForm from './ProductImageForm';
import CategoryForm from './CategoryForm';

type ParamsType = {
  role: Roles | 'user';
  product: Promise<ProductWithVariants | null>;
};

const UpdateProductContext = createContext<
  | {
      role: Roles | 'user';
      product: ProductWithVariants;
    }
  | undefined
>(undefined);
export const useUpdateProductContext = () => useContext(UpdateProductContext);

function UpdateProductLayout({ role, product }: ParamsType) {
  const fetchedProduct = use(product);
  if (!fetchedProduct) {
    return redirect('/dashboard/admin/products');
  }
  return (
    <UpdateProductContext.Provider
      value={{
        role,
        product: fetchedProduct,
      }}
    >
      <div className='grid gap-y-6'>
        {/* Product Image */}
        <ProductImageForm />
        {/* Product */}
        <ProductForm />
        {/* Variants */}
        <CategoryForm />
      </div>
    </UpdateProductContext.Provider>
  );
}
export default UpdateProductLayout;
