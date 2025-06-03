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
import { auth } from '@clerk/nextjs/server';

async function LinksDropdown() {
  const { userId } = await auth();

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
          const { href, labelText } = link;
          if (href === '/dashboard' && !userId) return null;
          return (
            <DropdownMenuItem asChild key={href}>
              <Link href={href} className='capitalize hover:cursor-pointer'>
                {labelText}
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
