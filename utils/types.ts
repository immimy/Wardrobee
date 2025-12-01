import { Prisma } from '@prisma/client';
import { IconType } from 'react-icons/lib';
import { Roles } from '@/types/globals';
import { createProduct, fetchAllProducts, fetchMyFavoriteIds } from './actions';

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

// START: Cart store type
export type ProductSelect = {
  id: string; // variant id
  size: string | null;
  color: string | null;
  discount: number;
  stock: number;
};
type CartItemData = {
  productId: string;
  image: string;
  name: string;
  category: ProductCategory;
  price: number;
};
export type CartItemState = { variantId: string; quantity: number };
export type CartItemType = {
  data: CartItemData;
  state: CartItemState;
  options: ProductSelect[];
};
type CartItemObject = {
  [cartItemId: string]: CartItemType & {
    _history?: CartItemState;
    isUpdating?: boolean;
  };
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
  cartItems: CartItemObject;
  totalQuantity: number;
  subtotal: number;
  deletedCartItems: { [cartItemId: string]: DeletedCartItemType };
};
type CartModalOpen = {
  cartOpen: boolean;
  removeItemOpen: boolean;
  removeItemId: string;
};
type CartHistory = {
  _removedCart: CartItemObject;
  _removedCartItem: CartItemObject;
};

export type CartStateType = { isLoading: boolean } & CartType &
  CartModalOpen &
  CartHistory;
// END: Cart store type

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
    variants: {
      select: {
        id: true,
        size: true,
        color: true,
        discount: true,
        stock: true,
      },
    },
  },
});
export type ProductWithVariants = Prisma.ProductGetPayload<
  typeof productWithVariants
>;
// END: Prisma database type

export type FetchAllProductsType = Awaited<ReturnType<typeof fetchAllProducts>>;
export type AllProductsType = FetchAllProductsType['data'];

export type CreateProductType = Awaited<ReturnType<typeof createProduct>>;

export type FetchMyFavoriteIdsType = Awaited<
  ReturnType<typeof fetchMyFavoriteIds>
>;
