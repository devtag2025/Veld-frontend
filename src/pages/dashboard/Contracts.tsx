import { useState, type FC } from 'react';
import ContractsHeader from '../../components/layout/dashboard/contracts/ContractsHeader';
import ContractsTable from "../../components/layout/dashboard/contracts/ContractsTable";
import ContractTemplateManager from '../../components/layout/dashboard/contracts/ContractTemplateManager';
import { Download, Plus, Search, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContractsData } from '@/data/ContractsData';

type TabType = 'contracts' | 'templates';

const Contracts: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('contracts');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');

  return (
    <div>
      <header className="bg-card py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Contract Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-0.5">
            Manage contracts, track signatures, and monitor deadlines
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Button variant="outline" className="w-full md:w-fit cursor-pointer">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className="w-full md:w-fit cursor-not-allowed opacity-50"
            disabled
            // onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Contract
          </Button>
        </div>
      </header>

      <ContractsHeader />

      <div className="mt-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'contracts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block w-5 h-5 mr-2 -mt-1" />
              All Contracts
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block w-5 h-5 mr-2 -mt-1" />
              Contract Templates
            </button>
          </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'contracts' ? (
            <>
              <div className="bg-card border rounded-xl p-3 mt-4">
                <div className="flex flex-col gap-3">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      className="w-full bg-background border rounded-lg text-sm py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary outline-none"
                      placeholder="Search contracts by hunter name, email, or ID..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Filters row */}
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex gap-2 flex-1">
                      <select 
                        className="bg-background border rounded-lg text-sm py-2 px-3 outline-none cursor-pointer border-input flex-1"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="signed">Signed</option>
                        <option value="expired">Expired</option>
                      </select>
                      <select 
                        className="bg-background border rounded-lg text-sm py-2 px-3 outline-none cursor-pointer border-input flex-1"
                        value={packageFilter}
                        onChange={(e) => setPackageFilter(e.target.value)}
                      >
                        <option value="">All Packages</option>
                        <option value="Standard Buffalo Hunt">Standard Buffalo Hunt</option>
                        <option value="Premium Buffalo Hunt">Premium Buffalo Hunt</option>
                        <option value="Ultimate Outback Experience">Ultimate Outback Experience</option>
                      </select>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 px-3 w-full md:w-auto">
                      <Filter className="h-4 w-4 mr-2" /> Filters
                    </Button>
                  </div>
                </div>
              </div>

              <ContractsTable
                data={ContractsData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
        ) : (
            <ContractTemplateManager />
        )}
      </div>

    </div>
  );
};

export default Contracts;


