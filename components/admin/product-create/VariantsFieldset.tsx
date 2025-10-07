'use client';

import { PRODUCT_CATEGORY } from '@/utils/constants';
import FormSelect from '@/components/form/FormSelect';
import VariantInputs from './VariantInputs';
import AddOptionButton from '@/components/single-variant/AddOptionButton';
import { useProductCreateContext } from './ProductProvider';
import { ProductCategory } from '@/utils/types';

function VariantsFieldset() {
  const { product, setProductState, variantComponents, addVariantComponent } =
    useProductCreateContext();

  return (
    <fieldset>
      {/* CATEGORY */}
      <FormSelect
        name='product[category]'
        labelText='category'
        placeholder='choose category'
        frameworks={PRODUCT_CATEGORY}
        value={product.category}
        onChange={(value: string) =>
          setProductState({ category: value as ProductCategory })
        }
      />
      {/* Rendered product options */}
      {
        <ul className='mb-4 md:grid justify-center'>
          {product.category === 'accessory' ? (
            // Accessory option
            <VariantInputs index={1} />
          ) : (
            // Clothes & Bag options
            variantComponents
          )}
        </ul>
      }
      {/* Add option button */}
      {product.category && product.category !== 'accessory' && (
        <AddOptionButton onClick={addVariantComponent} />
      )}
    </fieldset>
  );
}
export default VariantsFieldset;
