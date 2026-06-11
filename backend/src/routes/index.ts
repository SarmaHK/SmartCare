import { Router } from 'express';
import authRoutes from './authRoutes';
import doctorRoutes from './doctorRoutes';
import scheduleRoutes from './scheduleRoutes';
import appointmentRoutes from './appointmentRoutes';
import patientRoutes from './patientRoutes';
import doctorSelfRoutes from './doctorSelfRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server Running',
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorSelfRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
