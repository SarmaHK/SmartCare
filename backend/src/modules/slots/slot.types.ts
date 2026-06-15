import { z } from 'zod';
import { createSlotSchema, updateSlotSchema } from './slot.validation';

export type CreateSlotInput = z.infer<typeof createSlotSchema>['body'];
export type UpdateSlotInput = z.infer<typeof updateSlotSchema>['body'];
