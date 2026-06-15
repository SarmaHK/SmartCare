import { Request, Response, NextFunction } from 'express';
import * as doctorService from './doctor.service';

export const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const search = req.query.search as string;

    const doctors = await doctorService.getAllDoctors({ page, limit, search });
    res.status(200).json({ success: true, message: 'Doctors fetched successfully', data: doctors });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.getDoctorById(Number(req.params.id));
    res.status(200).json({ success: true, message: 'Doctor fetched successfully', data: doctor });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.getDoctorById(Number(req.user!.id));
    res.status(200).json({ success: true, message: 'Profile fetched successfully', data: doctor });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.updateDoctor(Number(req.user!.id), req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: doctor });
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ success: true, message: 'Doctor created successfully', data: doctor });
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'ADMIN' && req.body.email) {
      delete req.body.email; // Admins cannot update doctor email
    }
    const doctor = await doctorService.updateDoctor(Number(req.params.id), req.body);
    res.status(200).json({ success: true, message: 'Doctor updated successfully', data: doctor });
  } catch (error) {
    next(error);
  }
};

export const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await doctorService.deleteDoctor(Number(req.params.id));
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    next(error);
  }
};
