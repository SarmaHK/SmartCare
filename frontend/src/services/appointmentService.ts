import type { Appointment, BookingData } from '../types';
import { mockAppointments } from '../mock';

// Mock service functions — will be replaced with real API calls in Phase 2

export const appointmentService = {
  getAll: async (): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAppointments), 500);
    });
  },

  getById: async (id: string): Promise<Appointment | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = mockAppointments.find((a) => a.id === id);
        resolve(appointment);
      }, 300);
    });
  },

  getByPatientId: async (patientId: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockAppointments.filter((a) => a.patientId === patientId);
        resolve(results);
      }, 300);
    });
  },

  getByDoctorId: async (doctorId: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockAppointments.filter((a) => a.doctorId === doctorId);
        resolve(results);
      }, 300);
    });
  },

  create: async (data: BookingData): Promise<Appointment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment: Appointment = {
          id: `apt-${Date.now()}`,
          patientId: `pat-new-${Date.now()}`,
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          patientPhone: data.patientPhone,
          doctorId: data.doctorId,
          doctorName: data.doctor?.name || '',
          doctorSpecialization: data.doctor?.specialization || 'General Practice',
          doctorImage: data.doctor?.image || '',
          date: data.date,
          time: data.time,
          status: 'upcoming',
          notes: data.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(newAppointment);
      }, 500);
    });
  },

  cancel: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Appointment ${id} cancelled`);
        resolve(true);
      }, 300);
    });
  },

  reschedule: async (id: string, newDate: string, newTime: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Appointment ${id} rescheduled to ${newDate} at ${newTime}`);
        resolve(true);
      }, 300);
    });
  },
};
