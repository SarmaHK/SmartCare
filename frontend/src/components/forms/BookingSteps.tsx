import React from 'react';
import { Check } from 'lucide-react';
import { BOOKING_STEPS } from '../../utils/constants';
import type { BookingStep } from '../../types';

interface BookingStepsProps {
  currentStep: BookingStep;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep }) => {
  return (
    <div className="w-full mb-6">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-slate-200" />
        <div
          className="absolute top-4 left-0 h-[2px] bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (BOOKING_STEPS.length - 1)) * 100}%` }}
        />

        {BOOKING_STEPS.map((step) => {
          const done = currentStep > step.step;
          const active = currentStep === step.step;
          return (
            <div key={step.step} className="relative flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                done ? 'bg-blue-600 border-blue-600 text-white'
                  : active ? 'bg-white border-blue-600 text-blue-600'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {done ? <Check className="w-4 h-4" /> : step.step}
              </div>
              <span className={`mt-2 text-[11px] font-medium whitespace-nowrap ${
                active ? 'text-blue-600' : done ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-medium text-blue-600">Step {currentStep} of {BOOKING_STEPS.length}</span>
          <span className="text-[13px] text-slate-500">{BOOKING_STEPS[currentStep - 1].label}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / BOOKING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;
