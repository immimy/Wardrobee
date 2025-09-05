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
import { useCartContext } from '../providers/CartProvider';
import { useOptimisticCartContext } from '../navbar/CartButton';
import {  useTransition } from 'react';


function RemoveItemModal() {
  const [isCancelPending, startTransition] = useTransition();
  const {
    cartState: { removeItemOpen, removeItemId },
  } = useCartContext();
  const { isPending,optimisticState, removeCartItemAction ,cancelRemoveCartItemAction} = useOptimisticCartContext();

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
            disabled={isCancelPending}
            onClick={() => {
              startTransition(() => {
                const { variantId, quantity } =
                  optimisticState.cartItems[removeItemId].state;

                const formData = new FormData();
                formData.set('id', removeItemId);
                formData.set('productVariantId', variantId);
                formData.set('quantity', String(quantity));

                cancelRemoveCartItemAction(formData);
              });
            }}
          >
            {isCancelPending ? <LoadingContainer /> : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => removeCartItemAction(removeItemId)}
          >
            {isPending ? <LoadingContainer /> : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default RemoveItemModal;
