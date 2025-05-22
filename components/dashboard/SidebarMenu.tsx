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

function SidebarMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            {sidebarLinks.map((link) => {
              return (
                <NavigationMenuLink key={link.href}>
                  <Link href={link.href} className='capitalize'>
                    {link.labelText}
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
