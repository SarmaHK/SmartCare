import api from './api';

export const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getDoctorStats: async () => {
    const response = await api.get('/dashboard/doctor');
    return response.data;
  },

  getPatientStats: async () => {
    const response = await api.get('/dashboard/patient');
    return response.data;
  },
};
