'use client';

import { links } from '@/utils/links';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { LuUserRound } from 'react-icons/lu';
import AvatarImage from '../global/AvatarImage';
import Loading from '../global/Loading';

function LinksDropdown() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <Loading />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user ? (
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-x-2'
          >
            <AvatarImage height={24} width={24} className='h-6 w-6' />
            <span className='capitalize tracking-wide font-medium'>
              {user.username ??
                user.emailAddresses[0].emailAddress.split('@')[0]}
            </span>
          </Button>
        ) : (
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-x-2'
          >
            <span className='p-1 bg-secondary rounded-full'>
              <LuUserRound className='size-5' />
            </span>
            <span className='font-medium tracking-wide'>User</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {links.map((link) => {
          const { href, labelText } = link;
          if (href === '/dashboard' && !user) return null;
          return (
            <DropdownMenuItem asChild key={href}>
              <Link href={href} className='capitalize'>
                {labelText}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {user ? (
            <SignOutButton>
              <span className='w-full'>Sign out</span>
            </SignOutButton>
          ) : (
            <SignInButton mode='modal'>
              <span className='w-full'>Sign in</span>
            </SignInButton>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
