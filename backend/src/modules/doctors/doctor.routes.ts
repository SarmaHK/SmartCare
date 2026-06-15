import { Router } from 'express';
import * as controller from './doctor.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validate';
import { createDoctorSchema, updateDoctorSchema } from './doctor.validation';
import { Roles } from '../../config/roles';

const router = Router();

router.get('/', authenticate, authorize(Roles.ADMIN, Roles.PATIENT, Roles.DOCTOR), controller.getAllDoctors);
router.get('/profile', authenticate, authorize(Roles.DOCTOR), controller.getMyProfile);
router.put('/profile', authenticate, authorize(Roles.DOCTOR), validate(updateDoctorSchema), controller.updateMyProfile);
router.get('/:id', authenticate, authorize(Roles.ADMIN, Roles.PATIENT, Roles.DOCTOR), controller.getDoctorById);
router.post('/', authenticate, authorize(Roles.ADMIN), validate(createDoctorSchema), controller.createDoctor);
router.put('/:id', authenticate, authorize(Roles.ADMIN, Roles.DOCTOR), validate(updateDoctorSchema), controller.updateDoctor);
router.delete('/:id', authenticate, authorize(Roles.ADMIN), controller.deleteDoctor);

export default router;
