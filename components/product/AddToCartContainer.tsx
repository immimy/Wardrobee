'use client';

import { addToCartAction } from '@/utils/actions';
import FormContainer from '../form/FormContainer';
import ProductRadio from './ProductRadio';
import { useState } from 'react';
import { ProductVariant } from '@/lib/generated/prisma';
import { ProductCategory, CartItem } from '@/utils/types';
import { priceFormatter } from '@/utils/format';
import FormSelect from '../form/FormSelect';
import SubmitButton from '../form/SubmitButton';
import { Badge } from '../ui/badge';

const constructCartItem = (
  productPrice: number,
  productVariant: ProductVariant
): CartItem => {
  const { id: variantId, isOnSale, discount, stock } = productVariant;
  return {
    variantId,
    price: isOnSale ? productPrice * (1 - discount / 100) : productPrice,
    discount,
    isOnSale,
    stock,
  };
};
const constructAmountList = (stock: number) => {
  if (stock <= 10) {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }
  return Array.from({ length: 10 }, (_, i) => i + 1);
};

function AddToCartContainer({
  category,
  price,
  variants,
}: {
  category: ProductCategory;
  price: number;
  variants: Array<ProductVariant>;
}) {
  // Init current cart item
  const isAccessory = category === 'accessory';
  let initCartItem: CartItem | undefined;
  if (isAccessory) {
    initCartItem = constructCartItem(price, variants[0]);
  } else {
    initCartItem = { variantId: null, price, discount: 0, isOnSale: false };
  }

  // Controlled input
  const [currentCartItem, setCurrentCartItem] =
    useState<CartItem>(initCartItem);

  // Amount list - max 10 quantities
  const amountList = constructAmountList(currentCartItem.stock ?? 10);

  return (
    <FormContainer action={addToCartAction}>
      <div className='flex flex-col gap-y-4 md:max-w-md'>
        {/* PRICE */}
        <h6 className='capitalize tracking-wide font-semibold text-lg flex flex-wrap items-center gap-2'>
          price:
          <span className='ml-2 font-medium'>
            {priceFormatter(currentCartItem.price)}
          </span>
          {currentCartItem.isOnSale && (
            <>
              <Badge asChild variant='destructive' className='rounded-xl'>
                <span>-{currentCartItem.discount}%</span>
              </Badge>
              <span className='font-normal line-through text-muted-foreground text-sm'>
                {priceFormatter(price)}
              </span>
            </>
          )}
        </h6>
        {/* PRODUCT SELECTION */}
        {isAccessory ? (
          <input type='hidden' name='variantId' value={variants[0].id} />
        ) : (
          <div className='flex flex-wrap gap-2'>
            {variants.map((variant) => {
              const { size, color } = variant;
              const productItem = constructCartItem(price, variant);
              return (
                <div key={variant.id}>
                  <ProductRadio
                    category={category}
                    label={size}
                    gradientColor={color}
                    name='variantId'
                    productItem={productItem}
                    currentVariantId={currentCartItem.variantId}
                    setCurrentCartItem={setCurrentCartItem}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div>
          {/* Display stock if product is less than 20 items */}
          {currentCartItem.stock && currentCartItem.stock <= 20 && (
            <span className='block text-right text-destructive tracking-wide text-sm -translate-y-1/2'>
              only {currentCartItem.stock} item
              {currentCartItem.stock > 1 && 's'} available
            </span>
          )}
          {/* AMOUNT */}
          <FormSelect
            name='amount'
            labelText='Amount'
            placeholder='select amount'
            itemList={amountList}
          />
        </div>
        {/* SUBMIT */}
        <SubmitButton text='add to cart' />
      </div>
    </FormContainer>
  );
}
export default AddToCartContainer;
