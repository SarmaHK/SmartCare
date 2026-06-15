import React from 'react';
import { cn } from '../../utils/cn';
import { Card, CardContent } from './Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  iconClassName?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  iconClassName = 'bg-primary-50 text-primary-600',
  className,
}) => {
  return (
    <Card className={cn('card-hover', className)}>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            iconClassName
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-secondary-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-secondary-900">{value}</p>
          {description && (
            <p className="mt-0.5 text-xs text-secondary-400">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
