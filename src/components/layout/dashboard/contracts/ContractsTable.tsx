import { useState, useMemo } from "react";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Contract } from "@/types/contract";

interface ContractsTableProps {
  data: Contract[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

type SortKey = "hunterName" | "huntDate" | "status" | "totalAmount" | "package" | null;
type SortDirection = "asc" | "desc";

const statusConfig: Record<
  string,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  draft: {
    label: "Draft",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    dotColor: "bg-slate-500",
  },
  pending: {
    label: "Pending",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    dotColor: "bg-amber-500",
  },
  signed: {
    label: "Signed",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  expired: {
    label: "Expired",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    dotColor: "bg-red-500",
  },
  cancelled: {
    label: "Cancelled",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    dotColor: "bg-gray-500",
  },
};

const ContractsTable = ({ data, currentPage, setCurrentPage }: ContractsTableProps) => {
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
      let aValue: any = a[sortKey as keyof Contract];
      let bValue: any = b[sortKey as keyof Contract];

      // Handle undefined values
      if (aValue === undefined) aValue = "";
      if (bValue === undefined) bValue = "";

      if (typeof aValue === 'string') {
          return sortDirection === "asc" 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number') {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
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
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Contract ID
              </th>
              <SortableHeader columnKey="hunterName">Hunter</SortableHeader>
              <SortableHeader columnKey="package">Package</SortableHeader>
              <SortableHeader columnKey="huntDate">Hunt Date</SortableHeader>
              <SortableHeader columnKey="status">Status</SortableHeader>
              <SortableHeader columnKey="totalAmount">Amount</SortableHeader>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {sortedData.map((contract) => {
              const status = statusConfig[contract.status?.toLowerCase() || 'draft'] || statusConfig.draft;

              return (
                <tr
                  key={contract.id}
                  className={`hover:bg-muted/30 transition-colors group cursor-pointer`}
                >
                  <td className="p-4 font-medium text-xs text-muted-foreground">
                    {contract.id}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <div className="font-semibold">{contract.hunterName}</div>
                      <div className="text-xs text-muted-foreground">
                        {contract.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{contract.package}</div>
                    {contract.charterOption && contract.charterOption !== 'none' && (
                        <div className="text-xs text-muted-foreground capitalize">
                             + {contract.charterOption.replace('_', ' ')}
                        </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <span>{new Date(contract.huntDate).toLocaleDateString()}</span>
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
                  <td className="p-4 font-medium">
                    ${contract.totalAmount?.toLocaleString() || '0'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button className="p-1.5 cursor-pointer hover:bg-primary hover:text-background rounded text-muted-foreground border" title="View PDF">
                         <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 cursor-pointer hover:bg-primary hover:text-background rounded text-muted-foreground border" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 cursor-pointer hover:bg-primary hover:text-background rounded text-muted-foreground border" title="Edit">
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
          <span className="font-medium text-foreground">48</span> contracts
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

export default ContractsTable;

