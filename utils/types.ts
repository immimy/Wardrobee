import { Prisma } from '@/lib/generated/prisma';
import { IconType } from 'react-icons/lib';
import { Roles } from '@/types/globals';
import { useUser } from '@clerk/nextjs';

export type AllRoles = 'user' | Roles;

export type UserType = ReturnType<typeof useUser>['user'];

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
  formState: any,
  formData: FormData
) => Promise<FormState | void>;

export type ProductCategory = 'clothes' | 'bag' | 'accessory';
export type ProductBrand =
  | 'Aero Style'
  | 'Free Spirit'
  | 'Legacy Trek'
  | 'Prestige'
  | 'Calista'
  | 'Wander Lux';

// START: Cart context
type ProductSelect = {
  id: string; // variant id
  size: string | null;
  color: string | null;
  discount: number;
  stock: number;
};
export type CartItemType = {
  data: {
    image: string;
    name: string;
    category: ProductCategory;
    price: number;
  };
  state: { variantId: string; quantity: number };
  options: ProductSelect[];
};
type DeletedCartItemType = {
  variantId: string;
  image: string;
  name: string;
  category: ProductCategory;
  price: number;
  size: string | null;
  color: string | null;
  discount: number;
};
export type CartType = {
  cartItems: { [cartItemId: string]: CartItemType };
  totalQuantity: number;
  subtotal: number;
  deletedCartItems: { [cartItemId: string]: DeletedCartItemType };
};
type CartModalOpen = {
  cartOpen: boolean;
  removeItemOpen: boolean;
  removeItemId: string;
};

export type CartStateType = CartType & CartModalOpen;
// END: Cart context

// Optimistic cart state
export type OptimisticAction = {
  cartItemId: string;
  variantId: string;
  quantity: number;
  isReCalc: boolean;
};

// Single product context
export type CurrentProductVariant = {
  discount: number;
  stock: number | undefined;
  stockList: number[] | undefined;
  quantityList: number[];
};

// Map
export type Location = { lat: number; lng: number };

// START: Prisma database custom type
const productWithVariants = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    variants: true,
  },
});
export type ProductWithVariants = Prisma.ProductGetPayload<
  typeof productWithVariants
>;
// END: Prisma database type
