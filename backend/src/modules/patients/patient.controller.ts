import { Response, NextFunction } from 'express';
import * as patientService from './patient.service';
import { AuthenticatedRequest } from '../../types';

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await patientService.getProfile(Number(req.user!.id));
    res.status(200).json({ success: true, message: 'Profile fetched successfully', data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await patientService.updateProfile(Number(req.user!.id), req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (error) {
    next(error);
  }
};
