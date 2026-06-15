import { Router } from 'express';
import * as controller from './patient.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { Roles } from '../../config/roles';

const router = Router();

// Profile routes (only accessible by PATIENT role)
router.get('/profile', authenticate, authorize(Roles.PATIENT), controller.getProfile);
router.put('/profile', authenticate, authorize(Roles.PATIENT), controller.updateProfile);

export default router;
