import { Router } from 'express';
import * as controller from './slot.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validate';
import { createSlotSchema, updateSlotSchema } from './slot.validation';
import { Roles } from '../../config/roles';

const router = Router();

router.get('/available', authenticate, authorize(Roles.PATIENT, Roles.ADMIN, Roles.DOCTOR), controller.getAvailableSlots);
router.get('/my', authenticate, authorize(Roles.DOCTOR), controller.getMySlots);
router.post('/', authenticate, authorize(Roles.DOCTOR, Roles.ADMIN), validate(createSlotSchema), controller.createSlot);
router.get('/:id', authenticate, authorize(Roles.DOCTOR, Roles.ADMIN), controller.getSlotById);
router.put('/:id', authenticate, authorize(Roles.DOCTOR, Roles.ADMIN), validate(updateSlotSchema), controller.updateSlot);
router.delete('/:id', authenticate, authorize(Roles.DOCTOR, Roles.ADMIN), controller.deleteSlot);

export default router;
