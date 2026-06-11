import { Router } from 'express';
import { DoctorController } from '../controllers/DoctorController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { doctorSchema } from '../validators';

import { ScheduleController } from '../controllers/ScheduleController';

const router = Router();
const doctorController = new DoctorController();
const scheduleController = new ScheduleController();

// Publicly accessible for patients (assuming patients need to view doctors)
// or protected by generic authentication
router.get('/', authenticate, doctorController.getAllDoctors);
router.get('/:id', authenticate, doctorController.getDoctorById);
router.get('/:doctorId/available-slots', authenticate, scheduleController.getAvailableSlots);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), validate(doctorSchema), doctorController.createDoctor);
router.put('/:id', authenticate, authorize('ADMIN'), doctorController.updateDoctor);
router.delete('/:id', authenticate, authorize('ADMIN'), doctorController.deleteDoctor);

export default router;
