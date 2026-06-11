import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, FileText } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { bookingFormSchema, type BookingFormData } from '../../utils/validators';

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<BookingFormData>;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, onBack, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      notes: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h3 className="text-lg font-semibold text-text-primary mb-2">Patient Details</h3>
      <p className="text-text-secondary text-sm mb-6">Please fill in your details to complete the booking.</p>

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        leftIcon={<User className="w-4 h-4" />}
        error={errors.patientName?.message}
        {...register('patientName')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.patientEmail?.message}
        {...register('patientEmail')}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        leftIcon={<Phone className="w-4 h-4" />}
        error={errors.patientPhone?.message}
        {...register('patientPhone')}
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Notes (Optional)
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
          <textarea
            placeholder="Any additional notes or symptoms you'd like to mention..."
            rows={3}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-primary-200 resize-none"
            {...register('notes')}
          />
        </div>
        {errors.notes && (
          <p className="mt-1 text-xs text-danger">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} fullWidth>
          Back
        </Button>
        <Button type="submit" disabled={!isValid} fullWidth>
          Review Booking
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
