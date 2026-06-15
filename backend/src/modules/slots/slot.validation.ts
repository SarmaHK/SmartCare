import { z } from 'zod';

const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createSlotSchema = z.object({
  body: z.object({
    doctorId: z.number().optional(), // If DOCTOR, we infer from req.user
    slotDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
    startTime: z.string().regex(timeFormat, { message: 'Invalid start time format (HH:mm)' }),
    endTime: z.string().regex(timeFormat, { message: 'Invalid end time format (HH:mm)' }),
  }).refine((data) => {
    const start = new Date(`1970-01-01T${data.startTime}:00`);
    const end = new Date(`1970-01-01T${data.endTime}:00`);
    return end > start;
  }, {
    message: "End time must be after start time",
    path: ["endTime"]
  })
});

export const updateSlotSchema = z.object({
  body: z.object({
    slotDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }).optional(),
    startTime: z.string().regex(timeFormat).optional(),
    endTime: z.string().regex(timeFormat).optional(),
  }).refine((data) => {
    if (data.startTime && data.endTime) {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);
      return end > start;
    }
    return true;
  }, {
    message: "End time must be after start time",
    path: ["endTime"]
  })
});
