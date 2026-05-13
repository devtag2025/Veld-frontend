
import { useState } from "react";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type { Lead } from "@/types/leads";

interface LeadsTableProps {
  data: Lead[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalCount: number;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onStatusChange: (lead: Lead, status: Lead["status"]) => void;
  onCheckToggle: (id: string, field: "checked" | "checked2", value: boolean) => void;
}

type Status = "New" | "Contacted" | "Qualified" | "Converted";

const PAGES_PER_GROUP = 6;

const statusStyles: Record<Status, string> = {
  New: "bg-blue-50 text-blue-700 border border-blue-200",
  Contacted: "bg-amber-50 text-amber-700 border border-amber-200",
  Qualified: "bg-purple-50 text-purple-700 border border-purple-200",
  Converted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const getStatusStyle = (status: string) =>
  statusStyles[status as Status] ||
  "bg-gray-50 text-gray-700 border border-gray-200";

const LeadRow = ({
  lead,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  isProcessing,
}: {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: Lead["status"]) => void;
  onCheckToggle: (id: string, field: "checked" | "checked2", value: boolean) => void;
  isProcessing: boolean;
}) => (
  <tr
    key={lead._id}
    className={`hover:bg-muted/30 transition-colors ${isProcessing ? "cursor-wait pointer-events-none opacity-70" : ""}`}
  >
    {/* <td className="p-4 w-16">
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={lead.checked || false}
          onChange={() => onCheckToggle(lead._id, "checked", !lead.checked)}
          className={`h-4 w-4 rounded border-gray-300 accent-primary ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
          onClick={(e) => e.stopPropagation()}
          disabled={isProcessing}
        />
        <div className="w-px h-5 bg-border mx-0.5" />
        <input
          type="checkbox"
          checked={lead.checked2 || false}
          onChange={() => onCheckToggle(lead._id, "checked2", !lead.checked2)}
          className={`h-4 w-4 rounded border-gray-300 accent-emerald-600 ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
          onClick={(e) => e.stopPropagation()}
          disabled={isProcessing}
        />
      </div>
    </td> */}
    <td className="p-4">{lead.name}</td>
    <td className="p-4">{lead.email}</td>
    <td className="p-4">{lead.phone}</td>
    <td className="p-4">
      <div className="flex flex-col">
        <span className="font-medium">{lead.company}</span>
        <span className="text-xs text-muted-foreground">{lead.country}</span>
      </div>
    </td>
    <td className="p-4">{lead.huntInterest}</td>
    <td className="p-4">
      <CustomSelect
        value={lead.status}
        onChange={(val) => onStatusChange(lead, val as Lead["status"])}
        options={[
          { value: "New", label: "New" },
          { value: "Contacted", label: "Contacted" },
          { value: "Qualified", label: "Qualified" },
          { value: "Converted", label: "Converted" },
        ]}
        buttonClassName={`w-full min-w-[110px] px-2 py-1.5 rounded-md text-xs font-medium flex items-center justify-between outline-none ${getStatusStyle(
          lead.status,
        )}`}
      />
    </td>
    <td className="p-4 flex justify-end gap-2">
      <button
        aria-label={`View ${lead.name}`}
        onClick={() => onView(lead)}
        className="p-2 border cursor-pointer  rounded hover:bg-muted"
      >
        <Eye size={16} />
      </button>
      <button
        aria-label={`Edit ${lead.name}`}
        onClick={() => onEdit(lead)}
        className="p-2 border cursor-pointer rounded hover:bg-muted"
      >
        <Pencil size={16} />
      </button>
      <button
        aria-label={`Delete ${lead.name}`}
        onClick={() => onDelete(lead._id)}
        className="p-2 border cursor-pointer rounded hover:bg-red-50 text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

const LeadsTable = ({
  data,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
  onCheckToggle,
}: LeadsTableProps) => {

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleCheckWithProcessing = async (id: string, field: "checked" | "checked2", value: boolean) => {
    setProcessingId(id);
    try {
      await onCheckToggle(id, field, value);
    } finally {
      setProcessingId(null);
    }
  };

  const getPages = () => {
    const groupIndex = Math.floor((currentPage - 1) / PAGES_PER_GROUP);

    const start = groupIndex * PAGES_PER_GROUP + 1;
    const end = Math.min(start + PAGES_PER_GROUP - 1, totalPages);

    const pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="overflow-auto bg-background py-4">
      <div className="bg-card rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-[1000px] w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              {/* <th className="p-4 w-16"></th> */}
              {[
                "Name",
                "Email",
                "Phone",
                "Company",
                "Hunt Interest",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className={`p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider ${
                    header === "Actions" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {data.map((lead) => (
              <LeadRow
                key={lead._id}
                lead={lead}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onStatusChange={onStatusChange}
                onCheckToggle={handleCheckWithProcessing}
                isProcessing={processingId === lead._id}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Showing{" "}
          <span className="font-medium text-foreground">
            {data.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-
            {(currentPage - 1) * 10 + data.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{totalCount}</span>{" "}
          leads
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            {getPages().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 sm:w-9"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;
