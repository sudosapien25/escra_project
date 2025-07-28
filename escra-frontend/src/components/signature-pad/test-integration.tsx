import React, { useState } from 'react';
import { SignaturePad, SignaturePadValue } from './packages/signature-pad';

export const SignaturePadTest: React.FC = () => {
  const [signature, setSignature] = useState<SignaturePadValue | null>(null);

  const handleSignatureChange = (value: SignaturePadValue) => {
    setSignature(value);
    console.log('Signature changed:', value);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Signature Pad Test</h2>
      
      <div className="border rounded-lg p-4 mb-4">
        <SignaturePad
          value={signature?.value || ''}
          onChange={handleSignatureChange}
          drawSignatureEnabled={true}
          typedSignatureEnabled={true}
          uploadSignatureEnabled={true}
        />
      </div>

      {signature && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Current Signature:</h3>
          <p>Type: {signature.type}</p>
          <p>Value: {signature.value.substring(0, 50)}...</p>
          {signature.type === 'draw' || signature.type === 'upload' ? (
            <img src={signature.value} alt="Signature" className="max-w-xs mt-2" />
          ) : (
            <div className="text-2xl mt-2" style={{ fontFamily: 'cursive' }}>
              {signature.value}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 