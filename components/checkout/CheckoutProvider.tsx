'use client';

import {
  FetchAllAddressesType,
  ShippingAddressType,
} from '@/utils/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import DefaultAddressAlert from './DefaultAddressAlert';

type ContextType = {
  dbAddresses: FetchAllAddressesType;
  shippingAddress: ShippingAddressState;
  setShippingAddress: Dispatch<SetStateAction<ShippingAddressState>>;
};
const CheckoutProviderContext = createContext<undefined | ContextType>(
  undefined
);
export const useCheckoutProviderContext = () => {
  const state = useContext(CheckoutProviderContext);
  if (!state)
    throw new Error(
      'useCheckoutProviderContext must be used in CheckoutProviderProvider'
    );
  return state;
};

export type ShippingAddressState = ShippingAddressType | undefined;

type ParamsType = {
  children: React.ReactNode;
  addresses: FetchAllAddressesType;
  defaultAddress: ShippingAddressState;
};
function CheckoutProvider({
  children,
  addresses,
  defaultAddress,
}: ParamsType) {
  // Selected shipping address
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressState>(defaultAddress);
  return (
    <CheckoutProviderContext
      value={{
        dbAddresses: addresses,
        shippingAddress,
        setShippingAddress,
      }}
    >
      {/* Default Address Alert */}
      {/* Asking user if they want to set this as default address */}
      <DefaultAddressAlert />
      {children}
    </CheckoutProviderContext>
  );
}
export default CheckoutProvider;
