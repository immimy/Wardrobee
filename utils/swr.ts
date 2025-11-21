import { FetchAllProductsType } from './types';
import useSWRInfinite from 'swr/infinite';
import { toastError } from './clientFunctions';
import { useSearchParams } from 'next/navigation';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching data');
  }
  return await res.json();
};

// SWR Infinite scrolling with cursor-based pagination
export const useAllProductsSWRInfinite = (
  args: {
    initialData?: FetchAllProductsType[];
  } | void
) => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const limit = searchParams.get('limit') || '9';

  const getKey = (
    pageIndex: number,
    previousPageData: FetchAllProductsType
  ) => {
    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;
    // First page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/products?search=${search}&limit=${limit}`;
    // Add the cursor to the API endpoint
    return `/api/products?search=${search}&cursor=${previousPageData.nextCursor}&limit=${limit}`;
  };

  return useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    fallbackData: args?.initialData,
    onError: (error) => toastError(error),
  });
};
