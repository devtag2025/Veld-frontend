import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import * as bookingsApi from "@/api/bookings.api";
import type { Booking } from "@/types/booking";

interface PaymentRow {
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

  // Payment schedule state
  const [paymentDraft, setPaymentDraft] = useState<PaymentRow[]>([]);

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

      // Pre-fill payment schedule from existing booking
      if (booking.paymentSchedule && booking.paymentSchedule.length > 0) {
        setPaymentDraft(
          booking.paymentSchedule.map((p) => ({
            label: p.label,
            amount: p.amount.toString(),
            dueDate: p.dueDate
              ? new Date(p.dueDate).toISOString().split("T")[0]
              : "",
          }))
        );
      } else {
        setPaymentDraft([]);
      }
    }
  }, [isOpen, booking]);

  // Payment schedule helpers
  const addPaymentRow = () => {
    setPaymentDraft([...paymentDraft, { label: "", amount: "", dueDate: "" }]);
  };

  const removePaymentRow = (idx: number) => {
    setPaymentDraft(paymentDraft.filter((_, i) => i !== idx));
  };

  const updatePaymentRow = (
    idx: number,
    field: keyof PaymentRow,
    value: string
  ) => {
    const updated = [...paymentDraft];
    updated[idx] = { ...updated[idx], [field]: value };
    setPaymentDraft(updated);
  };

  // Auto-calculate total from payments
  const paymentTotal = paymentDraft.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !huntDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate payment rows
    for (const p of paymentDraft) {
      if (!p.label || !p.amount || !p.dueDate) {
        toast.error("All payment fields (description, amount, due date) are required");
        return;
      }
      if (Number(p.amount) <= 0) {
        toast.error("Payment amount must be greater than 0");
        return;
      }
    }

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
        totalAmount: paymentDraft.length > 0 ? paymentTotal : Number(totalAmount),
        note: note || undefined,
        paymentSchedule: paymentDraft.length > 0
          ? paymentDraft.map((p) => ({
              label: p.label,
              amount: Number(p.amount),
              dueDate: p.dueDate,
            }))
          : undefined,
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
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          This will re-send the contract with the updated details below. The
          booking progress will be reset and all payments will be marked as unpaid.
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
                value={huntDate}
                onChange={(e) => setHuntDate(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
              />
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
            {paymentDraft.length > 0 && (
              <span className="text-xs font-bold text-muted-foreground">
                Total: ${paymentTotal.toLocaleString()}
              </span>
            )}
          </div>

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
