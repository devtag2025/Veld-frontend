// src/types/lead.ts
export interface Note {
  note: string;
  createdAt: string;
}

export interface FollowUp {
  action: string;
  date: string;
}

export interface Activity {
  status: string;
  note: string;
  createdAt: string;
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
  source?: "ai-search" | "manual" | "import";
  nextAction?: { title: string; subtitle: string };
  notes: Note[];
  followUps: FollowUp[];
  activity: Activity[];
  createdAt: string;
  updatedAt: string;
}
