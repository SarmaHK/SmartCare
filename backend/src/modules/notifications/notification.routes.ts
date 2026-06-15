import { Router } from 'express';
import * as controller from './notification.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/my', authenticate, controller.getMyNotifications);
router.patch('/read-all', authenticate, controller.markAllAsRead);
router.patch('/:id/read', authenticate, controller.markAsRead);

export default router;
