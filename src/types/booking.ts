export type BookingStatus =
  | "Draft"
  | "Tentative"
  | "Signed"
  | "Confirmed"
  | "Declined"
  | "Cancelled";

export type PackageType = string;
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

export interface BookingNotification {
  type: string;
  message: string;
  read?: boolean;
  createdAt: string;
}

export type MedicalFormStatus = "Not Sent" | "Sent" | "Signed";
export type DeclarationFormStatus = "Not Assigned" | "Sent via DocuSign" | "Signed Manually" | "Signed";

export interface BookingForms {
  medical: {
    envelopeId?: string;
    status: MedicalFormStatus;
    sentAt?: string;
    signedAt?: string;
    formData?: Record<string, string>;
  };
  declaration: {
    envelopeId?: string;
    status: DeclarationFormStatus;
    sentAt?: string;
    signedAt?: string;
  };
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
  note?: string;
  contractHtml?: string;
  envelopeId?: string;
  confirmedAt?: string;
  notifications?: BookingNotification[];
  forms?: BookingForms;
  checked: boolean;
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
  note?: string;
}

export type UpdateBookingPayload = Partial<CreateBookingPayload> & {
  status?: BookingStatus;
};

export interface SendContractPayload {
  templateId?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  country?: string;
  huntInterest?: string;
  huntDate?: string;
  firearmOptions?: "Company Rifles" | "Bringing Own";
  totalAmount?: number;
  note?: string;
  paymentSchedule?: Array<{
    label: string;
    amount: number;
    dueDate: string;
  }>;
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

export type FormType = "medical" | "declaration";

export interface SendFormResponse {
  data: {
    envelopeId: string;
    formType: FormType;
    status: string;
    sentTo: string;
  };
}

export interface MarkDeclarationSignedResponse {
  data: {
    status: string;
  };
}
