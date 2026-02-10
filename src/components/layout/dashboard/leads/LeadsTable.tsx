import { useState, useMemo } from "react";
import {
  Clock,
  AlertCircle,
  Calendar,
  Mail,
  CircleDot,
  Eye,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lead, LeadStatus, LeadSource } from "@/data/LeadsData";

interface LeadsTableProps {
  data: Lead[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

type SortKey = "name" | "email" | "status" | "source" | null;
type SortDirection = "asc" | "desc";

const statusConfig: Record<
  LeadStatus,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  new: {
    label: "New",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
  },
  contacted: {
    label: "Contacted",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    dotColor: "bg-amber-500",
  },
  qualified: {
    label: "Qualified",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    dotColor: "bg-purple-500",
  },
  converted: {
    label: "Converted",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    dotColor: "bg-emerald-500",
  },
};

const sourceConfig: Record<
  LeadSource,
  { label: string; bgColor: string; textColor: string }
> = {
  "ai-search": {
    label: "AI Search",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
  manual: {
    label: "Manual",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
  },
  import: {
    label: "Import",
    bgColor: "bg-teal-50",
    textColor: "text-teal-700",
  },
};

const actionIconConfig: Record<string, { icon: typeof Clock; color: string }> =
  {
    urgent: { icon: AlertCircle, color: "text-red-500" },
    warning: { icon: Clock, color: "text-amber-500" },
    success: { icon: Calendar, color: "text-emerald-500" },
    info: { icon: Mail, color: "text-blue-500" },
    pending: { icon: CircleDot, color: "text-slate-400" },
  };

const LeadsTable = ({ data, currentPage, setCurrentPage }: LeadsTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortKey) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "source":
          aValue = a.source;
          bValue = b.source;
          break;
        default:
          return 0;
      }

      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  const SortableHeader = ({
    columnKey,
    children,
    className = "",
  }: {
    columnKey: SortKey;
    children: React.ReactNode;
    className?: string;
  }) => (
    <th
      className={`p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors select-none ${className}`}
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon columnKey={columnKey} />
      </div>
    </th>
  );

  return (
    <div className="flex-1 overflow-auto bg-background py-4">
      <div className="bg-card rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-[900px] w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <SortableHeader columnKey="name">Lead</SortableHeader>
              <SortableHeader columnKey="email">Contact</SortableHeader>
              <SortableHeader columnKey="status">Status</SortableHeader>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Next Action
              </th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Last Activity
              </th>
              <SortableHeader columnKey="source">Source</SortableHeader>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {sortedData.map((lead) => {
              const status = statusConfig[lead.status];
              const source = sourceConfig[lead.source];
              const actionIcon = actionIconConfig[lead.nextAction.type];
              const ActionIcon = actionIcon.icon;

              return (
                <tr
                  key={lead.id}
                  className={`hover:bg-muted/30 transition-colors group cursor-pointer`}
                >
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {lead.company}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div>{lead.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {lead.location}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} border`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status.dotColor} mr-1.5`}
                      ></span>
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ActionIcon className={`h-4 w-4 ${actionIcon.color}`} />
                      <div>
                        <div
                          className={`text-xs font-medium ${lead.nextAction.type === "urgent" ? "font-semibold" : ""}`}
                        >
                          {lead.nextAction.title}
                        </div>
                        {lead.nextAction.subtitle && (
                          <div
                            className={`text-xs ${lead.nextAction.type === "urgent" ? "text-red-600 font-medium" : lead.nextAction.type === "success" && lead.status === "converted" ? "text-emerald-600" : "text-muted-foreground"}`}
                          >
                            {lead.nextAction.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="text-xs">{lead.lastActivity.time}</div>
                    <div className="text-xs text-muted-foreground">
                      {lead.lastActivity.action}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${source.bgColor} ${source.textColor}`}
                    >
                      {source.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button className="p-1.5 cursor-pointer hover:bg-primary hover:text-background rounded text-muted-foreground border">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 cursor-pointer hover:bg-primary hover:text-background rounded text-muted-foreground border">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 cursor-pointer hover:bg-primary hover:text-background rounded text-muted-foreground border">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination - Responsive */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Showing <span className="font-medium text-foreground">1-6</span> of{" "}
          <span className="font-medium text-foreground">62</span> leads
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="outline" size="sm" disabled className="px-2 sm:px-3">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          {[1, 2, 3].map((page) => (
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
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-2 sm:px-3"
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

