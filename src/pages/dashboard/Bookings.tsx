import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Filter,
  Eye,
  MoreVertical,
  Calendar,
  FileSignature,
  CheckCircle2,
  DollarSign,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking.store";
import type { Booking, BookingStatus } from "@/types/booking";
import BookingModal from "@/components/layout/dashboard/booking/BookingModal";
import toast from "react-hot-toast";

const statusColorMap: Record<BookingStatus, string> = {
  Draft: "text-slate-600 bg-slate-100 border-slate-200",
  Tentative: "text-blue-700 bg-blue-50 border-blue-200",
  Signed: "text-purple-700 bg-purple-50 border-purple-200",
  Confirmed: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Cancelled: "text-red-700 bg-red-50 border-red-200",
};

const Bookings = () => {
  const {
    bookings,
    isLoading,
    fetchBookings,
    sendContract,
    confirmDeposit,
    deleteBooking,
    downloadContract,
  } = useBookingStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const searchMatch = b.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const statusMatch =
        statusFilter === "all" ? true : b.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [bookings, search, statusFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const draft = bookings.filter((b) => b.status === "Draft").length;
    const tentative = bookings.filter((b) => b.status === "Tentative").length;
    const confirmed = bookings.filter((b) => b.status === "Confirmed").length;

    return [
      {
        label: "Total Bookings",
        value: total,
        icon: Calendar,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Draft",
        value: draft,
        icon: FileSignature,
        color: "text-slate-600",
        bg: "bg-slate-50",
      },
      {
        label: "Pending Signature",
        value: tentative,
        icon: DollarSign,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "Confirmed",
        value: confirmed,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
    ];
  }, [bookings]);

  const handleSendContract = async (id: string) => {
    try {
      toast.loading("Sending contract via DocuSign...");
      await sendContract(id);
      toast.dismiss();
      toast.success("Contract sent successfully!");
    } catch {
      toast.dismiss();
      toast.error("Failed to send contract");
    }
    setActionMenuId(null);
  };

  const handleConfirmDeposit = async (id: string) => {
    try {
      toast.loading("Confirming deposit...");
      await confirmDeposit(id);
      toast.dismiss();
      toast.success("Deposit confirmed!");
    } catch {
      toast.dismiss();
      toast.error("Failed to confirm deposit");
    }
    setActionMenuId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      toast.loading("Deleting booking...");
      await deleteBooking(id);
      toast.dismiss();
      toast.success("Booking deleted!");
    } catch {
      toast.dismiss();
      toast.error("Failed to delete booking");
    }
    setActionMenuId(null);
  };

  const handleDownloadContract = async (id: string) => {
    try {
      toast.loading("Downloading contract...");
      await downloadContract(id);
      toast.dismiss();
      toast.success("Contract downloaded!");
    } catch {
      toast.dismiss();
      toast.error("Failed to download contract");
    }
    setActionMenuId(null);
  };

  const getPaymentSummary = (booking: Booking) => {
    const paid = booking.paymentSchedule.filter((p) => p.paid).length;
    const total = booking.paymentSchedule.length;
    return `${paid}/${total} paid`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Booking Master Records
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage hunt execution, payments, and compliance status.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button
            className="flex-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> New Booking
          </Button>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center bg-card p-3 rounded-xl border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-background border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
            placeholder="Search by client name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="bg-background border rounded-lg px-3 py-2 text-sm outline-none cursor-pointer border-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Tentative">Tentative</option>
            <option value="Signed">Signed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button variant="outline" size="sm" className="h-9 px-3">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {isLoading && bookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading bookings...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead className="bg-muted/40 border-b">
                <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4">Client & Schedule</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payments</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-muted/20 transition-all group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                        <Calendar className="h-3 w-3" />{" "}
                        {new Date(b.huntDate).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {b.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                        {b.packageType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          statusColorMap[b.status]
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium">
                        {getPaymentSummary(b)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm">
                        ${b.totalAmount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 relative">
                        <button className="p-2 border border-input rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer bg-card">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 border border-input rounded-lg hover:bg-slate-100 cursor-pointer bg-card"
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === b._id ? null : b._id,
                            )
                          }
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {actionMenuId === b._id && (
                          <div className="absolute right-0 top-10 bg-card border rounded-xl shadow-lg z-20 w-48 py-1">
                            {b.status === "Draft" && (
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                                onClick={() => handleSendContract(b._id)}
                              >
                                <FileSignature className="h-4 w-4" />
                                Send Contract
                              </button>
                            )}
                            {b.status === "Signed" && (
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                                onClick={() => handleConfirmDeposit(b._id)}
                              >
                                <DollarSign className="h-4 w-4" />
                                Confirm Deposit
                              </button>
                            )}
                            {(b.status === "Signed" ||
                              b.status === "Confirmed") && (
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                                onClick={() =>
                                  handleDownloadContract(b._id)
                                }
                              >
                                <Download className="h-4 w-4" />
                                Download Contract
                              </button>
                            )}
                            <button
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                              onClick={() => handleDelete(b._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-muted-foreground"
                    >
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className="bg-card border p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-1.5 rounded-lg ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
        {label}
      </span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default Bookings;
