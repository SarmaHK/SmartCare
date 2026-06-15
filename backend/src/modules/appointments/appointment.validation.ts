import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';

export const bookSchema = z.object({
  body: z.object({
    doctorId: z.number(),
    slotId: z.number(),
    notes: z.string().optional(),
  })
});

export const rescheduleSchema = z.object({
  body: z.object({
    newSlotId: z.number(),
  })
});

export const statusUpdateSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AppointmentStatus),
  })
});
