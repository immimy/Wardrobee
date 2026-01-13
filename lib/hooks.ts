import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';
import { formatCartItemData, toastError } from '@/utils/clientFunctions';
import {
  addCartItem,
  cancelUpdateCartItem,
  clearCart,
  removeCartItem,
  rollbackAddCartItem,
  rollbackClearCart,
  rollbackRemoveCartItem,
  rollbackUpdateCartItem,
  setCartItem,
  updateCartItem,
} from './features/cart/cartSlice';
import {
  addToCart,
  clearCart as clearCartAction,
  deleteCartItem,
  toggleFavorite,
  updateCartItem as updateCartItemAction,
} from '@/utils/actions';
import { useClerk } from '@clerk/nextjs';
import { CartItemState } from '@/utils/types';
import {
  addFavorite,
  removeFavorite,
  rollbackAddFavorite,
  rollbackRemoveFavorite,
} from './features/user/favoriteSlice';
import { toast } from 'sonner';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useAddToCart = () => {
  const username = useAppSelector((store) => store.user.username);
  const dispatch = useAppDispatch();
  const { openSignIn } = useClerk();
  return async (
    formData: FormData,
    cartItemData: ReturnType<typeof formatCartItemData>
  ) => {
    // Check if user logged in
    if (!username) {
      openSignIn();
      return toastError(
        new Error('Please log in before adding an item to the cart.')
      );
    }
    // Optimistic response
    const variantId = formData.get('productVariantId') as string;
    const quantity = Number(formData.get('quantity'));
    dispatch(addCartItem({ ...cartItemData, state: { variantId, quantity } }));
    try {
      // Update user's cart in the database
      const { returnData: cartItem } = await addToCart(formData);
      // Persist success result
      dispatch(addCartItem({ ...cartItem, isAdded: true }));
    } catch (error) {
      // Fail due to the user not logging in
      if (error instanceof Error && error.message.startsWith('Please log in')) {
        openSignIn();
      } else {
        // Rollback in case of failure
        dispatch(rollbackAddCartItem({ variantId }));
      }
      // Alert an error
      toastError(error);
    }
  };
};

export const useSetCartItem = () => {
  const dispatch = useAppDispatch();
  return (cartItemId: string, state: CartItemState) => {
    dispatch(setCartItem({ cartItemId, state }));
  };
};

export const useCancelUpdateCartItem = () => {
  const dispatch = useAppDispatch();
  return (cartItemId: string) => {
    dispatch(cancelUpdateCartItem({ cartItemId }));
  };
};

export const useUpdateCartItem = () => {
  const dispatch = useAppDispatch();
  return async (formData: FormData) => {
    // Optimistic response
    const cartItemId = formData.get('id') as string;
    const variantId = formData.get('productVariantId') as string;
    const quantity = Number(formData.get('quantity'));
    dispatch(
      updateCartItem({
        cartItemId,
        state: { variantId, quantity },
        isUpdated: false,
      })
    );
    try {
      // Update cart item in the database
      const { returnData: cartItem } = await updateCartItemAction(formData);
      // Persist success result
      dispatch(
        updateCartItem({
          cartItemId,
          state: cartItem.state,
          isUpdated: true,
        })
      );
    } catch (error) {
      // Rollback in case of failure
      dispatch(
        rollbackUpdateCartItem({ cartItemId, state: { variantId, quantity } })
      );
      // Alert an error
      toastError(error);
    }
  };
};

export const useRemoveCartItem = () => {
  const dispatch = useAppDispatch();
  return async (cartItemId: string) => {
    // Optimistic response
    dispatch(removeCartItem({ cartItemId, isRemoved: false }));
    try {
      // Remove cart item in the database
      await deleteCartItem(cartItemId);
      // Persist success result
      dispatch(removeCartItem({ cartItemId, isRemoved: true }));
    } catch (error) {
      // Rollback in case of failure
      dispatch(rollbackRemoveCartItem({ cartItemId }));
      // Alert an error
      toastError(error);
    }
  };
};

export const useClearCart = () => {
  const dispatch = useAppDispatch();
  return async () => {
    // Optimistic response
    dispatch(clearCart({ isCleared: false }));
    try {
      // Clear cart in the database
      await clearCartAction();
      // Persist success result
      dispatch(clearCart({ isCleared: true }));
    } catch {
      // Rollback in case of failure
      dispatch(rollbackClearCart());
      // Alert an error
      toast.error('Failed to clear cart');
    }
  };
};

export const useToggleFavorite = () => {
  const dispatch = useAppDispatch();
  return async ({
    productId,
    favoriteId,
    pathname,
  }: {
    productId: string;
    favoriteId?: string;
    pathname?: string;
  }) => {
    try {
      if (!favoriteId) {
        // Optimistic response
        dispatch(addFavorite({ productId }));
        // Toggle favorite in the database
        const resp = await toggleFavorite({ favoriteId, productId, pathname });
        // Persist success result
        dispatch(addFavorite({ productId, favoriteId: resp?.id }));
      } else {
        // Optimistic response
        dispatch(removeFavorite({ productId }));
        // Toggle favorite in the database
        await toggleFavorite({ favoriteId, productId, pathname });
      }
    } catch {
      if (!favoriteId) {
        // Rollback in case of failure
        dispatch(rollbackAddFavorite({ productId }));
      } else {
        // Rollback in case of failure
        dispatch(rollbackRemoveFavorite({ productId, favoriteId }));
      }
      toast.error('Failed to toggle favorite');
    }
  };
};
