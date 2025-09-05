'use client';

import { TbShoppingCartPlus } from 'react-icons/tb';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import { addToCart } from '@/utils/actions';
import { FormState } from '@/utils/types';
import { renderError } from '@/utils/clientFunctions';
import { useClerk } from '@clerk/nextjs';
import { useCartContext } from '../providers/CartProvider';

type ParamsType = {
  variantId: string;
};

function AddToCartButton({ variantId }: ParamsType) {
  const { openSignIn } = useClerk();
  const { cartState, setCartState } = useCartContext();

  const addToCartAction = async (
    formState: any,
    formData: FormData
  ): Promise<FormState> => {
    try {
      // Add cart item to database
      const cart = await addToCart(formData);
      const { cartItems, subtotal, totalQuantity } = cart;
      // Update cart state
      setCartState({ ...cartState, cartItems, subtotal, totalQuantity });
      return { message: 'Added product to cart', type: 'success' };
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Please log in')) {
        openSignIn();
      }
      return renderError(error);
    }
  };

  return (
    <FormContainer action={addToCartAction}>
      <input type='hidden' name='productVariantId' defaultValue={variantId} />
      <div className='max-w-10 ml-auto'>
        <SubmitButton
          icon={<TbShoppingCartPlus />}
          size='icon'
          className='inset-shadow-2xs shadow-muted-foreground/50'
        />
      </div>
    </FormContainer>
  );
}
export default AddToCartButton;
