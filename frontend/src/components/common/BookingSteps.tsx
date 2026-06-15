import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BookingStep {
  id: number;
  label: string;
  description?: string;
}

interface BookingStepsProps {
  steps: BookingStep[];
  currentStep: number;
  className?: string;
}

export const BookingSteps: React.FC<BookingStepsProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <nav aria-label="Booking progress" className={cn('w-full', className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className={cn('flex items-center', !isLast && 'flex-1')}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    isCompleted && 'border-primary-600 bg-primary-600 text-white',
                    isCurrent && 'border-primary-600 bg-primary-50 text-primary-700',
                    !isCompleted && !isCurrent && 'border-secondary-200 bg-white text-secondary-400'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <div className="mt-2 hidden text-center sm:block">
                  <p
                    className={cn(
                      'text-xs font-medium',
                      isCurrent ? 'text-primary-700' : 'text-secondary-500'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-[10px] text-secondary-400">{step.description}</p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 rounded-full sm:mx-4',
                    isCompleted ? 'bg-primary-600' : 'bg-secondary-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
