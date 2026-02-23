import { useState } from "react";
import {
  Inbox,
  MessageCircle,
  BadgeCheck,
  CheckCircle2,
  Download,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { useLeads } from "@/hooks/useLeads";
import type { Lead } from "@/types/leads";
import LeadFilters from "@/components/layout/dashboard/leads/LeadFilters";
import LeadsTable from "@/components/layout/dashboard/leads/LeadsTable";
import LeadForm from "@/components/layout/dashboard/leads/LeadsForm";
import { deleteLead, updateLead } from "@/api/leads.api";
import LeadDetailsModal from "@/components/layout/dashboard/leads/LeadsDetailsModal";

const Leads = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);

  const { leads, stats, loading, fetchLeads } = useLeads(statusFilter, search);

  const filteredLeads = leads;

  const statsConfig = [
    {
      label: "New",
      value: stats["New"] || 0,
      subtitle: "Awaiting contact",
      icon: Inbox,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Contacted",
      value: stats["Contacted"] || 0,
      subtitle: "In conversation",
      icon: MessageCircle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Qualified",
      value: stats["Qualified"] || 0,
      subtitle: "Ready to convert",
      icon: BadgeCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Converted",
      value: stats["Converted"] || 0,
      subtitle: "Converted leads",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchLeads();
  };

  const handleView = (lead: Lead) => {
    setViewLead(lead);
  };

  const handleStatusChange = async (id: string, status: Lead["status"]) => {
    await updateLead(id, { status });
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    await deleteLead(id);
    fetchLeads();
  };

  return (
    <div className="space-y-4">
      <header className="bg-card py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Leads Management</h1>
          <p className="text-sm text-muted-foreground">
            Track, manage, and convert your leads
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Lead
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <div
            key={stat.label}
            className="bg-card p-5 rounded-xl border shadow-sm"
          >
            <div className="flex justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>

              <span className="text-xs font-bold text-muted-foreground">
                {stat.label}
              </span>
            </div>

            <div className="text-3xl font-bold">{stat.value}</div>

            <p className="text-xs text-muted-foreground mt-1">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      <LeadFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <LeadsTable
        data={filteredLeads}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <LeadDetailsModal
        lead={viewLead}
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedLead ? "Edit Lead" : "Create Lead"}
        size="lg"
      >
        <LeadForm
          lead={selectedLead}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Leads;
