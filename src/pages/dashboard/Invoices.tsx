import { useState } from "react";
import {
  Search,
  Plus,
  ArrowUpRight,
  Clock,
  Calendar,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoicesData } from "@/data/InvoicesData";
import InvoicesTable from "@/components/layout/dashboard/invoices/InvoicesTable";

const Invoices = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const stats = [
    {
      label: "TOTAL REVENUE",
      value: "$428,500.00",
      change: "+12% from last season",
      changeColor: "text-emerald-600",
      icon: ArrowUpRight,
      iconColor: "text-blue-500",
    },
    {
      label: "PENDING BALANCE",
      value: "$84,200.00",
      change: "14 invoices pending",
      changeColor: "text-gray-500",
      icon: Clock,
      iconColor: "text-orange-500",
    },
    {
      label: "FEB INSTALLMENTS",
      value: "$32,000.00",
      change: "Due in next 14 days",
      changeColor: "text-blue-600",
      icon: Calendar,
      iconColor: "text-blue-500",
    },
    {
      label: "60-DAY FINALS",
      value: "$115,750.00",
      change: "8 High-priority payments",
      changeColor: "text-red-500",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
  ];

  return (
    <div>
      <header className="bg-card py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">
            Invoice Management
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-0.5">
            Track safari bookings, installments, and final payments.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer hover:bg-slate-50"
          >
            Send Reminder
          </Button>
          <Button className="flex-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <p className={`text-xs font-medium ${stat.changeColor}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="bg-card border rounded-xl p-3 mb-6">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              className="w-full bg-background border rounded-lg text-sm py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary outline-none"
              placeholder="Search client or invoice ID..."
              type="text"
            />
          </div>
          
          {/* Filters row */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <select 
                className="bg-background border rounded-lg text-sm py-2 px-3 outline-none cursor-pointer border-input flex-1"
                defaultValue="All"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <Button variant="outline" size="sm" className="h-9 px-3 w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <InvoicesTable
        data={InvoicesData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <p className="text-xs text-gray-400 mt-4">Showing 1-5 of 24 invoices</p>
    </div>
  );
};

export default Invoices;
