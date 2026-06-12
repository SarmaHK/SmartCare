import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-600';

  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100',
    outline: 'bg-transparent text-slate-600 border border-slate-300 hover:bg-slate-50 active:bg-slate-100',
    danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700 active:bg-red-800',
  };

  const sizes: Record<string, string> = {
    sm: 'h-7 px-3 text-xs gap-1.5 rounded-[3px]',
    md: 'h-8 px-4 text-[13px] gap-2 rounded-[3px]',
    lg: 'h-9 px-5 text-sm gap-2 rounded-[3px]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
