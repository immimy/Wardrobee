import SubmitButton from '@/components/form/SubmitButton';
import FormContainer from '@/components/form/FormContainer';
import TextDisplay from '@/components/single-variant/TextDisplay';
import ColorDisplay from '@/components/single-variant/ColorDisplay';
import OnSaleDisplay from '@/components/single-variant/OnSaleDisplay';
import { Button } from '@/components/ui/button';
import { useUpdateProductContext } from './UpdateProductLayout';
import { useSingleVariantContext } from './SingleVariantLists';
import { deleteProductVariant } from '@/utils/actions';
import { FaTrashCan, FaPencil } from 'react-icons/fa6';

function SingleVariantDisplay() {
  const { product } = useUpdateProductContext()!;
  const { id, size, color, stock, isOnSale, discount, setIsUpdate } =
    useSingleVariantContext()!;

  const enterUpdateMode = () => setIsUpdate(true);
  const deleteVariantAction = deleteProductVariant.bind(null, id);

  return (
    <li className='py-5 md:py-3 flex flex-wrap justify-center gap-x-8 gap-y-2 border-b last:border-b-0 lg:border-b-0'>
      {/* Show product option data */}
      <div className='flex flex-wrap gap-x-8 md:justify-center transition-transform *:mb-0'>
        {/* Clothes */}
        {product.category === 'clothes' && (
          <TextDisplay label='size' value={size?.toUpperCase()} />
        )}
        {/* Bag */}
        {product.category === 'bag' && <ColorDisplay value={color} />}
        {/* Stock */}
        <TextDisplay label='stock' value={stock} />
        {/* On sale and Discount */}
        <OnSaleDisplay isOnSale={isOnSale} discount={discount} />
      </div>
      {/* Buttons */}
      <div className='grid grid-cols-2 items-center gap-x-2 transition-all'>
        {/* Delete product option */}
        <FormContainer action={deleteVariantAction}>
          <SubmitButton
            icon={<FaTrashCan />}
            size='icon'
            variant='destructive'
            className='md:rounded-full md:w-8'
          />
        </FormContainer>
        {/* Enter update mode */}
        <Button
          type='button'
          size='icon'
          className='md:w-8 md:rounded-full hover:cursor-pointer'
          onClick={enterUpdateMode}
        >
          <FaPencil />
        </Button>
      </div>
    </li>
  );
}
export default SingleVariantDisplay;
