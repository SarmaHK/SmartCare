import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/DashboardService';
import { AuthenticatedRequest } from '../types';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getAdminDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getAdminStats();
      res.status(200).json({ success: true, message: 'Admin dashboard stats retrieved', data: stats });
    } catch (error) {
      next(error);
    }
  };

  getDoctorDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Assuming req.user.id is the doctor_id for simplicity
      const stats = await this.dashboardService.getDoctorStats(req.user!.id);
      res.status(200).json({ success: true, message: 'Doctor dashboard stats retrieved', data: stats });
    } catch (error) {
      next(error);
    }
  };

  getPatientDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getPatientStats(req.user!.id);
      res.status(200).json({ success: true, message: 'Patient dashboard stats retrieved', data: stats });
    } catch (error) {
      next(error);
    }
  };
}
