import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > halfPagesToShow + 2) {
        pageNumbers.push('...');
      }

      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);
      
      if (currentPage <= halfPagesToShow + 1) {
          endPage = maxPagesToShow - 1;
      }
      if (currentPage >= totalPages - halfPagesToShow) {
          startPage = totalPages - maxPagesToShow + 2;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - halfPagesToShow - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const pages = getPageNumbers();

  const baseButtonClass = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
  const defaultButtonClass = "bg-white text-slate-600 hover:bg-slate-100 border border-slate-300";
  const activeButtonClass = "bg-orange-500 text-white shadow border border-orange-500";
  const disabledButtonClass = "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200";

  return (
    <nav aria-label="Job pagination" className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${currentPage === 1 ? disabledButtonClass : defaultButtonClass}`}
        aria-label="Go to previous page"
      >
        <i className="fa-solid fa-chevron-left mr-2"></i>
        Prev
      </button>

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`${baseButtonClass} ${currentPage === page ? activeButtonClass : defaultButtonClass}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-sm font-semibold text-slate-500">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${currentPage === totalPages ? disabledButtonClass : defaultButtonClass}`}
        aria-label="Go to next page"
      >
        Next
        <i className="fa-solid fa-chevron-right ml-2"></i>
      </button>
    </nav>
  );
};

export default Pagination;
