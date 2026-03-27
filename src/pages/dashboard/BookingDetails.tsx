import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Building2,
  Globe,
  ShieldCheck,
  StickyNote,
  FileSignature,
  Download,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Send,
  Pencil,
  ClipboardCheck,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking.store";
import type { Booking, BookingStatus } from "@/types/booking";
import * as bookingsApi from "@/api/bookings.api";
import toast from "react-hot-toast";
import ResendContractModal from "@/components/layout/dashboard/booking/ResendContractModal";

const statusColorMap: Record<BookingStatus, string> = {
  Draft: "text-slate-600 bg-slate-100 border-slate-200",
  Tentative: "text-blue-700 bg-blue-50 border-blue-200",
  Signed: "text-purple-700 bg-purple-50 border-purple-200",
  Confirmed: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Declined: "text-orange-700 bg-orange-50 border-orange-200",
  Cancelled: "text-red-700 bg-red-50 border-red-200",
};

const statusSteps: BookingStatus[] = ["Draft", "Tentative", "Signed", "Confirmed"];

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sendContract, downloadContract, markPaymentPaid } =
    useBookingStore();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment editor state
  const [editingPayments, setEditingPayments] = useState(false);
  const [paymentDraft, setPaymentDraft] = useState<
    { label: string; amount: string; dueDate: string }[]
  >([]);

  // Note editor state
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  // Resend contract modal state
  const [resendModalOpen, setResendModalOpen] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await bookingsApi.getBooking(id);
      setBooking(data);
    } catch {
      toast.error("Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  // -- Auto-Refresh Polling --
  // If the booking is waiting on a signature, poll every 10 seconds
  // Pause polling when the resend modal is open to avoid resetting form values
  useEffect(() => {
    if (!booking || resendModalOpen) return;

    const isAwaitingSignature =
      booking.status === "Tentative" ||
      booking.forms?.medical?.status === "Sent" ||
      booking.forms?.declaration?.status === "Sent via DocuSign";

    if (!isAwaitingSignature) return;

    const interval = setInterval(async () => {
      try {
        // First sync statuses from DocuSign → DB
        await bookingsApi.syncStatuses();
        // Then fetch the updated booking
        const data = await bookingsApi.getBooking(id!);
        setBooking(data);
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [booking, id, resendModalOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading booking details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Booking not found</p>
        <Button onClick={() => navigate("/dashboard/booking")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bookings
        </Button>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(booking.status);
  const canEditPayments = ["Draft", "Tentative"].includes(booking.status);
  const canSendContract = booking.status === "Draft";
  const canResendContract = booking.status !== "Draft";
  //const canConfirmDeposit = booking.status === "Signed";
  const canDownload = ["Signed", "Confirmed"].includes(booking.status);
  const canMarkPayments = ["Signed", "Confirmed"].includes(booking.status);

  const paidCount = booking.paymentSchedule.filter((p) => p.paid).length;
  const totalPayments = booking.paymentSchedule.length;
  const paidAmount = booking.paymentSchedule
    .filter((p) => p.paid)
    .reduce((sum, p) => sum + p.amount, 0);

  // -- Payment editor handlers --

  const startEditPayments = () => {
    setPaymentDraft(
      [...booking.paymentSchedule]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .map((p) => ({
          label: p.label,
          amount: p.amount.toString(),
          dueDate: p.dueDate ? new Date(p.dueDate).toISOString().split("T")[0] : "",
        }))
    );
    setEditingPayments(true);
  };

  const addPaymentRow = () => {
    setPaymentDraft([
      ...paymentDraft,
      { label: "", amount: "", dueDate: "" },
    ]);
  };

  const removePaymentRow = (idx: number) => {
    setPaymentDraft(paymentDraft.filter((_, i) => i !== idx));
  };

  const updatePaymentRow = (
    idx: number,
    field: "label" | "amount" | "dueDate",
    value: string
  ) => {
    const updated = [...paymentDraft];
    updated[idx] = { ...updated[idx], [field]: value };
    setPaymentDraft(updated);
  };

  const savePayments = async () => {
    // Validate required fields
    for (const p of paymentDraft) {
      if (!p.label || !p.amount || !p.dueDate) {
        toast.error("All payment fields are required");
        return;
      }
      if (Number(p.amount) <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }
    }

    // Validate 60-day rule: every payment due date must be at least 60 days before the hunt date
    if (booking.huntDate) {
      const huntDate = new Date(booking.huntDate);
      huntDate.setHours(0, 0, 0, 0);
      const sixtyDaysBefore = new Date(huntDate);
      sixtyDaysBefore.setDate(sixtyDaysBefore.getDate() - 60);

      for (const p of paymentDraft) {
        const dueDate = new Date(p.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate > sixtyDaysBefore) {
          toast.error(
            `"${p.label || "Payment"}" due date must be at least 60 days before the hunt date (${sixtyDaysBefore.toLocaleDateString()})`
          );
          return;
        }
      }
    }

    try {
      toast.loading("Saving payment schedule...");
      const schedule = paymentDraft.map((p) => ({
        label: p.label,
        amount: Number(p.amount),
        dueDate: p.dueDate,
      }));
      const totalAmount = schedule.reduce((s, p) => s + p.amount, 0);

      await bookingsApi.updateBooking(booking._id, {
        paymentSchedule: schedule,
        totalAmount,
      });
      toast.dismiss();
      toast.success("Payment schedule saved!");
      setEditingPayments(false);
      fetchBooking();
    } catch {
      toast.dismiss();
      toast.error("Failed to save payment schedule");
    }
  };

  const handleSendContract = async () => {
    try {
      toast.loading("Sending contract via DocuSign...");
      await sendContract(booking._id);
      toast.dismiss();
      toast.success("Contract sent successfully!");
      fetchBooking();
    } catch {
      toast.dismiss();
      toast.error("Failed to send contract");
    }
  };

  // const handleConfirmDeposit = async () => {
  //   try {
  //     toast.loading("Confirming deposit...");
  //     await confirmDeposit(booking._id);
  //     toast.dismiss();
  //     toast.success("Deposit confirmed! Confirmation email sent.");
  //     fetchBooking();
  //   } catch {
  //     toast.dismiss();
  //     toast.error("Failed to confirm deposit");
  //   }
  // };

  const handleDownload = async () => {
    try {
      toast.loading("Downloading contract...");
      await downloadContract(booking._id);
      toast.dismiss();
      toast.success("Contract downloaded!");
    } catch {
      toast.dismiss();
      toast.error("Failed to download contract");
    }
  };

  const handleMarkPaid = async (idx: number) => {
    try {
      toast.loading("Marking payment as received...");
      await markPaymentPaid(booking._id, idx);
      toast.dismiss();
      toast.success("Payment marked as received!");
      fetchBooking();
    } catch {
      toast.dismiss();
      toast.error("Failed to mark payment");
    }
  };

  const handleSendReminder = async (idx: number) => {
    try {
      toast.loading("Sending payment reminder...");
      await bookingsApi.sendPaymentReminder(booking._id, idx);
      toast.dismiss();
      toast.success("Payment reminder sent!");
      fetchBooking();
    } catch {
      toast.dismiss();
      toast.error("Failed to send reminder");
    }
  };

  const startEditNote = () => {
    setNoteDraft(booking.note || "");
    setEditingNote(true);
  };

  const saveNote = async () => {
    try {
      toast.loading("Saving note...");
      await bookingsApi.updateBooking(booking._id, { note: noteDraft });
      toast.dismiss();
      toast.success("Note saved!");
      setEditingNote(false);
      fetchBooking();
    } catch {
      toast.dismiss();
      toast.error("Failed to save note");
    }
  };

  // -- Form handlers --

  const handleSendMedicalForm = async () => {
    try {
      toast.loading("Sending Food & Medical Form...");
      await bookingsApi.sendForm(booking._id, "medical");
      toast.dismiss();
      toast.success("Food & Medical Form sent!");
      fetchBooking();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || err.message || "Failed to send medical form");
    }
  };

  const handleSendDeclarationForm = async () => {
    try {
      toast.loading("Sending Prohibited Person Declaration...");
      await bookingsApi.sendForm(booking._id, "declaration");
      toast.dismiss();
      toast.success("Prohibited Person Declaration sent!");
      fetchBooking();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || err.message || "Failed to send declaration form");
    }
  };

  const handleMarkDeclarationSigned = async () => {
    try {
      toast.loading("Marking declaration as signed...");
      await bookingsApi.markDeclarationSigned(booking._id);
      toast.dismiss();
      toast.success("Declaration marked as signed!");
      fetchBooking();
    } catch {
      toast.dismiss();
      toast.error("Failed to mark declaration");
    }
  };

  const handleDownloadForm = async (formType: "medical" | "declaration") => {
    try {
      toast.loading("Downloading form...");
      await bookingsApi.downloadForm(booking._id, formType);
      toast.dismiss();
      toast.success("Form downloaded!");
    } catch {
      toast.dismiss();
      toast.error("Failed to download form");
    }
  };

  // Form status helpers
  const medicalStatus = booking.forms?.medical?.status || "Not Sent";
  const declarationStatus = booking.forms?.declaration?.status || "Not Assigned";

  const getFormStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      "Not Sent": "text-slate-600 bg-slate-100 border-slate-200",
      "Sent": "text-blue-700 bg-blue-50 border-blue-200",
      "Signed": "text-emerald-700 bg-emerald-50 border-emerald-200",
      "Not Assigned": "text-slate-600 bg-slate-100 border-slate-200",
      "Sent via DocuSign": "text-blue-700 bg-blue-50 border-blue-200",
      "Signed Manually": "text-purple-700 bg-purple-50 border-purple-200",
    };
    return map[status] || "text-slate-600 bg-slate-100 border-slate-200";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/booking")}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {booking.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusColorMap[booking.status]}`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {booking.email} • Created{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {canSendContract && (
            <Button
              onClick={handleSendContract}
              className="flex-1 md:flex-none cursor-pointer"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Contract
            </Button>
          )}
          {canResendContract && (
            <Button
              onClick={() => setResendModalOpen(true)}
              className="flex-1 md:flex-none cursor-pointer"
            >
              <Send className="h-4 w-4 mr-2" />
              Resend Contract
            </Button>
          )}
          {/* Confirm Deposit button commented out
          {canConfirmDeposit && (
            <Button
              onClick={handleConfirmDeposit}
              className="flex-1 md:flex-none cursor-pointer bg-emerald-600 hover:bg-emerald-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Confirm Deposit
            </Button>
          )}
          */}
          {canDownload && (
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex-1 md:flex-none cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Contract
            </Button>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em] mb-4">
          Booking Progress
        </h3>
        <div className="relative flex justify-between px-4">
          {/* Background bar */}
          <div className="absolute top-4 left-4 right-4 h-[3px] bg-muted rounded-full" style={{ zIndex: 0 }} />
          {/* Active bar */}
          <div
            className="absolute top-4 left-4 h-[3px] bg-primary rounded-full transition-all duration-700"
            style={{
              width: currentStepIndex >= 0
                ? `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`
                : "0%",
              zIndex: 1,
            }}
          />
          {statusSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isDone = isCompleted || isCurrent;
            return (
              <div key={step} className="flex flex-col items-center gap-2" style={{ zIndex: 2 }}>
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                    isDone
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDone ? "text-primary" : "text-muted-foreground/60"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Client Info */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em]">
              Client Information
            </h3>
            <InfoRow icon={<Mail size={16} />} label="Email" value={booking.email} />
            <InfoRow icon={<Phone size={16} />} label="Phone" value={booking.phone} />
            <InfoRow
              icon={<Building2 size={16} />}
              label="Company"
              value={booking.company || "N/A"}
            />
            <InfoRow
              icon={<Globe size={16} />}
              label="Country"
              value={booking.country || "N/A"}
            />
            <InfoRow
              icon={<ShieldCheck size={16} />}
              label="Hunt Interest"
              value={booking.huntInterest || "N/A"}
            />
            <InfoRow
              icon={<Calendar size={16} />}
              label="Hunt Date"
              value={
                booking.huntDate
                  ? new Date(booking.huntDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"
              }
            />
          </div>

          {/* Notes */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                <StickyNote size={14} className="text-amber-500" /> Internal Notes
              </h3>
              {!editingNote && (
                <button
                  onClick={startEditNote}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
            {editingNote ? (
              <div className="space-y-3">
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  rows={4}
                  className="w-full bg-background border rounded-xl text-sm py-3 px-4 outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Add internal notes about this booking..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingNote(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveNote}
                    className="cursor-pointer"
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            ) : booking.note ? (
              <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 text-sm text-amber-900/80 italic">
                "{booking.note}"
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No notes yet. Click the pencil icon to add one.</p>
            )}
          </div>
        </div>

        {/* Right Column — Payment Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em]">
                  Payment Schedule
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-2xl font-bold">
                    ${booking.totalAmount?.toLocaleString() || "0"}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-medium">
                    {paidCount}/{totalPayments} paid • $
                    {paidAmount.toLocaleString()} received
                  </span>
                </div>
              </div>
              {canEditPayments && !editingPayments && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startEditPayments}
                  className="cursor-pointer"
                >
                  <FileSignature className="h-4 w-4 mr-1" />
                  Edit Payments
                </Button>
              )}
            </div>

            {/* Payment Progress Bar */}
            <div className="px-6 py-3 bg-muted/20 border-b">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width:
                      totalPayments > 0
                        ? `${(paidCount / totalPayments) * 100}%`
                        : "0%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground font-medium">
                  ${paidAmount.toLocaleString()} received
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  ${((booking.totalAmount || 0) - paidAmount).toLocaleString()}{" "}
                  remaining
                </span>
              </div>
            </div>

            {editingPayments ? (
              /* Edit Mode */
              <div className="p-6 space-y-4">
                {paymentDraft.map((p, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-3 items-end"
                  >
                    <div className="col-span-4">
                      {idx === 0 && (
                        <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                          Description
                        </label>
                      )}
                      <input
                        type="text"
                        value={p.label}
                        onChange={(e) =>
                          updatePaymentRow(idx, "label", e.target.value)
                        }
                        className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Initial Deposit"
                      />
                    </div>
                    <div className="col-span-3">
                      {idx === 0 && (
                        <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                          Amount ($)
                        </label>
                      )}
                      <input
                        type="number"
                        value={p.amount}
                        onChange={(e) =>
                          updatePaymentRow(idx, "amount", e.target.value)
                        }
                        className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
                        placeholder="5000"
                        min={0}
                      />
                    </div>
                    <div className="col-span-4">
                      {idx === 0 && (
                        <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                          Due Date
                        </label>
                      )}
                      <input
                        type="date"
                        value={p.dueDate}
                        onChange={(e) =>
                          updatePaymentRow(idx, "dueDate", e.target.value)
                        }
                        className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removePaymentRow(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPaymentRow}
                  className="w-full border-2 border-dashed border-muted rounded-xl py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> Add Payment Installment
                </button>

                {paymentDraft.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-bold">
                      Total: $
                      {paymentDraft
                        .reduce((s, p) => s + (Number(p.amount) || 0), 0)
                        .toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPayments(false)}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={savePayments}
                        className="cursor-pointer"
                      >
                        Save Schedule
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* View Mode */
              <div className="divide-y">
                {booking.paymentSchedule.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No payments scheduled.{" "}
                    {canEditPayments && (
                      <button
                        className="text-primary underline cursor-pointer"
                        onClick={startEditPayments}
                      >
                        Add payments
                      </button>
                    )}
                  </div>
                ) : (
                  (() => {
                    const sorted = [...booking.paymentSchedule]
                      .map((p, originalIdx) => ({ ...p, originalIdx }))
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                    // Find the first unpaid payment in sorted order
                    const firstUnpaidIdx = sorted.findIndex((p) => !p.paid);

                    return sorted.map((p, sortedIdx) => {
                      const isNextActionable = sortedIdx === firstUnpaidIdx;
                      return (
                        <div
                          key={p.originalIdx}
                          className={`flex items-center justify-between p-4 ${
                            p.paid ? "bg-emerald-50/30" : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                p.paid
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {p.paid ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <Clock size={20} />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{p.label}</p>
                              <p className="text-[11px] text-muted-foreground">
                                Due:{" "}
                                {new Date(p.dueDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                                {p.paidAt && (
                                  <span className="text-emerald-600 ml-2">
                                    • Paid{" "}
                                    {new Date(p.paidAt).toLocaleDateString()}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">
                              ${p.amount.toLocaleString()}
                            </span>
                            {!p.paid && canMarkPayments && isNextActionable && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendReminder(p.originalIdx)}
                                  className="text-xs cursor-pointer hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Send Reminder
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkPaid(p.originalIdx)}
                                  className="text-xs cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Mark Received
                                </Button>
                              </>
                            )}
                            {p.paid && (
                              <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                                Received
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            )}
          </div>

          {/* Forms & Documents */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em]">
                Forms & Documents
              </h3>
            </div>

            {/* Food & Medical Form */}
            <div className="p-5 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <HeartPulse size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Food & Medical Form</p>
                    <p className="text-[11px] text-muted-foreground">
                      Dietary restrictions, allergies & medical info
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getFormStatusBadge(medicalStatus)}`}
                  >
                    {medicalStatus}
                  </span>
                  {medicalStatus === "Not Sent" && (
                    <Button
                      size="sm"
                      onClick={handleSendMedicalForm}
                      className="text-xs cursor-pointer"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send Form
                    </Button>
                  )}
                  {medicalStatus === "Sent" && (
                    <span className="text-[10px] text-blue-600 font-medium italic">
                      Awaiting signature...
                    </span>
                  )}
                  {medicalStatus === "Signed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadForm("medical")}
                      className="text-xs cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download Form
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Prohibited Person Declaration */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Prohibited Person Declaration</p>
                    <p className="text-[11px] text-muted-foreground">
                      PF495 — legal declaration required before hunt
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getFormStatusBadge(declarationStatus)}`}
                  >
                    {declarationStatus}
                  </span>
                  {declarationStatus === "Not Assigned" && (
                    <>
                      <Button
                        size="sm"
                        onClick={handleSendDeclarationForm}
                        className="text-xs cursor-pointer"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send via DocuSign
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMarkDeclarationSigned}
                        className="text-xs cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Mark Signed
                      </Button>
                    </>
                  )}
                  {declarationStatus === "Sent via DocuSign" && (
                    <span className="text-[10px] text-blue-600 font-medium italic">
                      Awaiting signature...
                    </span>
                  )}
                  {(declarationStatus === "Signed" || declarationStatus === "Signed Manually") && booking.forms?.declaration?.envelopeId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadForm("declaration")}
                      className="text-xs cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download Form
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications / Activity */}
          {booking.notifications && booking.notifications.length > 0 && (
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em] mb-4">
                Activity Log
              </h3>
              <div className="space-y-3">
                {[...booking.notifications]
                  .reverse()
                  .slice(0, 10)
                  .map((n: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-foreground">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resend Contract Modal */}
      <ResendContractModal
        isOpen={resendModalOpen}
        onClose={() => setResendModalOpen(false)}
        booking={booking}
        onContractResent={fetchBooking}
      />
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 p-2 rounded-xl bg-background border border-border/50 text-muted-foreground shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground/90">{value}</span>
    </div>
  </div>
);

export default BookingDetails;