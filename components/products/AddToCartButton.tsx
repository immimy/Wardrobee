'use client';

import { TbShoppingCartPlus } from 'react-icons/tb';
import { ProductWithVariants } from '@/utils/types';
import { formatCartItemData } from '@/utils/clientFunctions';
import { FormEventHandler, useTransition } from 'react';
import { useAddToCart } from '@/lib/hooks';
import { Button } from '../ui/button';
import LoadingContainer from '../global/LoadingContainer';

type ParamsType = {
  variantId: string;
  product: ProductWithVariants;
};

function AddToCartButton({ variantId, product }: ParamsType) {
  const [isPending, startTransition] = useTransition();
  const cartItemData = formatCartItemData(product);
  const addToCart = useAddToCart();

  const addToCartHandler: FormEventHandler<HTMLFormElement> = (e) => {
    startTransition(async () => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      await addToCart(formData, cartItemData);
    });
  };

  return (
    <form onSubmit={addToCartHandler}>
      <input type='hidden' name='productVariantId' defaultValue={variantId} />
      <input type='hidden' name='quantity' defaultValue={1} />
      <div className='max-w-10 ml-auto'>
        <Button
          size='icon'
          className='inset-shadow-2xs shadow-muted-foreground/50 dark:bg-muted dark:text-muted-foreground hover:cursor-pointer'
          disabled={isPending}
        >
          {isPending ? <LoadingContainer /> : <TbShoppingCartPlus />}
        </Button>
      </div>
    </form>
  );
}
export default AddToCartButton;
