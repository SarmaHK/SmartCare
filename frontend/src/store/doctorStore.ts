import { create } from 'zustand';
import { doctorService } from '../services/doctorService';

interface DoctorState {
  doctors: any[];
  selectedDoctor: any | null;
  isLoading: boolean;
  error: string | null;

  // Pagination & Filters
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  specialization: string;

  // Actions
  fetchDoctors: () => Promise<void>;
  getDoctorById: (id: string) => Promise<any>;
  setSelectedDoctor: (doctor: any | null) => void;
  setSearchQuery: (query: string) => void;
  setSpecializationFilter: (specialization: string) => void;
  setPage: (page: number) => void;
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: [],
  selectedDoctor: null,
  isLoading: false,
  error: null,
  
  page: 1,
  limit: 10,
  totalPages: 1,
  search: '',
  specialization: 'all',

  fetchDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit, search, specialization } = get();
      
      const params: any = { page, limit };
      if (search) params.search = search;
      if (specialization !== 'all') params.specialization = specialization;

      const response = await doctorService.getAll(params);
      
      if (response.success) {
        set({
          doctors: response.data,
          totalPages: response.totalPages,
          isLoading: false,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch doctors', isLoading: false });
    }
  },

  getDoctorById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorService.getById(id);
      if (response.success) {
        set({ selectedDoctor: response.data, isLoading: false });
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch doctor details', isLoading: false });
      return null;
    }
  },

  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),

  setSearchQuery: (search) => {
    set({ search, page: 1 });
    get().fetchDoctors();
  },

  setSpecializationFilter: (specialization) => {
    set({ specialization, page: 1 });
    get().fetchDoctors();
  },

  setPage: (page) => {
    set({ page });
    get().fetchDoctors();
  },
}));
