import http from "@/lib/httpClient";
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
  SendContractPayload,
  SendContractResponse,
  SyncStatusResponse,
  ContractStatusResponse,
  ConfirmDepositResponse,
  MarkPaidResponse,
  FormType,
  SendFormResponse,
  MarkDeclarationSignedResponse,
  PaginatedBookingsResponse,
} from "@/types/booking";

// ── CRUD ──────────────────────────────────────────────

export const getBookingStats = async () => {
  const { data } = await http.get("/bookings/stats");
  return data as Record<string, number>;
};

export const getBookings = async (params?: {
  status?: string;
  name?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await http.get("/bookings", { params });
  return data as PaginatedBookingsResponse;
};

export const getBooking = async (id: string) => {
  const { data } = await http.get(`/bookings/${id}`);
  return data.data as Booking;
};

export const createBooking = async (payload: CreateBookingPayload) => {
  const { data } = await http.post("/bookings", payload);
  return data.data as Booking;
};

export const updateBooking = async (
  id: string,
  payload: UpdateBookingPayload,
) => {
  const { data } = await http.put(`/bookings/${id}`, payload);
  return data.data as Booking;
};

export const deleteBooking = async (id: string) => {
  const { data } = await http.delete(`/bookings/${id}`);
  return data;
};

// ── DocuSign Contracts ────────────────────────────────

export const sendContract = async (
  id: string,
  payload?: SendContractPayload,
) => {
  const { data } = await http.post<SendContractResponse>(
    `/bookings/${id}/send-contract`,
    payload ?? {},
  );
  return data;
};

export const syncStatuses = async () => {
  const { data } = await http.get<SyncStatusResponse>(
    "/bookings/sync-statuses",
  );
  return data;
};

export const getContractStatus = async (id: string) => {
  const { data } = await http.get<ContractStatusResponse>(
    `/bookings/${id}/contract-status`,
  );
  return data;
};

export const downloadContract = async (id: string) => {
  const { data } = await http.get(`/bookings/${id}/contract`, {
    responseType: "blob",
  });
  return data as Blob;
};

// ── Forms (DocuSign Templates) ────────────────────────

export const sendForm = async (id: string, formType: FormType) => {
  const { data } = await http.post<SendFormResponse>(
    `/bookings/${id}/forms/${formType}/send`,
  );
  return data;
};

export const markDeclarationSigned = async (id: string) => {
  const { data } = await http.put<MarkDeclarationSignedResponse>(
    `/bookings/${id}/forms/declaration/mark-signed`,
  );
  return data;
};

export const downloadForm = async (id: string, formType: "medical" | "declaration") => {
  const response = await http.get(`/bookings/${id}/forms/${formType}/download`, {
    responseType: "blob",
  });

  // Create a download link and trigger it
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const formLabel = formType === "medical" ? "Food-Medical-Form" : "Prohibited-Person-Declaration";
  link.download = `${formLabel}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
// ── Payments ──────────────────────────────────────────

export const confirmDeposit = async (
  id: string,
  paymentIndex?: number,
) => {
  const { data } = await http.post<ConfirmDepositResponse>(
    `/bookings/${id}/confirm-deposit`,
    paymentIndex !== undefined ? { paymentIndex } : {},
  );
  return data;
};

export const markPaymentPaid = async (
  id: string,
  paymentIndex: number,
) => {
  const { data } = await http.put<MarkPaidResponse>(
    `/bookings/${id}/payments/${paymentIndex}/mark-paid`,
  );
  return data;
};

export const sendPaymentReminder = async (
  id: string,
  paymentIndex: number,
) => {
  const { data } = await http.post(
    `/bookings/${id}/payments/${paymentIndex}/send-reminder`,
  );
  return data;
};
