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
    register, handleSubmit,
    formState: { errors, isValid },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { patientName: '', patientEmail: '', patientPhone: '', notes: '', ...defaultValues },
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Patient Details</h3>
        <p className="text-[13px] text-slate-500 mb-4">Please fill in your details to complete the booking.</p>
      </div>

      <Input label="Full Name" placeholder="Enter your full name"
        leftIcon={<User className="w-4 h-4" />} error={errors.patientName?.message} {...register('patientName')} />

      <Input label="Email Address" type="email" placeholder="your@email.com"
        leftIcon={<Mail className="w-4 h-4" />} error={errors.patientEmail?.message} {...register('patientEmail')} />

      <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000"
        leftIcon={<Phone className="w-4 h-4" />} error={errors.patientPhone?.message} {...register('patientPhone')} />

      <div className="w-full">
        <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Notes (Optional)</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <textarea
            placeholder="Any additional notes..."
            rows={3}
            className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-[3px] placeholder:text-slate-400 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 resize-none"
            {...register('notes')}
          />
        </div>
        {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} fullWidth>Back</Button>
        <Button type="submit" disabled={!isValid} fullWidth>Review Booking</Button>
      </div>
    </form>
  );
};

export default BookingForm;
