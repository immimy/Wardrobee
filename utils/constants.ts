import { OrderStatus, ProductBrand, ProductCategory } from './types';

export const PRODUCT_CATEGORY: Array<ProductCategory> = [
  'clothes',
  'bag',
  'accessory',
];

export const PRODUCT_BRAND: Array<ProductBrand> = [
  'Aero Style',
  'Calista',
  'Free Spirit',
  'Legacy Trek',
  'Prestige',
  'Wander Lux',
];

export const CLOTHES_SIZE = ['XS', 'S', 'M', 'L', 'XL'];

export const BKK_LOCATION = { latitude: 13.736717, longitude: 100.523186 };

export const ORDER_STATUS: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPED'];
