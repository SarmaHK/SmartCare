import { z } from 'zod';
import { bookSchema, rescheduleSchema, statusUpdateSchema } from './appointment.validation';

export type BookInput = z.infer<typeof bookSchema>['body'];
export type RescheduleInput = z.infer<typeof rescheduleSchema>['body'];
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>['body'];
