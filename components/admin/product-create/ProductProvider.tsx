'use client';

import { createContext, useContext, useState } from 'react';
import VariantInputs from './VariantInputs';
import { ProductCategory } from '@/utils/types';

type ContextType = {
  product: InitialProductType;
  setProductState: (input: Partial<InitialProductType>) => void;
  variantComponents: Array<React.ReactElement | null>;
  addVariantComponent: () => void;
  removeVariantComponent: (index: number) => void;
  resetContext: () => void;
};
const ProductCreateContext = createContext<undefined | ContextType>(undefined);
export const useProductCreateContext = () => {
  const state = useContext(ProductCreateContext);
  if (!state)
    throw new Error(
      'useProductCreateContext must be used in ProductCreateProvider'
    );
  return state;
};

type InitialProductType = {
  key: number;
  image: string;
  category: ProductCategory | undefined;
};
const initialProductState: InitialProductType = {
  key: Date.now(),
  image: '',
  category: undefined,
};

type ParamsType = { children: React.ReactNode };
function ProductProvider({ children }: ParamsType) {
  // Product form state
  const [product, setProduct] = useState<InitialProductType>({
    ...initialProductState,
  });
  // Rendered variant components
  const [variantComponents, setVariantComponents] = useState<
    Array<React.ReactElement | null>
  >([<VariantInputs key={1} index={1} />]);

  // Product form state function
  const setProductState = (input: Partial<InitialProductType>) =>
    setProduct((state) => {
      return { ...state, ...input };
    });
  // Variant components function
  const addVariantComponent = () => {
    setVariantComponents([
      ...variantComponents,
      <VariantInputs
        key={variantComponents.length + 1}
        index={variantComponents.length + 1}
        removeBtn
      />,
    ]);
  };
  const removeVariantComponent = (index: number) => {
    const newState = variantComponents;
    newState[index] = null;
    setVariantComponents([...newState]);
  };
  // Reset context to initial state
  const resetContext = () => {
    setProduct({ ...initialProductState, key: Date.now() });
    setVariantComponents([<VariantInputs key={1} index={1} />]);
  };

  return (
    <ProductCreateContext
      value={{
        product,
        setProductState,
        variantComponents,
        addVariantComponent,
        removeVariantComponent,
        resetContext,
      }}
    >
      {children}
    </ProductCreateContext>
  );
}
export default ProductProvider;
