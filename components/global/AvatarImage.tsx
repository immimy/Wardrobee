'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { LuUserRound } from 'react-icons/lu';
import { useAppSelector } from '@/lib/hooks';
import LoadingContainer from './LoadingContainer';

function AvatarImage({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className: string;
}) {
  const { isLoading, image } = useAppSelector((state) => state.user);
  if (isLoading) return <LoadingContainer />;
  if (!image) return <LuUserRound className={className} />;

  return (
    <Image
      src={image}
      width={width}
      height={height}
      alt='avatar'
      className={cn('object-cover rounded-full dark:opacity-90', className)}
      priority
    />
  );
}
export default AvatarImage;
