'use client';

import FormContainer from '@/components/form/FormContainer';
import { updateCategoryAndVariantsAction } from '@/utils/actions';
import { createContext, SetStateAction, useContext, useState } from 'react';
import { useUpdateProductContext } from './UpdateProductLayout';
import { Dispatch } from 'react';
import CategorySelect from '@/components/admin/product-update/CategorySelect';
import SingleVariantContainer from './SingleVariantContainer';
import SubmitButton from '@/components/form/SubmitButton';
import NewVariantContainer from './NewVariantContainer';
import AllVariantsContainer from './AllVariantsContainer.tsx';
import { ProductCategory } from '@/utils/types';

type ContextType =
  | {
      category: ProductCategory;
      setCategory: Dispatch<SetStateAction<ProductCategory>>;
    }
  | undefined;
const CategoryFormContext = createContext<ContextType>(undefined);
export const useCategoryFormContext = () => useContext(CategoryFormContext);

function CategoryForm() {
  const { product } = useUpdateProductContext()!;
  // Controlled category select
  const [category, setCategory] = useState(product.category as ProductCategory);

  return (
    <CategoryFormContext.Provider value={{ category, setCategory }}>
      <div>
        {/* Category change */}
        <FormContainer action={updateCategoryAndVariantsAction}>
          <CategorySelect />
          {category !== product.category && (
            <>
              <input type='hidden' name='productId' value={product.id} />
              <AllVariantsContainer />
              <SubmitButton text='update category and all options' />
            </>
          )}
        </FormContainer>
        {/* NOT Category change */}
        {category === product.category && (
          <>
            <SingleVariantContainer />
            <NewVariantContainer />
          </>
        )}
      </div>
    </CategoryFormContext.Provider>
  );
}
export default CategoryForm;
