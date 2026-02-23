export interface FollowUp {
  action: string;
  date: string;
}

export interface Activity {
  status: string;
  date: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  company?: string;
  huntInterest: string;
  status: "New" | "Contacted" | "Qualified" | "Converted";
  nextAction?: { title: string; subtitle: string };
  note: string;
  followUps: FollowUp[];
  activity: Activity[];
  createdAt: string;
  updatedAt: string;
}
