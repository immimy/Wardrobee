import DescriptionContent from '@/components/product/DescriptionContent';
import { ProductWithVariants } from '@/utils/types';
import Image from 'next/image';
import AddToCartContainer from './AddToCartContainer';

type ParamsType = { product: ProductWithVariants };
function ProductContainer({ product }: ParamsType) {
  const { image, name, brand, description } = product;

  return (
    <section className='pt-8 grid gap-8 md:grid-cols-[380px_1fr] md:gap-10'>
      {/* Product Image */}
      <figure className='relative h-68 md:h-[350px] transition-all overflow-hidden rounded-2xl shadow-xl'>
        <Image
          alt='product image'
          src={image}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover'
        />
      </figure>
      {/* Product Details */}
      <article className='flex flex-col gap-y-4'>
        {/* Name & Brand */}
        <header>
          <h4 className='text-xl md:text-2xl font-semibold text-primary tracking-wider'>
            {name}
          </h4>
          <p className='text-lg md:text-xl font-medium uppercase'>{brand}</p>
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
