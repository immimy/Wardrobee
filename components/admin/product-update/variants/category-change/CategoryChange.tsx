'use client';

import { updateCategoryAndVariants } from '@/utils/actions';
import SubmitButton from '@/components/form/SubmitButton';
import AllVariantsContainer from './AllVariantsContainer.tsx';
import { useProductUpdateContext } from '../../ProductProvider';
import FormSelect from '@/components/form/FormSelect';
import { PRODUCT_CATEGORY } from '@/utils/constants';
import { ProductCategory } from '@/utils/types';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import { toastError } from '@/utils/clientFunctions';

function CategoryChange() {
  const { product, category, setCategory } = useProductUpdateContext();

  const updateCategoryAndVariantsHandler: FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await updateCategoryAndVariants(formData);
      toast.success('Updated category and options');
    } catch (error) {
      return toastError(error);
    }
  };

  return (
    <form onSubmit={updateCategoryAndVariantsHandler}>
      <FormSelect
        name='category'
        placeholder='choose category'
        frameworks={PRODUCT_CATEGORY}
        value={category}
        onChange={(value: string) => setCategory(value as ProductCategory)}
      />
      {category !== product.category && (
        <>
          <input type='hidden' name='productId' value={product.id} />
          <AllVariantsContainer />
          <SubmitButton
            text='update category and all options'
            className='w-full'
          />
        </>
      )}
    </form>
  );
}
export default CategoryChange;
