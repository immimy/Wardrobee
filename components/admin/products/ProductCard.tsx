'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import Link from 'next/link';
import { priceFormatter } from '@/utils/format';
import { HiMiniPencilSquare } from 'react-icons/hi2';
import { ProductWithVariants } from '@/utils/types';
import { Button } from '../../ui/button';
import ImageContainer from '../../global/ImageContainer';
import { FaCheck } from 'react-icons/fa6';
import { useAdminProductsProviderContext } from './AdminProductsProvider';

type ParamsType = {
  product: ProductWithVariants;
};

function ProductCard({ product }: ParamsType) {
  const { isDeleteMode, selectedProducts, toggleSelectProduct } =
    useAdminProductsProviderContext();
  const { id, image, name, brand, price } = product;
  const isSelected = selectedProducts.includes(id);

  const handleToggleSelection = () => toggleSelectProduct(id);

  return (
    <div className='relative'>
      <input type='hidden' disabled={!isSelected} name='productId' value={id} />
      <Button
        type='button'
        className={`absolute left-2.5 top-2.5 z-4 bg-accent ${
          !isDeleteMode && 'hidden'
        } transition-all`}
        variant='ghost'
        size='icon'
        onClick={handleToggleSelection}
      >
        {isSelected && <FaCheck />}
      </Button>
      <Card
        className='relative pt-0 pb-4 gap-2 bg-card text-card-foreground'
        onClick={handleToggleSelection}
      >
        <CardHeader className='px-0'>
          <ImageContainer
            alt='product image'
            src={image}
            className='h-54 rounded-t-xl'
          />
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap justify-between items-center'>
            <CardTitle>
              <h6 className='text-primary'>{name}</h6>
              <p className='text-sm font-normal capitalize'>{brand}</p>
            </CardTitle>
            <CardDescription className='self-start'>
              <p className='font-bold tracking-wider text-primary-foreground dark:text-muted-foreground'>
                {priceFormatter(price)}
              </p>
            </CardDescription>
          </div>
          <CardAction className='mt-1.5 flex justify-end gap-x-1.5'>
            {/* Navigate to product update page */}
            <Button
              asChild
              size='icon'
              className='rounded-full w-9 dark:bg-muted dark:text-muted-foreground'
            >
              <Link
                href={`products/${id}`}
                className={`${isDeleteMode && 'pointer-events-none'}`}
                aria-disabled={isDeleteMode}
                tabIndex={isDeleteMode ? -1 : undefined}
              >
                <HiMiniPencilSquare />
              </Link>
            </Button>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
}
export default ProductCard;
