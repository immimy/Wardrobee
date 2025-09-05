'use client';

import { generateNumberList } from '@/utils/clientFunctions';
import {
  CurrentProductVariant,
  ProductCategory,
  ProductWithVariants,
} from '@/utils/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type ContextType = {
  product: ProductWithVariants;
  cartItem: CurrentProductVariant;
  setCartItem: Dispatch<SetStateAction<CurrentProductVariant>>;
};
export const ProductContext = createContext<undefined | ContextType>(undefined);
export const useProductContext = () => {
  const state = useContext(ProductContext);
  if (!state)
    throw new Error('useProductContext must be used in ProductProvider');
  return state;
};

type ParamsType = { children: React.ReactNode; product: ProductWithVariants };
function ProductProvider({ children, product }: ParamsType) {
  // Init cart item state
  // 1. Clothes & Bag product
  let initialState: CurrentProductVariant = {
    discount: 0,
    stock: undefined,
    stockList: undefined,
    quantityList: generateNumberList(10),
  };
  const category = product.category as ProductCategory;
  const { stock, discount } = product.variants[0];
  // 2. Accessory product
  if (category === 'accessory') {
    if (stock < 10) {
      initialState.stockList = generateNumberList(stock);
    }
    initialState.stock = stock;
    initialState.discount = discount;
  }
  // Cart item state
  const [cartItem, setCartItem] = useState<CurrentProductVariant>(initialState);
  return (
    <ProductContext value={{ product, cartItem, setCartItem }}>
      {children}
    </ProductContext>
  );
}
export default ProductProvider;
