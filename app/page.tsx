import Container from '@/components/global/Container';
import Title from '@/components/global/Title';
import BestSellerProducts from '@/components/homepage/BestSellerProducts';
import FeaturedProducts from '@/components/homepage/FeaturedProducts';
import HeroCarousel from '@/components/homepage/HeroCarousel';
import CardsSkeleton from '@/components/skeleton/CardsSkeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function Homepage() {
  return (
    <Container className='pt-8 md:pt-12 pb-16'>
      {/* Hero */}
      <section className='grid md:grid-cols-2 gap-8 md:gap-12'>
        <div className='text-center md:text-end md:flex md:flex-col md:justify-center'>
          <h1 className='font-bold text-6xl tracking-tight text-primary-foreground dark:text-primary dark:opacity-90'>
            Wardrobee
          </h1>
          <h4 className='mt-1 font-medium text-2xl tracking-wide leading-6 italic text-primary dark:opacity-70'>
            &quot;Dress to mirror your mood and elevate every moment with
            style.&quot;
          </h4>
          <p className='mt-6 font-light text-xl tracking-wider leading-8 text-muted-foreground'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium
            sunt, recusandae error fugiat incidunt iusto veritatis modi
            exercitationem quia nobis dicta quasi eligendi! Nihil, officia rem
            labore nemo quod excepturi!
          </p>
        </div>
        <div className='order-first md:order-last'>
          <HeroCarousel />
        </div>
      </section>
      <section className='mt-16 md:mt-8'>
        {/* Featured products */}
        <Title title='featured products' />
        <Suspense fallback={<CardsSkeleton number={3} />}>
          <FeaturedProducts />
        </Suspense>
        {/* Best-selling products */}
        <Title title='bestseller' />
        <Suspense fallback={<CardsSkeleton number={3} />}>
          <BestSellerProducts />
        </Suspense>
      </section>
    </Container>
  );
}
export default Homepage;
