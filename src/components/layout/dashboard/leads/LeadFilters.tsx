import React from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="bg-card border rounded-xl p-3 mt-4 flex flex-col md:flex-row gap-3">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          className="w-full bg-background border rounded-lg text-sm py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary outline-none"
          placeholder="Search leads by name...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex gap-2 flex-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border rounded-lg text-sm py-2 px-3 outline-none cursor-pointer border-input flex-1"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 w-full md:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>
    </div>
  );
};

export default LeadFilters;
