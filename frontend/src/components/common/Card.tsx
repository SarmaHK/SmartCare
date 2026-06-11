import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/formatters';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 lg:p-6',
  lg: 'p-6 lg:p-8',
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const classes = cn(
    'bg-surface rounded-xl border border-border shadow-card',
    'transition-all duration-300',
    hover && 'cursor-pointer hover:shadow-card-hover hover:border-border-focus',
    paddingClasses[padding],
    className
  );

  if (hover) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
