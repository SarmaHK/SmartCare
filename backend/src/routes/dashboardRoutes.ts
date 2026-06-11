import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
const dashboardController = new DashboardController();

router.get('/admin', authenticate, authorize('ADMIN'), dashboardController.getAdminDashboard);
router.get('/doctor', authenticate, authorize('DOCTOR'), dashboardController.getDoctorDashboard);
router.get('/patient', authenticate, authorize('PATIENT'), dashboardController.getPatientDashboard);

export default router;
