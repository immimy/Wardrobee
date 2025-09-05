import { CartItemType, FormState } from './types';

export const renderError = async (error: unknown): Promise<FormState> => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
    type: 'error',
  };
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

export const sumSubtotalAndQuantity = (cartItems: {
  [cartItemId: string]: CartItemType;
}): {
  subtotal: number;
  totalQuantity: number;
} => {
  return Object.values(cartItems).reduce(
    (acc, cartItem) => {
      const { data, state, options } = cartItem;
      const price = data.price;
      const { variantId, quantity } = state;
      const { discount } = options.find((option) => option.id === variantId)!;
      const sellingPrice = price * (1 - discount / 100);
      return {
        subtotal: acc.subtotal + sellingPrice * quantity,
        totalQuantity: acc.totalQuantity + quantity,
      };
    },
    { subtotal: 0, totalQuantity: 0 }
  );
};

export const generateNumberList = (length: number) => {
  return Array.from({ length }, (_, i) => i + 1);
};
