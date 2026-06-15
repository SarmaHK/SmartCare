import { api } from './api';
import { type DoctorProfile } from './doctor.service';
import { type Slot } from './slot.service';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  slotId: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  cancelReason?: string;
  doctor: DoctorProfile;
  slot: Slot;
  patient?: {
    user: { fullName: string; phone: string; email: string };
    bloodGroup?: string;
    medicalHistory?: string;
    dateOfBirth?: string;
    gender?: string;
  };
}

export const appointmentService = {
  bookAppointment: async (data: { doctorId: number; slotId: number; notes?: string }) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  
  getMyAppointments: async (): Promise<{ success: boolean; data: Appointment[] }> => {
    const response = await api.get('/appointments/my');
    return response.data;
  },
  
  cancelAppointment: async (id: number | string, reason: string) => {
    const response = await api.patch(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },
  
  rescheduleAppointment: async (id: number | string, slotId: number) => {
    const response = await api.patch(`/appointments/${id}/reschedule`, { slotId });
    return response.data;
  },

  // Doctor Methods
  getDoctorAppointments: async (params?: { status?: string; date?: string; patientName?: string; page?: number; limit?: number }): Promise<{ success: boolean; data: { appointments: Appointment[]; total: number } }> => {
    const response = await api.get('/appointments/doctor', { params });
    return response.data;
  },

  getAppointmentById: async (id: number | string): Promise<{ success: boolean; data: Appointment }> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  updateAppointmentStatus: async (id: number | string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'): Promise<{ success: boolean; data: Appointment }> => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  }
};
