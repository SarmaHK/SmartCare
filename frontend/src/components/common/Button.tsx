import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary text-white border border-transparent shadow-sm hover:bg-primary-dark hover:shadow-md active:bg-primary-900',
  secondary: 'bg-white text-text-primary border border-border shadow-xs hover:bg-surface-hover hover:border-text-muted active:bg-gray-100',
  outline: 'bg-transparent border border-border text-text-secondary hover:border-text-muted hover:text-text-primary active:bg-surface-hover',
  ghost: 'bg-transparent text-text-secondary border border-transparent hover:bg-surface-hover hover:text-text-primary',
  danger: 'bg-danger text-white border border-transparent shadow-sm hover:bg-red-600 hover:shadow-md active:bg-red-700',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm font-semibold gap-2 rounded-md',
  md: 'px-6 py-2.5 text-base font-semibold gap-2 rounded-md',
  lg: 'px-8 py-3.5 text-lg font-bold gap-3 rounded-lg',
  xl: 'px-10 py-4 text-xl font-bold gap-3 rounded-xl',
};

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
  type,
  onClick,
}) => {
  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
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
    </motion.button>
  );
};

export default Button;
