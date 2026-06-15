import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-secondary-100 text-secondary-700 ring-secondary-200/60',
    primary: 'bg-primary-50 text-primary-700 ring-primary-200/60',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200/60',
    danger: 'bg-red-50 text-red-700 ring-red-200/60',
    info: 'bg-sky-50 text-sky-700 ring-sky-200/60',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-medium ring-1 ring-inset',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'info' && 'bg-sky-500',
            variant === 'primary' && 'bg-primary-500',
            variant === 'default' && 'bg-secondary-400'
          )}
        />
      )}
      {children}
    </span>
  );
};

export const getAppointmentStatusBadge = (status: string): {
  variant: BadgeProps['variant'];
  label: string;
} => {
  switch (status) {
    case 'CONFIRMED':
      return { variant: 'success', label: 'Confirmed' };
    case 'PENDING':
      return { variant: 'warning', label: 'Pending' };
    case 'CANCELLED':
      return { variant: 'danger', label: 'Cancelled' };
    case 'COMPLETED':
      return { variant: 'info', label: 'Completed' };
    default:
      return { variant: 'default', label: status };
  }
};
