'use client';

import { sidebarLinks } from '@/utils/links';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

function SidebarContainer() {
  const pathname = usePathname();

  return (
    <aside className='bg-muted'>
      <ul>
        {sidebarLinks.map((link) => {
          const { href, labelText } = link;
          const isActive = href === pathname;

          return (
            <li key={href}>
              <Button asChild variant='ghost'>
                <Link
                  key={href}
                  href={href}
                  className={`capitalize w-full rounded-none py-6 text-lg tracking-wider hover:bg-primary/70 ${
                    isActive && 'bg-primary/50 text-primary-foreground'
                  }`}
                >
                  {labelText}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
export default SidebarContainer;
