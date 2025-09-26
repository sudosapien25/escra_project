import apiClient from '@/lib/apiClient';
import { Notification, NotificationType } from '@/types/notifications';

export interface NotificationFilters {
  read?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export const notificationApi = {
  async getNotifications(filters?: NotificationFilters): Promise<NotificationResponse> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const response = await apiClient.client.get<NotificationResponse>(
        `/api/notifications?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async getNotification(id: string): Promise<Notification> {
    try {
      const response = await apiClient.client.get<Notification>(`/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error);
      throw error;
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.client.patch(`/api/notifications/${id}/read`);
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

  async markAsUnread(id: string): Promise<void> {
    try {
      await apiClient.client.patch(`/api/notifications/${id}/unread`);
    } catch (error) {
      console.error(`Error marking notification ${id} as unread:`, error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.client.post('/api/notifications/mark-all-read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.client.delete(`/api/notifications/${id}`);
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.client.get<{ count: number }>('/api/notifications/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
};