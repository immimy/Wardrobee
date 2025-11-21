'use client';
import { ProductCategory, ProductWithVariants } from '@/utils/types';
import { createContext, useContext, useState } from 'react';

// Context
type ContextType = {
  productForm: ProductFormType;
  setImage: (image: string) => void;
  setProductData: (
    field: keyof ProductFormType,
    value: string | boolean
  ) => void;
  product: ProductWithVariants;
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

// Form state type
type ProductFormType = {
  image: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  featured: boolean;
  category: ProductCategory;
};

type ParamsType = {
  children: React.ReactNode;
  product: ProductWithVariants;
};
function ProductProvider({ children, product }: ParamsType) {
  // Update product form state
  const [productForm, setProductForm] = useState<ProductFormType>({
    image: product.image,
    name: product.name,
    brand: product.brand,
    description: product.description || '',
    price: String(product.price),
    featured: product.featured,
    category: product.category as ProductCategory,
  });
  // Image
  const setImage = (image: string) => {
    setProductForm((state) => {
      if (!image) return { ...state, image: product.image };
      return { ...state, image };
    });
  };
  // Product data
  const setProductData = (
    field: keyof ProductFormType,
    value: string | boolean
  ) => {
    setProductForm((state) => ({ ...state, [field]: value }));
  };

  return (
    <ProductUpdateContext
      value={{
        productForm,
        setImage,
        setProductData,
        product,
      }}
    >
      {children}
    </ProductUpdateContext>
  );
}
export default ProductProvider;
