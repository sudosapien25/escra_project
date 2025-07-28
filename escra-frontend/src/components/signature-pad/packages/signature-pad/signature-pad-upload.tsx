import React, { useRef } from 'react';

interface SignaturePadUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export const SignaturePadUpload: React.FC<SignaturePadUploadProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      {value ? (
        <div className="relative">
          <img src={value} alt="Signature" className="max-h-32 max-w-full" />
          <button
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Upload Signature
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}; 