import { DoctorRepository } from '../repositories/DoctorRepository';
import { AppError } from '../errors/AppError';

export class DoctorService {
  private doctorRepository: DoctorRepository;

  constructor() {
    this.doctorRepository = new DoctorRepository();
  }

  async getAllDoctors(page: number, limit: number, search?: string, specialization?: string) {
    return this.doctorRepository.findAll(page, limit, search, specialization);
  }

  async getDoctorById(id: string) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
    return doctor;
  }

  async createDoctor(data: any) {
    return this.doctorRepository.create(data);
  }

  async updateDoctor(id: string, data: any) {
    await this.getDoctorById(id); // Ensures doctor exists
    await this.doctorRepository.update(id, data);
  }

  async deleteDoctor(id: string) {
    await this.getDoctorById(id); // Ensures doctor exists
    await this.doctorRepository.delete(id);
  }
}
