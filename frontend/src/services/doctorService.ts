import api from './api';

export const doctorService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; specialization?: string }) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/doctors', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  },
};
