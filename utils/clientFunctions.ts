import { toast } from 'sonner';
import {
  CartItemState,
  CartItemType,
  FetchMyFavoriteIdsType,
  FormState,
  ProductCategory,
  ProductWithVariants,
} from './types';

export const renderError = async (error: unknown): Promise<FormState> => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
    type: 'error',
  };
};

export const toastError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An error occurred';
  toast.error(message);
};

export function validateAvatar(file: unknown) {
  const maxUploadSize = 1024 * 1024 * 0.5; //0.5MB
  const maxUploadSizeText = '0.5MB';
  const acceptedFileTypes = 'image/';
  if (!file || !(file instanceof File)) {
    throw new Error('Please provide the file.');
  }
  if (!file.type.startsWith(acceptedFileTypes)) {
    throw new Error('File must be an image.');
  }
  if (file.size > maxUploadSize) {
    throw new Error(`File size must be less than ${maxUploadSizeText}.`);
  }
  return file as File;
}

export const mapDisplay = (isShown: boolean) => {
  const checkbox = document.getElementById('map-display') as HTMLInputElement;
  checkbox.checked = isShown;
};

export const setAddress = (address: string) => {
  const addressInput = document.getElementById('address') as HTMLInputElement;
  addressInput.value = address;
};

export const isObjectEmpty = (obj: object): boolean => {
  return Object.keys(obj).length < 1;
};

export const generateNumberList = (length: number) => {
  return Array.from({ length }, (_, i) => i + 1);
};

export const formatCartItemData = (
  product: ProductWithVariants
): Omit<CartItemType, 'state'> => {
  const { image, name, price, variants, id } = product;
  const category = product.category as ProductCategory;
  const data = { productId: id, image, name, category, price };
  return { data, options: variants };
};

export const isHistoryEqualToState = (
  obj1: CartItemState,
  obj2: CartItemState
) => {
  const isVariantIdEqual = obj1.variantId === obj2.variantId;
  const isQuantityEqual = obj1.quantity === obj2.quantity;
  return isVariantIdEqual && isQuantityEqual;
};

const isNumber = (input: any) => typeof input === 'number';
const isString = (input: any) => typeof input === 'string';
export const coerceFormValue = (input: string | number | undefined) => {
  return isNumber(input)
    ? String(input)
    : isString(input)
    ? input.toLowerCase()
    : input;
};

export const isDarkTheme = (theme: string | undefined) => theme === 'dark';

export const favoriteIndexSearch = (
  arr: FetchMyFavoriteIdsType,
  target: string // productId
): number => binarySearch(arr, 0, arr.length - 1, target, 'productId');

// Array input must be sorted in ascending order.
function binarySearch(
  arr: any[],
  low: number,
  high: number,
  x: any,
  field?: string
): number {
  if (high >= low) {
    const mid = low + Math.floor((high - low) / 2);
    const ref = field ? arr[mid][field] : arr[mid];
    // If the target is present at the middle
    if (ref === x) return mid;
    // If the target is smaller than mid, then
    // it can only be present in left subarray
    if (ref > x) return binarySearch(arr, low, mid - 1, x, field);
    // Else the target can only be present
    // in right subarray
    return binarySearch(arr, mid + 1, high, x, field);
  }
  // Reach here when target is not present in array
  return -1;
}

export function removeItemFromArray<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function sortByProductId<T extends { productId: string }>(
  arr: T[]
): T[] {
  // Sort string in ascending order
  return arr.sort((a, b) => {
    if (a.productId < b.productId) return -1; // a before b
    if (a.productId > b.productId) return 1; // a after b
    return 0; // a = b
  });
}
