import { Request, Response, NextFunction } from 'express';
import * as doctorService from './doctor.service';

export const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctors = await doctorService.getAllDoctors();
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

export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ success: true, message: 'Doctor created successfully', data: doctor });
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
