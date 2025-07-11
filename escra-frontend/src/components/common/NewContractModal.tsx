"use client";

import React, { useState, useRef } from 'react';
import { HiOutlineDocumentText, HiChevronDown, HiOutlineUpload } from 'react-icons/hi';
import { Logo } from '@/components/common/Logo';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTRACT_TYPES = [
  'Standard Agreement',
  'Residential – Cash',
  'Residential – Financed',
  'Commercial – Cash or Financed',
  'Assignment / Wholesale',
  'Installment / Lease-to-Own',
];
const MILESTONE_TEMPLATES = [
  'Standard (6 milestones)',
  'Simple (4 milestones)',
  'Construction (8 milestones)',
  'Custom',
];

const NewContractModal: React.FC<NewContractModalProps> = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState(1);
  const [showContractTypeDropdown, setShowContractTypeDropdown] = useState(false);
  const [showMilestoneDropdown, setShowMilestoneDropdown] = useState(false);
  const contractTypeDropdownRef = useRef<HTMLDivElement>(null);
  const milestoneDropdownRef = useRef<HTMLDivElement>(null);
  const [modalForm, setModalForm] = useState({
    title: '',
    type: '',
    milestone: '',
    notes: '',
    buyer: '',
    seller: '',
    agent: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModalForm({ ...modalForm, [name]: value });
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setUploadedFiles(validFiles);
  };

  // Function to handle dropdown clicks
  const handleDropdownClick = (
    event: React.MouseEvent,
    currentDropdown: boolean,
    setCurrentDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    otherDropdownSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    event.stopPropagation();
    otherDropdownSetter(false);
    setCurrentDropdown(!currentDropdown);
  };

  // Click outside handler for both dropdowns
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const contractTypeDropdown = contractTypeDropdownRef.current;
      const milestoneDropdown = milestoneDropdownRef.current;
      
      if (!contractTypeDropdown?.contains(target) && !milestoneDropdown?.contains(target)) {
        setShowContractTypeDropdown(false);
        setShowMilestoneDropdown(false);
      }
    }

    if (showContractTypeDropdown || showMilestoneDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContractTypeDropdown, showMilestoneDropdown]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (modalStep === 1) {
      if (!modalForm.title.trim()) {
        errors.title = 'Please fill out this field';
        isValid = false;
      }
      if (!modalForm.type) {
        errors.type = 'Please select a contract type';
        isValid = false;
      }
      if (!modalForm.milestone) {
        errors.milestone = 'Please select a milestone template';
        isValid = false;
      }
    } else if (modalStep === 2) {
      if (!modalForm.buyer.trim()) {
        errors.buyer = 'Please fill out this field';
        isValid = false;
      }
      if (!modalForm.seller.trim()) {
        errors.seller = 'Please fill out this field';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (isValid) {
      if (modalStep === 1) {
        setModalStep(2);
      } else if (modalStep === 2) {
        setModalStep(3);
      } else {
        onClose();
        setModalStep(1);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl mx-auto px-4 sm:px-8 font-sans">
        {/* Modal Header */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 sm:px-8 sm:pt-8 sm:pb-2 border-b border-gray-100 gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <HiOutlineDocumentText className="text-primary text-2xl" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-black leading-tight">Create New Contract</h2>
              <p className="text-gray-500 text-sm leading-tight">Fill in the details to quickly get started</p>
            </div>
          </div>
          <button onClick={() => { onClose(); setModalStep(1); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Stepper */}
        <div className="flex items-center justify-center w-full px-0 sm:px-2 py-3 sm:pt-4 sm:pb-2 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-nowrap justify-center w-full px-2">
            {[1, 2, 3].map((step, idx) => (
              <React.Fragment key={step}>
                <button
                  type="button"
                  onClick={() => setModalStep(step)}
                  className={`flex items-center gap-2 font-semibold transition-all duration-300 text-sm px-2 py-1 sm:text-base sm:px-4 sm:py-1.5 rounded-lg whitespace-nowrap
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
                {idx < 2 && <div className="w-4 sm:w-6 h-0.5 bg-gray-200 mx-2" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Modal Body */}
        {modalStep === 1 && (
          <form className="px-4 py-4 sm:px-8 sm:pt-2 sm:pb-6" onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="title" className="block text-xs font-medium text-gray-500 mb-1">Contract Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={modalForm.title}
                onChange={handleModalChange}
                className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  formErrors.title ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter contract title"
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-xs font-medium text-gray-500 mb-1">Contract Type</label>
              <div className="relative w-full" ref={contractTypeDropdownRef}>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white ${
                    formErrors.type ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Select contract type"
                  value={CONTRACT_TYPES.find(t => t === modalForm.type) || ''}
                  readOnly
                  onClick={(e) => handleDropdownClick(e, showContractTypeDropdown, setShowContractTypeDropdown, setShowMilestoneDropdown)}
                />
                <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {showContractTypeDropdown && (
                  <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {CONTRACT_TYPES.map(type => (
                      <button
                        key={type}
                        className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.type === type ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                        onClick={e => {
                          e.preventDefault();
                          setModalForm(prev => ({ ...prev, type }));
                          setShowContractTypeDropdown(false);
                          setFormErrors(prev => ({ ...prev, type: '' }));
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.type && (
                <p className="mt-1 text-xs text-red-600">{formErrors.type}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="milestone" className="block text-xs font-medium text-gray-500 mb-1">Milestone Template</label>
              <div className="relative w-full" ref={milestoneDropdownRef}>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white ${
                    formErrors.milestone ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Select milestone template"
                  value={MILESTONE_TEMPLATES.find(t => t === modalForm.milestone) || ''}
                  readOnly
                  onClick={(e) => handleDropdownClick(e, showMilestoneDropdown, setShowMilestoneDropdown, setShowContractTypeDropdown)}
                />
                <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {showMilestoneDropdown && (
                  <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {MILESTONE_TEMPLATES.map(template => (
                      <button
                        key={template}
                        className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.milestone === template ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                        onClick={e => {
                          e.preventDefault();
                          setModalForm(prev => ({ ...prev, milestone: template }));
                          setShowMilestoneDropdown(false);
                          setFormErrors(prev => ({ ...prev, milestone: '' }));
                        }}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.milestone && (
                <p className="mt-1 text-xs text-red-600">{formErrors.milestone}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="notes" className="block text-xs font-medium text-gray-500 mb-1">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={modalForm.notes}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors min-h-[120px]"
                placeholder="Enter any additional notes for this contract"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base">Next</button>
            </div>
          </form>
        )}
        {modalStep === 2 && (
          <form className="px-8 pt-2 pb-6" onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="buyer" className="block text-xs font-medium text-gray-500 mb-1">Buyer / Client</label>
              <input
                type="text"
                id="buyer"
                name="buyer"
                value={modalForm.buyer}
                onChange={handleModalChange}
                className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  formErrors.buyer ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter buyer or client name"
              />
              {formErrors.buyer && (
                <p className="mt-1 text-xs text-red-600">{formErrors.buyer}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="seller" className="block text-xs font-medium text-gray-500 mb-1">Seller / Provider</label>
              <input
                type="text"
                id="seller"
                name="seller"
                value={modalForm.seller}
                onChange={handleModalChange}
                className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  formErrors.seller ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter seller or provider name"
              />
              {formErrors.seller && (
                <p className="mt-1 text-xs text-red-600">{formErrors.seller}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="agent" className="block text-xs font-medium text-gray-500 mb-1">Agent / Escrow Officer (Optional)</label>
              <input
                type="text"
                id="agent"
                name="agent"
                value={modalForm.agent}
                onChange={handleModalChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
          <form className="px-8 pt-2 pb-6" onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 mb-2">Upload Documents (Optional)</label>
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-8 px-4 text-center transition hover:border-primary">
                  <HiOutlineUpload className="text-3xl text-gray-400 mb-2" />
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