'use client';

import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Loading from './Loading';
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
  if (!isLoaded) return <Loading />;
  if (!user) return <LuUserRound />;
  const imageUrl = user?.imageUrl as string;

  return (
    <Image
      src={imageUrl}
      width={width}
      height={height}
      alt='avatar'
      className={cn('object-cover rounded-full', className)}
      priority
    />
  );
}
export default AvatarImage;
