import { useEffect, type FC } from 'react';
import { FileText, Save } from 'lucide-react';
import { useContractTemplateStore } from '@/stores/contractTemplate.store';
import { Button } from '@/components/ui/button';

const ContractTemplateManager: FC = () => {
  const { templates, fetchTemplates, seedDefaultTemplate, isLoading } = useContractTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);



  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Contract Templates</h2>
          <p className="mt-1 text-sm text-gray-500">
            View available contract templates for different hunt packages
          </p>
        </div>
        <Button 
          variant="secondary"
          className="cursor-pointer"
          onClick={() => seedDefaultTemplate()}
          disabled={isLoading}
        >
          <Save className="w-4 h-4 mr-2"/> Seed Default Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id || template.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 flex flex-col justify-between"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <span className="truncate max-w-[150px] sm:max-w-[200px]" title={template.name}>{template.name}</span>
                      {template.isDefault && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 shrink-0">
                          Default
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-2">
                <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                <span>Modified: {new Date(template.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no contract templates available.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContractTemplateManager;
