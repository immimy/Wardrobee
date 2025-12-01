'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

type ParamsType = { className?: string; totalPage: number };

function PaginationContainer({ className, totalPage }: ParamsType) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // In case no products found, return nothing
  if (!totalPage) return null;

  const currentPage = Number(searchParams.get('page')) || 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPage;

  // Create page buttons
  const pageButtons = (currentPage: number, lastPage: number) => {
    const buttonArray = [];

    if (lastPage !== 1) {
      buttonArray.push(createPageButton({ page: 1, currentPage, pathname }));
    }
    if (currentPage > 2) {
      buttonArray.push(
        createPageButton({ page: 'before', currentPage, pathname })
      );
    }
    if (currentPage > 1 && currentPage < lastPage) {
      buttonArray.push(
        createPageButton({ page: currentPage, currentPage, pathname })
      );
    }
    if (currentPage < lastPage - 1) {
      buttonArray.push(
        createPageButton({ page: 'after', currentPage, pathname })
      );
    }
    buttonArray.push(
      createPageButton({ page: lastPage, currentPage, pathname })
    );

    return buttonArray;
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={`${pathname}?page=${isFirstPage ? 1 : currentPage - 1}`}
            className={`${isFirstPage && 'pointer-events-none'}`}
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
          />
        </PaginationItem>
        {/* Page Buttons */}
        {pageButtons(currentPage, totalPage)}
        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={`${pathname}?page=${
              isLastPage ? totalPage : currentPage + 1
            }`}
            className={`${isLastPage && 'pointer-events-none'}`}
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
export default PaginationContainer;

function createPageButton({
  page,
  currentPage,
  pathname,
}: {
  page: number | 'before' | 'after';
  currentPage: number;
  pathname: string;
}) {
  return (
    <PaginationItem key={`page-${page}`}>
      {typeof page !== 'number' ? (
        <PaginationEllipsis />
      ) : (
        <PaginationLink
          isActive={page === currentPage}
          href={`${pathname}?page=${page}`}
        >
          {page}
        </PaginationLink>
      )}
    </PaginationItem>
  );
}
