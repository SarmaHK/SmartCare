import { api } from './api';
import { type AuthUser } from './auth.service';

export interface DoctorProfile {
  id: number;
  userId: number;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: string;
  bio: string;
  user: AuthUser;
}

export interface DoctorListResponse {
  success: boolean;
  data: {
    doctors: DoctorProfile[];
    total: number;
    page: number;
    limit: number;
  };
}

export const doctorService = {
  getAllDoctors: async (params?: { page?: number; limit?: number; search?: string; specialization?: string }): Promise<DoctorListResponse> => {
    const response = await api.get<DoctorListResponse>('/doctors', { params });
    return response.data;
  },
  getDoctorById: async (id: number | string): Promise<{ success: boolean; data: DoctorProfile }> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Profile Management for Logged in Doctor
  getMyProfile: async (): Promise<{ success: boolean; data: DoctorProfile }> => {
    const response = await api.get('/doctors/profile');
    return response.data;
  },

  updateMyProfile: async (data: Partial<DoctorProfile> & { fullName?: string; email?: string; phone?: string }): Promise<{ success: boolean; data: DoctorProfile }> => {
    const response = await api.put('/doctors/profile', data);
    return response.data;
  }
};
