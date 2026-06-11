import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { appointmentSchema, updateAppointmentStatusSchema } from '../validators';

const router = Router();
const appointmentController = new AppointmentController();

// Admin sees all
router.get('/', authenticate, authorize('ADMIN'), appointmentController.getAllAppointments);
router.get('/:id', authenticate, appointmentController.getAppointmentById); // Could add specific ownership checks here
router.delete('/:id', authenticate, authorize('ADMIN'), appointmentController.deleteAppointment);

// Booking, Rescheduling, Cancellation
router.post('/', authenticate, authorize('PATIENT'), validate(appointmentSchema), appointmentController.bookAppointment);
router.put('/:id', authenticate, authorize('PATIENT'), validate(appointmentSchema), appointmentController.rescheduleAppointment);
router.delete('/:id/cancel', authenticate, authorize('PATIENT', 'DOCTOR'), appointmentController.cancelAppointment); // Alternative route design for cancellation
router.patch('/:id/status', authenticate, authorize('ADMIN', 'DOCTOR'), validate(updateAppointmentStatusSchema), appointmentController.updateStatus);

export default router;
