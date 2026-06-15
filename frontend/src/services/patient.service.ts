import { api } from './api';

export interface PatientProfile {
  id: number;
  userId: number;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
}

export const patientService = {
  getProfile: async (): Promise<{ success: boolean; data: PatientProfile }> => {
    const response = await api.get('/patients/profile');
    return response.data;
  },
  
  updateProfile: async (data: Partial<PatientProfile>) => {
    const response = await api.put('/patients/profile', data);
    return response.data;
  }
};
