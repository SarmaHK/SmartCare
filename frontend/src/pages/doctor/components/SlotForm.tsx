import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/forms/Input';
import { Button } from '../../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/cards/Card';
import { type Slot } from '../../../services/slot.service';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface SlotFormProps {
  initialData?: Slot;
  onSubmit: (data: { slotDate: string; startTime: string; endTime: string; location?: string }) => Promise<void>;
  isLoading: boolean;
}

export const SlotForm: React.FC<SlotFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    slotDate: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        slotDate: format(new Date(initialData.slotDate), 'yyyy-MM-dd'),
        startTime: initialData.startTime.substring(11, 16),
        endTime: initialData.endTime.substring(11, 16),
        location: initialData.location || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!formData.slotDate || !formData.startTime || !formData.endTime) {
      return 'All fields are required.';
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    if (formData.slotDate < today) {
      return 'Slot date cannot be in the past.';
    }

    if (formData.startTime >= formData.endTime) {
      return 'End time must be after start time.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    await onSubmit({
      slotDate: formData.slotDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Availability Slot' : 'Create Availability Slot'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <Input
            label="Date"
            type="date"
            name="slotDate"
            value={formData.slotDate}
            onChange={handleChange}
            required
            leftIcon={<Calendar className="h-4 w-4" />}
          />

          <Input
            label="Location / Clinic (Optional)"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. City Hospital, Downtown Clinic"
            leftIcon={<MapPin className="h-4 w-4" />}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Start Time"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              leftIcon={<Clock className="h-4 w-4" />}
            />
            <Input
              label="End Time"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              leftIcon={<Clock className="h-4 w-4" />}
            />
          </div>

          <div className="border-t border-secondary-100 pt-4">
            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              {initialData ? 'Update Slot' : 'Create Slot'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
