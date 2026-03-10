import { useState, useEffect, type FC } from 'react';
import { X, Save, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import type { Contract, ContractFormData } from '../../../../types/contract';
import { useContractTemplateStore } from '@/stores/contractTemplate.store';
import { usePackageStore } from '@/stores/package.store';

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}

const CreateContractModal: FC<CreateContractModalProps> = ({ isOpen, onClose, contract }) => {
  const isEditMode = !!contract;
  const [step, setStep] = useState(1);
  const { templates, fetchTemplates } = useContractTemplateStore();
  const { packages, fetchPackages } = usePackageStore();

  const [hunterName, setHunterName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [huntDate, setHuntDate] = useState('');
  const [packageType, setPackageType] = useState('standard');
  const [pickupPoint, setPickupPoint] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  const [charterOption, setCharterOption] = useState('none');
  const [trophyProcessing, setTrophyProcessing] = useState(true);
  const [firearmOption, setFirearmOption] = useState('company');
  const [customNotes, setCustomNotes] = useState('');
  const [template, setTemplate] = useState('default');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchPackages();
      setStep(1);
      setErrors({});
      
      if (contract) {
        setHunterName(contract.hunterName || '');
        setEmail(contract.email || '');
        setPhone(contract.phone || '');
        setAddress(contract.address || '');
        setHuntDate(contract.huntDate || '');
        setPackageType(contract.package || 'standard');
        setPickupPoint(contract.pickupPoint || '');
        setPickupNotes(contract.pickupNotes || '');
        setCharterOption(contract.charterOption || 'none');
        setTrophyProcessing(contract.trophyProcessing ?? true);
        setFirearmOption(contract.firearmOption || 'company');
        setCustomNotes(contract.customNotes || '');
        setTemplate(contract.template || 'default');
      } else {
        setHunterName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setHuntDate('');
        setPackageType('standard');
        setPickupPoint('');
        setPickupNotes('');
        setCharterOption('none');
        setTrophyProcessing(true);
        setFirearmOption('company');
        setCustomNotes('');
        setTemplate('default');
      }
    }
  }, [isOpen, contract, fetchTemplates]);

  const buildFormData = (): ContractFormData => ({
    hunterName,
    email,
    phone,
    address,
    huntDate,
    package: packageType,
    pickupPoint,
    pickupNotes,
    charterOption,
    trophyProcessing,
    firearmOption,
    customNotes,
    template
  });

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Step 2 validation
    if (!huntDate) {
      setErrors(prev => ({ ...prev, huntDate: 'Hunt date is required' }));
      return;
    }

    setIsSaving(true);
    try {
      const data = buildFormData();
      if (isEditMode) {
        console.log('Updating contract:', data);
        toast.success('Contract updated successfully');
      } else {
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

  const handleSaveAndSend = async () => {
    await onSubmit();
    if (huntDate) {
      toast.success('Contract sent to hunter');
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!hunterName) newErrors.hunterName = 'Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!phone) newErrors.phone = 'Phone is required';
    if (!template) newErrors.template = 'Template is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              {isEditMode ? 'Edit Contract' : 'Create New Contract'} - Step {step} of 2
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {step === 1 && (
                <>
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
                          value={hunterName}
                          onChange={e => setHunterName(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.hunterName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.hunterName && (
                          <p className="mt-1 text-sm text-red-600">{errors.hunterName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 border-b pb-2">
                      Contract Template
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Template <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={template}
                        onChange={e => setTemplate(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.template ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select a template...</option>
                        {templates.map(t => (
                          <option key={t._id || t.id} value={t._id || t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      {errors.template && (
                        <p className="mt-1 text-sm text-red-600">{errors.template}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
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
                          value={huntDate}
                          onChange={e => setHuntDate(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.huntDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.huntDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.huntDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Package Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={packageType}
                          onChange={e => setPackageType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {packages.length === 0 && (
                            <option value="">No packages available</option>
                          )}
                          {packages.map(pkg => (
                            <option key={pkg._id} value={pkg.name}>
                              {pkg.name} - ${pkg.price}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pick Up Location
                        </label>
                        <input
                          type="text"
                          value={pickupPoint}
                          onChange={e => setPickupPoint(e.target.value)}
                          placeholder="e.g., Darwin Hotel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pickup Notes
                        </label>
                        <input
                          type="text"
                          value={pickupNotes}
                          onChange={e => setPickupNotes(e.target.value)}
                          placeholder="Arrival time, special instructions"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

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
                          value={charterOption}
                          onChange={e => setCharterOption(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="none">No Charter</option>
                          <option value="helicopter-206">Helicopter 206</option>
                          <option value="helicopter-other">Other Helicopter</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Firearm Option <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={firearmOption}
                          onChange={e => setFirearmOption(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="company">Use Company Rifles (Included)</option>
                          <option value="own">Import Own Rifles</option>
                        </select>
                      </div>

                      <div className="col-span-2 mt-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 mt-2">
                          <input
                            type="checkbox"
                            checked={trophyProcessing}
                            onChange={e => setTrophyProcessing(e.target.checked)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          Include Trophy Processing (Field prep, skull boiling, cleaning)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes / Special Requests
                    </label>
                    <textarea
                      value={customNotes}
                      onChange={e => setCustomNotes(e.target.value)}
                      rows={4}
                      placeholder="Enter any custom hunt details..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
              {step === 1 ? (
                 <button
                 type="button"
                 onClick={onClose}
                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
               >
                 Cancel
               </button>
              ) : (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}

              <div className="flex items-center gap-3">
                {step === 1 ? (
                   <button
                   type="button"
                   onClick={nextStep}
                   className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                 >
                   Next
                   <ArrowRight className="w-4 h-4 ml-2" />
                 </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAndSend}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Contract
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContractModal;
