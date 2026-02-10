export type LeadStatus = "new" | "contacted" | "qualified" | "converted";
export type LeadSource = "ai-search" | "manual" | "import";

export interface Lead {
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

export const LeadsData: Lead[] = [
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
