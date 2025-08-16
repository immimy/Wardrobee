'use client';

import { Roles } from '@/types/globals';
import FormContainer from '../../form/FormContainer';
import { createProductAction } from '@/utils/actions';
import ProductFieldset from './ProductFieldset';
import VariantFieldset from './VariantsFieldset';
import SubmitButton from '../../form/SubmitButton';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { ProductCategory } from '@/utils/types';

type ContextType = {
  role: Roles | 'user';
  category: ProductCategory | undefined;
  setCategory: Dispatch<SetStateAction<ProductCategory | undefined>>;
};
const CreateProductContext = createContext<undefined | ContextType>(undefined);
export const useCreateProductContext = () => useContext(CreateProductContext);

type ParamsType = { role: Roles | 'user' };
function CreateProductForm({ role }: ParamsType) {
  const [category, setCategory] = useState<ProductCategory | undefined>(
    undefined
  );
  return (
    <CreateProductContext.Provider value={{ role, category, setCategory }}>
      <FormContainer action={createProductAction}>
        <div className='grid gap-y-4'>
          <ProductFieldset />
          <VariantFieldset />
        </div>
        <SubmitButton text='create product' className='w-full' />
      </FormContainer>
    </CreateProductContext.Provider>
  );
}
export default CreateProductForm;
