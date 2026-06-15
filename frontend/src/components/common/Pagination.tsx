import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-b-xl border-t border-secondary-100 bg-secondary-50/50 px-4 py-3 sm:px-6',
        className
      )}
    >
      <p className="hidden text-sm text-secondary-500 sm:block">
        Page <span className="font-medium text-secondary-700">{currentPage}</span> of{' '}
        <span className="font-medium text-secondary-700">{totalPages}</span>
      </p>

      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <span className="text-sm font-medium text-secondary-600 sm:hidden">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          <span className="hidden sm:inline">Next</span>
        </Button>
      </div>
    </div>
  );
};
