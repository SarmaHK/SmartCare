import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';

interface DashboardState {
  stats: any | null;
  isLoading: boolean;
  error: string | null;

  fetchAdminStats: () => Promise<void>;
  fetchDoctorStats: () => Promise<void>;
  fetchPatientStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchAdminStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardService.getAdminStats();
      if (response.success) {
        set({ stats: response.data, isLoading: false });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch dashboard stats', isLoading: false });
    }
  },

  fetchDoctorStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardService.getDoctorStats();
      if (response.success) {
        set({ stats: response.data, isLoading: false });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch dashboard stats', isLoading: false });
    }
  },

  fetchPatientStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardService.getPatientStats();
      if (response.success) {
        set({ stats: response.data, isLoading: false });
      } else throw new Error(response.message);
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch dashboard stats', isLoading: false });
    }
  },
}));
