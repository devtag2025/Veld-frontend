import { useState } from "react";
import { createLead, updateLead } from "@/api/leads.api";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/leads";

interface Props {
  lead?: Lead | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeadForm = ({ lead, onSuccess, onCancel }: Props) => {
  const isEdit = !!lead;

  const [form, setForm] = useState({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    country: lead?.country || "",
    company: lead?.company || "",
    huntInterest: lead?.huntInterest || "",
    status: lead?.status || "New",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) await updateLead(lead!._id, form);
      else await createLead(form);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-muted-foreground mb-2"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="company"
            className="text-sm font-medium text-muted-foreground mb-2"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            placeholder="Company name"
            value={form.company}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground mb-2"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-muted-foreground mb-2"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="country"
          className="text-sm font-medium text-muted-foreground mb-2"
        >
          Country <span className="text-red-500">*</span>
        </label>
        <input
          id="country"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="huntInterest"
          className="text-sm font-medium text-muted-foreground mb-2"
        >
          Hunt Interest <span className="text-red-500">*</span>
        </label>
        <input
          id="huntInterest"
          name="huntInterest"
          placeholder="Hunt interest"
          value={form.huntInterest}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="text-sm font-medium text-muted-foreground mb-2"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {isEdit ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
