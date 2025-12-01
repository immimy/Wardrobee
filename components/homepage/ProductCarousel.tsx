'use client';

import { FetchAllProductsType } from '@/utils/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import ProductCard from '../products/ProductCard';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import StoreFavoriteButton from '../favorite/StoreFavoriteButton';

type ParamsType = { products: FetchAllProductsType };

function ProductCarousel({ products }: ParamsType) {
  const plugin = useRef(Autoplay({ delay: 2000 }));

  return (
    <div className='mt-2.5 max-w-[85%] md:max-w-[90%] mx-auto'>
      <Carousel opts={{ loop: true }} plugins={[plugin.current]}>
        <CarouselContent>
          {products.data.map((item) => {
            return (
              <CarouselItem
                key={item.id}
                className='md:basis-1/2 lg:basis-1/3 relative'
              >
                {/* Product Card */}
                <ProductCard product={item} />
                {/* Favorite Button */}
                <StoreFavoriteButton
                  productId={item.id}
                  className='absolute top-5 left-10'
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
export default ProductCarousel;
