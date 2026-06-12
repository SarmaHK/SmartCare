import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-[4px] shadow-sm ${paddingMap[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
