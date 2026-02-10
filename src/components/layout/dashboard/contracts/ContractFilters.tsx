import { Search, Filter, X } from 'lucide-react';
import { useState, type FC, type ChangeEvent } from 'react';

export interface ContractFiltersState {
  search: string;
  status: string;
  package: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
}

interface ContractFiltersProps {
  filters: ContractFiltersState;
  onFiltersChange: (filters: ContractFiltersState) => void;
}

const ContractFilters: FC<ContractFiltersProps> = ({ filters, onFiltersChange }) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, status: e.target.value });
  };

  const handlePackageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, package: e.target.value });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const currentRange = filters.dateRange || { start: '', end: '' };
    const newRange = { ...currentRange, [field]: value };
    
    // If both are empty, set to null, otherwise update
    if (!newRange.start && !newRange.end) {
      onFiltersChange({ ...filters, dateRange: null });
    } else {
      onFiltersChange({ ...filters, dateRange: newRange });
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      dateRange: null,
      package: 'all'
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.status !== 'all' || 
    filters.package !== 'all' || 
    filters.dateRange !== null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="space-y-4">
        {/* Primary Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by hunter name, contract ID, or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={handleStatusChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending Signature</option>
                <option value="signed">Signed</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Package Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                value={filters.package}
                onChange={handlePackageChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Packages</option>
                <option value="standard">Standard Package</option>
                <option value="premium">Premium Package</option>
                <option value="custom">Custom Package</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hunt Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Search: {filters.search}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Status: {filters.status}
              </span>
            )}
            {filters.package !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Package: {filters.package}
              </span>
            )}
            {filters.dateRange && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Date: {filters.dateRange.start || 'Any'} - {filters.dateRange.end || 'Any'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractFilters;
