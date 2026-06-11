import { Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/DoctorService';

export class DoctorController {
  private doctorService: DoctorService;

  constructor() {
    this.doctorService = new DoctorService();
  }

  getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const specialization = req.query.specialization as string;

      const result = await this.doctorService.getAllDoctors(page, limit, search, specialization);

      res.status(200).json({
        success: true,
        message: 'Doctors retrieved successfully',
        ...result // Spread to include data, total, page, limit, totalPages
      });
    } catch (error) {
      next(error);
    }
  };

  getDoctorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctor = await this.doctorService.getDoctorById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Doctor retrieved successfully',
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  };

  createDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = await this.doctorService.createDoctor(req.body);
      res.status(201).json({
        success: true,
        message: 'Doctor created successfully',
        data: { id: doctorId },
      });
    } catch (error) {
      next(error);
    }
  };

  updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.doctorService.updateDoctor(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Doctor updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.doctorService.deleteDoctor(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Doctor deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
