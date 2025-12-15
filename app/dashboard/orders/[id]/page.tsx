import Container from '@/components/global/Container';
import Title from '@/components/global/Title';
import AddressContainer from '@/components/single-order/AddressContainer';
import OrderSummaryContainer from '@/components/single-order/OrderSummaryContainer';
import OrderTracking from '@/components/single-order/OrderTracking';
import ShoppingCartContainer from '@/components/single-order/ShoppingCartContainer';
import { fetchSingleOrder } from '@/utils/actions';

type ParamsType = { params: Promise<{ id: string }> };

async function SingleOrderPage({ params }: ParamsType) {
  const { id } = await params;
  const order = await fetchSingleOrder(id);
  return (
    <section>
      <Container>
        {/* Order Status */}
        <OrderTracking status={order.status} />
        <div className='md:flex md:gap-x-8'>
          {/* Shopping Cart */}
          <div className='grow'>
            <Title title='shopping cart' />
            <ShoppingCartContainer
              orderItems={order.orderItems}
              className='mt-4 md:mt-6'
            />
          </div>
          {/* Shipping Address */}
          <div className='md:grow lg:max-w-1/3'>
            <Title title='shipping address' />
            <AddressContainer shippingAddress={order.shippingAddress} />
            {/* Order Summary */}
            <Title title='order summary' />
            <OrderSummaryContainer
              shippingFee={order.shippingFee}
              orderItems={order.orderItems}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
export default SingleOrderPage;
