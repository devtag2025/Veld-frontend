import type { Lead } from "@/types/leads";
import http from "@/lib/httpClient";

// Get all leads with optional filters
export const getLeads = async (status?: string, name?: string) => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  if (name) params.name = name;

  const { data } = await http.get("/leads", { params });
  return data.data as Lead[];
};

// Get single lead
export const getLead = async (id: string) => {
  const { data } = await http.get(`/leads/${id}`);
  return data.data as Lead;
};

// Create lead
export const createLead = async (lead: Partial<Lead>) => {
  const { data } = await http.post("/leads", lead);
  return data.data as Lead;
};

// Update lead
export const updateLead = async (id: string, lead: Partial<Lead>) => {
  const { data } = await http.put(`/leads/${id}`, lead);
  return data.data as Lead;
};

// Delete lead
export const deleteLead = async (id: string) => {
  const { data } = await http.delete(`/leads/${id}`);
  return data.message;
};

// Get stats counts
export const getLeadStats = async () => {
  const statuses = ["New", "Contacted", "Qualified", "Converted"];
  const result: Record<string, number> = {};
  await Promise.all(
    statuses.map(async (s) => {
      const leads = await getLeads(s);
      result[s] = leads.length;
    }),
  );
  return result;
};
