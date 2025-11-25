'use client';

import InfiniteScroll from '@/components/global/InfiniteScroll';
import { Button } from '@/components/ui/button';
import { useAdminProductsProviderContext } from './AdminProductsProvider';
import { FormEventHandler } from 'react';
import { toastError } from '@/utils/clientFunctions';
import { deleteProducts } from '@/utils/actions';
import { FaCheck, FaX } from 'react-icons/fa6';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getFreshCart } from '@/lib/features/cart/cartSlice';
import { useAllProductsSWRInfinite } from '@/utils/swr';
import { toast } from 'sonner';

function AdminProductsContainer() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((store) => store.cart);
  const currentProductInCart = Object.values(cartItems).map(
    (item) => item.data.productId
  );
  const { mutate } = useAllProductsSWRInfinite();
  const {
    isDeleteMode,
    toggleDeleteMode,
    cancelDeleteMode,
    selectedProducts,
    search,
    products,
  } = useAdminProductsProviderContext();

  const deleteProductsHandler: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      // Delete products to database
      await deleteProducts(formData);
      toast.success('Deleted products');
      // Clear all products cache on SWR without revalidation
      mutate(undefined, { revalidate: false });
      // Ensure that the cart is always fresh
      const isProductInCart = currentProductInCart.some((item) =>
        selectedProducts.includes(item)
      );
      if (isProductInCart) dispatch(getFreshCart());
    } catch (error) {
      return toastError(error);
    }
  };

  return (
    <form onSubmit={deleteProductsHandler}>
      <InfiniteScroll
        key={search}
        products={products}
        isAdmin
        stickyClassName='md:bg-transparent'
        isDeleteMode={isDeleteMode}
        toggleDeleteMode={toggleDeleteMode}
      />
      <div
        className={`max-w-6xl xl:max-w-7xl mx-auto fixed bottom-0 md:bottom-9 md:right-9 inset-x-0 flex flex-col md:flex-row md:justify-end md:gap-x-1.5 *:rounded-none z-5 ${
          !isDeleteMode && 'hidden'
        }`}
      >
        <Button
          type='submit'
          className='uppercase tracking-wider font-semibold hover:cursor-pointer'
          disabled={!selectedProducts.length}
        >
          <span>
            <FaCheck />
          </span>
          continue
        </Button>
        <Button
          type='button'
          variant='destructive'
          className='uppercase tracking-wider font-semibold hover:cursor-pointer'
          onClick={cancelDeleteMode}
        >
          <span>
            <FaX />
          </span>
          cancel
        </Button>
      </div>
    </form>
  );
}
export default AdminProductsContainer;
