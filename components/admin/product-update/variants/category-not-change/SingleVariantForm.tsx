import { updateProductVariant } from '@/utils/actions';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { toastError } from '@/utils/clientFunctions';
import VariantInputs from '@/components/admin/product-update/VariantInputs';
import { useSingleVariantContext } from './SingleVariantLists';
import SubmitButton from '@/components/form/SubmitButton';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

function SingleVariantForm() {
  const { id, size, color, stock, discount, setIsUpdate } =
    useSingleVariantContext();

  const cancelUpdateMode = () => setIsUpdate(false);
  const updateVariantHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await updateProductVariant(formData);
      setIsUpdate(false);
      toast.success('Product option updated');
    } catch (error) {
      return toastError(error);
    }
  };

  return (
    <li className='py-3 border-b last:border-b-0 lg:border-b-0'>
      {/* Update single variant form */}
      <form onSubmit={updateVariantHandler}>
        <div className='md:flex justify-center items-center gap-x-8'>
          <VariantInputs
            id={id}
            size={size}
            color={color}
            stock={stock}
            discount={discount}
          />
          {/* Buttons */}
          <div className='flex justify-center gap-x-2'>
            {/* Submit button */}
            <SubmitButton
              size='icon'
              className='md:rounded-full text-input bg-successful hover:bg-successful hover:scale-120 hover:cursor-pointer dark:text-foreground/90'
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
        </div>
      </form>
    </li>
  );
}
export default SingleVariantForm;
