import FormSelect from '@/components/form/FormSelect';
import ColorInput from '@/components/form/ColorInput';
import FormInput from '@/components/form/FormInput';
import SubmitButton from '@/components/form/SubmitButton';
import { Button } from '@/components/ui/button';
import { CLOTHES_SIZE } from '@/utils/constants';
import { createProductVariant } from '@/utils/actions';
import { toastError } from '@/utils/clientFunctions';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { Dispatch, FormEventHandler, SetStateAction, useState } from 'react';
import { useProductUpdateContext } from '@/components/admin/product-update/ProductProvider';
import { toast } from 'sonner';
import SwitchToggle from '@/components/form/SwitchToggle';

type ParamsType = { setIsCreate: Dispatch<SetStateAction<boolean>> };

function NewVariantForm({ setIsCreate }: ParamsType) {
  const { product } = useProductUpdateContext();
  const [isOnSale, setIsOnSale] = useState<boolean>(false);

  const createNewVariantHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await createProductVariant(formData);
      setIsCreate(false);
      toast.success('Created product option');
    } catch (error) {
      return toastError(error);
    }
  };

  return (
    <div className='py-3 border-t lg:border-t-0 grid justify-center'>
      {/* New single variant form */}
      <form onSubmit={createNewVariantHandler}>
        <div className='md:flex justify-center items-center gap-x-8'>
          {/* PRODUCT ID */}
          <input type='hidden' name='productId' defaultValue={product.id} />
          {/* CATEGORY */}
          <input
            type='hidden'
            name='category'
            defaultValue={product.category}
          />
          {/* Clothes - SIZE */}
          {product.category === 'clothes' && (
            <FormSelect
              name='size'
              labelText='size'
              frameworks={CLOTHES_SIZE}
              placeholder='choose size'
            />
          )}
          {/* Bag - COLOR */}
          {product.category === 'bag' && (
            <ColorInput name='color' labelText='color' />
          )}
          {/* STOCK */}
          <FormInput type='text' name='stock' labelText='stock' />
          {/* IS ON SALE */}
          <SwitchToggle
            name='isOnSale'
            labelText='on sale'
            labelPosition='top'
            checked={isOnSale}
            onChange={(checked: boolean) => setIsOnSale(checked)}
          />
          {/* DISCOUNT */}
          {isOnSale && (
            <FormInput
              type='text'
              name='discount'
              labelText='discount (%)'
              className='max-w-[200px]'
            />
          )}
          {/* Buttons */}
          <div className='flex items-center gap-x-2 justify-self-center'>
            <>
              {/* Submit button */}
              <SubmitButton
                icon={<FaCheck />}
                size='icon'
                className='w-8 rounded-full text-successful bg-transparent border-0 hover:bg-transparent hover:scale-120 shadow-none'
              />
              {/* Cancel button */}
              <Button
                type='button'
                size='icon'
                className='w-8 rounded-full text-destructive bg-transparent border-0 hover:cursor-pointer hover:bg-transparent hover:scale-120 shadow-none'
                onClick={() => setIsCreate(false)}
              >
                <FaXmark />
              </Button>
            </>
          </div>
        </div>
      </form>
    </div>
  );
}
export default NewVariantForm;
