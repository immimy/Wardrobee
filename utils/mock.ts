import fs from 'fs';
import path from 'path';
import mockData from '@/mockData';
import { uploadImage } from './supabase';

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function uploadMockImage() {
  const image = getMockProduct('image');
  if (typeof image === 'string')
    throw new Error('Failed to upload mock image.');
  // Read image file as a Buffer
  const filePath = path.resolve(
    './public/products',
    `${image.name}.${image.extension}`
  );
  const fileContent = fs.readFileSync(filePath);
  if (!fileContent) throw new Error('Failed to upload mock image.');
  // Upload image to the database
  return uploadImage(fileContent, image.name);
}

export const getRandomData = function <T>(input: T[]): T {
  return input[randomNumber(0, input.length - 1)];
};
export function getMockProduct(field: 'image' | 'name' | 'description') {
  switch (field) {
    case 'image':
      return getRandomData(mockData.productImages);
    case 'name':
      return getRandomData(mockData.products.name);
    case 'description':
      return getRandomData(mockData.products.description);

    default:
      throw new Error(`\`${field}\` is not supported in mock data.`);
  }
}
export function getMockAddress(field: 'receiver' | 'address' | 'phoneNumber') {
  switch (field) {
    case 'receiver':
      return getRandomData(mockData.addresses.receiver);
    case 'address':
      return getRandomData(mockData.addresses.address);
    case 'phoneNumber':
      return getRandomData(mockData.addresses.phoneNumber);

    default:
      throw new Error(`\`${field}\` is not supported in mock data.`);
  }
}
