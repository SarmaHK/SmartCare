import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-primary-600 text-white shadow-sm hover:bg-primary-700 active:bg-primary-800',
      secondary:
        'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300',
      outline:
        'border border-secondary-200 bg-white text-secondary-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700',
      ghost: 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900',
      danger:
        'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
    };

    const sizes = {
      sm: 'h-8 gap-1.5 rounded-lg px-3 text-xs',
      md: 'h-10 gap-2 rounded-lg px-4 text-sm',
      lg: 'h-12 gap-2.5 rounded-lg px-6 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
