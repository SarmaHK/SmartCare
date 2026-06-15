import { Router } from 'express';
import * as controller from './appointment.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validate';
import { bookSchema, rescheduleSchema, statusUpdateSchema } from './appointment.validation';
import { Roles } from '../../config/roles';

const router = Router();

// Admin
router.get('/', authenticate, authorize(Roles.ADMIN), controller.getAllAppointments);

// Doctor
router.get('/doctor', authenticate, authorize(Roles.DOCTOR), controller.getDoctorAppointments);
router.patch('/:id/status', authenticate, authorize(Roles.DOCTOR, Roles.ADMIN), validate(statusUpdateSchema), controller.updateAppointmentStatus);

// Patient
router.post('/', authenticate, authorize(Roles.PATIENT), validate(bookSchema), controller.bookAppointment);
router.get('/my', authenticate, authorize(Roles.PATIENT), controller.getMyAppointments);

// Patient & Admin & Doctor Shared
router.get('/:id', authenticate, authorize(Roles.PATIENT, Roles.ADMIN, Roles.DOCTOR), controller.getAppointmentById);
router.patch('/:id/cancel', authenticate, authorize(Roles.PATIENT, Roles.ADMIN), controller.cancelAppointment);
router.patch('/:id/reschedule', authenticate, authorize(Roles.PATIENT, Roles.ADMIN), validate(rescheduleSchema), controller.rescheduleAppointment);

export default router;
