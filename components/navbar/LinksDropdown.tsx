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
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from '@clerk/nextjs';
import AvatarImage from '../global/AvatarImage';
import { useAppSelector } from '@/lib/hooks';

function LinksDropdown() {
  const { username, role } = useAppSelector((store) => store.user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='secondary'
          size='icon'
          className='rounded-full hover:cursor-pointer shadow-2xl'
        >
          <AvatarImage height={36} width={36} className='w-9 h-9' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {links.map((link) => {
          const { url, title } = link;
          if (url === '/dashboard' && !username) return null;
          if (url === '/admin' && (!username || role === 'user')) return null;
          return (
            <DropdownMenuItem asChild key={url}>
              <Link href={url} className='capitalize hover:cursor-pointer'>
                {title}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignedIn>
            <SignOutButton>
              <span className='w-full hover:cursor-pointer'>Sign out</span>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode='modal'>
              <span className='w-full hover:cursor-pointer'>Sign in</span>
            </SignInButton>
          </SignedOut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
