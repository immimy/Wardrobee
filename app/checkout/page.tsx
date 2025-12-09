import AddressContainer from '@/components/checkout/AddressContainer';
import CheckoutProvider from '@/components/checkout/CheckoutProvider';
import OrderSummaryContainer from '@/components/checkout/OrderSummaryContainer';
import ShoppingCartContainer from '@/components/checkout/ShoppingCartContainer';
import SubmitButton from '@/components/form/SubmitButton';
import Container from '@/components/global/Container';
import Title from '@/components/global/Title';
import { fetchAllAddresses, fetchCart, getAuthUser } from '@/utils/actions';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

async function CheckoutPage() {
  const { userId } = await getAuthUser();
  // Cached cart
  const getCachedCart = unstable_cache(
    async () => fetchCart(userId),
    [`${userId}-cart`],
    { tags: [`${userId}-cart`], revalidate: 60 * 15 }
  );
  const cart = await getCachedCart();
  if (!cart.totalQuantity) return redirect('/');
  // Cached addresses
  const getCachedAddresses = unstable_cache(
    async () => fetchAllAddresses(userId),
    [`${userId}-all-addresses`],
    { tags: [`${userId}-all-addresses`], revalidate: 60 * 15 }
  );
  const addresses = await getCachedAddresses();
  const defaultAddress = addresses.find((item) => item.isDefault);
  return (
    <section>
      <Container className='pt-8 pb-16 md:flex md:gap-x-8'>
        {/* Shopping Cart */}
        <div className='grow'>
          <Title title='shopping cart' />
          <ShoppingCartContainer cart={cart} className='mt-4 md:mt-6' />
        </div>
        {/* Shipping Address */}
        <div className='md:grow lg:max-w-1/3'>
          <CheckoutProvider
            addresses={addresses}
            defaultAddress={defaultAddress}
          >
            <Title title='shipping address' />
            <AddressContainer />
          </CheckoutProvider>
          {/* Order Summary */}
          <Title title='order summary' />
          <OrderSummaryContainer cart={cart} />
          <SubmitButton
            formId='checkout'
            text='place an order'
            className='w-full'
            disabled={!defaultAddress}
          />
        </div>
      </Container>
    </section>
  );
}
export default CheckoutPage;
