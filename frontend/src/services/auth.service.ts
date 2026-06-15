import { api } from './api';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  profileImage?: string;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'PATIENT' | 'DOCTOR';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: AuthUser }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('smartcare_token');
  }
};
