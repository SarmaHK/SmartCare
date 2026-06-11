import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { scheduleSchema } from '../validators';

const router = Router();
const scheduleController = new ScheduleController();

// Shared between DOCTOR and ADMIN
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), scheduleController.getAllSchedules);
router.get('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), scheduleController.getScheduleById);

// Creation, Updating, Deletion - Admin and Doctor
router.post('/', authenticate, authorize('ADMIN', 'DOCTOR'), validate(scheduleSchema), scheduleController.createSchedule);
router.put('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), scheduleController.updateSchedule);
router.delete('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), scheduleController.deleteSchedule);

export default router;
