import { Modal } from "@/components/ui/modal";
import type { Lead } from "@/types/leads";

interface Props {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetailsModal = ({ lead, isOpen, onClose }: Props) => {
  if (!lead) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="lg">
      <div className="space-y-3">
        <div>
          <b>Name:</b> {lead.name}
        </div>
        <div>
          <b>Email:</b> {lead.email}
        </div>
        <div>
          <b>Phone:</b> {lead.phone}
        </div>
        <div>
          <b>Company:</b> {lead.company}
        </div>
        <div>
          <b>Country:</b> {lead.country}
        </div>
        <div>
          <b>Status:</b> {lead.status}
        </div>

        <div>
          <b>Notes:</b>
          {lead.notes.length > 1 ? (
            lead.notes.map((n, i) => (
              <div key={i} className="text-sm border p-2 rounded mt-1 italic">
                {n.note}
              </div>
            ))
          ) : (
            <div className="text-sm border p-2 rounded mt-1">
              No notes available. Add a note to keep track of important
              information.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LeadDetailsModal;
