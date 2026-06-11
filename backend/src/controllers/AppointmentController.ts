import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { AuthenticatedRequest } from '../types';

export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = new AppointmentService();
  }

  getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const date = req.query.date as string;

      const result = await this.appointmentService.getAllAppointments(page, limit, status, date);
      res.status(200).json({ success: true, message: 'Appointments retrieved', ...result });
    } catch (error) {
      next(error);
    }
  };

  getPatientAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.appointmentService.getPatientAppointments(req.user!.id);
      res.status(200).json({ success: true, message: 'Patient appointments retrieved', data });
    } catch (error) {
      next(error);
    }
  };

  getDoctorAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.appointmentService.getDoctorAppointments(req.user!.id);
      res.status(200).json({ success: true, message: 'Doctor appointments retrieved', data });
    } catch (error) {
      next(error);
    }
  };

  getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.appointmentService.getAppointmentById(req.params.id);
      res.status(200).json({ success: true, message: 'Appointment retrieved', data });
    } catch (error) {
      next(error);
    }
  };

  bookAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const appointmentId = await this.appointmentService.bookAppointment(req.user!.id, req.body);
      res.status(201).json({ success: true, message: 'Appointment booked successfully', data: { id: appointmentId } });
    } catch (error) {
      next(error);
    }
  };

  cancelAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await this.appointmentService.cancelAppointment(req.params.id, req.user!.id, req.user!.role);
      res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
      next(error);
    }
  };

  rescheduleAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await this.appointmentService.rescheduleAppointment(req.params.id, req.user!.id, req.body);
      res.status(200).json({ success: true, message: 'Appointment rescheduled successfully' });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.appointmentService.updateStatus(req.params.id, req.body.status);
      res.status(200).json({ success: true, message: 'Appointment status updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  deleteAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.appointmentService.deleteAppointment(req.params.id);
      res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
