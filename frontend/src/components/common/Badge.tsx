import React from 'react';
import { APPOINTMENT_STATUS_CONFIG } from '../../constants';
import type { AppointmentStatus } from '../../types';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  status?: AppointmentStatus;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-slate-50 text-slate-600 border-slate-200',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  status,
  children,
  size = 'sm',
  className = '',
}) => {
  const statusConfig = status ? APPOINTMENT_STATUS_CONFIG[status] : null;
  const colorClass = statusConfig ? statusConfig.color : variantStyles[variant];
  const label = status ? statusConfig?.label : children;

  const sizeClass = size === 'sm'
    ? 'px-2 py-0.5 text-[11px]'
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold uppercase tracking-wide border rounded-[3px] ${sizeClass} ${colorClass} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
