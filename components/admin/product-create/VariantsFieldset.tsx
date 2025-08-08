'use client';

import { PRODUCT_CATEGORY } from '@/utils/constants';
import FormSelect from '../../form-control/FormSelect';
import VariantInput from './VariantInput';
import { useState } from 'react';
import { ProductCategory } from '@/utils/types';
import AddOptionButton from '../../single-variant/AddOptionButton';
import { useCreateProductContext } from './CreateProductForm';

import { createContext, useContext } from 'react';

type ContextType = {
  removeVariantComponent: (index: number) => void;
};
const VariantsFieldsetContext = createContext<undefined | ContextType>(
  undefined
);
export const useVariantsFieldsetContext = () =>
  useContext(VariantsFieldsetContext);

function VariantsFieldset() {
  // Current category state
  const { category, setCategory } = useCreateProductContext()!;
  // Rendered variant components list
  const [variantComponents, setVariantComponents] = useState<
    Array<React.ReactElement | null>
  >([<VariantInput key={1} index={1} removeBtn />]);

  const addVariantComponent = () => {
    setVariantComponents([
      ...variantComponents,
      <VariantInput
        key={variantComponents.length + 1}
        index={variantComponents.length + 1}
        removeBtn
      />,
    ]);
  };
  const removeVariantComponent = (index: number) => {
    const newState = variantComponents;
    newState[index] = null;
    setVariantComponents([...newState]);
  };

  return (
    <VariantsFieldsetContext.Provider value={{ removeVariantComponent }}>
      <fieldset>
        {/* CATEGORY */}
        <FormSelect
          isLabel
          name='product[category]'
          labelText='category'
          placeholder='choose category'
          frameworks={PRODUCT_CATEGORY}
          defaultValue={category?.toLowerCase()}
          onChange={(value: string) => setCategory(value as ProductCategory)}
        />
        {/* Rendered product options */}
        {
          <ul className='mb-4 md:grid justify-center'>
            {category === 'accessory' ? (
              // Accessory option
              <VariantInput index={1} />
            ) : (
              // Clothes & Bag options
              variantComponents
            )}
          </ul>
        }
        {/* Add option button */}
        {category && category !== 'accessory' && (
          <AddOptionButton onClick={addVariantComponent} />
        )}
      </fieldset>
    </VariantsFieldsetContext.Provider>
  );
}
export default VariantsFieldset;
