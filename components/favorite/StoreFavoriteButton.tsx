'use client';

import { FaRegHeart, FaHeart } from 'react-icons/fa6';
import { useAppSelector, useToggleFavorite } from '@/lib/hooks';
import { favoriteIndexSearch } from '@/utils/clientFunctions';
import LoadingContainer from '../global/LoadingContainer';
import FormContainer from '../form/FormContainer';

type ParamsType = {
  productId: string;
  className?: string;
  text?: string;
};

function StoreFavoriteButton({ productId, className, text }: ParamsType) {
  const toggleFavorite = useToggleFavorite();
  // Retrieve data from store
  const { isLoading, favorites } = useAppSelector((store) => store.favorite);
  const index = favoriteIndexSearch(favorites, productId);
  const isFavorite = index !== -1;

  return (
    <span className={className}>
      <FormContainer
        action={() =>
          toggleFavorite({
            productId,
            favoriteId: isFavorite ? favorites[index].id : undefined,
          })
        }
      >
        <button
          type='submit'
          className={`hover:cursor-pointer bg-transparent hover:bg-transparent hover:animate-bounce transition-transform shadow-none text-2xl capitalize tracking-wider font-medium ${
            text &&
            'border-2 border-primary rounded-xl hover:animate-none px-4 py-2'
          }`}
        >
          {isLoading ? (
            <LoadingContainer />
          ) : isFavorite ? (
            <div className='flex items-center gap-x-1.5'>
              <FaHeart className='text-destructive drop-shadow-sm/30 drop-shadow-popover-foreground' />
              {text && <span className='text-lg'>{text}</span>}
            </div>
          ) : (
            <div className='flex items-center gap-x-1.5'>
              <FaRegHeart className='text-popover-foreground drop-shadow-sm/70 drop-shadow-popover' />
              {text && <span className='text-lg'>{text}</span>}
            </div>
          )}
        </button>
      </FormContainer>
    </span>
  );
}
export default StoreFavoriteButton;
