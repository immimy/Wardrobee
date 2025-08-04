'use client';

import { PRODUCT_CATEGORY } from '@/utils/constants';
import FormSelect from '../../form-control/FormSelect';
import VariantInput from './VariantInput';
import { useState } from 'react';
import { ProductCategory } from '@/utils/types';
import AddOptionButton from '../../single-variant/AddOptionButton';
import { useCreateProductContext } from './CreateProductForm';

function VariantsFieldset() {
  // Current category state
  const { category, setCategory } = useCreateProductContext()!;

  // Rendered variant components list
  const [variantComponents, setVariantComponents] = useState<
    Array<React.ReactElement>
  >([<VariantInput key={1} index={1} />]);

  const addVariantComponent = () => {
    setVariantComponents([
      ...variantComponents,
      <VariantInput
        key={variantComponents.length + 1}
        index={variantComponents.length + 1}
      />,
    ]);
  };

  return (
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
      {<ul className='mb-4 md:grid justify-center'>{variantComponents}</ul>}
      {/* Add option button */}
      {category && <AddOptionButton onClick={addVariantComponent} />}
    </fieldset>
  );
}
export default VariantsFieldset;
