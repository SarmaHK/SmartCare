import { Router } from 'express';

import authRoutes from './modules/auth/auth.routes';
import doctorRoutes from './modules/doctors/doctor.routes';
import slotRoutes from './modules/slots/slot.routes';
import appointmentRoutes from './modules/appointments/appointment.routes';
import adminRoutes from './modules/admin/admin.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import { authenticate } from './middleware/auth.middleware';
import { authorize } from './middleware/role.middleware';
import { Roles } from './config/roles';

const router = Router();

import patientRoutes from './modules/patients/patient.routes';

// Authentication Module (Public + Me)
router.use('/auth', authRoutes);

// Protected Patient Routes
router.use('/patients', patientRoutes);

// Protected Doctor Routes
router.use('/doctors', doctorRoutes);
router.use('/slots', slotRoutes);

// Protected Appointments Routes
router.use('/appointments', appointmentRoutes);

// Protected Admin Routes
router.use('/admin', adminRoutes);

// Protected Notification Routes
router.use('/notifications', notificationRoutes);

export default router;
