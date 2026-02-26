export type BookingStatus =
  | "Draft"
  | "Tentative"
  | "Signed"
  | "Confirmed"
  | "Cancelled";

export type PackageType = "Standard" | "Custom";
export type FirearmOption = "Company Rifles" | "Bringing Own";

export interface PaymentScheduleItem {
  label: string;
  amount: number;
  dueDate: string;
  paid?: boolean;
  paidAt?: string;
}

export interface CustomField {
  label: string;
  value: string;
}

export interface Booking {
  _id: string;
  leadId?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  huntInterest?: string;
  huntDate: string;
  packageType: PackageType;
  addOns?: string[];
  firearmOptions?: FirearmOption;
  totalAmount: number;
  customFields?: CustomField[];
  paymentSchedule: PaymentScheduleItem[];
  status: BookingStatus;
  contractHtml?: string;
  envelopeId?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  leadId?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  huntInterest?: string;
  huntDate: string;
  packageType: PackageType;
  addOns?: string[];
  firearmOptions?: FirearmOption;
  totalAmount: number;
  customFields?: CustomField[];
  paymentSchedule?: Omit<PaymentScheduleItem, "paid" | "paidAt">[];
}

export type UpdateBookingPayload = Partial<CreateBookingPayload> & {
  status?: BookingStatus;
};

export interface SendContractPayload {
  templateId?: string;
}

export interface SendContractResponse {
  success: boolean;
  message: string;
  data: {
    envelopeId: string;
    status: BookingStatus;
    sentTo: string;
  };
}

export interface SyncStatusItem {
  bookingId: string;
  name: string;
  previousStatus: BookingStatus;
  newStatus: BookingStatus;
  signedAt?: string;
}

export interface SyncStatusResponse {
  success: boolean;
  message: string;
  data: {
    checked: number;
    synced: number;
    updated: SyncStatusItem[];
  };
}

export interface ContractStatusResponse {
  data: {
    bookingStatus: BookingStatus;
    docusignStatus: {
      status: string;
      sentDateTime: string;
      completedDateTime?: string;
    };
  };
}

export interface ConfirmDepositResponse {
  data: {
    status: BookingStatus;
    confirmedAt: string;
    paymentSchedule: PaymentScheduleItem[];
  };
}

export interface MarkPaidResponse {
  data: {
    paymentSchedule: PaymentScheduleItem[];
    allPaymentsComplete: boolean;
  };
}
