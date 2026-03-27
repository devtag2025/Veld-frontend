import { useState, useEffect, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useBookingStore } from "@/stores/booking.store";
import type { Lead } from "@/types/leads";
import toast from "react-hot-toast";
import { generatePaymentSchedule, isHuntDateValid } from "@/utils/paymentSchedule";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: Lead | null;
  onBookingCreated?: () => void;
}

const BookingModal = ({ isOpen, onClose, leadData, onBookingCreated }: BookingModalProps) => {
  const { createBooking, isLoading } = useBookingStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [huntInterest, setHuntInterest] = useState("");
  const [huntDate, setHuntDate] = useState("");
  const [firearmOptions, setFirearmOptions] = useState<"Company Rifles" | "Bringing Own">("Company Rifles");
  const [totalAmount, setTotalAmount] = useState("");
  const [note, setNote] = useState("");
  
  const [paymentDraft, setPaymentDraft] = useState<any[]>([]);

  const addPaymentRow = () => {
    setPaymentDraft([
      ...paymentDraft,
      { label: "", amount: "", dueDate: "" },
    ]);
  };

  const removePaymentRow = (index: number) => {
    setPaymentDraft(paymentDraft.filter((_, i) => i !== index));
  };

  const updatePaymentRow = (index: number, field: string, value: string) => {
    const updated = [...paymentDraft];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentDraft(updated);
  };

  const paymentTotal = paymentDraft.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  // Auto-generated schedule preview (only when admin enters total amount without manual rows)
  const autoSchedule = useMemo(() => {
    if (paymentDraft.length > 0 || !totalAmount || !huntDate) return null;
    const amt = Number(totalAmount);
    if (amt < 5000) return null;
    if (!isHuntDateValid(huntDate)) return null;
    return generatePaymentSchedule(amt, huntDate);
  }, [totalAmount, huntDate, paymentDraft.length]);

  // Min hunt date = 60 days from today
  const minHuntDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split("T")[0];
  }, []);

  const isFromLead = !!leadData;

  // Pre-fill fields from lead data when modal opens
  useEffect(() => {
    if (isOpen && leadData) {
      setName(leadData.name || "");
      setEmail(leadData.email || "");
      setPhone(leadData.phone || "");
      setCompany(leadData.company || "");
      setCountry(leadData.country || "");
      setHuntInterest(leadData.huntInterest || "");
      setNote(leadData.note || "");
    }
  }, [isOpen, leadData]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setCountry("");
    setHuntInterest("");
    setHuntDate("");
    setFirearmOptions("Company Rifles");
    setTotalAmount("");
    setPaymentDraft([]);
    setNote("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !company || !country || !huntInterest || !huntDate) {
       toast.error("Please fill in all required fields (except payment if using schedule)");
       return;
    }

    if (!isHuntDateValid(huntDate)) {
      toast.error("Hunt date must be at least 60 days from today");
      return;
    }

    if (paymentDraft.length === 0 && !totalAmount) {
      toast.error("Please provide a total amount or create a payment schedule");
      return;
    }

    const finalTotal = paymentDraft.length > 0 ? paymentTotal : Number(totalAmount);

    if (finalTotal < 5000) {
      toast.error("Total payment amount must be at least $5000");
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

    try {
      await createBooking({
        leadId: leadData?._id || undefined,
        name,
        email,
        phone,
        company: company || undefined,
        country: country || undefined,
        huntInterest: huntInterest || undefined,
        huntDate,
        packageType: "",
        firearmOptions,
        totalAmount: finalTotal,
        note: note || undefined,
        paymentSchedule: paymentDraft.length > 0
          ? paymentDraft.map((p) => ({
              label: p.label,
              amount: Number(p.amount),
              dueDate: p.dueDate,
            }))
          : undefined,
      });
      toast.success("Booking created successfully!");
      resetForm();
      onBookingCreated?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create booking");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isFromLead ? "Convert Lead to Booking" : "Create New Hunt Booking"}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Client Information
          </h3>

          {isFromLead && (
            <p className="text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
              Pre-filled from lead record. Complete the booking details below.
            </p>
          )}

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
                Company *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="Hunt Co"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Country *
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="Australia"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Hunt Interest *
              </label>
              <input
                type="text"
                required
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
                Total Amount ($) * <span className="text-[10px] font-normal lowercase">(minimum $5000)</span>
              </label>
              <input
                type="number"
                disabled={paymentDraft.length > 0}
                value={paymentDraft.length > 0 ? paymentTotal : totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none disabled:bg-muted/50 disabled:cursor-not-allowed"
                placeholder={paymentDraft.length > 0 ? "Calculated from schedule" : "e.g. 15000"}
                min={0}
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
                    e.target.value as "Company Rifles" | "Bringing Own",
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
                Total Scheduled: ${paymentTotal.toLocaleString()}
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

          {/* Auto-generated schedule preview */}
          {autoSchedule && paymentDraft.length === 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
              <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Auto-generated Payment Preview
              </p>
              <p className="text-[10px] text-muted-foreground">
                Since you haven't added manual payments, the following schedule will be auto-created:
              </p>
              <div className="space-y-1.5">
                {autoSchedule.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-background border rounded-lg px-3 py-2">
                    <div>
                      <span className="text-sm font-medium">{p.label}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">
                        Due: {new Date(p.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-sm font-bold">${p.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            onClick={handleClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            {isLoading ? "Creating..." : "Save Booking Record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;
