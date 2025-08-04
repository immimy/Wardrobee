import FormSelect from '@/components/form-control/FormSelect';
import ColorInput from '@/components/form-control/ColorInput';
import FormInput from '@/components/form-control/FormInput';
import FormContainer from '@/components/form/FormContainer';
import OnSaleContainer from '@/components/form-custom/OnSaleAndDiscountInput';
import SubmitButton from '@/components/form/SubmitButton';
import { Button } from '@/components/ui/button';
import { useUpdateProductContext } from './UpdateProductLayout';
import { CLOTHES_SIZE } from '@/utils/constants';
import { FormState } from '@/utils/types';
import { createProductVariant } from '@/utils/actions';
import { renderError } from '@/utils/clientFunctions';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { Dispatch, SetStateAction } from 'react';

type ParamsType = { setIsCreate: Dispatch<SetStateAction<boolean>> };

function NewVariantForm({ setIsCreate }: ParamsType) {
  const { product } = useUpdateProductContext()!;

  const createProductVariantAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      await createProductVariant(formData);
      setIsCreate(false);
      return { message: 'Created product option', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  return (
    <li className='mt-2 flex flex-wrap justify-center gap-x-6'>
      {/* Form */}
      <FormContainer id='create-variant' action={createProductVariantAction}>
        <div className='flex flex-wrap gap-x-6 md:justify-center transition-transform border-b last:border-b-0 *:mb-0'>
          {/* Hidden input */}
          <input type='hidden' name='productId' defaultValue={product.id} />
          <input
            type='hidden'
            name='category'
            defaultValue={product.category}
          />
          {/* Clothes */}
          {product.category === 'clothes' && (
            <FormSelect
              name='size'
              labelText='size'
              isLabel
              frameworks={CLOTHES_SIZE}
              placeholder='choose size'
            />
          )}
          {/* Bag */}
          {product.category === 'bag' && (
            <ColorInput name='color' labelText='color' />
          )}
          {/* Stock */}
          <FormInput type='text' name='stock' labelText='stock' />
          {/* OnSale and Discount */}
          <OnSaleContainer />
        </div>
      </FormContainer>
      {/* Buttons */}
      <div className='flex items-center gap-x-2'>
        <>
          {/* Submit button */}
          <SubmitButton
            form='create-variant'
            icon={<FaCheck />}
            size='icon'
            className='w-8 rounded-full text-successful bg-transparent border-0 hover:bg-transparent hover:scale-120'
          />
          {/* Cancel button */}
          <Button
            type='button'
            size='icon'
            className='w-8 rounded-full text-destructive bg-transparent border-0 hover:cursor-pointer hover:bg-transparent hover:scale-120'
            onClick={() => setIsCreate(false)}
          >
            <FaXmark />
          </Button>
        </>
      </div>
    </li>
  );
}
export default NewVariantForm;
