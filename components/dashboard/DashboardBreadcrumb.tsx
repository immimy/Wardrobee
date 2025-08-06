'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import PageOrLinkItem from './PageOrLinkItem';

function DashboardBreadcrumb() {
  // example: '/admin/products/:id' -> '', 'admin', 'products', ':id'
  const pathname = usePathname();
  const pathnameList = pathname.split('/');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* 1) Home page */}
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/* 2) Dashboard page */}
        <BreadcrumbItem>
          <PageOrLinkItem
            total={pathnameList.length}
            index={1}
            pathName={pathnameList[1]}
            path={pathnameList.slice(0, 2).join('/')}
          />
        </BreadcrumbItem>
        {/* 3) Topic page */}
        {pathnameList.length > 2 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <PageOrLinkItem
                total={pathnameList.length}
                index={2}
                pathName={pathnameList[2]}
                path={pathnameList.slice(0,3).join('/')}
              />
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default DashboardBreadcrumb;
