import React from 'react';
import { Link } from 'react-router-dom';

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
}

export const PaginationNav: React.FC<PaginationNavProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl = '#'
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Si moins de 7 pages, afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Afficher 1, 2, 3, ..., dernière page
      pages.push(1, 2, 3);
      if (currentPage > 4) {
        pages.push('...');
      }
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageClick = (page: number) => (e: React.MouseEvent) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-4 sm:px-0 pt-6">
      <div className="-mt-px flex w-0 flex-1">
        {currentPage > 1 && (
          <Link
            to={`${baseUrl}?page=${currentPage - 1}`}
            onClick={handlePageClick(currentPage - 1)}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg
              aria-hidden="true"
              className="mr-3 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                fillRule="evenodd"
              />
            </svg>
            Previous
          </Link>
        )}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }
          
          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;
          
          return (
            <Link
              key={pageNumber}
              to={`${baseUrl}?page=${pageNumber}`}
              onClick={handlePageClick(pageNumber)}
              aria-current={isActive ? 'page' : undefined}
              className={
                isActive
                  ? 'inline-flex items-center border-t-2 border-primary px-4 pt-4 text-sm font-medium text-primary'
                  : 'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
              }
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {currentPage < totalPages && (
          <Link
            to={`${baseUrl}?page=${currentPage + 1}`}
            onClick={handlePageClick(currentPage + 1)}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Next
            <svg
              aria-hidden="true"
              className="ml-3 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                fillRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
};
