import { create } from "zustand";
import * as bookingsApi from "@/api/bookings.api";
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
  SyncStatusItem,
} from "@/types/booking";

interface BookingFilters {
  status?: string;
  name?: string;
}

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;

  // CRUD
  fetchBookings: (filters?: BookingFilters) => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  createBooking: (data: CreateBookingPayload) => Promise<Booking>;
  updateBooking: (id: string, data: UpdateBookingPayload) => Promise<Booking>;
  deleteBooking: (id: string) => Promise<void>;

  // DocuSign
  sendContract: (id: string, templateId?: string) => Promise<void>;
  syncStatuses: () => Promise<SyncStatusItem[]>;
  downloadContract: (id: string) => Promise<void>;

  // Payments
  confirmDeposit: (id: string, paymentIndex?: number) => Promise<void>;
  markPaymentPaid: (id: string, paymentIndex: number) => Promise<void>;

  // Helpers
  setSelectedBooking: (booking: Booking | null) => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingsApi.getBookings(filters);
      set({ bookings, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch bookings",
        isLoading: false,
      });
    }
  },

  fetchBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingsApi.getBooking(id);
      set({ selectedBooking: booking, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch booking",
        isLoading: false,
      });
    }
  },

  createBooking: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingsApi.createBooking(data);
      set((state) => ({
        bookings: [booking, ...state.bookings],
        isLoading: false,
      }));
      return booking;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to create booking";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateBooking: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await bookingsApi.updateBooking(id, data);
      set((state) => ({
        bookings: state.bookings.map((b) => (b._id === id ? updated : b)),
        selectedBooking:
          state.selectedBooking?._id === id ? updated : state.selectedBooking,
        isLoading: false,
      }));
      return updated;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to update booking";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  deleteBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await bookingsApi.deleteBooking(id);
      set((state) => ({
        bookings: state.bookings.filter((b) => b._id !== id),
        selectedBooking:
          state.selectedBooking?._id === id ? null : state.selectedBooking,
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete booking",
        isLoading: false,
      });
      throw new Error("Failed to delete booking");
    }
  },

  sendContract: async (id, templateId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingsApi.sendContract(
        id,
        templateId ? { templateId } : undefined,
      );
      // Update the booking status locally
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === id ? { ...b, status: response.data.status } : b,
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to send contract",
        isLoading: false,
      });
      throw new Error("Failed to send contract");
    }
  },

  syncStatuses: async () => {
    try {
      const response = await bookingsApi.syncStatuses();
      const updatedItems = response.data.updated;

      if (updatedItems.length > 0) {
        // Re-fetch bookings to get the latest data
        const bookings = await bookingsApi.getBookings();
        set({ bookings });
      }

      return updatedItems;
    } catch (err: any) {
      console.warn("Failed to sync DocuSign statuses:", err);
      return [];
    }
  },

  downloadContract: async (id) => {
    try {
      const blob = await bookingsApi.downloadContract(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to download contract",
      });
      throw new Error("Failed to download contract");
    }
  },

  confirmDeposit: async (id, paymentIndex) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingsApi.confirmDeposit(id, paymentIndex);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === id
            ? {
                ...b,
                status: response.data.status,
                confirmedAt: response.data.confirmedAt,
                paymentSchedule: response.data.paymentSchedule,
              }
            : b,
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to confirm deposit",
        isLoading: false,
      });
      throw new Error("Failed to confirm deposit");
    }
  },

  markPaymentPaid: async (id, paymentIndex) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingsApi.markPaymentPaid(id, paymentIndex);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === id
            ? { ...b, paymentSchedule: response.data.paymentSchedule }
            : b,
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to mark payment",
        isLoading: false,
      });
      throw new Error("Failed to mark payment as paid");
    }
  },

  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  clearError: () => set({ error: null }),
}));
