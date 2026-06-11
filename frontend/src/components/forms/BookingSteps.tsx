import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BOOKING_STEPS } from '../../constants';
import { cn } from '../../utils/formatters';
import type { BookingStep } from '../../types';

interface BookingStepsProps {
  currentStep: BookingStep;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep }) => {
  return (
    <div className="w-full mb-8">
      {/* Desktop Steps */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 gradient-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (BOOKING_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {BOOKING_STEPS.map((step) => {
          const isCompleted = currentStep > step.step;
          const isActive = currentStep === step.step;
          return (
            <div key={step.step} className="relative flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2',
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : isActive
                    ? 'bg-white border-primary text-primary shadow-glow'
                    : 'bg-white border-border text-text-muted'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.step}
              </motion.div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-primary' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Steps */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">
            Step {currentStep} of {BOOKING_STEPS.length}
          </span>
          <span className="text-sm text-text-muted">
            {BOOKING_STEPS[currentStep - 1].label}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <motion.div
            className="h-2 rounded-full gradient-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / BOOKING_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;
