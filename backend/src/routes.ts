import { Router } from 'express';

import authRoutes from './modules/auth/auth.routes';
import doctorRoutes from './modules/doctors/doctor.routes';
import slotRoutes from './modules/slots/slot.routes';
import appointmentRoutes from './modules/appointments/appointment.routes';
import { authenticate } from './middleware/auth.middleware';
import { authorize } from './middleware/role.middleware';
import { Roles } from './config/roles';

const router = Router();

// Authentication Module (Public + Me)
router.use('/auth', authRoutes);

// Protected Patient Routes
router.use('/patients', authenticate, authorize(Roles.PATIENT), (req, res) => res.json({ message: 'Patients module stub' }));

// Protected Doctor Routes
router.use('/doctors', doctorRoutes);
router.use('/slots', slotRoutes);

// Protected Appointments Routes
router.use('/appointments', appointmentRoutes);

// Protected Admin Routes
router.use('/admin', authenticate, authorize(Roles.ADMIN), (req, res) => res.json({ message: 'Admin module stub' }));

export default router;
