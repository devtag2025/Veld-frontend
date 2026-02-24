import { useState } from "react";
import { createLead, updateLead } from "@/api/leads.api";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Target,
  CheckCircle2,
  Loader2,
  StickyNote,
} from "lucide-react";
import type { Lead } from "@/types/leads";
import toast from "react-hot-toast";

interface Props {
  lead?: Lead | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeadForm = ({ lead, onSuccess, onCancel }: Props) => {
  const isEdit = !!lead;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    country: lead?.country || "",
    company: lead?.company || "",
    huntInterest: lead?.huntInterest || "",
    status: lead?.status || "New",
    note: lead?.note || "", // Initialize note state
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(
      isEdit ? "Updating lead..." : "Creating lead...",
    );

    try {
      if (isEdit) await updateLead(lead!._id, form);
      else await createLead(form);

      toast.success(isEdit ? "Lead updated successfully" : "New lead created", {
        id: toastId,
      });
      onSuccess();
    } catch {
      toast.error("An error occurred. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Full Name" icon={<User size={16} />} required>
            <input
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </FormGroup>

          <FormGroup label="Company" icon={<Building2 size={16} />}>
            <input
              name="company"
              placeholder="Acme Corp"
              value={form.company}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </FormGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
          Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Email Address" icon={<Mail size={16} />} required>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </FormGroup>

          <FormGroup label="Phone Number" icon={<Phone size={16} />} required>
            <input
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </FormGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
          Lead Logistics & Notes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Country" icon={<Globe size={16} />} required>
            <input
              name="country"
              placeholder="United States"
              value={form.country}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </FormGroup>

          <FormGroup label="Lead Status" icon={<CheckCircle2 size={16} />}>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring appearance-none cursor-pointer"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
            </select>
          </FormGroup>
        </div>

        <FormGroup label="Hunt Interest" icon={<Target size={16} />} required>
          <input
            name="huntInterest"
            placeholder="Big Game, Safari, etc."
            value={form.huntInterest}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            required
          />
        </FormGroup>

        <FormGroup label="Internal Notes" icon={<StickyNote size={16} />}>
          <textarea
            name="note"
            rows={4}
            placeholder="Add specific details about the lead's preferences, budget, or previous interactions..."
            value={form.note}
            onChange={handleChange}
            className="flex w-full rounded-md border border-input bg-background px-9 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px] resize-none"
          />
        </FormGroup>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          Discard Changes
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[120px] shadow-sm active:scale-95 transition-all"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
};

const FormGroup = ({ label, icon, children, required }: any) => (
  <div className="flex flex-col space-y-2 relative">
    <label className="text-xs font-bold text-foreground/80 flex items-center gap-1">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

export default LeadForm;
