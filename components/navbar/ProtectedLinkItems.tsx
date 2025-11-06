'use client';

import { useAppSelector } from '@/lib/hooks';
import { protectedLinks } from '@/utils/links';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import Link from 'next/link';

function ProtectedLinkItems() {
  const { username, role } = useAppSelector((store) => store.user);
  return (
    <>
      {protectedLinks.map((link) => {
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
    </>
  );
}
export default ProtectedLinkItems;
