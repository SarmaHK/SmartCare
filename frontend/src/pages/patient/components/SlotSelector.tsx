import React, { useState, useEffect } from 'react';
import { slotService, type Slot } from '../../../services/slot.service';
import { Skeleton } from '../../../components/common/Skeleton';
import { EmptyState } from '../../../components/common/EmptyState';
import { format, addDays } from 'date-fns';
import { cn } from '../../../utils/cn';
import { Clock } from 'lucide-react';

interface SlotSelectorProps {
  doctorId: number;
  onSelectSlot: (slot: Slot) => void;
  selectedSlotId?: number;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  doctorId,
  onSelectSlot,
  selectedSlotId,
}) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [doctorId, selectedDate]);

  async function fetchSlots(date: Date) {
    setIsLoading(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const response = await slotService.getAvailableSlots(doctorId, dateString);
      if (response.success) {
        setSlots(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch slots', error);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-secondary-700">Select a date</p>
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {dates.map((date, i) => {
            const isSelected =
              format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex min-w-[4.5rem] flex-col items-center justify-center rounded-lg border px-3 py-2.5 transition-all',
                  isSelected
                    ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                    : 'border-secondary-200 bg-white text-secondary-600 hover:border-primary-300 hover:bg-primary-50'
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                  {isToday ? 'Today' : format(date, 'EEE')}
                </span>
                <span className="text-lg font-bold leading-tight">{format(date, 'd')}</span>
                <span className="text-[10px] opacity-70">{format(date, 'MMM')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-secondary-700">Available time slots</p>
        <div className="min-h-[140px]">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <EmptyState
              size="sm"
              icon={<Clock className="h-6 w-6" />}
              title="No slots available"
              description="Try selecting a different date to find available appointments."
            />
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={cn(
                    'rounded-lg border py-2 flex flex-col items-center justify-center text-center transition-all',
                    selectedSlotId === slot.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600/20'
                      : 'border-secondary-200 bg-white text-secondary-700 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700'
                  )}
                >
                  <span className="text-sm font-medium">{slot.startTime.substring(11, 16)}</span>
                  {slot.location && (
                    <span className="text-[10px] text-secondary-500 truncate w-full px-1" title={slot.location}>
                      {slot.location}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
