import { z } from 'zod';
import { updateUserStatusSchema } from './admin.validation';

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>['body'];
