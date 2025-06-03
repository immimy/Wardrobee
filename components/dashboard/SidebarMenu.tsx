'use client';

import { sidebarLinks } from '@/utils/links';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SidebarMenu() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-primary/50 text-primary-foreground text-md font-semibold tracking-widest'>
            Menu
          </NavigationMenuTrigger>
          <NavigationMenuContent data-motion='from-end'>
            {sidebarLinks.map((link) => {
              const { href, labelText } = link;
              const isActive = pathname === href;
              return (
                <NavigationMenuLink asChild key={href}>
                  <Link
                    href={href}
                    className={`capitalize ${isActive && 'bg-primary/50'}`}
                  >
                    {labelText}
                  </Link>
                </NavigationMenuLink>
              );
            })}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
export default SidebarMenu;
