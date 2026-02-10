import { useState, useEffect, type FC } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  version: string;
  isDefault: boolean;
  createdAt: string;
  lastModified: string;
  usageCount: number;
  status: 'active' | 'inactive' | 'archived';
  content?: string;
  includePaymentTerms?: boolean;
  includeFirearmSection?: boolean;
  includeCharterSection?: boolean;
  includeTrophySection?: boolean;
  customSections?: any[];
}

const ContractTemplateManager: FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // Replace with actual API call
      // const response = await axios.get('/api/contracts/templates');
      
      // Mock data
      const mockTemplates: Template[] = [
        {
          id: 'TPL-001',
          name: 'Default Hunt Contract',
          description: 'Standard contract for regular hunt bookings',
          version: '1.0',
          isDefault: true,
          createdAt: '2026-01-01',
          lastModified: '2026-01-15',
          usageCount: 45,
          status: 'active'
        },
        {
          id: 'TPL-002',
          name: 'Premium Hunt Contract',
          description: 'Contract for premium package hunts with helicopter charter',
          version: '1.2',
          isDefault: false,
          createdAt: '2026-01-05',
          lastModified: '2026-01-20',
          usageCount: 12,
          status: 'active'
        },
        {
          id: 'TPL-003',
          name: 'Custom Hunt Contract',
          description: 'Customizable contract template for special requests',
          version: '1.0',
          isDefault: false,
          createdAt: '2026-01-10',
          lastModified: '2026-01-10',
          usageCount: 5,
          status: 'active'
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Contract Templates</h2>
          <p className="mt-1 text-sm text-gray-500">
            View available contract templates for different hunt packages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {template.name}
                      {template.isDefault && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">v{template.version}</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {template.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Used {template.usageCount} times</span>
                <span>Modified {new Date(template.lastModified).toLocaleDateString()}</span>
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
