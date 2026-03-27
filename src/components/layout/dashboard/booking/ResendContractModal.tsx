import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import * as bookingsApi from "@/api/bookings.api";
import type { Booking } from "@/types/booking";
import { isHuntDateValid } from "@/utils/paymentSchedule";

interface ExistingPayment {
  label: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidAt?: string;
}

interface NewPaymentRow {
  label: string;
  amount: string;
  dueDate: string;
}

interface ResendContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onContractResent: () => void;
}

const ResendContractModal = ({
  isOpen,
  onClose,
  booking,
  onContractResent,
}: ResendContractModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [huntInterest, setHuntInterest] = useState("");
  const [huntDate, setHuntDate] = useState("");
  const [firearmOptions, setFirearmOptions] = useState<
    "Company Rifles" | "Bringing Own"
  >("Company Rifles");
  const [totalAmount, setTotalAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Existing payments from the booking (read-only for paid ones)
  const [existingPayments, setExistingPayments] = useState<ExistingPayment[]>([]);
  // New payments added by admin
  const [newPayments, setNewPayments] = useState<NewPaymentRow[]>([]);

  // Min hunt date = 60 days from today
  const minHuntDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split("T")[0];
  }, []);

  // Pre-fill with existing booking data when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      setName(booking.name || "");
      setEmail(booking.email || "");
      setPhone(booking.phone || "");
      setCompany(booking.company || "");
      setCountry(booking.country || "");
      setHuntInterest(booking.huntInterest || "");
      setHuntDate(
        booking.huntDate
          ? new Date(booking.huntDate).toISOString().split("T")[0]
          : ""
      );
      setFirearmOptions(booking.firearmOptions || "Company Rifles");
      setTotalAmount(booking.totalAmount?.toString() || "");
      setNote(booking.note || "");

      // Load existing payment schedule sorted by due date, preserving paid status
      if (booking.paymentSchedule && booking.paymentSchedule.length > 0) {
        const sorted = [...booking.paymentSchedule]
          .map((p) => ({
            label: p.label,
            amount: p.amount,
            dueDate: p.dueDate
              ? new Date(p.dueDate).toISOString().split("T")[0]
              : "",
            paid: p.paid || false,
            paidAt: p.paidAt,
          }))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        setExistingPayments(sorted);
      } else {
        setExistingPayments([]);
      }
      setNewPayments([]);
    }
  }, [isOpen, booking]);

  // New payment helpers
  const addPaymentRow = () => {
    setNewPayments([...newPayments, { label: "", amount: "", dueDate: "" }]);
  };

  const removeNewPaymentRow = (idx: number) => {
    setNewPayments(newPayments.filter((_, i) => i !== idx));
  };

  const updateNewPaymentRow = (
    idx: number,
    field: keyof NewPaymentRow,
    value: string
  ) => {
    const updated = [...newPayments];
    updated[idx] = { ...updated[idx], [field]: value };
    setNewPayments(updated);
  };

  // Remove an existing unpaid payment
  const removeExistingPayment = (idx: number) => {
    setExistingPayments(existingPayments.filter((_, i) => i !== idx));
  };

  // Edit an existing unpaid payment
  const updateExistingPayment = (
    idx: number,
    field: keyof ExistingPayment,
    value: string | number
  ) => {
    const updated = [...existingPayments];
    updated[idx] = { ...updated[idx], [field]: value };
    setExistingPayments(updated);
  };

  // Combined total from all payments
  const existingTotal = existingPayments.reduce((sum, p) => sum + p.amount, 0);
  const newTotal = newPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );
  const paymentTotal = existingTotal + newTotal;
  const hasAnyPayments = existingPayments.length > 0 || newPayments.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !huntDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isHuntDateValid(huntDate)) {
      toast.error("Hunt date must be at least 60 days from today");
      return;
    }

    // Validate new payment rows
    for (const p of newPayments) {
      if (!p.label || !p.amount || !p.dueDate) {
        toast.error("All payment fields (description, amount, due date) are required");
        return;
      }
      if (Number(p.amount) <= 0) {
        toast.error("Payment amount must be greater than 0");
        return;
      }
    }

    // Validate existing unpaid payment rows that may have been edited
    for (const p of existingPayments) {
      if (!p.label || !p.amount || !p.dueDate) {
        toast.error("All payment fields (description, amount, due date) are required");
        return;
      }
    }

    const finalTotalAmount = hasAnyPayments ? paymentTotal : Number(totalAmount);
    if (finalTotalAmount < 5000) {
      toast.error("Total payment amount must be at least $5000");
      return;
    }

    // Combine existing payments (with their paid status preserved) and new ones
    const combinedSchedule = [
      ...existingPayments.map((p) => ({
        label: p.label,
        amount: p.amount,
        dueDate: p.dueDate,
        paid: p.paid,
        paidAt: p.paidAt,
      })),
      ...newPayments.map((p) => ({
        label: p.label,
        amount: Number(p.amount),
        dueDate: p.dueDate,
        paid: false,
      })),
    ];

    setIsSending(true);
    try {
      toast.loading("Re-sending contract via DocuSign...");
      await bookingsApi.sendContract(booking._id, {
        name,
        email,
        phone,
        company: company || undefined,
        country: country || undefined,
        huntInterest: huntInterest || undefined,
        huntDate,
        firearmOptions,
        totalAmount: hasAnyPayments ? paymentTotal : Number(totalAmount),
        note: note || undefined,
        paymentSchedule: combinedSchedule.length > 0 ? combinedSchedule : undefined,
      });
      toast.dismiss();
      toast.success("Contract re-sent successfully!");
      onContractResent();
      onClose();
    } catch {
      toast.dismiss();
      toast.error("Failed to resend contract");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resend Contract"
      size="xl"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          This will re-send the contract with the updated details below.
          Previously received payments will retain their status.
        </p>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Client Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. John Hunter"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="Hunt Co"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="Australia"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Hunt Interest
              </label>
              <input
                type="text"
                value={huntInterest}
                onChange={(e) => setHuntInterest(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Red Stag"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Hunt Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Hunt Date *
              </label>
              <input
                type="date"
                required
                min={minHuntDate}
                value={huntDate}
                onChange={(e) => setHuntDate(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
              />
              {huntDate && !isHuntDateValid(huntDate) && (
                <p className="text-[10px] text-red-500 mt-1">Hunt date must be at least 60 days from today</p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Firearm Option
              </label>
              <select
                value={firearmOptions}
                onChange={(e) =>
                  setFirearmOptions(
                    e.target.value as "Company Rifles" | "Bringing Own"
                  )
                }
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
              >
                <option value="Company Rifles">Company Rifles</option>
                <option value="Bringing Own">Bringing Own</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Schedule Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
              Payment Schedule
            </h3>
            {hasAnyPayments && (
              <span className="text-xs font-bold text-muted-foreground">
                Total: ${paymentTotal.toLocaleString()}
              </span>
            )}
          </div>

          {/* Existing Payments — sorted by date */}
          {existingPayments.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Existing Payments
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-12 gap-3 px-2">
                <div className="col-span-3">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Description</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Amount ($)</span>
                </div>
                <div className="col-span-3">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Due Date</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Status</span>
                </div>
                <div className="col-span-2" />
              </div>

              {existingPayments.map((p, idx) => (
                <div
                  key={`existing-${idx}`}
                  className={`grid grid-cols-12 gap-3 items-center rounded-lg px-2 py-2.5 ${
                    p.paid
                      ? "bg-emerald-50/60 border border-emerald-200"
                      : "bg-amber-50/40 border border-amber-200"
                  }`}
                >
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={p.label}
                      disabled={p.paid}
                      onChange={(e) =>
                        updateExistingPayment(idx, "label", e.target.value)
                      }
                      className={`w-full border rounded-lg text-sm py-2 px-3 outline-none ${
                        p.paid
                          ? "bg-emerald-50 text-emerald-800 cursor-not-allowed font-medium"
                          : "bg-background focus:ring-1 focus:ring-primary"
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={p.amount}
                      disabled={p.paid}
                      onChange={(e) =>
                        updateExistingPayment(idx, "amount", Number(e.target.value))
                      }
                      className={`w-full border rounded-lg text-sm py-2 px-3 outline-none ${
                        p.paid
                          ? "bg-emerald-50 text-emerald-800 cursor-not-allowed font-medium"
                          : "bg-background focus:ring-1 focus:ring-primary"
                      }`}
                      min={0}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="date"
                      value={p.dueDate}
                      disabled={p.paid}
                      onChange={(e) =>
                        updateExistingPayment(idx, "dueDate", e.target.value)
                      }
                      className={`w-full border rounded-lg text-sm py-2 px-3 outline-none ${
                        p.paid
                          ? "bg-emerald-50 text-emerald-800 cursor-not-allowed"
                          : "bg-background"
                      }`}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    {p.paid ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 whitespace-nowrap">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        Received
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 whitespace-nowrap">
                        <Clock size={14} className="text-amber-600 shrink-0" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {p.paid ? (
                      <div className="p-2 text-transparent select-none">—</div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeExistingPayment(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Payments */}
          {newPayments.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                New Payments
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-12 gap-3 px-2">
                <div className="col-span-4">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Description</span>
                </div>
                <div className="col-span-3">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Amount ($)</span>
                </div>
                <div className="col-span-4">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Due Date</span>
                </div>
                <div className="col-span-1" />
              </div>

              {newPayments.map((p, idx) => (
                <div
                  key={`new-${idx}`}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={p.label}
                      onChange={(e) =>
                        updateNewPaymentRow(idx, "label", e.target.value)
                      }
                      className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Additional Charge"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={p.amount}
                      onChange={(e) =>
                        updateNewPaymentRow(idx, "amount", e.target.value)
                      }
                      className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
                      placeholder="5000"
                      min={0}
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="date"
                      value={p.dueDate}
                      onChange={(e) =>
                        updateNewPaymentRow(idx, "dueDate", e.target.value)
                      }
                      className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeNewPaymentRow(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addPaymentRow}
            className="w-full border-2 border-dashed border-muted rounded-xl py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add Payment Installment
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Internal Notes
          </h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="Add any internal notes about this booking..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSending}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            {isSending ? "Sending..." : "Resend Contract"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResendContractModal;
