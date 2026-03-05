import { create } from "zustand";
import * as notificationsApi from "@/api/notifications.api";
import type { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const { notifications, count } =
        await notificationsApi.getAllNotifications();
      set({ notifications, unreadCount: count, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationsApi.markNotificationRead(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      console.warn("Failed to mark notification as read");
    }
  },
}));
