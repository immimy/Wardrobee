'use client';

import FormSelect from '@/components/form/FormSelect';
import ColorInput from '@/components/form/ColorInput';
import FormInput from '@/components/form/FormInput';
import SwitchToggle from '@/components/form/SwitchToggle';
import { CLOTHES_SIZE } from '@/utils/constants';
import { FaXmark } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useProductCreateContext } from './ProductProvider';
import { useState } from 'react';

type ParamsType = {
  index: number;
  removeBtn?: boolean;
};

function VariantInput({ index, removeBtn }: ParamsType) {
  const [isOnSale, setIsOnSale] = useState<boolean>(false);

  const { product, removeVariantComponent } = useProductCreateContext();
  if (!product.category) return null;

  return (
    <li className='py-5 md:py-3 flex gap-x-6 gap-y-4 flex-col md:flex-row items-center justify-center md:justify-start transition-transform border-b last:border-b-0 md:border-b-0 *:mb-0 relative'>
      {/* CLOTHES */}
      {product.category === 'clothes' && (
        <FormSelect
          name={`variant${index}[size]`}
          labelText='size'
          frameworks={CLOTHES_SIZE}
          placeholder='choose size'
          className='min-w-[200px]'
        />
      )}
      {/* BAG */}
      {product.category === 'bag' && (
        <ColorInput name={`variant${index}[color]`} labelText='color' />
      )}
      {/* STOCK */}
      <FormInput
        type='text'
        name={`variant${index}[stock]`}
        labelText='stock'
        className='min-w-[200px]'
      />
      {/* IS ON SALE */}
      <SwitchToggle
        name={index ? `variant${index}[isOnSale]` : 'isOnSale'}
        labelText='on sale'
        labelPosition='top'
        checked={isOnSale}
        onChange={(checked: boolean) => setIsOnSale(checked)}
      />
      {/* DISCOUNT */}
      {isOnSale && (
        <FormInput
          type='text'
          name={index ? `variant${index}[discount]` : 'discount'}
          labelText='discount (%)'
          className='min-w-[200px]'
        />
      )}
      {/* Remove Button */}
      {removeBtn && (
        <div className='absolute top-3 right-3 sm:right-6 md:relative md:top-0 md:right-0 md:grow md:justify-self-end flex justify-end'>
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='size-6 rounded-full hover:cursor-pointer hover:scale-110 transition-transform'
            onClick={() => removeVariantComponent(index - 1)}
          >
            <FaXmark />
          </Button>
        </div>
      )}
    </li>
  );
}
export default VariantInput;
