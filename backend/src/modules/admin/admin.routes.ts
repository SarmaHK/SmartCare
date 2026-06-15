import { Router } from 'express';
import * as controller from './admin.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validate';
import { updateUserStatusSchema } from './admin.validation';
import { Roles } from '../../config/roles';

const router = Router();

// Apply auth and admin role to all routes in this router
router.use(authenticate, authorize(Roles.ADMIN));

router.get('/dashboard', controller.getDashboardStats);

router.get('/users', controller.getAllUsers);
router.get('/users/:id', controller.getUserById);
router.patch('/users/:id/status', validate(updateUserStatusSchema), controller.updateUserStatus);

router.get('/doctors', controller.getAllDoctors);
router.get('/doctors/:id/summary', controller.getDoctorSummary);

router.get('/appointments', controller.getAllAppointments);

router.get('/reports/appointments', controller.getAppointmentReports);

export default router;
