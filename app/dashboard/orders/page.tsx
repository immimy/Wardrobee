import Title from '@/components/global/Title';
import { orderColumns } from '@/components/table/columns';
import { DataTable } from '@/components/table/DataTable';
import { fetchAllOrders } from '@/utils/actions';

async function OrdersPage() {
  const orders = await fetchAllOrders();
  return (
    <section>
      <Title title='order history' />
      <div className='p-4'>
        <DataTable columns={orderColumns} data={orders} />
      </div>
    </section>
  );
}
export default OrdersPage;
