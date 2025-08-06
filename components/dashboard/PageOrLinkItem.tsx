import { BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { capitalizeFirstLetter } from '@/utils/format';

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
        <BreadcrumbLink href={path}>
          {capitalizeFirstLetter(pathName)}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage className='capitalize'>{pathName}</BreadcrumbPage>
      )}
    </>
  );
}
export default PageOrLinkItem;
