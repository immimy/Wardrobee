import { sidebarLinks } from '@/utils/links';
import Link from 'next/link';

function SidebarContainer() {
  return (
    <aside className='flex flex-col justify-center'>
      {sidebarLinks.map((link) => {
        return (
          <Link key={link.href} href={link.href}>
            {link.labelText}
          </Link>
        );
      })}
    </aside>
  );
}
export default SidebarContainer;
