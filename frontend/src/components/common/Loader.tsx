import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin ${sizeClasses[size]}`} />
    </div>
  );
};

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
      <p className="text-xs text-slate-500">Loading...</p>
    </div>
  </div>
);

export const Skeleton: React.FC<{ className?: string; count?: number }> = ({ className = '', count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`skeleton h-4 ${className}`} />
    ))}
  </>
);

export const AppointmentCardSkeleton: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-[4px] p-4 space-y-3">
    <div className="flex items-center gap-3">
      <div className="skeleton w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
      </div>
      <div className="skeleton h-5 w-16" />
    </div>
    <div className="flex gap-4">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-3 w-16" />
    </div>
  </div>
);

export default Spinner;
