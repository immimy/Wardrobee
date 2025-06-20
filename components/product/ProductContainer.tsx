import DescriptionContent from '@/components/product/DescriptionContent';
import { ProductCategory, ProductWithVariants } from '@/utils/types';
import Image from 'next/image';
import AddToCartContainer from './AddToCartContainer';

async function ProductContainer({ product }: { product: ProductWithVariants }) {
  const { image, name, brand, description, price, totalStock, variants } =
    product;

  const category = product.category as ProductCategory;

  return (
    <section className='pt-8 grid gap-8 sm:grid-cols-[380px_1fr] md:gap-10'>
      <figure className='relative h-68 md:h-[350px] transition-all overflow-hidden rounded-2xl shadow-xl'>
        <Image
          alt='product image'
          src={image}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover'
        />
      </figure>
      <article className='flex flex-col gap-y-4'>
        <header>
          <h4 className='text-xl md:text-2xl font-semibold text-primary tracking-wider'>
            {name}
          </h4>
          <p className='text-lg md:text-xl font-medium'>{brand}</p>
        </header>
        <DescriptionContent content={description} />
        {totalStock < 1 ? (
          <h4 className='text-destructive capitalize text-2xl md:text-4xl tracking-wide text-center'>
            out of stock
          </h4>
        ) : (
          <AddToCartContainer
            category={category}
            price={price}
            variants={variants}
          />
        )}
      </article>
    </section>
  );
}
export default ProductContainer;
