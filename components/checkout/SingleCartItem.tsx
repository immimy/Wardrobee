import { CartItemType } from '@/utils/types';
import ImageContainer from '../global/ImageContainer';
import TextDisplay from '../single-variant/TextDisplay';
import ColorDisplay from '../single-variant/ColorDisplay';
import PriceDisplay from '../single-variant/PriceDisplay';
import { priceFormatter } from '@/utils/format';
import { Badge } from '../ui/badge';

type ParamsType = { cartItem: CartItemType };
function SingleCartItem({ cartItem }: ParamsType) {
  const { image, name, price, category } = cartItem.data;
  const { quantity, variantId } = cartItem.state;
  const { size, color, discount } = cartItem.options.find(
    (item) => item.id === variantId
  )!;
  const sellingPrice = price * (1 - discount / 100);

  return (
    <li className='grid place-items-center md:place-items-start lg:px-16 border md:border-0 rounded-2xl drop-shadow'>
      <div className='flex items-center gap-x-8'>
        {/* Product Image */}
        <ImageContainer
          src={image}
          alt={name}
          className='size-16 md:size-32 rounded-2xl'
        />
        {/* Product Details */}
        <div>
          <h4 className='mb-2.5 font-bold text-ring'>
            {name}
            <Badge
              variant='destructive'
              className={`${
                !discount && 'hidden'
              } px-1.5 py-0 rounded-none shadow ml-3`}
            >
              -{discount}%
            </Badge>
          </h4>
          <div className='grid grid-cols-4 place-items-center gap-x-4'>
            {category === 'clothes' && (
              <TextDisplay label='size' value={size!} className='uppercase' />
            )}
            {category === 'bag' && <ColorDisplay value={color!} />}
            <TextDisplay label='qty' value={quantity} className='col-start-2' />
            <PriceDisplay
              label='price'
              value={priceFormatter(sellingPrice)}
              isOnSale={Boolean(discount)}
              price={price}
            />
            <TextDisplay
              label='subtotal'
              value={priceFormatter(sellingPrice * quantity)}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
export default SingleCartItem;
