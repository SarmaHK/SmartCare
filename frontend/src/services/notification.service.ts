import { api } from './api';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getMyNotifications: async (): Promise<{ success: boolean; data: Notification[] }> => {
    const response = await api.get('/notifications/my');
    return response.data;
  },

  markAsRead: async (id: number): Promise<{ success: boolean; data: Notification }> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ success: boolean }> => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  }
};
