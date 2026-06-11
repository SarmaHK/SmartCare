import { DashboardRepository } from '../repositories/DashboardRepository';

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getAdminStats() {
    return this.dashboardRepository.getAdminStats();
  }

  async getDoctorStats(doctorId: string) {
    return this.dashboardRepository.getDoctorStats(doctorId);
  }

  async getPatientStats(patientId: string) {
    return this.dashboardRepository.getPatientStats(patientId);
  }
}
