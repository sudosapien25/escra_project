import React from 'react';
import { TbPencilShare } from 'react-icons/tb';
import { SignatureDocument } from '@/data/mockSignatures';

// Types for signature values
export interface SignatureValue {
  type: 'draw' | 'type' | 'upload';
  value: string;
}

interface SignatureConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  signature: SignatureValue | null;
  document: SignatureDocument | null;
  isLoading?: boolean;
}

export const SignatureConfirmationModal: React.FC<SignatureConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  signature,
  document,
  isLoading = false
}) => {
  if (!isOpen || !signature || !document) return null;

  const renderSignaturePreview = () => {
    if (signature.type === 'draw') {
      return (
        <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <img 
            src={signature.value} 
            alt="Captured signature" 
            className="max-w-full max-h-32 object-contain"
          />
        </div>
      );
    } else if (signature.type === 'type') {
      return (
        <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-signature text-gray-900 dark:text-white">
            {signature.value}
          </span>
        </div>
      );
    } else if (signature.type === 'upload') {
      return (
        <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <img 
            src={signature.value} 
            alt="Uploaded signature" 
            className="max-w-full max-h-32 object-contain"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Confirm Signature
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Signature Preview Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Signature Preview
            </h3>
            {renderSignaturePreview()}
          </div>

          {/* Document Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Document Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Document ID:</span>
                  <p className="text-sm text-gray-900 dark:text-white">{document.documentId || document.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Name:</span>
                  <p className="text-sm text-gray-900 dark:text-white">{document.document}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Signer Name:</span>
                  <p className="text-sm text-gray-900 dark:text-white">{document.assignee || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract Name:</span>
                  <p className="text-sm text-gray-900 dark:text-white">{document.contract || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract ID:</span>
                  <p className="text-sm text-gray-900 dark:text-white">{document.contractId || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-1 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block" />
                Signing...
              </>
            ) : (
              <>
                <TbPencilShare className="mr-2 text-lg" />
                Sign
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 