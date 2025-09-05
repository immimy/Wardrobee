'use client';

import ProductRadio from './ProductRadio';
import { FormEventHandler, useTransition } from 'react';
import { ProductCategory } from '@/utils/types';
import { priceFormatter } from '@/utils/format';
import { Badge } from '../ui/badge';
import { generateNumberList } from '@/utils/clientFunctions';
import { useProductContext } from './ProductProvider';
import QuantitySelect from './QuantitySelect';
import { Button } from '../ui/button';
import LoadingContainer from '../global/LoadingContainer';
import { addToCart } from '@/utils/actions';
import { useClerk } from '@clerk/nextjs';
import { useCartContext } from '../providers/CartProvider';
import { toast } from 'sonner';

function AddToCartContainer() {
  const [isPending, startTransition] = useTransition();
  const { openSignIn } = useClerk();
  const { cartState, setCartState } = useCartContext();

  const {
    product,
    cartItem: { discount },
  } = useProductContext();
  const { category, price, variants, totalStock } = product;
  const sellingPrice = price * (1 - discount / 100);

  const addToCartHandler: FormEventHandler = (e) => {
    startTransition(async () => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      try {
        // Add cart item to database
        const cart = await addToCart(formData);
        const { cartItems, subtotal, totalQuantity } = cart;
        // Update cart state
        setCartState({ ...cartState, cartItems, subtotal, totalQuantity });
        toast.success('Added product to cart');
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.startsWith('Please log in')
        ) {
          openSignIn();
        }
        const message =
          error instanceof Error ? error.message : 'An error occurred';
        toast.error(message);
      }
    });
  };

  return (
    <form onSubmit={addToCartHandler}>
      <div className='flex flex-col gap-y-4 md:max-w-md'>
        {/* PRICE */}
        <h6 className='capitalize tracking-wide font-semibold text-lg flex flex-wrap items-center gap-2'>
          price:
          <span className='ml-2 font-medium'>
            {priceFormatter(sellingPrice)}
          </span>
          {Boolean(discount) && (
            <>
              <Badge asChild variant='destructive' className='rounded-xl'>
                <span>-{discount}%</span>
              </Badge>
              <span className='font-normal line-through text-muted-foreground text-sm'>
                {priceFormatter(price)}
              </span>
            </>
          )}
        </h6>
        {/* PRODUCT SELECTION */}
        {product.category === 'accessory' ? (
          // Accessory
          <input
            type='hidden'
            name='productVariantId'
            value={variants[0].id}
            required
          />
        ) : (
          // Clothes & Bag
          <div className='flex flex-wrap gap-2'>
            {variants.map((variant) => {
              const { id, size, color, stock, discount } = variant;
              let quantityList: number[] | undefined = undefined;
              if (stock < 10) {
                quantityList = generateNumberList(stock);
              }
              return (
                <div key={variant.id}>
                  <ProductRadio
                    category={category as ProductCategory}
                    label={size}
                    gradientColor={color}
                    value={id}
                    discount={discount}
                    stock={stock}
                    quantityList={quantityList}
                  />
                </div>
              );
            })}
          </div>
        )}
        {/* Quantity Select */}
        <QuantitySelect />
        {/* SUBMIT */}
        <Button
          type='submit'
          className='w-full max-w-none uppercase font-semibold tracking-widest hover:cursor-pointer'
          disabled={totalStock < 1 ? true : isPending}
        >
          {isPending ? <LoadingContainer /> : 'add to cart'}
        </Button>
      </div>
    </form>
  );
}
export default AddToCartContainer;
