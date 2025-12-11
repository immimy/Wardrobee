import { DeletedCartItemType } from '@/utils/types';
import ImageContainer from '../global/ImageContainer';
import TextField from './TextField';
import ColorField from './ColorField';
import PriceField from './PriceField';
import { Badge } from '../ui/badge';

type ParamsType = { cartItem: DeletedCartItemType };

function DeletedCartItemList({ cartItem }: ParamsType) {
  return (
    <li className='flex flex-wrap gap-2 py-1.5'>
      <ImageContainer
        alt=''
        src={cartItem.image}
        className='size-12 rounded shadow grayscale'
      />
      <div className='grow flex flex-wrap justify-between gap-2'>
        <h6 className='font-semibold mb-1.5 text-muted-foreground'>
          {cartItem.name}
          {Boolean(cartItem.discount) && (
            <Badge
              variant='destructive'
              className='rounded ml-2 h-5 bg-muted-foreground text-muted'
            >
              -{cartItem.discount}%
            </Badge>
          )}
        </h6>
        <div className='flex flex-wrap gap-2'>
          {cartItem.size && (
            <TextField field='size' value={cartItem.size} uppercase />
          )}
          {cartItem.color && <ColorField value={cartItem.color} grayscale />}
          <PriceField price={cartItem.price} discount={cartItem.discount} />
        </div>
      </div>
    </li>
  );
}
export default DeletedCartItemList;
