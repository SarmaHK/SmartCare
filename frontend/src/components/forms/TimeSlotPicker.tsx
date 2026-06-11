import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../../utils/formatters';
import type { TimeSlot } from '../../types';
import { staggerContainer, staggerItem } from '../../hooks/useAnimations';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string;
  onSelect: (time: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, selectedTime, onSelect }) => {
  const availableSlots = slots.filter((s) => s.isAvailable);
  const unavailableSlots = slots.filter((s) => !s.isAvailable);

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary text-sm">No time slots available for this date.</p>
        <p className="text-text-muted text-xs mt-1">Please select a different date.</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-text-primary mb-3">
        Available Slots ({availableSlots.length})
      </h4>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 gap-2"
      >
        {slots.map((slot) => (
          <motion.button
            key={slot.time}
            variants={staggerItem}
            type="button"
            disabled={!slot.isAvailable}
            onClick={() => slot.isAvailable && onSelect(slot.time)}
            className={cn(
              'px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
              slot.isAvailable && selectedTime === slot.time
                ? 'bg-primary text-white border-primary shadow-md'
                : slot.isAvailable
                ? 'bg-surface border-border text-text-primary hover:border-primary hover:text-primary cursor-pointer'
                : 'bg-surface-hover border-border text-text-muted cursor-not-allowed line-through opacity-50'
            )}
          >
            {slot.time}
          </motion.button>
        ))}
      </motion.div>
      {unavailableSlots.length > 0 && (
        <p className="text-text-muted text-xs mt-3">
          {unavailableSlots.length} slot(s) already booked
        </p>
      )}
    </div>
  );
};

export default TimeSlotPicker;
