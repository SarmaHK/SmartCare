import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { AppError } from '../errors/AppError';

export class ScheduleService {
  private scheduleRepository: ScheduleRepository;
  private doctorRepository: DoctorRepository;
  private appointmentRepository: AppointmentRepository;

  constructor() {
    this.scheduleRepository = new ScheduleRepository();
    this.doctorRepository = new DoctorRepository();
    this.appointmentRepository = new AppointmentRepository();
  }

  async getAllSchedules(page: number, limit: number, doctorId?: string, day?: string) {
    return this.scheduleRepository.findAll(page, limit, doctorId, day);
  }

  async getScheduleById(id: string) {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }
    return schedule;
  }

  async createSchedule(data: any) {
    // Validate doctor existence
    const doctor = await this.doctorRepository.findById(data.doctor_id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    if (data.start_time >= data.end_time) {
      throw new AppError('Start time must be before end time', 400);
    }

    // Check overlaps
    const hasOverlap = await this.scheduleRepository.checkOverlap(data.doctor_id, data.day, data.start_time, data.end_time);
    if (hasOverlap) {
      throw new AppError('Schedule overlaps with an existing schedule', 400);
    }

    return this.scheduleRepository.create(data);
  }

  async updateSchedule(id: string, data: any) {
    const schedule = await this.getScheduleById(id);
    
    const startTime = data.start_time || schedule.start_time;
    const endTime = data.end_time || schedule.end_time;

    if (startTime >= endTime) {
      throw new AppError('Start time must be before end time', 400);
    }

    // Check overlaps
    const hasOverlap = await this.scheduleRepository.checkOverlap(schedule.doctor_id, schedule.day, startTime, endTime, id);
    if (hasOverlap) {
      throw new AppError('Schedule overlaps with an existing schedule', 400);
    }

    await this.scheduleRepository.update(id, data);
  }

  async deleteSchedule(id: string) {
    await this.getScheduleById(id);
    await this.scheduleRepository.delete(id);
  }

  async getAvailableSlots(doctorId: string, dateStr: string) {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Get schedules for that day
    const schedules = await this.scheduleRepository.findByDoctorAndDay(doctorId, day);
    
    // Get booked appointments for that date
    const bookedAppointments = await this.appointmentRepository.findByDoctorAndDate(doctorId, dateStr);
    const bookedTimes = bookedAppointments.map(app => app.time);

    const availableSlots: string[] = [];

    // Assuming slots are 30 mins each
    schedules.forEach(schedule => {
      let current = new Date(`1970-01-01T${schedule.start_time}Z`);
      const end = new Date(`1970-01-01T${schedule.end_time}Z`);

      while (current < end) {
        const timeString = current.toISOString().substring(11, 16);
        if (!bookedTimes.includes(`${timeString}:00`) && !bookedTimes.includes(timeString)) {
          availableSlots.push(timeString);
        }
        current.setMinutes(current.getMinutes() + 30);
      }
    });

    return availableSlots.sort();
  }
}
