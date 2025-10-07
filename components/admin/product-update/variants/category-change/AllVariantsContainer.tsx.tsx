import VariantInputs from '@/components/admin/product-update/VariantInputs';
import { useProductUpdateContext } from '@/components/admin/product-update/ProductProvider';

function AllVariantsContainer() {
  const { product, category } = useProductUpdateContext();
  return (
    <ul className='mb-4 md:grid justify-center'>
      {category === 'accessory' ? (
        <li className='py-3 lg:py-1.5 border-b last:border-b-0 lg:border-b-0'>
          <VariantInputs />
        </li>
      ) : (
        product.variants.map((variant, index) => {
          const { id, size, color, stock, discount } = variant;
          return (
            <li
              key={variant.id}
              className='py-3 lg:py-1.5 border-b last:border-b-0 lg:border-b-0'
            >
              <VariantInputs
                index={index + 1}
                id={id}
                size={size || undefined}
                color={color || undefined}
                stock={stock}
                discount={discount}
              />
            </li>
          );
        })
      )}
    </ul>
  );
}
export default AllVariantsContainer;
