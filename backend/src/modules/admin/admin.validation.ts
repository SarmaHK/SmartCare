import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  })
});
