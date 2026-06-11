import { create } from 'zustand';
import { appointmentService } from '../services/appointmentService';

interface AppointmentState {
  appointments: any[];
  isLoading: boolean;
  error: string | null;

  // Pagination & Filters
  page: number;
  limit: number;
  totalPages: number;

  // Actions
  fetchPatientAppointments: () => Promise<void>;
  fetchDoctorAppointments: () => Promise<void>;
  fetchAllAppointments: (status?: string, date?: string) => Promise<void>;
  
  bookAppointment: (data: any) => Promise<void>;
  rescheduleAppointment: (id: string, data: any) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,
  
  page: 1,
  limit: 10,
  totalPages: 1,

  fetchPatientAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.getPatientAppointments();
      if (response.success) {
        set({ appointments: response.data, isLoading: false });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch appointments', isLoading: false });
    }
  },

  fetchDoctorAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.getDoctorAppointments();
      if (response.success) {
        set({ appointments: response.data, isLoading: false });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch appointments', isLoading: false });
    }
  },

  fetchAllAppointments: async (status, date) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const response = await appointmentService.getAll({ page, limit, status, date });
      if (response.success) {
        set({
          appointments: response.data,
          totalPages: response.totalPages,
          isLoading: false,
        });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch appointments', isLoading: false });
    }
  },

  bookAppointment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentService.book(data);
      set({ isLoading: false });
      // Depending on role, we might want to refresh list here if needed
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Booking failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  rescheduleAppointment: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentService.reschedule(id, data);
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Rescheduling failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  cancelAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentService.cancel(id);
      
      // Optimistic UI update
      set((state) => ({
        appointments: state.appointments.map(app => 
          app.id === id ? { ...app, status: 'CANCELLED' } : app
        ),
        isLoading: false
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Cancellation failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentService.updateStatus(id, status);
      
      set((state) => ({
        appointments: state.appointments.map(app => 
          app.id === id ? { ...app, status } : app
        ),
        isLoading: false
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Status update failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },
}));
