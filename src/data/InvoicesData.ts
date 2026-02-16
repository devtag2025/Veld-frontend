export type InvoiceStatus = "paid" | "overdue" | "sent" | "draft";

export interface Invoice {
  id: string;
  clientName: string;
  safariDetails: string;
  clientInitials: string;
  status: InvoiceStatus;
  dueDate: string;
  amount: number;
  date: string; // Additional date field for "Feb 12, 2024" shown under ID
  avatarColor: string;
}

export const InvoicesData: Invoice[] = [
  {
    id: "INV-2024-882",
    clientName: "Marcus Thorne",
    safariDetails: "10-Day Plains Game • Buffalo Safari",
    clientInitials: "MT",
    status: "paid",
    dueDate: "Feb 15, 2024",
    amount: 12450.00,
    date: "Feb 12, 2024",
    avatarColor: "bg-gray-100 text-gray-600",
  },
  {
    id: "INV-2024-879",
    clientName: "Robert Hilliard",
    safariDetails: "60-Day Final Balance • Elephant Cull",
    clientInitials: "RH",
    status: "overdue",
    dueDate: "Feb 01, 2024",
    amount: 24800.00,
    date: "Jan 28, 2024",
    avatarColor: "bg-blue-100 text-blue-600",
  },
  {
    id: "INV-2024-885",
    clientName: "Sarah Kincaid",
    safariDetails: "Feb Installment • Limpopo Base",
    clientInitials: "SK",
    status: "sent",
    dueDate: "Feb 28, 2024",
    amount: 8500.00,
    date: "Feb 14, 2024",
    avatarColor: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "INV-2024-889",
    clientName: "Andrew Benitez",
    safariDetails: "Custom Safari Package • Karoo",
    clientInitials: "AB",
    status: "draft",
    dueDate: "Mar 05, 2024",
    amount: 15200.00,
    date: "Pending Approval",
    avatarColor: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "INV-2024-880",
    clientName: "Greg Morrison",
    safariDetails: "60-Day Final Payment • Lion Hunt",
    clientInitials: "GM",
    status: "sent",
    dueDate: "Feb 22, 2024",
    amount: 45000.00,
    date: "Feb 10, 2024",
    avatarColor: "bg-gray-100 text-gray-600",
  },
   {
    id: "INV-2024-891",
    clientName: "Elena Rodriguez",
    safariDetails: "Photo Safari • Kruger Park",
    clientInitials: "ER",
    status: "paid",
    dueDate: "Feb 10, 2024",
    amount: 5200.00,
    date: "Feb 05, 2024",
    avatarColor: "bg-pink-100 text-pink-600",
  },
  {
    id: "INV-2024-895",
    clientName: "Michael Chang",
    safariDetails: "Bow Hunting • Eastern Cape",
    clientInitials: "MC",
    status: "sent",
    dueDate: "Mar 15, 2024",
    amount: 18750.00,
    date: "Feb 20, 2024",
    avatarColor: "bg-orange-100 text-orange-600",
  },
  {
    id: "INV-2024-898",
    clientName: "Jessica Stern",
    safariDetails: "Family Package • Garden Route",
    clientInitials: "JS",
    status: "draft",
    dueDate: "Apr 01, 2024",
    amount: 9800.00,
    date: "Drafting",
    avatarColor: "bg-purple-100 text-purple-600",
  },
];
