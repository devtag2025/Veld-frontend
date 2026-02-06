import { Clock, CheckCircle2, Target, ShieldAlert } from "lucide-react";

export type ContractStatus = "draft" | "sent" | "signed";
export type PaymentStatus = "deposit_due" | "paid" | "overdue";
export type FirearmStatus = "not_started" | "in_progress" | "done";

export const bookingStats = [
  {
    label: "Active Hunts",
    value: "24",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "At Risk",
    value: "03",
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Pending Permits",
    value: "12",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Checklist Avg",
    value: "78%",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export interface Booking {
  id: string;
  clientName: string;
  huntDate: string;
  huntYear: string;
  package: string;
  contractStatus: ContractStatus;
  paymentStatus: PaymentStatus;
  firearmStatus: FirearmStatus;
  progress: number;
  nextDeadline: {
    title: string;
    date: string;
    isUrgent: boolean;
  };
}

export const bookingsData: Booking[] = [
  {
    id: "BK-1001",
    clientName: "John Smith",
    huntYear: "2026",
    huntDate: "Aug 12 - Aug 20",
    package: "Plains Game Custom",
    contractStatus: "signed",
    paymentStatus: "paid",
    firearmStatus: "done",
    progress: 100,
    nextDeadline: {
      title: "Hunt Arrival",
      date: "Aug 12, 2026",
      isUrgent: false,
    },
  },
  {
    id: "BK-1002",
    clientName: "Markus Weber",
    huntYear: "2025",
    huntDate: "Sep 05 - Sep 15",
    package: "Buffalo & Sable",
    contractStatus: "sent",
    paymentStatus: "overdue",
    firearmStatus: "in_progress",
    progress: 45,
    nextDeadline: {
      title: "Deposit Overdue",
      date: "Overdue 3d",
      isUrgent: true,
    },
  },
  {
    id: "BK-1003",
    clientName: "Robert Dowson",
    huntYear: "2025",
    huntDate: "Oct 10 - Oct 20",
    package: "Helicopter Cull",
    contractStatus: "draft",
    paymentStatus: "deposit_due",
    firearmStatus: "not_started",
    progress: 15,
    nextDeadline: {
      title: "Firearm Permit",
      date: "Due in 12d",
      isUrgent: true,
    },
  },
  {
    id: "BK-1004",
    clientName: "Robert Dowson",
    huntYear: "2024",
    huntDate: "Oct 10 - Oct 20",
    package: "Helicopter Cull",
    contractStatus: "draft",
    paymentStatus: "deposit_due",
    firearmStatus: "not_started",
    progress: 15,
    nextDeadline: {
      title: "Firearm Permit",
      date: "Due in 12d",
      isUrgent: true,
    },
  },
];

export const getStatusUI = (status: string) => {
  const map: Record<string, string> = {
    signed: "text-emerald-700 bg-emerald-50 border-emerald-200",
    paid: "text-emerald-700 bg-emerald-50 border-emerald-200",
    done: "text-emerald-700 bg-emerald-50 border-emerald-200",
    sent: "text-blue-700 bg-blue-50 border-blue-200",
    in_progress: "text-purple-700 bg-purple-50 border-purple-200",
    deposit_due: "text-amber-700 bg-amber-50 border-amber-200",
    overdue: "text-red-700 bg-red-50 border-red-200 font-bold animate-pulse",
    draft: "text-slate-600 bg-slate-100 border-slate-200",
    not_started: "text-slate-400 bg-slate-50 border-slate-100",
  };
  return map[status] || map["draft"];
};
