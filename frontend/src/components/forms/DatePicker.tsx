import React from 'react';
import { Calendar } from 'lucide-react';
import { getNextDates } from '../../utils/formatters';

interface DatePickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  daysCount?: number;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onSelect, daysCount = 14 }) => {
  const dates = getNextDates(daysCount);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-slate-500" />
        <h4 className="text-[13px] font-medium text-slate-700">Select a Date</h4>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {dates.map((item) => (
          <button
            key={item.date}
            type="button"
            onClick={() => onSelect(item.date)}
            className={`flex flex-col items-center p-2 rounded-[3px] border text-center transition-colors ${
              selectedDate === item.date
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className={`text-[10px] mb-0.5 ${selectedDate === item.date ? 'text-blue-200' : 'text-slate-400'}`}>
              {item.dayName.slice(0, 3)}
            </span>
            <span className="text-[13px] font-medium">{item.display}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
