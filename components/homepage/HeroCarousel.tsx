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
          const path = `/images/hero${index + 1}.jpg`;
          return (
            <CarouselItem key={index}>
              <figure className='relative h-96 overflow-hidden -skew-y-4 shadow-xl rounded-2xl'>
                <Image
                  src={path}
                  alt={`hero${index + 1}`}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover'
                  priority
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
