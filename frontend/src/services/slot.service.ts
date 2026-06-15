import { api } from './api';

export interface Slot {
  id: number;
  doctorId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  isAvailable: boolean;
}

export const slotService = {
  getAvailableSlots: async (doctorId: number | string, date?: string): Promise<{ success: boolean; data: Slot[] }> => {
    const response = await api.get(`/slots/available`, { params: { doctorId, date } });
    return response.data;
  },

  // Doctor Methods
  getMySlots: async (date?: string): Promise<{ success: boolean; data: Slot[] }> => {
    const response = await api.get('/slots/my', { params: { date } });
    return response.data;
  },

  getSlotById: async (id: number | string): Promise<{ success: boolean; data: Slot }> => {
    const response = await api.get(`/slots/${id}`);
    return response.data;
  },

  createSlot: async (data: { slotDate: string; startTime: string; endTime: string; location?: string }): Promise<{ success: boolean; data: Slot }> => {
    const response = await api.post('/slots', data);
    return response.data;
  },

  updateSlot: async (id: number | string, data: { slotDate?: string; startTime?: string; endTime?: string; location?: string }): Promise<{ success: boolean; data: Slot }> => {
    const response = await api.put(`/slots/${id}`, data);
    return response.data;
  },

  deleteSlot: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/slots/${id}`);
    return response.data;
  }
};
