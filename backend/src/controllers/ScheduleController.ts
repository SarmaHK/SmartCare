import { Request, Response, NextFunction } from 'express';
import { ScheduleService } from '../services/ScheduleService';

export class ScheduleController {
  private scheduleService: ScheduleService;

  constructor() {
    this.scheduleService = new ScheduleService();
  }

  getAllSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const doctorId = req.query.doctor_id as string;
      const day = req.query.day as string;

      const result = await this.scheduleService.getAllSchedules(page, limit, doctorId, day);

      res.status(200).json({
        success: true,
        message: 'Schedules retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedule = await this.scheduleService.getScheduleById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Schedule retrieved successfully',
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  };

  createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = await this.scheduleService.createSchedule(req.body);
      res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: { id: scheduleId },
      });
    } catch (error) {
      next(error);
    }
  };

  updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.scheduleService.updateSchedule(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Schedule updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.scheduleService.deleteSchedule(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Schedule deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = req.params.doctorId;
      const date = req.query.date as string;

      if (!date) {
        return res.status(400).json({ success: false, message: 'Date query parameter is required' });
      }

      const slots = await this.scheduleService.getAvailableSlots(doctorId, date);
      res.status(200).json({
        success: true,
        message: 'Available slots retrieved successfully',
        data: slots,
      });
    } catch (error) {
      next(error);
    }
  };
}
