import api from './api';

export const scheduleService = {
  getAll: async (params?: { page?: number; limit?: number; doctor_id?: string; day?: string }) => {
    const response = await api.get('/schedules', { params });
    return response.data;
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await api.get(`/doctors/${doctorId}/available-slots`, { params: { date } });
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/schedules', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },
};
