import React from 'react';
import { Card, CardContent } from '../../../components/cards/Card';

interface AdminStatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  colorClass = 'bg-primary-50 text-primary-600',
}) => {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-secondary-500">{title}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-secondary-900">{value}</p>
            {trend && (
              <p
                className={`mt-2 text-sm font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {trend}
              </p>
            )}
          </div>
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
