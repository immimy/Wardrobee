import FormSelect from '@/components/form-control/FormSelect';
import ColorInput from '@/components/form-control/ColorInput';
import FormInput from '@/components/form-control/FormInput';
import OnSaleAndDiscountInput from '@/components/form-custom/OnSaleAndDiscountInput';
import { useCreateProductContext } from './CreateProductForm';
import { CLOTHES_SIZE } from '@/utils/constants';
import { FaXmark } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useVariantsFieldsetContext } from './VariantsFieldset';

type ParamsType = {
  index: number;
  removeBtn?: boolean;
};

function VariantInput({ index, removeBtn }: ParamsType) {
  const { removeVariantComponent } = useVariantsFieldsetContext()!;
  const { category } = useCreateProductContext()!;
  if (!category) return null;

  return (
    <li className='py-5 md:py-3 flex gap-x-6 gap-y-4 flex-col md:flex-row items-center justify-center md:justify-start transition-transform border-b last:border-b-0 md:border-b-0 *:mb-0 relative'>
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
      {/* Remove Button */}
      {removeBtn && (
        <Button
          type='button'
          variant='destructive'
          size='icon'
          className='absolute size-6 top-3 right-3 sm:right-6 md:-right-24 md:top-1/2 md:-translate-y-1/2 rounded-full hover:cursor-pointer hover:scale-110 transition-transform'
          onClick={() => removeVariantComponent(index - 1)}
        >
          <FaXmark />
        </Button>
      )}
    </li>
  );
}
export default VariantInput;
