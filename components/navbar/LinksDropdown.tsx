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
  useUser,
} from '@clerk/nextjs';
import AvatarImage from '../global/AvatarImage';
import LoadingContainer from '../global/LoadingContainer';

function LinksDropdown() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <LoadingContainer />;
  const username =
    user?.username ??
    user?.emailAddresses[0].emailAddress.split('@')[0] ??
    'user';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-x-2'
        >
          <AvatarImage height={24} width={24} className='h-6 w-6' />
          <span className='capitalize tracking-wide font-medium'>
            {username}
          </span>
        </Button>
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
          <SignedIn>
            <SignOutButton>
              <span className='w-full'>Sign out</span>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode='modal'>
              <span className='w-full'>Sign in</span>
            </SignInButton>
          </SignedOut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
