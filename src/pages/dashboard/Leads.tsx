import { useState } from "react";
import {
  Search,
  Download,
  Plus,
  Inbox,
  MessageCircle,
  BadgeCheck,
  CheckCircle2,
  Filter,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type LeadStatus = "new" | "contacted" | "qualified" | "converted";
type LeadSource = "ai-search" | "manual" | "import";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  location: string;
  status: LeadStatus;
  nextAction: {
    type: "urgent" | "warning" | "success" | "info" | "pending";
    title: string;
    subtitle: string;
  };
  lastActivity: {
    time: string;
    action: string;
  };
  source: LeadSource;
  avatarGradient: string;
}

const leadsData: Lead[] = [
  {
    id: 1,
    name: "Allison Philips",
    company: "CodeForge Solutions",
    email: "allison@codeforge.com",
    location: "Silicon Valley, CA",
    status: "new",
    nextAction: {
      type: "warning",
      title: "Initial outreach",
      subtitle: "Due: Today",
    },
    lastActivity: { time: "2 hours ago", action: "Added to system" },
    source: "ai-search",
    avatarGradient: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    name: "Sophia Brown",
    company: "InfinitiTech Labs",
    email: "sophia@infinititech.labs",
    location: "Cambridge, MA",
    status: "contacted",
    nextAction: {
      type: "urgent",
      title: "Follow-up call",
      subtitle: "Overdue 1 day",
    },
    lastActivity: { time: "3 days ago", action: "Email sent" },
    source: "ai-search",
    avatarGradient: "from-emerald-400 to-emerald-600",
  },
  {
    id: 3,
    name: "Angel Korsgaard",
    company: "QuantumNexus Technologies",
    email: "hello@quantumnexus.com",
    location: "Zurich, Switzerland",
    status: "qualified",
    nextAction: {
      type: "success",
      title: "Demo scheduled",
      subtitle: "Tomorrow, 2PM",
    },
    lastActivity: { time: "1 day ago", action: "Call completed" },
    source: "manual",
    avatarGradient: "from-purple-400 to-purple-600",
  },
  {
    id: 4,
    name: "Justin Workman",
    company: "CyberSphere Labs",
    email: "justin@cybersphere.labs",
    location: "Seoul, South Korea",
    status: "converted",
    nextAction: {
      type: "success",
      title: "Deal closed",
      subtitle: "$12,000 ARR",
    },
    lastActivity: { time: "5 days ago", action: "Contract signed" },
    source: "ai-search",
    avatarGradient: "from-orange-400 to-orange-600",
  },
  {
    id: 5,
    name: "James Curtis",
    company: "DataPulse Dynamics",
    email: "james@datapulse.com",
    location: "Austin, TX",
    status: "contacted",
    nextAction: {
      type: "info",
      title: "Send proposal",
      subtitle: "Due: In 2 days",
    },
    lastActivity: { time: "12 hours ago", action: "Discovery call" },
    source: "import",
    avatarGradient: "from-pink-400 to-pink-600",
  },
  {
    id: 6,
    name: "Jaxson Stanton",
    company: "TechVista Ventures",
    email: "jaxson@techvista.net",
    location: "Bangalore, India",
    status: "new",
    nextAction: { type: "pending", title: "No action set", subtitle: "" },
    lastActivity: { time: "6 hours ago", action: "Added to system" },
    source: "ai-search",
    avatarGradient: "from-cyan-400 to-cyan-600",
  },
];

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

      <div className="bg-card border-b py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              className="w-full bg-background border rounded-lg text-sm py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Search leads by name, email, or company..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary min-w-[140px]">
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
            <select className="bg-background border rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary min-w-[140px]">
              <option value="">All Sources</option>
              <option value="ai-search">AI Search</option>
              <option value="manual">Manual Entry</option>
              <option value="import">Import</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-background py-4">
        <div className="bg-card rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-[900px] w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Lead
                </th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Next Action
                </th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {leadsData.map((lead) => {
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

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">1-6</span> of{" "}
            <span className="font-medium text-foreground">62</span> leads
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-9"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

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
            <div className="grid grid-cols-2 gap-3">
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
            <div className="grid grid-cols-2 gap-3">
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
            <div className="grid grid-cols-2 gap-3">
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
