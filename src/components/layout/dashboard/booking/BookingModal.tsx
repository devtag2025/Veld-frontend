import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useBookingStore } from "@/stores/booking.store";
import type { Lead } from "@/types/leads";
import toast from "react-hot-toast";

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
    setNote("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !huntDate || !totalAmount) {
      toast.error("Please fill in all required fields");
      return;
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
        totalAmount: Number(totalAmount),
        note: note || undefined,
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
                readOnly={isFromLead}
                className={`w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none ${isFromLead ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
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
                readOnly={isFromLead}
                className={`w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none ${isFromLead ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
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
                readOnly={isFromLead}
                className={`w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none ${isFromLead ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
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
                readOnly={isFromLead}
                className={`w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none ${isFromLead ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
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
                readOnly={isFromLead}
                className={`w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none ${isFromLead ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
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
                readOnly={isFromLead}
                className={`w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none ${isFromLead ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
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
                Total Amount ($) *
              </label>
              <input
                type="number"
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
                placeholder="25000"
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
