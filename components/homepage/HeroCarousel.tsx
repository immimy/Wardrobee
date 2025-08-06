import Image from 'next/image';
import hero1 from '@/public/images/hero1.jpg';
import hero2 from '@/public/images/hero2.jpg';
import hero3 from '@/public/images/hero3.jpg';
import hero4 from '@/public/images/hero4.jpg';
import hero5 from '@/public/images/hero5.jpg';
const carouselImages = [hero1, hero2, hero3, hero4, hero5];
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
        {carouselImages.map((image, index) => {
          return (
            <CarouselItem key={index}>
              <Image
                src={image}
                alt='hero'
                className='w-full h-[24rem] rounded-full rounded-tr-none object-cover -skew-y-4 shadow-xl'
                priority={index === 0}
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
