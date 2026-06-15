import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  text,
  fullPage = false,
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} role="status">
      <Loader2 className={cn('animate-spin text-primary-600', sizes[size])} aria-hidden="true" />
      {text && <p className="text-sm font-medium text-secondary-500">{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[50vh] items-center justify-center">{content}</div>;
  }

  return content;
};
