import http from "@/lib/httpClient";
import type { NotificationsResponse } from "@/types/notification";

export const getAllNotifications = async () => {
  const { data } = await http.get<NotificationsResponse>(
    "/bookings/notifications/all",
  );
  return data.data;
};

export const markNotificationRead = async (notificationId: string) => {
  const { data } = await http.put(
    `/bookings/notifications/${notificationId}/read`,
  );
  return data;
};
