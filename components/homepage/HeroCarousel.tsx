import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

function HeroCarousel() {
  return (
    <Carousel className='w-full max-w-9/12' opts={{ loop: true }}>
      <CarouselContent>
        {Array.from({ length: 5 }, (_, index) => {
          const order = index + 1;
          const path = `/images/hero${order}.jpg`;
          return (
            <CarouselItem key={index}>
              <figure className='relative h-96 overflow-hidden -skew-y-4 shadow-xl'>
                <Image
                  src={path}
                  alt={`hero${order}`}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover -skew-y-4'
                  priority={order === 1}
                />
              </figure>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
export default HeroCarousel;
