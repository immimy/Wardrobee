import { useProductUpdateContext } from '@/components/admin/product-update/ProductProvider';
import SingleVariantLists from './SingleVariantLists';

function SingleVariantContainer() {
  const { product } = useProductUpdateContext();
  return (
    <ul className='md:grid justify-center'>
      {product.variants.map((variant) => {
        const { id, size, color, stock, discount } = variant;
        return (
          <SingleVariantLists
            key={id}
            id={id}
            size={size || undefined}
            color={color || undefined}
            stock={stock}
            discount={discount}
          />
        );
      })}
    </ul>
  );
}
export default SingleVariantContainer;
