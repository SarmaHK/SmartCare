import React from 'react';
import { cn } from '../../utils/cn';

export function Table({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className={cn('w-full overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-soft', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-secondary-900" {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'border-b border-secondary-200 bg-secondary-50/80 text-xs font-semibold uppercase tracking-wider text-secondary-500',
        className
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-secondary-100 transition-colors duration-150 hover:bg-primary-50/40',
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-12 whitespace-nowrap px-5 align-middle font-semibold text-secondary-500 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('whitespace-nowrap px-5 py-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
}
