import React, { useState } from 'react';
import { SignatureModal, SignatureValue } from './SignatureModal';

const SignatureExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signature, setSignature] = useState<SignatureValue | null>(null);

  const handleSave = (signatureValue: SignatureValue) => {
    setSignature(signatureValue);
    console.log('Signature saved:', signatureValue);
  };

  const renderSignature = () => {
    if (!signature) return null;

    if (signature.type === 'draw' || signature.type === 'upload') {
      return (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Your Signature:</h3>
          <img 
            src={signature.value} 
            alt="Signature" 
            className="border border-gray-300 rounded p-2 max-w-xs"
          />
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Your Signature:</h3>
        <div className="border border-gray-300 rounded p-4 text-2xl font-cursive">
          {signature.value}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Signature Modal Example</h1>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Signature Modal
      </button>

      {renderSignature()}

      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        drawEnabled={true}
        typeEnabled={true}
        uploadEnabled={true}
        title="Add Your Signature"
        confirmText="Save Signature"
        cancelText="Cancel"
      />
    </div>
  );
};

export default SignatureExample; 