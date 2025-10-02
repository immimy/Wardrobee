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
    <Carousel
      className='max-w-9/12 md:max-w-10/12 lg:max-w-11/12'
      opts={{ loop: true }}
    >
      <CarouselContent>
        {Array.from({ length: 5 }, (_, index) => {
          const order = index + 1;
          const path = `/images/hero${order}.jpg`;
          return (
            <CarouselItem key={index}>
              <Image
                src={path}
                alt={`hero${order}`}
                width={550}
                height={384}
                className='w-full max-w-[550px] h-[24rem] rounded-full rounded-tr-none object-cover -skew-y-4 shadow-xl'
                priority={order === 1}
              />
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
