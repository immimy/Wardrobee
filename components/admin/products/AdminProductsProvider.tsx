'use client';

import { FetchAllProductsType } from '@/utils/types';
import { createContext, useContext, useState } from 'react';

type ContextType = {
  search: string;
  products: FetchAllProductsType;
  isDeleteMode: boolean;
  selectedProducts: string[];
  toggleDeleteMode: () => void;
  cancelDeleteMode: () => void;
  toggleSelectProduct: (productId: string) => void;
};
const AdminProductsProviderContext = createContext<undefined | ContextType>(
  undefined
);
export const useAdminProductsProviderContext = () => {
  const state = useContext(AdminProductsProviderContext);
  if (!state)
    throw new Error(
      'useAdminProductsProviderContext must be used in AdminProductsProviderProvider'
    );
  return state;
};

type ParamsType = {
  children: React.ReactNode;
  search: string;
  products: FetchAllProductsType;
};

function AdminProductsProvider({ children, search, products }: ParamsType) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleDeleteMode = () =>
    setIsDeleteMode((state) => {
      if (state) {
        // Clear all selected products
        setSelectedProducts([]);
      }
      return !state;
    });
  const cancelDeleteMode = () => {
    // Exit delete mode
    setIsDeleteMode(false);
    // Clear all selected products
    setSelectedProducts([]);
  };
  const toggleSelectProduct = (productId: string) =>
    setSelectedProducts((state) => {
      const index = state.indexOf(productId);
      if (index === -1) {
        // Product is not selected.
        return [...state, productId];
      } else {
        // Product is selected.
        return [...state.slice(0, index), ...state.slice(index + 1)];
      }
    });

  return (
    <AdminProductsProviderContext
      value={{
        search,
        products,
        isDeleteMode,
        selectedProducts,
        toggleDeleteMode,
        cancelDeleteMode,
        toggleSelectProduct,
      }}
    >
      {children}
    </AdminProductsProviderContext>
  );
}
export default AdminProductsProvider;
