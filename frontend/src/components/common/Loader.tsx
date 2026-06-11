import React from 'react';
import { cn } from '../../utils/formatters';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'border-3 border-border border-t-primary rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
      <p className="text-text-muted text-sm">Loading...</p>
    </div>
  </div>
);

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={cn('skeleton h-4 rounded-lg', className)} />
    ))}
  </>
);

export const DoctorCardSkeleton: React.FC = () => (
  <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
    <div className="flex items-center gap-4">
      <div className="skeleton w-16 h-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-8 w-20 rounded-full" />
      <div className="skeleton h-8 w-20 rounded-full" />
    </div>
    <div className="skeleton h-10 w-full rounded-xl" />
  </div>
);

export const AppointmentCardSkeleton: React.FC = () => (
  <div className="bg-surface rounded-2xl border border-border p-5 space-y-3">
    <div className="flex items-center gap-3">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
      </div>
      <div className="skeleton h-6 w-20 rounded-full" />
    </div>
    <div className="flex gap-4">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-4 w-20" />
    </div>
  </div>
);

export default Spinner;
