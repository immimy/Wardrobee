import { CreateProductType, FetchAllProductsType } from './types';
import useSWRInfinite, { unstable_serialize } from 'swr/infinite';
import { toastError } from './clientFunctions';
import { useSearchParams } from 'next/navigation';
import { useSWRConfig } from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching data');
  }
  return await res.json();
};

//////// START: SWR Infinite - All products cache ////////
// All base urls (public & admin)
const getAllBaseUrlSWRInfinite = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const limit = searchParams.get('limit') || '9';
  return {
    // Public all products page
    public: `/api/products?search=${search}&limit=${limit}`,
    // Admin all products page
    admin: `/api/products?search=${search}&limit=${limit}&admin=true`,
  };
};

const generateBaseUrl = ({ isAdmin }: { isAdmin: boolean }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const limit = searchParams.get('limit') || '9';
  if (isAdmin) {
    return `/api/products?search=${search}&limit=${limit}&admin=true`;
  } else {
    return `/api/products?search=${search}&limit=${limit}`;
  }
};
const generateKeySWRInfinite =
  (baseUrl: string) =>
  (pageIndex: number, previousPageData: FetchAllProductsType) => {
    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;
    // First page, we don't have `previousPageData`
    if (pageIndex === 0) return `${baseUrl}`;
    // Add the cursor to the API endpoint
    return `${baseUrl}&cursor=${previousPageData.nextCursor}`;
  };

// SWR Infinite scrolling with cursor-based pagination
export const useAllProductsSWRInfinite = (
  args: {
    initialData?: FetchAllProductsType[];
    isAdmin?: boolean;
  } | void
) => {
  const baseUrl = generateBaseUrl({ isAdmin: args?.isAdmin || false });
  const getKey = generateKeySWRInfinite(baseUrl);
  return useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    fallbackData: args?.initialData,
    onError: (error) => toastError(error),
  });
};

const customMutate = () => {
  const { mutate } = useSWRConfig();
  return (baseUrl: string, newData?: CreateProductType) => {
    mutate(
      unstable_serialize(generateKeySWRInfinite(baseUrl)),
      newData
        ? async (data: any) => {
            if (data && data.length) {
              const firstPage = data[0];
              firstPage.data.unshift(newData);
              return [firstPage, ...data.slice(1)];
            }
            return data;
          }
        : undefined,
      { revalidate: false }
    );
  };
};
// SWR cache mutation and revalidation
export const useAllProductsMutate = () => {
  const baseUrls = getAllBaseUrlSWRInfinite();
  const mutate = customMutate();
  return (newData?: CreateProductType) => {
    if (!newData) {
      mutate(baseUrls.public);
      mutate(baseUrls.admin);
    } else {
      mutate(baseUrls.public, newData);
      mutate(baseUrls.admin, newData);
    }
  };
};
//////// END: SWR Infinite - All products cache ////////