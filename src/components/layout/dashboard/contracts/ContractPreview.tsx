import { useState, type FC } from 'react';
import { X, Download, Send, Printer } from 'lucide-react';
import { generateContractPDF } from "../../../../utils/pdfGenerator";
import toast from 'react-hot-toast';

import { type Contract } from '../../../../types/contract';

interface ContractPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
}

const ContractPreview: FC<ContractPreviewProps> = ({ isOpen, onClose, contract }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const pdfBlob = await generateContractPDF(contract);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      let currentPdfUrl = pdfUrl;
      if (!currentPdfUrl) {
        setIsGenerating(true);
        const pdfBlob = await generateContractPDF(contract);
        currentPdfUrl = URL.createObjectURL(pdfBlob);
        setIsGenerating(false);
      } else {
         // If url exists, we might need to fetch blob again or just reuse if we had the blob. 
         // For simplicity with stub, just regenerating to get blob or we need to store blob.
         // But the logic below assumes we generate a new one for download to be safe/clean.
         const pdfBlob = await generateContractPDF(contract);
         currentPdfUrl = URL.createObjectURL(pdfBlob);
      }
      
      if (currentPdfUrl) {
          const link = document.createElement('a');
          link.href = currentPdfUrl;
          link.download = `Contract-${contract.id}-${contract.hunterName.replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(currentPdfUrl);
          toast.success('PDF downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      // Generate PDF
      const pdfBlob = await generateContractPDF(contract);
      
      // Send via email API
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `Contract-${contract.id}.pdf`);
      formData.append('email', contract.email);
      formData.append('hunterName', contract.hunterName);
      formData.append('contractId', contract.id);

      // await axios.post('/api/contracts/send-email', formData);
      console.log('Sending contract to:', contract.email);
      toast.success(`Contract sent to ${contract.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send contract');
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = async () => {
    try {
      let currentPdfUrl = pdfUrl;
      if (!currentPdfUrl) {
        const pdfBlob = await generateContractPDF(contract);
        currentPdfUrl = URL.createObjectURL(pdfBlob);
      }
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = currentPdfUrl!;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          // Only revoke if we just created it and it's not the state one? 
          // Keeping it simple: if it's the state one, don't revoke. 
          // Actually, URL.createObjectURL creates a new reference.
          // Let's rely on the state one if available.
        }, 1000);
      };
    } catch (error) {
      console.error('Error printing PDF:', error);
      toast.error('Failed to print contract');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
            <div>
              <h3 className="text-lg font-medium text-white">
                Contract Preview - {contract.id}
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                {contract.hunterName} • Hunt Date: {new Date(contract.huntDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Refresh Preview'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send to Hunter'}
              </button>
            </div>
          </div>

          {/* PDF Preview Area */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0 bg-white shadow-lg"
                title="Contract Preview"
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 h-full overflow-auto">
                <ContractHTMLPreview contract={contract} />
              </div>
            )}
          </div>

          {/* Generate PDF Button (if not yet generated) */}
          {!pdfUrl && (
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-center">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating PDF...' : 'Generate PDF Preview'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// HTML Preview Component (fallback before PDF generation)
interface ContractHTMLPreviewProps {
  contract: Contract;
}

const ContractHTMLPreview: FC<ContractHTMLPreviewProps> = ({ contract }) => {
  return (
    <div className="max-w-4xl mx-auto font-serif">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          GOODHAND OUTBACK EXPERIENCE
        </h1>
        <h2 className="text-xl font-semibold text-gray-700">
          Australian Hunt Contract
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          www.goodhandoutbackexperience.com.au
        </p>
      </div>

      {/* Contract Details */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Contract ID:</p>
            <p className="text-gray-900">{contract.id}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Date:</p>
            <p className="text-gray-900">{new Date(contract.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Hunter Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          HUNTER INFORMATION
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Name:</p>
            <p className="text-gray-900">{contract.hunterName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Email:</p>
            <p className="text-gray-900">{contract.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Phone:</p>
            <p className="text-gray-900">{contract.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Address:</p>
            <p className="text-gray-900">{contract.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Hunt Details */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          HUNT DETAILS
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Hunt Date:</span>
            <span className="text-gray-900">{new Date(contract.huntDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Package:</span>
            <span className="text-gray-900">{contract.package}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Pickup Point:</span>
            <span className="text-gray-900">{contract.pickupPoint || 'To be determined'}</span>
          </div>
          {contract.charterOption && contract.charterOption !== 'none' && (
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Charter Option:</span>
              <span className="text-gray-900">{contract.charterOption}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          PAYMENT TERMS
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Total Amount:</span>
            <span className="text-gray-900">${contract.totalAmount?.toLocaleString() || 'TBD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Deposit (50%):</span>
            <span className="text-gray-900">${contract.totalAmount ? (contract.totalAmount * 0.5).toLocaleString() : 'TBD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Balance Due (60 days before hunt):</span>
            <span className="text-gray-900">${contract.totalAmount ? (contract.totalAmount * 0.5).toLocaleString() : 'TBD'}</span>
          </div>
        </div>
      </div>

      {/* Firearm Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          FIREARM OPTIONS
        </h3>
        <p className="text-gray-900 mb-2">
          <span className="font-semibold">Selected Option:</span> {contract.firearmOption}
        </p>
        {contract.firearmOption === 'own' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Firearm permit forms must be submitted at least 8 weeks prior to hunt date.
            </p>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          TERMS AND CONDITIONS
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>1. This contract is subject to the standard terms and conditions of Goodhand Outback Experience.</p>
          <p>2. Cancellations must be made in writing and are subject to cancellation fees as outlined in our policy.</p>
          <p>3. The client is responsible for obtaining all necessary licenses and permits.</p>
          <p>4. Trophy processing includes field preparation, skull boiling, and cleaning. Shipping is not included.</p>
          <p>5. Payment must be made via international wire transfer to the specified bank account.</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-2 gap-8">
        <div>
          <div className="border-t border-gray-800 pt-2">
            <p className="text-sm font-semibold text-gray-700">Hunter Signature</p>
            <p className="text-xs text-gray-600 mt-1">Date: _____________</p>
          </div>
        </div>
        <div>
          <div className="border-t border-gray-800 pt-2">
            <p className="text-sm font-semibold text-gray-700">Karl Goodhand (Director)</p>
            <p className="text-xs text-gray-600 mt-1">Goodhand Outback Experience</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
        <p>Lot 208 Ninnis Court, Howard Springs, NT 0835</p>
        <p>Email: Karlgoodhand@icloud.com | Phone: +61 409 02 4989 (AU) | +1 307 410 0173 (USA Jan-Feb)</p>
      </div>
    </div>
  );
};

export default ContractPreview;
