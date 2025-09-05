import { useUpdateProductContext } from './UpdateProductLayout';
import SingleVariantLists from './SingleVariantLists';

function SingleVariantContainer() {
  const { product } = useUpdateProductContext()!;
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
