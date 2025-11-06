'use client';

import useSWRInfinite from 'swr/infinite';
import { useCallback, useEffect } from 'react';
import LoadingContainer from './LoadingContainer';
import ProductCard from '@/components/products/ProductCard';
import AdminProductCard from '@/components/admin/products/ProductCard';
import { FetchAllProductsType } from '@/utils/types';

const fetcher = (url: string) => fetch(url).then((resp) => resp.json());

type ParamsType = {
  search: string;
  limit: string;
  products: FetchAllProductsType;
  isAdmin?: boolean;
};

function InfiniteScroll({ search, limit, products, isAdmin }: ParamsType) {
  const getKey = useCallback(
    (pageIndex: number, previousPageData: FetchAllProductsType) => {
      // Reached the end
      if (previousPageData && !previousPageData.nextCursor) return null;
      // First page, we don't have `previousPageData`
      if (pageIndex === 0)
        return `/api/products?search=${search}&limit=${limit}`;
      // Add the cursor to the API endpoint
      return `/api/products?search=${search}&cursor=${previousPageData.nextCursor}&limit=${limit}`;
    },
    [search, limit]
  );
  // SWR Infinite scrolling with cursor-based pagination
  const { data, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    fallbackData: [products],
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
      {/* Total products */}
      <div className='py-4 text-end capitalize font-medium tracking-wider bg-background sticky top-15 z-1'>
        {data.length} pages of {totalProducts} products
      </div>
      {/* Product cards */}
      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
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
