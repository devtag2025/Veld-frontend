import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

const BookingModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Hunt Booking">
      <form className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Client & Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Client Name
              </label>
              <input
                type="text"
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                  Hunt Year
                </label>
                <select className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none">
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                  Date Range
                </label>
                <input
                  type="text"
                  className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
                  placeholder="Oct 12-18"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Hunt Details & Compliance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Package Type
              </label>
              <select className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none">
                <option value="Premium">Premium Safari</option>
                <option value="Standard">Standard Hunt</option>
                <option value="Big Game">Big Game Special</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-bold mb-1 uppercase text-muted-foreground">
                  Contract
                </label>
                <select className="w-full bg-background border rounded-md text-[10px] py-1.5 px-1 outline-none">
                  <option value="pending">Pending</option>
                  <option value="signed">Signed</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold mb-1 uppercase text-muted-foreground">
                  Payment
                </label>
                <select className="w-full bg-background border rounded-md text-[10px] py-1.5 px-1 outline-none">
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold mb-1 uppercase text-muted-foreground">
                  Firearm
                </label>
                <select className="w-full bg-background border rounded-md text-[10px] py-1.5 px-1 outline-none">
                  <option value="needed">Needed</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Critical Deadline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Deadline Title
              </label>
              <input
                type="text"
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
                placeholder="e.g., Deposit Due"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
                Deadline Date
              </label>
              <input
                type="date"
                className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
              />
            </div>
          </div>
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
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            Save Booking Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;
