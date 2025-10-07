import FormSelect from '@/components/form/FormSelect';
import ColorInput from '@/components/form/ColorInput';
import FormInput from '@/components/form/FormInput';
import { CLOTHES_SIZE } from '@/utils/constants';
import { useProductUpdateContext } from './ProductProvider';
import SwitchToggle from '@/components/form/SwitchToggle';
import { useState } from 'react';

type ParamsType = {
  index?: number;
  id?: string;
  size?: string | undefined;
  color?: string | undefined;
  stock?: number;
  discount?: number;
};

function VariantInputs({
  index,
  id,
  size,
  color,
  stock,
  discount,
}: ParamsType) {
  const { category } = useProductUpdateContext();
  const [isOnSale, setIsOnSale] = useState<boolean>(Boolean(discount));

  return (
    <div className='mb-2 md:mb-0 text-center grid justify-center md:flex flex-wrap  gap-x-6'>
      {/* (optional) VARIANT ID */}
      {id && (
        <input
          type='hidden'
          name={index ? `variant${index}[id]` : 'id'}
          defaultValue={id}
        />
      )}
      {/* (optional) Product category */}
      {!index && (
        <input type='hidden' name='category' defaultValue={category} />
      )}
      {/* Clothes - SIZE */}
      {category === 'clothes' && (
        <FormSelect
          name={index ? `variant${index}[size]` : 'size'}
          labelText='size'
          frameworks={CLOTHES_SIZE}
          placeholder='choose size'
          defaultValue={size}
          className='min-w-[200px]'
        />
      )}
      {/* Bag - COLOR */}
      {category === 'bag' && (
        <ColorInput
          name={index ? `variant${index}[color]` : 'color'}
          labelText='color'
          defaultValue={color}
        />
      )}
      {/* STOCK */}
      <FormInput
        type='text'
        name={index ? `variant${index}[stock]` : 'stock'}
        labelText='stock'
        defaultValue={stock}
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
          defaultValue={discount || 0}
          className='min-w-[200px]'
        />
      )}
    </div>
  );
}
export default VariantInputs;
