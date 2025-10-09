import { ProductCategory } from '@/utils/types';
import { useProductContext } from './ProductProvider';

type ProductRadioType = {
  category: ProductCategory;
  label: string | null;
  gradientColor: string | null;
  value: string;
  discount: number;
  stock: number;
  quantityList: number[] | undefined;
};

function ProductRadio({
  category,
  label,
  gradientColor,
  value,
  discount,
  stock,
  quantityList,
}: ProductRadioType) {
  const isOutOfStock = stock < 1;
  const { cartItem, setCartItem } = useProductContext();
  const handleOnChange = () =>
    setCartItem({ ...cartItem, discount, stock, stockList: quantityList });

  if (category === 'clothes') {
    return (
      <div className='w-fit'>
        <label
          htmlFor={label!}
          className='relative grid place-items-center px-4 bg-input text-foreground'
        >
          <span className='uppercase'>{label}</span>
          <input
            type='radio'
            id={label!}
            name='productVariantId'
            className={`appearance-none m-0 absolute inset-0 w-full border border-border before:absolute before:inset-0 before:w-full checked:before:border-2 checked:before:border-ring ${
              isOutOfStock
                ? 'hover:cursor-default before:bg-muted/80 before:rounded-full'
                : 'hover:cursor-pointer'
            }`}
            value={value}
            onChange={handleOnChange}
            disabled={isOutOfStock}
            required
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
            name='productVariantId'
            className={`appearance-none m-0 size-8 border border-border rounded-full shadow shadow-ring/50 relative before:absolute before:inset-0 checked:before:border-2 checked:before:border-ring checked:before:rounded-full ${
              isOutOfStock
                ? 'hover:cursor-not-allowed before:bg-muted/80 before:rounded-full'
                : 'hover:cursor-pointer'
            }`}
            style={{ backgroundColor: gradientColor! }}
            value={value}
            onChange={handleOnChange}
            disabled={isOutOfStock}
            required
          />
        </label>
      </div>
    );
  }

  return null;
}
export default ProductRadio;
