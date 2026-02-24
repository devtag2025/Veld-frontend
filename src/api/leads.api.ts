import type { Lead } from "@/types/leads";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${BASE_URL}/leads`;

// Get all leads with optional filters
export const getLeads = async (status?: string, name?: string) => {
  const params: any = {};
  if (status) params.status = status;
  if (name) params.name = name;

  const { data } = await axios.get(API_URL, { params });
  return data.data as Lead[];
};

// Get single lead
export const getLead = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data.data as Lead;
};

// Create lead
export const createLead = async (lead: Partial<Lead>) => {
  const { data } = await axios.post(API_URL, lead);
  return data.data as Lead;
};

// Update lead
export const updateLead = async (id: string, lead: Partial<Lead>) => {
  const { data } = await axios.put(`${API_URL}/${id}`, lead);
  return data.data as Lead;
};

// Delete lead
export const deleteLead = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
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
