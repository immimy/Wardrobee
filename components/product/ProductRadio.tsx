import { ProductCategory, CartItem } from '@/utils/types';
import { Dispatch, SetStateAction } from 'react';

type ProductRadioType = {
  category: ProductCategory;
  label?: string | null;
  gradientColor?: string | null;
  name: string;
  productItem: CartItem;
  currentVariantId: string | null;
  setCurrentCartItem: Dispatch<SetStateAction<CartItem>>;
};

function ProductRadio({
  category,
  label,
  gradientColor,
  name,
  productItem,
  currentVariantId,
  setCurrentCartItem,
}: ProductRadioType) {
  const handleOnChange = () => {
    setCurrentCartItem(productItem);
  };

  const variantId = productItem.variantId!;
  const isOutOfStock = productItem.stock! < 1;

  if (category === 'clothes') {
    return (
      <div className='w-fit'>
        <label
          htmlFor={label!}
          className='relative grid place-items-center px-4 bg-input text-foreground'
        >
          <span>{label}</span>
          <input
            type='radio'
            id={label!}
            name={name}
            className={`appearance-none m-0 absolute inset-0 w-full border border-border before:absolute before:inset-0 before:w-full checked:before:border-2 checked:before:border-ring ${
              isOutOfStock
                ? 'hover:cursor-default before:bg-muted/80 before:rounded-full'
                : 'hover:cursor-pointer'
            }`}
            value={variantId}
            defaultChecked={currentVariantId === variantId}
            onChange={handleOnChange}
            disabled={isOutOfStock}
          />
        </label>
      </div>
    );
  }

  if (category === 'bag') {
    return (
      <div className='w-fit'>
        <label htmlFor={gradientColor!}>
          <input
            type='radio'
            id={gradientColor!}
            name={name}
            className={`appearance-none m-0 size-8 border border-border rounded-full shadow shadow-ring/50 relative before:absolute before:inset-0 before:size-8 checked:before:border-2 checked:before:border-ring checked:before:rounded-full ${
              isOutOfStock
                ? 'hover:cursor-default before:bg-muted/80 before:rounded-full'
                : 'hover:cursor-pointer'
            }`}
            style={{ backgroundColor: gradientColor! }}
            value={variantId}
            defaultChecked={currentVariantId === variantId}
            onChange={handleOnChange}
            disabled={isOutOfStock}
          />
        </label>
      </div>
    );
  }

  return null;
}
export default ProductRadio;
