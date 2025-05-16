import { links } from '@/utils/links';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';

function LinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>User</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {links.map((link) => {
          const { href, labelText } = link;
          return (
            <DropdownMenuItem asChild key={href}>
              <Link href={href} className='capitalize'>
                {labelText}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
