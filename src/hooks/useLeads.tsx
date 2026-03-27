import { getLeads, getLeadStats } from "@/api/leads.api";
import type { Lead } from "@/types/leads";
import { useState, useEffect } from "react";

export const useLeads = (statusFilter?: string, search?: string, page: number = 1, limit: number = 10) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // By default, we exclude leads that are converted (have bookingId)
      // from the main leads views.
      const response = await getLeads(statusFilter, search, page, limit, true);
      setLeads(response.data);
      if (response.pagination) {
        setTotalCount(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const s = await getLeadStats();
    setStats(s);
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [statusFilter, search, page, limit]);

  return { leads, loading, stats, fetchLeads, fetchStats, totalCount, totalPages };
};
