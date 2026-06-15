import React from 'react';
import { cn } from '../../utils/cn';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (query: string) => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Search className="h-4 w-4 text-secondary-400" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          type="search"
          className={cn(
            'block h-10 w-full rounded-lg border border-secondary-200 bg-white pl-10 pr-4 text-sm text-secondary-900',
            'placeholder:text-secondary-400 transition-colors duration-150',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            className
          )}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
