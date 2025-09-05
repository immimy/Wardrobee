'use client';

import SingleVariantForm from './SingleVariantForm';
import { useState } from 'react';
import SingleVariantData from './SingleVariantData';
import { createContext, useContext, Dispatch, SetStateAction } from 'react';

type ContextType = {
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
} & ParamsType;
const SingleVariantContext = createContext<undefined | ContextType>(undefined);
export const useSingleVariantContext = () => useContext(SingleVariantContext);

type ParamsType = {
  id: string;
  size: string | undefined;
  color: string | undefined;
  stock: number;
  discount: number;
};

function SingleVariantList({ id, size, color, stock, discount }: ParamsType) {
  const [isUpdate, setIsUpdate] = useState(false);
  return (
    <SingleVariantContext.Provider
      key={id}
      value={{ id, size, color, stock, discount, setIsUpdate }}
    >
      {isUpdate ? <SingleVariantForm /> : <SingleVariantData />}
    </SingleVariantContext.Provider>
  );
}
export default SingleVariantList;
