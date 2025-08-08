import FormSelect from '@/components/form-control/FormSelect';
import ColorInput from '@/components/form-control/ColorInput';
import FormInput from '@/components/form-control/FormInput';
import OnSaleAndDiscountInput from '@/components/form-custom/OnSaleAndDiscountInput';
import { useCategoryFormContext } from './CategoryForm';
import { CLOTHES_SIZE } from '@/utils/constants';

type ParamsType = {
  index?: number;
  id?: string;
  size?: string | undefined;
  color?: string | undefined;
  stock?: number;
  isOnSale?: boolean;
  discount?: number;
};

function SingleVariantInput({
  index,
  id,
  size,
  color,
  stock,
  isOnSale,
  discount,
}: ParamsType) {
  const { category } = useCategoryFormContext()!;
  return (
    <div className='mb-2 md:mb-0 text-center grid justify-center md:flex flex-wrap md:justify-start gap-x-6'>
      {/* Variant Id */}
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
      {/* Clothes */}
      {category === 'clothes' && (
        <FormSelect
          name={index ? `variant${index}[size]` : 'size'}
          labelText='size'
          isLabel
          frameworks={CLOTHES_SIZE}
          placeholder='choose size'
          defaultValue={size}
        />
      )}
      {/* Bag */}
      {category === 'bag' && (
        <ColorInput
          name={index ? `variant${index}[color]` : 'color'}
          labelText='color'
          defaultValue={color}
        />
      )}
      {/* Stock */}
      <FormInput
        type='text'
        name={index ? `variant${index}[stock]` : 'stock'}
        labelText='stock'
        defaultValue={stock}
        className='max-w-[200px]'
      />
      {/* On sale And Discount */}
      <OnSaleAndDiscountInput
        index={index}
        isOnSale={isOnSale}
        discount={discount}
      />
    </div>
  );
}
export default SingleVariantInput;
