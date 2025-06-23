'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

function DashboardBreadcrumb() {
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop();

  let headerPath: string | undefined;
  let headerTitle: string | undefined;
  let page: string | undefined;

  if (pathname.startsWith('/dashboard')) {
    headerPath = '/dashboard';
    headerTitle = 'Dashboard';
    page = currentPath === 'dashboard' ? '' : currentPath;
  }
  if (pathname.startsWith('/dashboard/admin')) {
    headerPath = '/dashboard/admin';
    headerTitle = 'Admin';
    page = currentPath === 'admin' ? '' : currentPath;
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={headerPath}>{headerTitle}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className='capitalize'>{page}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default DashboardBreadcrumb;
