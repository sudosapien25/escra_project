// Integration Code for Signature Modal
// This file contains the code needed to integrate the SignatureModal component into your application

import React, { useState } from 'react';
import { SignatureModal, SignatureValue } from './SignatureModal';

// Required imports for the integration
// import { SignatureModal, SignatureValue } from '@/components/SignatureModal';

export function useSignatureModal() {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<SignatureValue | null>(null);

  // Signature modal handlers
  const handleOpenSignatureModal = () => {
    setShowSignatureModal(true);
  };

  const handleCloseSignatureModal = () => {
    setShowSignatureModal(false);
  };

  const handleSaveSignature = (signature: SignatureValue) => {
    setCurrentSignature(signature);
    console.log('Signature saved:', signature);
    // TODO: Here you would typically save the signature to the document
    // For now, we'll just log it and close the modal
  };

  return {
    showSignatureModal,
    currentSignature,
    handleOpenSignatureModal,
    handleCloseSignatureModal,
    handleSaveSignature,
  };
}

// Example component showing how to integrate the SignatureModal
export function ExampleSignatureIntegration() {
  const {
    showSignatureModal,
    handleOpenSignatureModal,
    handleCloseSignatureModal,
    handleSaveSignature,
  } = useSignatureModal();

  return (
    <div>
      {/* Your button to open the signature modal */}
      <button
        onClick={handleOpenSignatureModal}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        Sign Document
      </button>

      {/* Signature Modal Component */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={handleCloseSignatureModal}
        onSave={handleSaveSignature}
        drawEnabled={true}
        typeEnabled={true}
        uploadEnabled={true}
        title="Sign Document"
        confirmText="Confirm Signature"
        cancelText="Cancel"
      />
    </div>
  );
}

// State variables you need to add to your component:
/*
const [showSignatureModal, setShowSignatureModal] = useState(false);
const [currentSignature, setCurrentSignature] = useState<SignatureValue | null>(null);
*/

// Functions you need to add to your component:
/*
const handleOpenSignatureModal = () => {
  setShowSignatureModal(true);
};

const handleCloseSignatureModal = () => {
  setShowSignatureModal(false);
};

const handleSaveSignature = (signature: SignatureValue) => {
  setCurrentSignature(signature);
  console.log('Signature saved:', signature);
  // TODO: Here you would typically save the signature to the document
  // For now, we'll just log it and close the modal
};
*/

// JSX you need to add to your component's return statement:
/*
<SignatureModal
  isOpen={showSignatureModal}
  onClose={handleCloseSignatureModal}
  onSave={handleSaveSignature}
  drawEnabled={true}
  typeEnabled={true}
  uploadEnabled={true}
  title="Sign Document"
  confirmText="Confirm Signature"
  cancelText="Cancel"
/>
*/ 