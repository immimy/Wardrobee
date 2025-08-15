import FormContainer from '@/components/form/FormContainer';
import { updateProductVariant } from '@/utils/actions';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { FormState } from '@/utils/types';
import { renderError } from '@/utils/clientFunctions';
import SingleVariantInput from './SingleVariantInput';
import { useSingleVariantContext } from './SingleVariantLists';
import SubmitButton from '@/components/form/SubmitButton';

function SingleVariantForm() {
  const { id, size, color, stock, isOnSale, discount, setIsUpdate } =
    useSingleVariantContext()!;

  const cancelUpdateMode = () => setIsUpdate(false);
  const updateSingleVariantAction = async (
    prevState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      await updateProductVariant(formData);
      setIsUpdate(false);
      return { message: 'Product option updated', type: 'success' };
    } catch (error) {
      return renderError(error);
    }
  };

  return (
    <li className='py-3 border-b last:border-b-0 lg:border-b-0 md:flex justify-between items-center gap-x-8'>
      {/* Update single variant form */}
      <FormContainer
        id={`update-${id}-variant`}
        action={updateSingleVariantAction}
      >
        <SingleVariantInput
          id={id}
          size={size}
          color={color}
          stock={stock}
          isOnSale={isOnSale}
          discount={discount}
        />
      </FormContainer>
      {/* Buttons */}
      <div className='flex justify-center gap-x-2'>
        {/* Submit button */}
        <SubmitButton
          form={`update-${id}-variant`}
          size='icon'
          className='md:rounded-full text-input bg-successful hover:bg-successful hover:scale-120 hover:cursor-pointer'
          icon={<FaCheck />}
        />
        {/* Cancel update mode */}
        <Button
          type='button'
          size='icon'
          variant='destructive'
          className='md:rounded-full hover:cursor-pointer hover:scale-120'
          onClick={cancelUpdateMode}
        >
          <FaXmark />
        </Button>
      </div>
    </li>
  );
}
export default SingleVariantForm;
