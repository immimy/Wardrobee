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
import { HiMiniPencilSquare, HiMiniTrash } from 'react-icons/hi2';
import { ProductWithVariants } from '@/utils/types';
import { Button } from '../ui/button';
import ImageContainer from '../global/ImageContainer';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import { deleteProduct } from '@/utils/actions';

function ProductCard(props: ProductWithVariants) {
  const { id, image, name, brand, price } = props;
  const deleteProductAction = deleteProduct.bind(null, id);
  return (
    <Card className='relative pt-0 pb-4 gap-2 bg-card text-card-foreground'>
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
            <p className='font-bold tracking-wider text-primary-foreground'>
              {priceFormatter(price)}
            </p>
          </CardDescription>
        </div>
        <CardAction className='mt-1.5 flex justify-end gap-x-1.5'>
          {/* Delete product button */}
          <FormContainer action={deleteProductAction}>
            <SubmitButton
              icon={<HiMiniTrash />}
              size='icon'
              className='rounded-full w-9'
            />
          </FormContainer>
          {/* Navigate to product update page */}
          <Button asChild size='icon' className='rounded-full w-9'>
            <Link href={`products/${id}`}>
              <HiMiniPencilSquare />
            </Link>
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}
export default ProductCard;
