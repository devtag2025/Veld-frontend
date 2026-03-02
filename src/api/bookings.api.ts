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
} from "@/types/booking";

// ── CRUD ──────────────────────────────────────────────

export const getBookings = async (params?: {
  status?: string;
  name?: string;
}) => {
  const { data } = await http.get("/bookings", { params });
  return data.data as Booking[];
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
