import type { Lead, PaginatedLeadsResponse } from "@/types/leads";
import http from "@/lib/httpClient";

// Get all leads with optional filters
export const getLeads = async (
  status?: string, 
  name?: string, 
  page?: number, 
  limit?: number, 
  excludeConverted?: boolean
) => {
  const params: Record<string, string | number | boolean> = {};
  if (status) params.status = status;
  if (name) params.name = name;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (excludeConverted !== undefined) params.excludeConverted = excludeConverted;

  const { data } = await http.get("/leads", { params });
  return data as PaginatedLeadsResponse;
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
  const { data } = await http.get("/leads/stats");
  return data as Record<string, number>;
};
