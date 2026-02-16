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
import type { Invoice, InvoiceStatus } from "@/data/InvoicesData";

interface InvoicesTableProps {
  data: Invoice[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

type SortKey = "id" | "clientName" | "status" | "dueDate" | "amount" | null;
type SortDirection = "asc" | "desc";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  paid: {
    label: "Paid",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  overdue: {
    label: "Overdue",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    dotColor: "bg-red-500",
  },
  sent: {
    label: "Sent",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
  },
  draft: {
    label: "Draft",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    dotColor: "bg-gray-500",
  },
};

const InvoicesTable = ({ data, currentPage, setCurrentPage }: InvoicesTableProps) => {
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
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortKey) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "clientName":
          aValue = a.clientName;
          bValue = b.clientName;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "dueDate":
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      } else {
        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
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

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 overflow-auto bg-background py-4">
      <div className="bg-card rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-[900px] w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <SortableHeader columnKey="id">Invoice ID</SortableHeader>
              <SortableHeader columnKey="clientName">Client & Safari</SortableHeader>
              <SortableHeader columnKey="status">Status</SortableHeader>
              <SortableHeader columnKey="dueDate">Due Date</SortableHeader>
              <SortableHeader columnKey="amount" className="text-right justify-end">
                <div className="flex items-center justify-end w-full">
                  Amount
                  <SortIcon columnKey="amount" />
                </div>
              </SortableHeader>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {paginatedData.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-muted/30 transition-colors group cursor-pointer"
              >
                <td className="p-4 font-medium text-xs text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{invoice.id}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{invoice.date}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${invoice.avatarColor}`}
                    >
                      {invoice.clientInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {invoice.clientName}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {invoice.safariDetails}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusConfig[invoice.status].bgColor
                    } ${statusConfig[invoice.status].textColor} border`}
                  >
                     <span
                        className={`w-1.5 h-1.5 rounded-full ${statusConfig[invoice.status].dotColor} mr-1.5`}
                      ></span>
                    {statusConfig[invoice.status].label}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`text-sm ${
                      invoice.status === "overdue"
                        ? "text-red-600 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {invoice.dueDate}
                  </span>
                </td>
                <td className="p-4 text-right font-medium">
                  ${invoice.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-4 text-right">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Responsive */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground whitespace-nowrap">
           Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-
           {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)}</span> of{" "}
          <span className="font-medium text-foreground">{sortedData.length}</span> invoices
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2 sm:px-3"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          
           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
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

export default InvoicesTable;
