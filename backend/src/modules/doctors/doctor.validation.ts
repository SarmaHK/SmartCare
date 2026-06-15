import { z } from 'zod';

export const createDoctorSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().min(10),
    specialization: z.string().min(2),
    qualification: z.string().optional(),
    experienceYears: z.number().min(0).optional(),
    consultationFee: z.number().min(0).optional(),
    bio: z.string().optional(),
  })
});

export const updateDoctorSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    specialization: z.string().min(2).optional(),
    qualification: z.string().optional(),
    experienceYears: z.number().min(0).optional(),
    consultationFee: z.number().min(0).optional(),
    bio: z.string().optional(),
    isActive: z.boolean().optional(),
  })
});
