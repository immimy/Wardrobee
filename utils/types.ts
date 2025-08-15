import { Prisma } from '@/lib/generated/prisma';
import { IconType } from 'react-icons/lib';
import { Roles } from '@/types/globals';

export type AllRoles = 'user' | Roles;

export type NavLink = {
  url: string;
  title: string;
  icon?: IconType;
};

export type FormState = {
  message: string;
  type: 'default' | 'success' | 'error';
};

export type ActionFunction = (
  prevState: any,
  formData: FormData
) => Promise<FormState>;

export type ProductCategory = 'clothes' | 'bag' | 'accessory';
export type ProductBrand =
  | 'Aero Style'
  | 'Free Spirit'
  | 'Legacy Trek'
  | 'Prestige'
  | 'Calista'
  | 'Wander Lux';

const productWithVariants = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    variants: true,
  },
});
export type ProductWithVariants = Prisma.ProductGetPayload<
  typeof productWithVariants
>;

export type CartItem = {
  variantId: string | null;
  price: number;
  discount: number;
  isOnSale: boolean;
  stock?: number;
};

export type Location = { lat: number; lng: number };
