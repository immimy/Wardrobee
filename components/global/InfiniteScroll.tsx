'use client';

import { useEffect } from 'react';
import LoadingContainer from './LoadingContainer';
import ProductCard from '@/components/products/ProductCard';
import AdminProductCard from '@/components/admin/products/ProductCard';
import { FetchAllProductsType } from '@/utils/types';
import { useAllProductsSWRInfinite } from '@/utils/swr';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { FaTrashCan } from 'react-icons/fa6';

type ParamsType = {
  products: FetchAllProductsType;
  isAdmin?: boolean;
  isDeleteMode?: boolean;
  toggleDeleteMode?: () => void;
};

function InfiniteScroll({
  products,
  isAdmin,
  isDeleteMode,
  toggleDeleteMode,
}: ParamsType) {
  const pathname = usePathname();

  // SWR Infinite scrolling with cursor-based pagination
  const { data, setSize, isLoading } = useAllProductsSWRInfinite({
    initialData: [products],
    isAdmin,
  });
  const isReachingEnd = data && data[data.length - 1].nextCursor === null;

  // Attach observer every time we mount the component
  useEffect(() => {
    const target = document.getElementById('loading-more')!;
    // Intersection observer
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          // Fetching more data
          setSize((size) => size + 1);
        }
      },
      { rootMargin: '50px' }
    );
    observer.observe(target);
    // Cleanup function when the component is unmounted
    return () => observer.unobserve(target);
  }, [setSize]);

  if (!data) return null;

  // Calculate total products
  const totalProducts = data.reduce(
    (acc, products) => acc + products.data.length,
    0
  );

  return (
    <>
      <div
        className={`text-end capitalize font-medium tracking-wider bg-background ${
          isAdmin
            ? 'pb-4 md:my-auto md:bg-transparent top-30 md:top-18 md:w-fit md:ml-auto'
            : 'py-4 top-15'
        } sticky z-50`}
        // className={`pb-4 md:pt-4 text-end capitalize font-medium tracking-wider bg-background ${
        //   isAdmin && 'md:bg-transparent'
        // } sticky top-30 md:top-15 md:w-fit md:ml-auto z-50`}
      >
        {/* Delete mode */}
        {/* (OPTIONAL) ADMIN ONLY */}
        {pathname === '/admin/products' && (
          <Button
            type='button'
            variant='secondary'
            className={`uppercase tracking-wider font-semibold hover:cursor-pointer ${
              isDeleteMode && 'drop-shadow-md drop-shadow-destructive'
            }`}
            onClick={toggleDeleteMode}
          >
            <span>
              <FaTrashCan />
            </span>
            delete mode
          </Button>
        )}
        {/* Total products */}
        <span className='ml-6'>
          {data.length} pages of {totalProducts} products
        </span>
      </div>
      {/* Product cards */}
      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-[98%] mx-auto'>
        {data.map((products: FetchAllProductsType) => {
          return products.data.map((product) => {
            if (isAdmin)
              return <AdminProductCard key={product.id} product={product} />;
            return <ProductCard key={product.id} product={product} />;
          });
        })}
      </div>
      {/* Loading edge */}
      <div
        id='loading-more'
        className='py-16 flex justify-center items-center bg-background text-foreground uppercase'
        style={{
          visibility: isLoading || isReachingEnd ? 'visible' : 'hidden',
        }}
      >
        {isLoading ? <LoadingContainer /> : isReachingEnd && 'No more products'}
      </div>
    </>
  );
}
export default InfiniteScroll;
