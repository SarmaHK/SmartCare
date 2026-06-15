import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}) => {
  const sizes = {
    sm: { container: 'py-8', icon: 'h-12 w-12', iconInner: 'h-6 w-6' },
    md: { container: 'py-12', icon: 'h-14 w-14', iconInner: 'h-7 w-7' },
    lg: { container: 'py-16', icon: 'h-16 w-16', iconInner: 'h-8 w-8' },
  };

  const s = sizes[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary-200 bg-white text-center',
        s.container,
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'mb-4 flex items-center justify-center rounded-full bg-secondary-50 text-secondary-400',
            s.icon
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-secondary-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-secondary-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
