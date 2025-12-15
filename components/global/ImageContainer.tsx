'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

type ImageContainerParams = {
  alt: string;
  src: string;
  className?: string;
};

function ImageContainer({ alt, src, className }: ImageContainerParams) {
  return (
    <figure className={cn('relative overflow-hidden', className)}>
      <Image
        alt={alt}
        src={src}
        fill
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        className='object-cover'
        priority
        onError={(e) => (e.currentTarget.srcset = '/images/image-404.svg')}
      />
    </figure>
  );
}
export default ImageContainer;
