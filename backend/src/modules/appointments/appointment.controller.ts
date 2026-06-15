import { Request, Response, NextFunction } from 'express';
import * as appointmentService from './appointment.service';
import { AuthenticatedRequest } from '../../types';
import { AppointmentStatus, Role } from '@prisma/client';

export const bookAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const appointment = await appointmentService.bookAppointment(Number(req.user!.id), req.body);
    res.status(201).json({ success: true, message: 'Appointment booked successfully', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const appointments = await appointmentService.getMyAppointments(Number(req.user!.id));
    res.status(200).json({ success: true, message: 'Appointments fetched successfully', data: appointments });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(Number(req.user!.id));
    res.status(200).json({ success: true, message: 'Appointments fetched successfully', data: appointments });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, status, doctorId } = req.query;
    
    const result = await appointmentService.getAllAppointments(
      skip ? Number(skip) : 0,
      take ? Number(take) : 10,
      status as AppointmentStatus,
      doctorId ? Number(doctorId) : undefined
    );
    
    res.status(200).json({ success: true, message: 'Appointments fetched successfully', data: result.data, meta: result.meta });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const appointment = await appointmentService.cancelAppointment(
      Number(req.params.id), 
      Number(req.user!.id), 
      req.user!.role as Role
    );
    res.status(200).json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const rescheduleAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const appointment = await appointmentService.rescheduleAppointment(
      Number(req.params.id), 
      Number(req.user!.id), 
      req.user!.role as Role, 
      req.body
    );
    res.status(200).json({ success: true, message: 'Appointment rescheduled successfully', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const appointment = await appointmentService.updateAppointmentStatus(
      Number(req.params.id), 
      Number(req.user!.id), 
      req.user!.role as Role, 
      req.body
    );
    res.status(200).json({ success: true, message: 'Appointment status updated successfully', data: appointment });
  } catch (error) {
    next(error);
  }
};
