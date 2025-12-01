'use client';

import { FaRegHeart, FaHeart } from 'react-icons/fa6';
import { useToggleFavorite } from '@/lib/hooks';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import LoadingContainer from '../global/LoadingContainer';

type ParamsType = {
  productId: string;
  favoriteId?: string;
  className?: string;
};

function StaticFavoriteButton({
  productId,
  favoriteId,
  className,
}: ParamsType) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = Boolean(favoriteId);

  return (
    <span className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(() =>
            toggleFavorite({ productId, favoriteId, pathname })
          );
        }}
      >
        <button
          type='submit'
          className='hover:cursor-pointer bg-transparent hover:bg-transparent hover:animate-bounce transition-transform shadow-none text-2xl capitalize tracking-wider font-medium'
        >
          {isPending ? (
            <LoadingContainer />
          ) : isFavorite ? (
            <FaHeart className='text-destructive drop-shadow-sm/30 drop-shadow-popover-foreground' />
          ) : (
            <FaRegHeart className='text-popover-foreground drop-shadow-sm/70 drop-shadow-popover' />
          )}
        </button>
      </form>
    </span>
  );
}
export default StaticFavoriteButton;
