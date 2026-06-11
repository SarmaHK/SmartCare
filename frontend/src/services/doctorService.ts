import type { Doctor } from '../types';
import { mockDoctors } from '../mock';

// Mock service functions — will be replaced with real API calls in Phase 2

export const doctorService = {
  getAll: async (): Promise<Doctor[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDoctors), 500);
    });
  },

  getById: async (id: string): Promise<Doctor | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doctor = mockDoctors.find((d) => d.id === id);
        resolve(doctor);
      }, 300);
    });
  },

  search: async (query: string): Promise<Doctor[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockDoctors.filter(
          (d) =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.specialization.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 300);
    });
  },

  getFeatured: async (): Promise<Doctor[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = mockDoctors
          .filter((d) => d.isAvailable)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        resolve(featured);
      }, 300);
    });
  },
};
