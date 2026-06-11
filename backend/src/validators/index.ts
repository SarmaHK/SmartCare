import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).default('PATIENT'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const doctorSchema = z.object({
  body: z.object({
    user_id: z.string().uuid('Invalid user ID'),
    specialization: z.string().min(2, 'Specialization is required'),
    consultation_fee: z.number().min(0, 'Fee must be non-negative'),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

export const scheduleSchema = z.object({
  body: z.object({
    doctor_id: z.string().uuid('Invalid doctor ID'),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    start_time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
    end_time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
  }),
});

export const appointmentSchema = z.object({
  body: z.object({
    doctor_id: z.string().uuid('Invalid doctor ID'),
    schedule_id: z.string().uuid('Invalid schedule ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
    notes: z.string().optional(),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
  }),
});
