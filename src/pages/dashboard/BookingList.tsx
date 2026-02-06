import {
  Search,
  Download,
  Plus,
  Filter,
  Eye,
  MoreVertical,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingsData, getStatusUI, bookingStats } from "@/data/BookingData";
import { useMemo, useState } from "react";

const BookingList = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");

  const filteredBookings = useMemo(() => {
    return bookingsData.filter((b) => {
      const searchMatch = b.clientName
        .toLowerCase()
        .includes(search.toLowerCase());

      const yearMatch = year === "all" ? true : b.huntYear.toString() === year;

      return searchMatch && yearMatch;
    });
  }, [search, year]);

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
          <Button className="flex-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> New Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bookingStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center bg-card p-3 rounded-xl border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-background border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
            placeholder="Search by client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="bg-background border rounded-lg px-3 py-2 text-sm outline-none cursor-pointer border-input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value={"all"}>All Years</option>
            <option value={"2024"}>2024</option>
            <option value={"2025"}>2025</option>
            <option value={"2026"}>2026</option>
          </select>
          <Button variant="outline" size="sm" className="h-9 px-3">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead className="bg-muted/40 border-b">
              <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="p-4">Client & Schedule</th>
                <th className="p-4">Package</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4">Critical Deadline</th>
                <th className="p-4">Progress</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-muted/20 transition-all group"
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-900">
                      {b.clientName}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                      <Calendar className="h-3 w-3" /> {b.huntYear} •{" "}
                      {b.huntDate}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                      {b.package}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1.5">
                      <StatusRow label="Contract" status={b.contractStatus} />
                      <StatusRow label="Payment" status={b.paymentStatus} />
                      <StatusRow label="Firearm" status={b.firearmStatus} />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full ${b.nextDeadline.isUrgent ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"}`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold ${b.nextDeadline.isUrgent ? "text-red-600" : "text-slate-700"}`}
                        >
                          {b.nextDeadline.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                          {b.nextDeadline.date}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="w-24 space-y-1">
                      <div className="text-[10px] font-bold text-muted-foreground">
                        {b.progress}%
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-700"
                          style={{ width: `${b.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 border border-input rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer bg-card">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 border border-input rounded-lg hover:bg-slate-100 cursor-pointer bg-card">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
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

const StatusRow = ({ label, status }: { label: string; status: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[9px] font-extrabold text-muted-foreground/70 w-14 uppercase">
      {label}
    </span>
    <span
      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusUI(status)}`}
    >
      {status.replace("_", " ")}
    </span>
  </div>
);

export default BookingList;
