import { useMemo } from "react";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/leads";

interface LeadsTableProps {
  data: Lead[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Lead["status"]) => void;
}

type Status = "New" | "Contacted" | "Qualified" | "Converted";

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
}: {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
  onStatusChange: (id: string, status: Lead["status"]) => void;
}) => (
  <tr key={lead._id} className="hover:bg-muted/30 transition-colors">
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
      <select
        value={lead.status}
        onChange={(e) =>
          onStatusChange(lead._id, e.target.value as Lead["status"])
        }
        className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
          lead.status,
        )}`}
      >
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Converted">Converted</option>
      </select>
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
  onEdit,
  onView,
  onDelete,
  onStatusChange,
}: LeadsTableProps) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage]);

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
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
            {paginatedData.map((lead) => (
              <LeadRow
                key={lead._id}
                lead={lead}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Showing{" "}
          <span className="font-medium text-foreground">
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, data.length)}
          </span>{" "}
          of <span className="font-medium text-foreground">{data.length}</span>{" "}
          leads
        </div>
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
      </div>
    </div>
  );
};

export default LeadsTable;
