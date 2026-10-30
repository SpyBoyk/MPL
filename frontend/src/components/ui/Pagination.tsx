import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className = '',
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) {
    return null;
  }

  const startItem = totalItems !== undefined ? (currentPage - 1) * pageSize + 1 : undefined;
  const endItem = totalItems !== undefined ? Math.min(currentPage * pageSize, totalItems) : undefined;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#f8fafc] dark:bg-[#070d18] border-t border-[#e2e8f0] dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 ${className}`}
    >
      {/* LEFT: Item Counter & Page Size */}
      <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
        {totalItems !== undefined && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Showing <strong className="text-slate-800 dark:text-slate-200">{startItem}</strong> to{' '}
            <strong className="text-slate-800 dark:text-slate-200">{endItem}</strong> of{' '}
            <strong className="text-[#174478] dark:text-sky-400">{totalItems}</strong> entries
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white dark:bg-[#0b1329] border border-[#cbd5e1] dark:border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#174478] dark:focus:ring-sky-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-[#0b1329]">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* RIGHT: Page Navigation Buttons */}
      <div className="flex items-center justify-center sm:justify-end gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1 rounded bg-white dark:bg-[#0b1329] border border-[#cbd5e1] dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-[#e9eef5] dark:hover:bg-slate-800 hover:text-[#174478] dark:hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#0b1329] border border-[#cbd5e1] dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800 hover:text-[#174478] dark:hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-bold"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-1 text-slate-400 dark:text-slate-600 select-none">
                  •••
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[28px] h-7 px-1.5 text-xs font-bold transition flex items-center justify-center [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)] ${
                  isActive
                    ? 'bg-[#174478] dark:bg-sky-600 text-white shadow-2xs font-extrabold'
                    : 'bg-white dark:bg-[#0b1329] border border-[#cbd5e1] dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800 hover:border-[#174478] dark:hover:border-sky-500 hover:text-[#174478] dark:hover:text-sky-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#0b1329] border border-[#cbd5e1] dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800 hover:text-[#174478] dark:hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-bold"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1 rounded bg-white dark:bg-[#0b1329] border border-[#cbd5e1] dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-[#e9eef5] dark:hover:bg-slate-800 hover:text-[#174478] dark:hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
