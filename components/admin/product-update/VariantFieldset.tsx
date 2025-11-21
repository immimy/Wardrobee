import FormSelect from '@/components/form/FormSelect';
import ColorInput from '@/components/form/ColorInput';
import FormInput from '@/components/form/FormInput';
import { CLOTHES_SIZE } from '@/utils/constants';
import { useProductUpdateContext } from './ProductProvider';
import SwitchToggle from '@/components/form/SwitchToggle';
import { MouseEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toastError } from '@/utils/clientFunctions';

// Form state type
type VariantFormType = {
  size: string;
  color: string;
  stock: string | number;
  isOnSale: boolean;
  discount: string | number;
};

type ParamsType = {
  // Passing either index or id (choose one)
  index?: number; // for creating a new variant
  id?: string; // for updating an existent variant
  size?: string | null;
  color?: string | null;
  stock?: number;
  discount?: number;
  disableDeleteBtn?: boolean;
};

function VariantFieldset({
  index,
  id,
  size,
  color,
  stock,
  discount,
  disableDeleteBtn,
}: ParamsType) {
  const elementIdentifier = `variant-${id || index}`;
  const variantId = `variant[${id || index}]`;

  const {
    productForm: { category },
  } = useProductUpdateContext();

  // Variant state
  const [variantForm, setVariantForm] = useState<VariantFormType>({
    size: size || '',
    color: color || '',
    stock: stock || '',
    isOnSale: Boolean(discount),
    discount: discount || '',
  });
  const setVariantData = (
    field: keyof VariantFormType,
    value: string | boolean
  ) => {
    setVariantForm((state) => ({ ...state, [field]: value }));
  };

  // Handle delete variant
  const deleteVariantHandler: MouseEventHandler<HTMLButtonElement> = () => {
    // Find variant item
    const el = document.getElementById(elementIdentifier);
    if (!el)
      return toastError(
        `Cannot find variant with id attribute: ${elementIdentifier}`
      );
    // CaseI: Delete existing variant
    if (id) {
      // Generating hidden input contains the id of variant that user wants to remove
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', `deletedVariant[${id}]`);
      hiddenInput.setAttribute('value', id);
      // Append after the last child of variant item
      el.append(hiddenInput);
      // Remove the first child of variant item
      el.removeChild(el.firstElementChild!);
    } else {
      // CaseII: Delete new added variant
      return el.remove();
    }
  };

  return (
    <li id={elementIdentifier} className='mt-2'>
      <div className='relative border rounded-md'>
        <div className='py-4 px-8 text-center md:flex md:flex-wrap md:gap-x-6'>
          {/* (optional) VARIANT ID */}
          {id && (
            <input type='hidden' name={`${variantId}[id]`} defaultValue={id} />
          )}
          {/* Clothes - SIZE */}
          {category === 'clothes' && (
            <FormSelect
              name={`${variantId}[size]`}
              labelText='size'
              frameworks={CLOTHES_SIZE}
              placeholder='choose size'
              value={variantForm.size}
              onChange={(value: string) => setVariantData('size', value)}
              className='min-w-[125px]'
            />
          )}
          {/* Bag - COLOR */}
          {category === 'bag' && (
            <ColorInput
              name={`${variantId}[color]`}
              labelText='color'
              value={variantForm.color}
              onChange={(e) => setVariantData('color', e.currentTarget.value)}
            />
          )}
          {/* STOCK */}
          <FormInput
            type='text'
            name={`${variantId}[stock]`}
            labelText='stock'
            value={variantForm.stock}
            onChange={(e) => setVariantData('stock', e.currentTarget.value)}
            className='md:max-w-[125px]'
          />
          {/* IS ON SALE */}
          <div className='md:flex justify-center gap-x-4'>
            <SwitchToggle
              name={`${variantId}[isOnSale]`}
              labelText='on sale'
              labelPosition='top'
              checked={variantForm.isOnSale}
              onChange={(checked: boolean) =>
                setVariantData('isOnSale', checked)
              }
            />
            {/* DISCOUNT */}
            {variantForm.isOnSale && (
              <FormInput
                type='text'
                name={`${variantId}[discount]`}
                labelText='discount (%)'
                value={variantForm.discount}
                onChange={(e) =>
                  setVariantData('discount', e.currentTarget.value)
                }
                className='md:max-w-[125px]'
              />
            )}
          </div>
        </div>
        {/* Delete button */}
        <Button
          type='button'
          onClick={deleteVariantHandler}
          variant='destructive'
          size='sm'
          className='uppercase text-xs w-full rounded-t-none md:absolute md:top-0 md:right-0 md:rounded-tr-lg md:rounded-b-none md:w-fit'
          disabled={disableDeleteBtn}
        >
          delete
        </Button>
      </div>
    </li>
  );
}
export default VariantFieldset;
