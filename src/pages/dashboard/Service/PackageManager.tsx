import { useState, useEffect, type FC } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePackageStore } from '@/stores/package.store';
import CreatePackageModal from '@/components/layout/dashboard/services/CreatePackageModal';

const PackageManager: FC = () => {
  const { packages, fetchPackages, deletePackage, isLoading } = usePackageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hunt Packages</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your standard hunt packages and pricing here.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 flex flex-col justify-between"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-emerald-100 rounded-lg p-3">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {pkg.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-700 mt-1">${pkg.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                {pkg.details || 'No description provided.'}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                <Button 
                   variant="outline" 
                   size="sm" 
                   className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                   onClick={() => pkg._id && deletePackage(pkg._id)}
                   disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2"/> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {packages.length === 0 && !isLoading && (
            <div className="col-span-full p-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
              No packages found. Create a new package to get started.
            </div>
        )}
      </div>

      <CreatePackageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PackageManager;
