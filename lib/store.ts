import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/lib/features/user/userSlice';
import cartReducer from '@/lib/features/cart/cartSlice';
import favoriteReducer from '@/lib/features/user/favoriteSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      cart: cartReducer,
      favorite: favoriteReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
