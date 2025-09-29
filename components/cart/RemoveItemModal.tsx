'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import LoadingContainer from '../global/LoadingContainer';
import { useTransition } from 'react';
import { useAppDispatch, useAppSelector, useRemoveCartItem } from '@/lib/hooks';
import { setCartState } from '@/lib/features/cart/cartSlice';

function RemoveItemModal() {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const removeCartItem = useRemoveCartItem();
  const { removeItemOpen, removeItemId } = useAppSelector(
    (store) => store.cart
  );

  return (
    <AlertDialog open={removeItemOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to remove this item from the cart?
          </AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              dispatch(
                // Close remove cart item modal
                setCartState({ removeItemOpen: false, removeItemId: '' })
              );
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                removeCartItem(removeItemId);
                // Close remove cart item modal
                dispatch(
                  setCartState({
                    removeItemOpen: false,
                    removeItemId: '',
                  })
                );
              })
            }
          >
            {isPending ? <LoadingContainer /> : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default RemoveItemModal;
