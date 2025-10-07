'use client';

import { useProductContext } from './ProductProvider';
import FormSelect from '../form/FormSelect';

function QuantitySelect() {
  const {
    product: { totalStock },
    cartItem,
  } = useProductContext();

  // Product is out of stock
  if (!totalStock)
    return (
      <h4 className='text-destructive capitalize text-2xl md:text-4xl tracking-wide text-center'>
        out of stock
      </h4>
    );

  // Product is available for purchase.
  const { stockList, quantityList, stock } = cartItem;
  return (
    <div>
      {/* Display stock if product is less than 20 items */}
      {stock && stock <= 20 && (
        <span className='block text-right text-destructive tracking-wide text-sm -translate-y-1/2 uppercase'>
          {stock} item
          {stock > 1 && 's'} in stock
        </span>
      )}
      {/* Quantity Select */}
      <FormSelect
        hideLabel
        name='quantity'
        placeholder='Select Quantity'
        labelText='Quantity'
        frameworks={stockList || quantityList}
      />
    </div>
  );
}
export default QuantitySelect;
