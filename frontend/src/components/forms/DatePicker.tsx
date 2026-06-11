import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/formatters';
import { getNextDates } from '../../utils/formatters';
import { staggerContainer, staggerItem } from '../../hooks/useAnimations';

interface DatePickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  daysCount?: number;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onSelect, daysCount = 14 }) => {
  const dates = getNextDates(daysCount);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-medium text-text-primary">Select a Date</h4>
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2"
      >
        {dates.map((item) => (
          <motion.button
            key={item.date}
            variants={staggerItem}
            type="button"
            onClick={() => onSelect(item.date)}
            className={cn(
              'flex flex-col items-center p-3 rounded-xl border transition-all duration-200',
              selectedDate === item.date
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-surface border-border text-text-primary hover:border-primary hover:text-primary cursor-pointer'
            )}
          >
            <span className={cn(
              'text-xs font-medium mb-1',
              selectedDate === item.date ? 'text-white/80' : 'text-text-muted'
            )}>
              {item.dayName.slice(0, 3)}
            </span>
            <span className="text-sm font-semibold">{item.display}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default DatePicker;
