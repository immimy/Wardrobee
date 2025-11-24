import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import ImageContainer from '../global/ImageContainer';

function HeroCarousel() {
  return (
    <div className='max-w-9/12 mx-auto'>
      <Carousel opts={{ loop: true }}>
        <CarouselContent className='dark:*:opacity-90'>
          {Array.from({ length: 5 }, (_, index) => {
            const path = `/images/hero${index + 1}.jpg`;
            return (
              <CarouselItem key={index}>
                <ImageContainer
                  src={path}
                  alt={`hero${index + 1}`}
                  className='-skew-y-4 shadow-xl rounded-2xl h-96'
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
export default HeroCarousel;
