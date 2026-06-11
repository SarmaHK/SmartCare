import React from 'react';
import { cn } from '../../utils/formatters';
import { APPOINTMENT_STATUS_CONFIG } from '../../constants';
import type { AppointmentStatus } from '../../types';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  status?: AppointmentStatus;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200/50',
  danger: 'bg-red-50 text-red-700 border border-red-200/50',
  info: 'bg-blue-50 text-blue-700 border border-blue-200/50',
  default: 'bg-gray-50 text-gray-700 border border-gray-200/50',
};

const dotColors: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  default: 'bg-gray-500',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  status,
  children,
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const statusConfig = status ? APPOINTMENT_STATUS_CONFIG[status] : null;
  const colorClass = statusConfig ? statusConfig.color : variantClasses[variant];
  const dotColorClass = statusConfig ? statusConfig.dotColor : dotColors[variant];

  // Map old tailwind classes if APPOINTMENT_STATUS_CONFIG still has old strings, 
  // though we could leave it to rely on the variantClasses map mostly.
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-md shadow-xs',
        size === 'sm' ? 'px-2 py-0.5 text-[11px] uppercase tracking-wider' : 'px-2.5 py-1 text-xs uppercase tracking-wider',
        colorClass,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5 shadow-sm',
            dotColorClass
          )}
        />
      )}
      {status ? statusConfig?.label : children}
    </span>
  );
};

export default Badge;
