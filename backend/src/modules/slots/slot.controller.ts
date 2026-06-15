import { Request, Response, NextFunction } from 'express';
import * as slotService from './slot.service';
import { AuthenticatedRequest } from '../../types';
import { Role } from '@prisma/client';

export const createSlot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.user!.role === Role.DOCTOR ? Number(req.user!.id) : req.body.doctorId;
    
    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID is required' });
    }

    const slot = await slotService.createSlot(Number(doctorId), req.body);
    res.status(201).json({ success: true, message: 'Slot created successfully', data: slot });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { doctorId, date } = req.query;
    const slots = await slotService.getAvailableSlots(
      doctorId ? Number(doctorId) : undefined,
      date ? String(date) : undefined
    );
    res.status(200).json({ success: true, message: 'Available slots fetched successfully', data: slots });
  } catch (error) {
    next(error);
  }
};

export const getMySlots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const slots = await slotService.getDoctorSlots(Number(req.user!.id));
    res.status(200).json({ success: true, message: 'Your slots fetched successfully', data: slots });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const slot = await slotService.updateSlot(
      Number(req.params.id), 
      Number(req.user!.id), 
      req.user!.role as Role, 
      req.body
    );
    res.status(200).json({ success: true, message: 'Slot updated successfully', data: slot });
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await slotService.deleteSlot(
      Number(req.params.id), 
      Number(req.user!.id), 
      req.user!.role as Role
    );
    res.status(200).json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    next(error);
  }
};
