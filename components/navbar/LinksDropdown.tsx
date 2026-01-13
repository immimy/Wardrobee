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
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import AvatarImage from '../global/AvatarImage';
import ProtectedLinkItems from './ProtectedLinkItems';
import CustomSignOutButton from './CustomSignOutButton';

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
            <CustomSignOutButton />
          </SignedIn>
          {/* Sign out */}
          <SignedOut>
            <SignInButton mode='modal'>
              <button className='w-full hover:cursor-pointer'>Sign in</button>
            </SignInButton>
          </SignedOut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
