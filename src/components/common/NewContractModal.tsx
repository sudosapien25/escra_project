"use client";

import React, { useState } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { Logo } from '@/components/common/Logo';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTRACT_TYPES = [
  'Property Sale',
  'Commercial Lease',
  'Construction Escrow',
  'Investment Property',
];
const MILESTONE_TEMPLATES = [
  'Standard (6 milestones)',
  'Simple (4 milestones)',
  'Construction (8 milestones)',
  'Custom',
];

const NewContractModal: React.FC<NewContractModalProps> = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState(1);
  const [modalForm, setModalForm] = useState({
    title: '',
    type: '',
    milestone: '',
    notes: '',
    buyer: '',
    seller: '',
    agent: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setUploadedFiles(validFiles);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto p-0 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <HiOutlineDocumentText className="text-primary text-2xl" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-black leading-tight">Create New Contract</h2>
              <p className="text-gray-500 text-sm leading-tight">Fill in the contract details to get started</p>
            </div>
          </div>
          <button onClick={() => { onClose(); setModalStep(1); }} className="text-gray-400 hover:text-gray-600 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Stepper */}
        <div className="flex items-center justify-between px-8 pt-4 pb-2">
          <div className="flex items-center space-x-2 w-full">
            {[1, 2, 3].map((step, idx) => (
              <React.Fragment key={step}>
                <button
                  type="button"
                  onClick={() => setModalStep(step)}
                  className={`flex items-center gap-2 font-semibold transition-all duration-300 text-sm px-4 py-1.5 rounded-lg whitespace-nowrap
                    ${modalStep === step
                      ? 'text-primary border-2 border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  <span className={`inline-block transition-all duration-300 ${modalStep === step ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: modalStep === step ? 18 : 0}}>
                    {modalStep === step && <Logo width={18} height={18} className="pointer-events-none" />}
                  </span>
                  {step === 1 && 'Step 1: Details'}
                  {step === 2 && 'Step 2: Parties'}
                  {step === 3 && 'Step 3: Documents'}
                </button>
                {idx < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-2" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Modal Body */}
        {modalStep === 1 && (
          <form className="px-8 pt-2 pb-6" onSubmit={e => { e.preventDefault(); setModalStep(2); }}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Contract Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={modalForm.title}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base"
                placeholder="Enter contract title"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
              <select
                id="type"
                name="type"
                value={modalForm.type}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base"
                required
              >
                <option value="" disabled>Select a contract type</option>
                {CONTRACT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="milestone" className="block text-sm font-medium text-gray-700 mb-1">Milestone Template</label>
              <select
                id="milestone"
                name="milestone"
                value={modalForm.milestone}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base"
                required
              >
                <option value="" disabled>Select a milestone template</option>
                {MILESTONE_TEMPLATES.map(template => (
                  <option key={template} value={template}>{template}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={modalForm.notes}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base min-h-[80px]"
                placeholder="Enter any additional notes for this contract"
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base">Next</button>
            </div>
          </form>
        )}
        {modalStep === 2 && (
          <form className="px-8 pt-2 pb-6" onSubmit={e => { e.preventDefault(); setModalStep(3); }}>
            <div className="mb-4">
              <label htmlFor="buyer" className="block text-sm font-medium text-gray-700 mb-1">Buyer / Client</label>
              <input
                type="text"
                id="buyer"
                name="buyer"
                value={modalForm.buyer}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base"
                placeholder="Enter buyer or client name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="seller" className="block text-sm font-medium text-gray-700 mb-1">Seller / Provider</label>
              <input
                type="text"
                id="seller"
                name="seller"
                value={modalForm.seller}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base"
                placeholder="Enter seller or provider name"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-1">Agent / Escrow Officer (Optional)</label>
              <input
                type="text"
                id="agent"
                name="agent"
                value={modalForm.agent}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base"
                placeholder="Enter agent or escrow officer name"
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setModalStep(1)} className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold hover:bg-gray-50 transition-colors text-base">Previous</button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base">Next</button>
            </div>
          </form>
        )}
        {modalStep === 3 && (
          <form className="px-8 pt-2 pb-6" onSubmit={e => { e.preventDefault(); onClose(); setModalStep(1); }}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents (Optional)</label>
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-8 px-4 text-center transition hover:border-primary">
                  <HiOutlineDocumentText className="text-3xl text-gray-400 mb-2" />
                  <div className="text-xs text-gray-500 font-medium">Click to upload or drag and drop</div>
                  <div className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </label>
              {uploadedFiles.length > 0 && (
                <ul className="mt-3 text-sm text-gray-600">
                  {uploadedFiles.map((file, idx) => (
                    <li key={idx} className="truncate">{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setModalStep(2)} className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold hover:bg-gray-50 transition-colors text-base">Previous</button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base">Create Contract</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewContractModal; 