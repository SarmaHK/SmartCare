import { z } from 'zod';
import { createDoctorSchema, updateDoctorSchema } from './doctor.validation';

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>['body'];
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>['body'];
