import { z } from 'zod';

export const bookingFormSchema = z.object({
  patientName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  patientEmail: z
    .string()
    .email('Please enter a valid email address'),
  patientPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
