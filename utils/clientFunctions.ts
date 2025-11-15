import { toast } from 'sonner';
import {
  CartItemState,
  CartItemType,
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
  const { image, name, price, variants } = product;
  const category = product.category as ProductCategory;
  const data = { image, name, category, price };
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

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching data');
  }
  return await res.json();
};
