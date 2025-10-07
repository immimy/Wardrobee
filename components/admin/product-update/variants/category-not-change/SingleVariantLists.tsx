'use client';

import SingleVariantForm from './SingleVariantForm';
import { useState } from 'react';
import SingleVariantData from './SingleVariantData';
import { createContext, useContext, Dispatch, SetStateAction } from 'react';

type ContextType = {
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
} & ParamsType;
const SingleVariantContext = createContext<undefined | ContextType>(undefined);
export const useSingleVariantContext = () => {
  const state = useContext(SingleVariantContext);
  if (!state)
    throw new Error(
      'useSingleVariantContext must be used in SingleVariantProvider'
    );
  return state;
};

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
    <SingleVariantContext
      key={id}
      value={{ id, size, color, stock, discount, setIsUpdate }}
    >
      {isUpdate ? <SingleVariantForm /> : <SingleVariantData />}
    </SingleVariantContext>
  );
}
export default SingleVariantList;
