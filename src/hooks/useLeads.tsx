import { getLeads, getLeadStats } from "@/api/leads.api";
import type { Lead } from "@/types/leads";
import { useState, useEffect } from "react";

export const useLeads = (statusFilter?: string, search?: string) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeads(statusFilter, search);
    setLeads(data);
    setLoading(false);
  };

  const fetchStats = async () => {
    const s = await getLeadStats();
    setStats(s);
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [statusFilter, search]);

  return { leads, loading, stats, fetchLeads, fetchStats };
};
