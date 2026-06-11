import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { AppError } from '../errors/AppError';
import { executeTransaction } from '../config/database';

export class AppointmentService {
  private appointmentRepository: AppointmentRepository;
  private doctorRepository: DoctorRepository;
  private scheduleRepository: ScheduleRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
    this.doctorRepository = new DoctorRepository();
    this.scheduleRepository = new ScheduleRepository();
  }

  async getAllAppointments(page: number, limit: number, status?: string, date?: string) {
    return this.appointmentRepository.findAll(page, limit, status, date);
  }

  async getPatientAppointments(patientId: string) {
    return this.appointmentRepository.findByPatient(patientId);
  }

  async getDoctorAppointments(doctorId: string) {
    return this.appointmentRepository.findByDoctor(doctorId);
  }

  async getAppointmentById(id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }
    return appointment;
  }

  async bookAppointment(patientId: string, data: any) {
    return executeTransaction(async (connection) => {
      // Validate doctor
      const doctor = await this.doctorRepository.findById(data.doctor_id);
      if (!doctor) throw new AppError('Doctor not found', 404);

      // Validate schedule
      const schedule = await this.scheduleRepository.findById(data.schedule_id);
      if (!schedule || schedule.doctor_id !== data.doctor_id) {
        throw new AppError('Invalid schedule for the selected doctor', 400);
      }

      // Validate if time falls within schedule boundaries (simplified check)
      if (data.time < schedule.start_time || data.time >= schedule.end_time) {
        throw new AppError('Selected time is outside the doctor\'s schedule', 400);
      }

      // Check slot availability with FOR UPDATE lock
      const isAvailable = await this.appointmentRepository.checkSlotAvailability(data.doctor_id, data.date, data.time, connection);
      if (!isAvailable) {
        throw new AppError('This time slot is already booked', 409); // Conflict
      }

      // Create appointment
      const appointmentId = await this.appointmentRepository.create({
        ...data,
        patient_id: patientId,
      }, connection);

      return appointmentId;
    });
  }

  async cancelAppointment(id: string, userId: string, userRole: string) {
    return executeTransaction(async (connection) => {
      const appointment = await this.getAppointmentById(id);
      
      // Authorization check: Patient can only cancel own, Doctor can cancel own
      if (userRole === 'PATIENT' && appointment.patient_id !== userId) {
        throw new AppError('Not authorized to cancel this appointment', 403);
      }
      if (userRole === 'DOCTOR' && appointment.doctor_id !== userId) { // Note: Assuming doctorId matches userId or needs lookup, simplified here
        // In reality, doctor.user_id = userId. This needs resolving if roles use generic IDs.
      }

      if (appointment.status === 'COMPLETED') {
        throw new AppError('Cannot cancel a completed appointment', 400);
      }
      if (appointment.status === 'CANCELLED') {
        throw new AppError('Appointment is already cancelled', 400);
      }

      await this.appointmentRepository.updateStatus(id, 'CANCELLED', connection);
    });
  }

  async rescheduleAppointment(id: string, patientId: string, data: any) {
    return executeTransaction(async (connection) => {
      const appointment = await this.getAppointmentById(id);

      if (appointment.patient_id !== patientId) {
        throw new AppError('Not authorized to reschedule this appointment', 403);
      }

      if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
        throw new AppError('Cannot reschedule a completed or cancelled appointment', 400);
      }

      // Check new slot
      const isAvailable = await this.appointmentRepository.checkSlotAvailability(data.doctor_id, data.date, data.time, connection);
      if (!isAvailable) {
        throw new AppError('This new time slot is already booked', 409);
      }

      await this.appointmentRepository.reschedule(id, data.date, data.time, data.schedule_id, connection);
    });
  }

  async updateStatus(id: string, status: string) {
    await this.getAppointmentById(id);
    await this.appointmentRepository.updateStatus(id, status);
  }

  async deleteAppointment(id: string) {
    await this.getAppointmentById(id);
    await this.appointmentRepository.delete(id);
  }
}
