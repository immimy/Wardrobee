'use client';

import { FormEventHandler } from 'react';
import ImageFieldset from './ImageFieldset';
import ProductFieldset from './ProductFieldset';
import { toastError } from '@/utils/clientFunctions';
import { useProductUpdateContext } from './ProductProvider';
import VariantsFieldsetContainer from './VariantsFieldsetContainer';
import { updateProduct } from '@/utils/actions';
import SubmitButton from '@/components/form/SubmitButton';
import { useAllProductsMutate } from '@/utils/swr';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getFreshCart } from '@/lib/features/cart/cartSlice';

function ProductForm() {
  const { replaceWithMockData } = useProductUpdateContext();
  const dispatch = useAppDispatch();
  // Get current cart from store
  const { cartItems } = useAppSelector((store) => store.cart);
  const currentProductInCart = Object.values(cartItems).map(
    (item) => item.data.productId
  );
  // Admin update product context
  const {
    setImage,
    product: { id: productId, updatedAt },
    productForm: { category },
  } = useProductUpdateContext();
  // SWR cache mutation and revalidation
  const allProductsMutate = useAllProductsMutate();

  const updateProductHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      // Update product to database
      const product = await updateProduct(formData);
      toast.success('Updated product successfully!');
      // 📑 START: MOCK LAYER 📑
      // Update form state (Display mock data) & Clear image input
      replaceWithMockData({
        ...product,
        description: product.description ?? '',
      });
      const imageInput = document.getElementById(
        'product-image'
      ) as HTMLInputElement;
      imageInput.value = '';
      // 📑 END: MOCK LAYER 📑
      // Clear all products cache on SWR without revalidation
      allProductsMutate();
      // Ensure that the cart is always fresh
      const isProductInCart = currentProductInCart.some(
        (item) => item === productId
      );
      if (isProductInCart) dispatch(getFreshCart());
    } catch (error) {
      // Clear image preview
      setImage('');
      return toastError(error);
    }
  };

  return (
    <form onSubmit={updateProductHandler}>
      <input type='hidden' name='product[id]' value={productId} />
      {/* Product Image */}
      <ImageFieldset />
      {/* Product */}
      <ProductFieldset />
      {/* Variants */}
      <VariantsFieldsetContainer key={`${category}-${updatedAt}`} />
      <SubmitButton text='submit update product' className='w-full mt-4' />
    </form>
  );
}
export default ProductForm;
