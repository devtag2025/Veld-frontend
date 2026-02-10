import { useState } from "react";
import {
  Inbox,
  MessageCircle,
  BadgeCheck,
  CheckCircle2,
  Filter,
  Download,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { LeadsData } from "@/data/LeadsData";
import LeadsTable from "@/components/layout/dashboard/leads/LeadsTable";



const Leads = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      label: "New",
      value: 24,
      subtitle: "Awaiting contact",
      icon: Inbox,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Contacted",
      value: 18,
      subtitle: "In conversation",
      icon: MessageCircle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Qualified",
      value: 12,
      subtitle: "Ready to convert",
      icon: BadgeCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Converted",
      value: 8,
      subtitle: "This month",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      subtitleColor: "text-emerald-600",
    },
  ];

  return (
    <div>
      <header className="bg-card py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Leads Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-0.5">
            Track, manage, and convert your leads
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Button variant="outline" className="w-full md:w-fit cursor-pointer">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className="w-full md:w-fit cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Lead
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card p-5 rounded-xl border shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-xl p-3 mt-4">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              className="w-full bg-background border rounded-lg text-sm py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary outline-none"
              placeholder="Search leads by name, email, or company..."
              type="text"
            />
          </div>
          
          {/* Filters row */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <select className="bg-background border rounded-lg text-sm py-2 px-3 outline-none cursor-pointer border-input flex-1">
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
              <select className="bg-background border rounded-lg text-sm py-2 px-3 outline-none cursor-pointer border-input flex-1">
                <option value="">All Sources</option>
                <option value="ai-search">AI Search</option>
                <option value="manual">Manual Entry</option>
                <option value="import">Import</option>
              </select>
            </div>
            <Button variant="outline" size="sm" className="h-9 px-3 w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>
      </div>

      <LeadsTable
        data={LeadsData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Lead"
      >
        <form className="space-y-4">
          {/* Lead Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Lead
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </h3>
            <select className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          {/* Next Action */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Next Action
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Initial outreach"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Due: Today"
                />
              </div>
            </div>
          </div>

          {/* Source */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Source
            </h3>
            <select className="w-full bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="ai-search">AI Search</option>
              <option value="manual">Manual Entry</option>
              <option value="import">Import</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
