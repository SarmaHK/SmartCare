import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
const appointmentController = new AppointmentController();

router.get('/appointments', authenticate, authorize('DOCTOR'), appointmentController.getDoctorAppointments);

export default router;
