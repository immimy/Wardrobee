import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { priceFormatter } from '@/utils/format';
import { TbShoppingCartPlus } from 'react-icons/tb';
import { ProductWithVariants } from '@/utils/types';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import { addToCartAction } from '@/utils/actions';

function ProductCard(props: ProductWithVariants) {
  const { id, image, name, brand, price, variants, totalSales } = props;
  const isOutOfStock = variants.length < 1;
  console.log(props);

  return (
    <Card
      className={`relative pt-0 pb-4 gap-2 bg-card text-card-foreground ${
        isOutOfStock &&
        'before:absolute before:block before:inset-0 before:bg-muted-foreground/30 before:z-10 before:rounded-xl'
      }`}
    >
      <Link href={`/products/${id}`}>
        <CardHeader className='px-0'>
          <figure className='relative h-54 overflow-hidden rounded-t-xl'>
            <Image
              alt='product image'
              src={image}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover'
            />
          </figure>
        </CardHeader>
      </Link>
      <CardContent>
        <div className='flex flex-wrap justify-between items-center'>
          <Link href={`/products/${id}`}>
            <CardTitle>
              <h6 className='text-primary'>{name}</h6>
              <p className='text-sm font-normal'>{brand}</p>
            </CardTitle>
          </Link>
          <CardDescription className='self-start'>
            <p className='font-bold tracking-wider text-primary-foreground'>
              {priceFormatter(price)}
            </p>
          </CardDescription>
        </div>
        <CardDescription>
          <span className='uppercase text-xs tracking-wide font-semibold'>
            sales : {totalSales}
          </span>
        </CardDescription>
        <CardAction className='w-full mt-1.5 relative'>
          {isOutOfStock ? (
            <p className=' uppercase text-center tracking-wide text-destructive'>
              out of stock
            </p>
          ) : (
            <FormContainer action={addToCartAction}>
              <fieldset>
                <input type='hidden' name='variantId' value={variants[0].id} />
                <input type='hidden' name='amount' value={1} />
              </fieldset>
              <div className='max-w-10 ml-auto'>
                <SubmitButton
                  icon={<TbShoppingCartPlus />}
                  size='icon'
                  className='inset-shadow-2xs shadow-muted-foreground/50'
                />
              </div>
            </FormContainer>
          )}
        </CardAction>
      </CardContent>
    </Card>
  );
}
export default ProductCard;
