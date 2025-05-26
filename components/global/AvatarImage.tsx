'use client';

import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import LoadingContainer from './LoadingContainer';
import { LuUserRound } from 'react-icons/lu';

function AvatarImage({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className: string;
}) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <LoadingContainer />;
  if (!user) return <LuUserRound className={className} />;

  return (
    <Image
      src={user.imageUrl}
      width={width}
      height={height}
      alt='avatar'
      className={cn('object-cover rounded-full', className)}
      priority
    />
  );
}
export default AvatarImage;
