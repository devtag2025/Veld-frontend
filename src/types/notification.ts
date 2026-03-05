export type NotificationType =
  | "contract_sent"
  | "contract_signed"
  | "contract_declined"
  | "contract_voided"
  | "deposit_confirmed"
  | "payment_received";

export interface Notification {
  _id: string;
  bookingId: string;
  bookingName: string;
  type: NotificationType;
  message: string;
  createdAt: string;
}

export interface NotificationsResponse {
  data: {
    notifications: Notification[];
    count: number;
  };
}
