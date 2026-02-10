import { useState, useEffect, type FC } from 'react';
import { X, Save, Send } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { type Contract, type ContractFormData } from '../../../../types/contract';

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}

const CreateContractModal: FC<CreateContractModalProps> = ({ isOpen, onClose, contract }) => {
  const isEditMode = !!contract;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ContractFormData>({
    defaultValues: {
      hunterName: contract?.hunterName || '',
      email: contract?.email || '',
      phone: contract?.phone || '',
      address: contract?.address || '',
      huntDate: contract?.huntDate || '',
      package: contract?.package || 'standard',
      pickupPoint: contract?.pickupPoint || '',
      pickupNotes: contract?.pickupNotes || '',
      charterOption: contract?.charterOption || 'none',
      trophyProcessing: contract?.trophyProcessing || true,
      firearmOption: contract?.firearmOption || 'company',
      customNotes: contract?.customNotes || '',
      template: contract?.template || 'default'
    }
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);


  const selectedFirearm = watch('firearmOption');
  const selectedCharter = watch('charterOption');

  useEffect(() => {
    if (contract) {
      // Type assertion to ensure keys match ContractFormData where possible, or just specific fields
      setValue('hunterName', contract.hunterName || '');
      setValue('email', contract.email || '');
      setValue('phone', contract.phone || '');
      setValue('address', contract.address || '');
      setValue('huntDate', contract.huntDate || '');
      setValue('package', contract.package || 'standard');
      setValue('pickupPoint', contract.pickupPoint || '');
      setValue('pickupNotes', contract.pickupNotes || '');
      setValue('charterOption', contract.charterOption || 'none');
      setValue('trophyProcessing', contract.trophyProcessing || true);
      setValue('firearmOption', contract.firearmOption || 'company');
      setValue('customNotes', contract.customNotes || '');
      setValue('template', contract.template || 'default');
    }
  }, [contract, setValue]);

  const onSubmit: SubmitHandler<ContractFormData> = async (data) => {
    setIsSaving(true);
    try {
      // Replace with actual API call
      if (isEditMode) {
        // await axios.put(`/api/contracts/${contract.id}`, data);
        console.log('Updating contract:', data);
        toast.success('Contract updated successfully');
      } else {
        // await axios.post('/api/contracts', data);
        console.log('Creating contract:', data);
        toast.success('Contract created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
      toast.error('Failed to save contract');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndSend = async (data: ContractFormData) => {
    await onSubmit(data);
    // Additional logic to send email
    toast.success('Contract sent to hunter');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              {isEditMode ? 'Edit Contract' : 'Create New Contract'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {/* Hunter Information */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4 border-b pb-2">
                  Hunter Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('hunterName', { required: 'Name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.hunterName && (
                      <p className="mt-1 text-sm text-red-600">{errors.hunterName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register('address')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hunt Details */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4 border-b pb-2">
                  Hunt Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hunt Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('huntDate', { required: 'Hunt date is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.huntDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.huntDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('package', { required: 'Package is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="standard">Standard Package - $12,000</option>
                      <option value="premium">Premium Package - $15,000</option>
                      <option value="custom">Custom Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Point
                    </label>
                    <select
                      {...register('pickupPoint')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select pickup point</option>
                      <option value="darwin-hotel">Darwin Hotel</option>
                      <option value="darwin-airport">Darwin Airport</option>
                      <option value="custom">Custom Location</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Notes
                    </label>
                    <input
                      type="text"
                      {...register('pickupNotes')}
                      placeholder="e.g., Arrival time, special instructions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4 border-b pb-2">
                  Additional Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Charter Option
                    </label>
                    <select
                      {...register('charterOption')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="none">No Charter</option>
                      <option value="helicopter-206">Helicopter 206 (Recommended)</option>
                      <option value="helicopter-other">Other Helicopter</option>
                    </select>
                    {selectedCharter === 'helicopter-206' && (
                      <p className="mt-1 text-xs text-blue-600">
                        Reduces driving time and increases hunting time
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firearm Option <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('firearmOption', { required: 'Firearm option is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="company">Use Company Rifles (Included)</option>
                      <option value="own">Import Own Rifles</option>
                    </select>
                    {selectedFirearm === 'own' && (
                      <p className="mt-1 text-xs text-amber-600">
                        Note: Forms must be submitted at least 8 weeks before hunt
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('trophyProcessing')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Include Trophy Processing (Field prep, skull boiling, cleaning)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4 border-b pb-2">
                  Contract Template
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Template
                  </label>
                  <select
                    {...register('template')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="default">Default Contract Template</option>
                    <option value="premium">Premium Hunt Template</option>
                    <option value="custom">Custom Template</option>
                  </select>
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes / Special Requests
                </label>
                <textarea
                  {...register('customNotes')}
                  rows={4}
                  placeholder="Enter any special requirements, dietary restrictions, medical conditions, or custom hunt details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : isEditMode ? 'Update Contract' : 'Save Contract'}
              </button>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleSubmit(handleSaveAndSend)}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Save & Send to Hunter
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContractModal;
