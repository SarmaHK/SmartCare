import { create } from 'zustand';
import { scheduleService } from '../services/schedule.service';

interface ScheduleState {
  schedules: any[];
  availableSlots: string[];
  isLoading: boolean;
  error: string | null;

  page: number;
  limit: number;
  totalPages: number;

  fetchSchedules: (doctorId?: string, day?: string) => Promise<void>;
  fetchAvailableSlots: (doctorId: string, date: string) => Promise<void>;
  createSchedule: (data: any) => Promise<void>;
  updateSchedule: (id: string, data: any) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  availableSlots: [],
  isLoading: false,
  error: null,

  page: 1,
  limit: 10,
  totalPages: 1,

  fetchSchedules: async (doctorId, day) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const params: any = { page, limit };
      if (doctorId) params.doctor_id = doctorId;
      if (day) params.day = day;

      const response = await scheduleService.getAll(params);
      if (response.success) {
        set({ schedules: response.data, totalPages: response.totalPages, isLoading: false });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch schedules', isLoading: false });
    }
  },

  fetchAvailableSlots: async (doctorId, date) => {
    set({ isLoading: true, error: null });
    try {
      const response = await scheduleService.getAvailableSlots(doctorId, date);
      if (response.success) {
        set({ availableSlots: response.data, isLoading: false });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch available slots', isLoading: false });
    }
  },

  createSchedule: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await scheduleService.create(data);
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create schedule';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateSchedule: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await scheduleService.update(id, data);
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update schedule';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  deleteSchedule: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await scheduleService.delete(id);
      set((state) => ({
        schedules: state.schedules.filter(s => s.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete schedule';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },
}));
