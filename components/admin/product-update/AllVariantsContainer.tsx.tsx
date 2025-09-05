import { useCategoryFormContext } from './CategoryForm';
import SingleVariantInput from './SingleVariantInput';
import { useUpdateProductContext } from './UpdateProductLayout';

function AllVariantsContainer() {
  const { product } = useUpdateProductContext()!;
  const { category } = useCategoryFormContext()!;
  return (
    <ul className='mb-4 md:grid justify-center'>
      {category === 'accessory' ? (
        <li className='py-3 lg:py-1.5 border-b last:border-b-0 lg:border-b-0'>
          <SingleVariantInput />
        </li>
      ) : (
        product.variants.map((variant, index) => {
          const { id, size, color, stock, discount } = variant;
          return (
            <li
              key={variant.id}
              className='py-3 lg:py-1.5 border-b last:border-b-0 lg:border-b-0'
            >
              <SingleVariantInput
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
