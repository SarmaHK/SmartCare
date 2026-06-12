import React from 'react';
import { Clock } from 'lucide-react';
import type { TimeSlot } from '../../types';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string;
  onSelect: (time: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, selectedTime, onSelect }) => {
  const available = slots.filter((s) => s.isAvailable);
  const unavailable = slots.filter((s) => !s.isAvailable);

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-slate-200 rounded-[3px] bg-slate-50">
        <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
        <p className="text-[13px] text-slate-600">No time slots available</p>
        <p className="text-[11px] text-slate-400 mt-1">Please select a different date</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-[13px] font-medium text-slate-700 mb-3">
        Available Slots ({available.length})
      </h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.isAvailable}
            onClick={() => slot.isAvailable && onSelect(slot.time)}
            className={`px-2 py-2 rounded-[3px] text-[13px] font-medium border transition-colors ${
              slot.isAvailable && selectedTime === slot.time
                ? 'bg-blue-600 text-white border-blue-600'
                : slot.isAvailable
                ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
      {unavailable.length > 0 && (
        <p className="text-[11px] text-slate-400 mt-2">{unavailable.length} slot(s) already booked</p>
      )}
    </div>
  );
};

export default TimeSlotPicker;
