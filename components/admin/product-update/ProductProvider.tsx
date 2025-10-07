'use client';
import { ProductCategory, ProductWithVariants } from '@/utils/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

// Context
type ContextType = {
  product: ProductWithVariants;
  image: ProductImageType;
  setImageState: (input: Partial<ProductImageType>) => void;
  category: ProductCategory;
  setCategory: Dispatch<SetStateAction<ProductCategory>>;
};
const ProductUpdateContext = createContext<undefined | ContextType>(undefined);
export const useProductUpdateContext = () => {
  const state = useContext(ProductUpdateContext);
  if (!state)
    throw new Error(
      'useProductUpdateContext must be used in ProductUpdateProvider'
    );
  return state;
};

// State type
type ProductImageType = {
  url: string;
  isUpdating: boolean;
};

type ParamsType = {
  children: React.ReactNode;
  product: ProductWithVariants;
};
function ProductProvider({ children, product }: ParamsType) {
  // Product image state
  const [image, setImage] = useState<ProductImageType>({
    url: product.image,
    isUpdating: false,
  });
  // Product category state
  const [category, setCategory] = useState<ProductCategory>(
    product.category as ProductCategory
  );
  // Product image function
  const setImageState = (input: Partial<ProductImageType>) =>
    setImage((state) => {
      return { ...state, ...input };
    });

  return (
    <ProductUpdateContext
      value={{
        product,
        image,
        setImageState,
        category,
        setCategory,
      }}
    >
      {children}
    </ProductUpdateContext>
  );
}
export default ProductProvider;
