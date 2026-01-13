import DescriptionContent from '@/components/product/DescriptionContent';
import { SingleProductType } from '@/utils/types';
import AddToCartContainer from './AddToCartContainer';
import ImageContainer from '../global/ImageContainer';
import StaticFavoriteButton from '../favorite/StaticFavoriteButton';

type ParamsType = { product: SingleProductType };
function ProductContainer({ product }: ParamsType) {
  const { image, name, brand, description } = product;

  return (
    <section className='pt-8 grid gap-8 md:grid-cols-[380px_1fr] md:gap-10'>
      {/* Product Image */}
      <ImageContainer
        src={image}
        alt='product image'
        className='h-68 md:h-[350px] transition-all rounded-2xl shadow-xl'
      />
      {/* Product Details */}
      <article className='flex flex-col gap-y-4'>
        {/* Name & Brand */}
        <header className='flex justify-between'>
          <div>
            <h4 className='text-xl md:text-2xl font-semibold text-primary tracking-wider'>
              {name}
            </h4>
            <p className='text-lg md:text-xl font-medium uppercase'>{brand}</p>
          </div>
          {/* Favorite Button */}
          <StaticFavoriteButton
            productId={product.id}
            favoriteId={product?.favorites[0]?.id}
          />
        </header>
        {/* Description */}
        <DescriptionContent description={description} />
        {/* Selection */}
        <AddToCartContainer />
      </article>
    </section>
  );
}
export default ProductContainer;
