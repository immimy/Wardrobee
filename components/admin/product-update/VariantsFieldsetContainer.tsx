'use client';

import { useState } from 'react';
import { useProductUpdateContext } from './ProductProvider';
import VariantFieldset from './VariantFieldset';
import AddOptionButton from '@/components/single-variant/AddOptionButton';

function VariantsFieldsetContainer() {
  const {
    productForm: { category },
    product: { variants },
  } = useProductUpdateContext();

  // New added variants
  const [newVariants, setNewVariants] = useState<React.ReactElement[]>([]);
  const addVariantHandler = () => {
    setNewVariants((state) => {
      const index = state.length + 1;
      return [...state, <VariantFieldset key={index} index={index} />];
    });
  };

  return (
    <div className='md:mx-auto md:max-w-2xl'>
      {/* Existing variants list */}
      <ul>
        {variants.map((variant, index) => {
          // If category is accessory and is not the first item.
          if (category === 'accessory' && index) {
            return (
              <input
                key={variant.id}
                type='hidden'
                name={`deletedVariant[${variant.id}]`}
                value={variant.id}
              />
            );
          }
          return (
            <VariantFieldset
              key={variant.id}
              {...variant}
              // Disable delete button if category is accessory.
              disableDeleteBtn={category === 'accessory'}
            />
          );
        })}
      </ul>
      {/* New added variants list */}
      <ul>{newVariants}</ul>
      {category !== 'accessory' && (
        <AddOptionButton onClick={addVariantHandler} />
      )}
    </div>
  );
}
export default VariantsFieldsetContainer;
