'use client';

import FormContainer from '@/components/form/FormContainer';
import { updateAllProductVariants } from '@/utils/actions';
import { createContext, SetStateAction, useContext, useState } from 'react';
import { useUpdateProductContext } from './UpdateProductLayout';
import { Dispatch } from 'react';
import CategorySelect from '@/components/admin/product-update/CategorySelect';
import SingleVariantContainer from './SingleVariantContainer';
import SubmitButton from '@/components/form/SubmitButton';
import NewVariantContainer from './NewVariantContainer';
import AllVariantsContainer from './AllVariantsContainer.tsx';
import { FormState, ProductCategory } from '@/utils/types';
import { renderError } from '@/utils/clientFunctions';

type ContextType =
  | {
      category: string;
      setCategory: Dispatch<SetStateAction<string>>;
    }
  | undefined;
const CategoryFormContext = createContext<ContextType>(undefined);
export const useCategoryFormContext = () => useContext(CategoryFormContext);

function CategoryForm() {
  const { product } = useUpdateProductContext()!;
  // Controlled category select
  const [category, setCategory] = useState(product.category);
  // Product category state
  const [oldCategory, setOldCategory] = useState(product.category);

  // Update category and all variants
  const updateCategoryAndAllVariantsAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      await updateAllProductVariants(formData);
      setOldCategory(formData.get('category') as ProductCategory);
      return {
        message: 'Updated category and options',
        type: 'success',
      };
    } catch (error) {
      return renderError(error);
    }
  };

  return (
    <CategoryFormContext.Provider value={{ category, setCategory }}>
      <div>
        {/* Category change */}
        <FormContainer action={updateCategoryAndAllVariantsAction}>
          <CategorySelect />
          {category !== oldCategory && (
            <>
              <input type='hidden' name='productId' value={product.id} />
              <AllVariantsContainer />
              <SubmitButton text='update category and all options' />
            </>
          )}
        </FormContainer>
        {/* NOT Category change */}
        {category === oldCategory && (
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
