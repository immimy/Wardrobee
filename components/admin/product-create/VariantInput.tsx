import FormSelect from '@/components/form-control/FormSelect';
import ColorInput from '@/components/form-control/ColorInput';
import FormInput from '@/components/form-control/FormInput';
import OnSaleAndDiscountInput from '@/components/form-custom/OnSaleAndDiscountInput';
import { useCreateProductContext } from './CreateProductForm';
import { CLOTHES_SIZE } from '@/utils/constants';

type ParamsType = {
  index: number;
};

function VariantInput({ index }: ParamsType) {
  const { category } = useCreateProductContext()!;
  if (!category) return null;

  return (
    <li className='py-5 md:py-3 flex gap-x-6 gap-y-4 flex-col md:flex-row items-center justify-center md:justify-start transition-transform border-b last:border-b-0 md:border-b-0 *:mb-0'>
      {/* CLOTHES */}
      {category === 'clothes' && (
        <FormSelect
          name={`variant${index}[size]`}
          labelText='size'
          isLabel
          frameworks={CLOTHES_SIZE}
          placeholder='choose size'
        />
      )}
      {/* BAG */}
      {category === 'bag' && (
        <ColorInput name={`variant${index}[color]`} labelText='color' />
      )}
      {/* STOCK */}
      <FormInput
        type='text'
        name={`variant${index}[stock]`}
        labelText='stock'
        defaultValue={100}
        className='max-w-[200px]'
      />
      {/* ON SALE AND DISCOUNT */}
      <OnSaleAndDiscountInput index={index} />
    </li>
  );
}
export default VariantInput;
