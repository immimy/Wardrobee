import { publicLinks } from '@/utils/links';
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
import ProtectedLinkItems from './ProtectedLinkItems';

function LinksDropdown() {
  return (
    <DropdownMenu>
      {/* TRIGGER BUTTON */}
      <DropdownMenuTrigger asChild>
        <Button
          variant='secondary'
          size='icon'
          className='rounded-full hover:cursor-pointer shadow-2xl'
        >
          <AvatarImage height={36} width={36} className='w-9 h-9' />
        </Button>
      </DropdownMenuTrigger>
      {/* CONTENT */}
      <DropdownMenuContent align='end'>
        {/* Public links */}
        {publicLinks.map((link) => {
          const { url, title } = link;
          return (
            <DropdownMenuItem asChild key={url}>
              <Link href={url} className='capitalize hover:cursor-pointer'>
                {title}
              </Link>
            </DropdownMenuItem>
          );
        })}
        {/* Protected links */}
        <ProtectedLinkItems />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* Sign in */}
          <SignedIn>
            <SignOutButton>
              <span className='w-full hover:cursor-pointer'>Sign out</span>
            </SignOutButton>
          </SignedIn>
          {/* Sign out */}
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
