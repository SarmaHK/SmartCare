import { create } from 'zustand';
import type { Doctor, DoctorFilters, Specialization } from '../types';
import { mockDoctors } from '../mock';

interface DoctorState {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  filters: DoctorFilters;
  isLoading: boolean;

  // Actions
  fetchDoctors: () => void;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  getDoctorById: (id: string) => Doctor | undefined;
  setSearchQuery: (query: string) => void;
  setSpecializationFilter: (specialization: Specialization | 'all') => void;
  setSortBy: (sortBy: DoctorFilters['sortBy']) => void;
  setAvailableOnly: (available: boolean) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const defaultFilters: DoctorFilters = {
  specialization: 'all',
  search: '',
  sortBy: 'rating',
  availableOnly: false,
};

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: [],
  filteredDoctors: [],
  selectedDoctor: null,
  filters: { ...defaultFilters },
  isLoading: false,

  fetchDoctors: () => {
    set({ isLoading: true });
    // Simulate API delay
    setTimeout(() => {
      set({ doctors: mockDoctors, isLoading: false });
      get().applyFilters();
    }, 500);
  },

  setSelectedDoctor: (doctor) => {
    set({ selectedDoctor: doctor });
  },

  getDoctorById: (id) => {
    return get().doctors.find((d) => d.id === id);
  },

  setSearchQuery: (query) => {
    set((state) => ({
      filters: { ...state.filters, search: query },
    }));
    get().applyFilters();
  },

  setSpecializationFilter: (specialization) => {
    set((state) => ({
      filters: { ...state.filters, specialization },
    }));
    get().applyFilters();
  },

  setSortBy: (sortBy) => {
    set((state) => ({
      filters: { ...state.filters, sortBy },
    }));
    get().applyFilters();
  },

  setAvailableOnly: (available) => {
    set((state) => ({
      filters: { ...state.filters, availableOnly: available },
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
    get().applyFilters();
  },

  applyFilters: () => {
    const { doctors, filters } = get();
    let result = [...doctors];

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.specialization.toLowerCase().includes(query) ||
          d.location.toLowerCase().includes(query)
      );
    }

    // Specialization filter
    if (filters.specialization !== 'all') {
      result = result.filter((d) => d.specialization === filters.specialization);
    }

    // Available only
    if (filters.availableOnly) {
      result = result.filter((d) => d.isAvailable);
    }

    // Sort
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        result.sort((a, b) => b.experience - a.experience);
        break;
      case 'fee-low':
        result.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case 'fee-high':
        result.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    set({ filteredDoctors: result });
  },
}));
