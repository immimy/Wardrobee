import ProductProvider from '@/components/admin/product-create/ProductProvider';
import ProductForm from '@/components/admin/product-create/ProductForm';
import MockAlert from '@/components/global/MockAlert';

async function CreateProductPage() {
  return (
    <ProductProvider>
      {/* Mock alert */}
      <MockAlert type='product' />
      {/* Form content */}
      <section className='mt-4 px-8'>
        <ProductForm />
      </section>
    </ProductProvider>
  );
}
export default CreateProductPage;
