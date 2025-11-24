import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Link from 'next/link';
import { priceFormatter } from '@/utils/format';
import { ProductWithVariants } from '@/utils/types';
import ImageContainer from '../global/ImageContainer';
import AddToCartButton from './AddToCartButton';

type ParamsType = {
  product: ProductWithVariants;
};
function ProductCard({ product }: ParamsType) {
  const { id, image, name, brand, price, variants, totalSales } = product;
  const isOutOfStock = variants.length < 1;

  return (
    <Card
      className={`relative pt-0 pb-4 gap-2 bg-card text-card-foreground ${
        isOutOfStock && 'opacity-50'
      }`}
    >
      {/* ON SALE BADGE */}
      {variants.some((item) => item.discount > 0) && (
        <span className='absolute right-0 top-3 z-4 px-2.5 bg-destructive drop-shadow-md drop-shadow-accent text-shadow-destructive tracking-widest text-sm'>
          ON SALE
        </span>
      )}
      {/* PRODUCT IMAGE */}
      <Link href={`/products/${id}`}>
        <CardHeader className='px-0'>
          <ImageContainer
            alt='product image'
            src={image}
            className='h-54 rounded-t-xl'
          />
        </CardHeader>
      </Link>
      {/* PRODUCT CONTENT */}
      <CardContent>
        <div className='flex flex-wrap justify-between items-center'>
          {/* NAME & BRAND */}
          <Link href={`/products/${id}`}>
            <CardTitle>
              <h6 className='text-primary'>{name}</h6>
              <p className='text-sm font-normal capitalize'>{brand}</p>
            </CardTitle>
          </Link>
          {/* PRICE */}
          <CardDescription className='self-start'>
            <p className='font-bold tracking-wider text-primary-foreground dark:text-muted-foreground'>
              {priceFormatter(price)}
            </p>
          </CardDescription>
        </div>
        {/* TOTAL SALES */}
        <CardDescription>
          <span className='uppercase text-xs tracking-wide font-semibold'>
            total sales : {totalSales}
          </span>
        </CardDescription>
        {/* ADD TO CART BUTTON */}
        <CardAction className='w-full mt-1.5'>
          {isOutOfStock ? (
            <p className=' uppercase text-center tracking-wide text-destructive'>
              out of stock
            </p>
          ) : (
            <AddToCartButton variantId={variants[0].id} product={product} />
          )}
        </CardAction>
      </CardContent>
    </Card>
  );
}
export default ProductCard;
