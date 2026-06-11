import api from './api';

export const appointmentService = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; date?: string }) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getPatientAppointments: async () => {
    const response = await api.get('/patient/appointments');
    return response.data;
  },

  getDoctorAppointments: async () => {
    const response = await api.get('/doctor/appointments');
    return response.data;
  },

  book: async (data: any) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  reschedule: async (id: string, data: any) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.delete(`/appointments/${id}/cancel`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },
};
