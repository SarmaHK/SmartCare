import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { AppointmentStatus, Role } from '@prisma/client';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, message: 'Dashboard stats fetched successfully', data: stats });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, search, role } = req.query;
    const result = await adminService.getAllUsers(
      skip ? Number(skip) : 0,
      take ? Number(take) : 10,
      search ? String(search) : undefined,
      role as Role
    );
    res.status(200).json({ success: true, message: 'Users fetched successfully', data: result.data, meta: result.meta });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.getUserById(Number(req.params.id));
    res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.updateUserStatus(Number(req.params.id), req.body);
    res.status(200).json({ success: true, message: 'User status updated successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctors = await adminService.getAllDoctors();
    res.status(200).json({ success: true, message: 'Doctors fetched successfully', data: doctors });
  } catch (error) {
    next(error);
  }
};

export const getDoctorSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await adminService.getDoctorSummary(Number(req.params.id));
    res.status(200).json({ success: true, message: 'Doctor summary fetched successfully', data: summary });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, status, doctorId, patientId, date } = req.query;
    const result = await adminService.getAllAppointments(
      skip ? Number(skip) : 0,
      take ? Number(take) : 10,
      status as AppointmentStatus,
      doctorId ? Number(doctorId) : undefined,
      patientId ? Number(patientId) : undefined,
      date ? String(date) : undefined
    );
    res.status(200).json({ success: true, message: 'Appointments fetched successfully', data: result.data, meta: result.meta });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await adminService.getAppointmentReports();
    res.status(200).json({ success: true, message: 'Reports fetched successfully', data: reports });
  } catch (error) {
    next(error);
  }
};
