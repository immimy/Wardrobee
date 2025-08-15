import ProductsContainer from '@/components/admin/ProductsContainer';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import Link from 'next/link';
import { TbShoppingBagPlus } from 'react-icons/tb';

function AdminProductsPage() {
  return (
    <section className='mt-4 md:mt-8'>
      <ProductsContainer />
      <Tooltip>
        <TooltipTrigger className='hidden 2xl:block p-3 z-10 fixed bottom-20 right-16 rounded-full bg-primary text-primary-foreground hover:animate-bounce transition-all'>
          <Link href='/admin/product-create'>
            <TbShoppingBagPlus className='text-4xl' />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go to create product</p>
        </TooltipContent>
      </Tooltip>
    </section>
  );
}
export default AdminProductsPage;
