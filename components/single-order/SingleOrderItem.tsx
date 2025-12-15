import ImageContainer from '../global/ImageContainer';
import TextDisplay from '../single-variant/TextDisplay';
import ColorDisplay from '../single-variant/ColorDisplay';
import PriceDisplay from '../single-variant/PriceDisplay';
import { priceFormatter } from '@/utils/format';
import { Badge } from '../ui/badge';
import { OrderItem } from '@prisma/client';

type ParamsType = { orderItem: OrderItem };
function SingleOrderItem({ orderItem }: ParamsType) {
  const {
    productImage,
    productName,
    productSize,
    productColor,
    price,
    quantity,
    discount,
    total,
  } = orderItem;
  const sellingPrice = price * (1 - discount / 100);

  return (
    <li className='p-4 md:p-0 grid place-items-center md:place-items-start lg:px-16 border md:border-0 rounded-2xl drop-shadow'>
      <div className='flex flex-wrap md:flex-nowrap items-center gap-x-8'>
        {/* Product Image */}
        <ImageContainer
          src={productImage}
          alt={productName}
          className='size-16 md:size-32 rounded-2xl'
        />
        {/* Product Details */}
        <div>
          <h4 className='mb-2.5 font-bold text-ring'>
            {productName}
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
            {productSize && (
              <TextDisplay
                label='size'
                value={productSize}
                className='uppercase'
              />
            )}
            {productColor && <ColorDisplay value={productColor} />}
            <TextDisplay label='qty' value={quantity} className='col-start-2' />
            <PriceDisplay
              label='price'
              value={priceFormatter(sellingPrice)}
              isOnSale={Boolean(discount)}
              price={price}
            />
            <TextDisplay
              label='subtotal'
              value={priceFormatter(Number(total))}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
export default SingleOrderItem;
