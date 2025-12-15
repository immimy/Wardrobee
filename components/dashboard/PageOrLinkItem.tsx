import { BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { capitalizeFirstLetter } from '@/utils/format';
import Link from 'next/link';

type ParamsType = {
  total: number;
  index: number;
  pathName: string;
  path: string;
};

function PageOrLinkItem({ total, index, pathName, path }: ParamsType) {
  return (
    <>
      {total > index + 1 ? (
        <BreadcrumbLink asChild>
          <Link href={path}>{capitalizeFirstLetter(pathName)}</Link>
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage className='capitalize'>{pathName}</BreadcrumbPage>
      )}
    </>
  );
}
export default PageOrLinkItem;
