import ProductProvider from '@/components/admin/product-create/ProductProvider';
import ProductForm from '@/components/admin/product-create/ProductForm';

async function CreateProductPage() {
  return (
    <ProductProvider>
      <section className='mt-4 px-8'>
        <ProductForm />
      </section>
    </ProductProvider>
  );
}
export default CreateProductPage;
