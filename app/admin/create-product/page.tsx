import { getRole } from '@/utils/clerk';
import CreateProductForm from '@/components/admin/product-create/CreateProductForm';

async function CreateProductPage() {
  const role = await getRole();

  return (
    <section className='mt-4 px-8'>
      <CreateProductForm role={role} />
    </section>
  );
}
export default CreateProductPage;
