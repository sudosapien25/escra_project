'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaFileAlt, FaCheckCircle, FaClock, FaCalendarAlt, FaSort, FaPlus, FaArrowUp, FaDollarSign, FaDownload, FaRegFileAlt } from 'react-icons/fa';
import { FaArrowUpFromBracket } from 'react-icons/fa6';
import { HiOutlineDocumentText, HiOutlineDuplicate, HiOutlineDownload, HiOutlineTrash, HiOutlinePencilAlt, HiOutlineDocument, HiOutlineDocumentDownload, HiOutlineUpload } from 'react-icons/hi';
import { Logo } from '@/components/common/Logo';

interface Contract {
  id: string;
  title: string;
  parties: string;
  status: string;
  updated: string;
  value?: string;
  documents?: number;
  type: string;
}

const ContractsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('allContracts');
  const [activeContentTab, setActiveContentTab] = useState('contractList');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewContractForm, setShowNewContractForm] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [modalForm, setModalForm] = useState({
    title: '',
    type: '',
    milestone: '',
    notes: '',
    buyer: '',
    seller: '',
    agent: '',
    value: '',
    closingDate: '',
    dueDate: '',
    propertyAddress: '',
    propertyType: '',
    escrowNumber: '',
    buyerEmail: '',
    sellerEmail: false,
    agentEmail: false,
    earnestMoney: '',
    downPayment: '',
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    lenderName: '',
    titleCompany: '',
    insuranceCompany: '',
    inspectionPeriod: '',
    contingencies: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [emailErrors, setEmailErrors] = useState({
    buyerEmail: false,
    sellerEmail: false,
    agentEmail: false,
  });

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

  const PROPERTY_TYPES = [
    'Single Family',
    'Multi Family',
    'Commercial',
    'Land',
    'Industrial',
    'Other'
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModalForm({ ...modalForm, [name]: value });

    // Email validation
    if (name === 'buyerEmail' || name === 'sellerEmail' || name === 'agentEmail') {
      if (value && !validateEmail(value)) {
        setEmailErrors(prev => ({ ...prev, [name]: true }));
      } else {
        setEmailErrors(prev => ({ ...prev, [name]: false }));
      }
    }
  };

  const TABS = [
    { key: 'allContracts', label: 'All Contracts' },
    { key: 'createdMe', label: 'Created by Me' },
    { key: 'assignedMe', label: 'Assigned to Me' },
  ];

  const CONTENT_TABS = [
    { key: 'contractList', label: 'Contracts' },
    { key: 'documents', label: 'Documents' },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    // Only allow PDF, DOC, DOCX, JPG and max 10MB each
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setUploadedFiles(validFiles);
  };

  // Sample data
  const sampleContracts: Contract[] = [
    {
      id: '9548',
      title: 'New Property Acquisition',
      parties: 'Robert Chen & Eastside Properties',
      status: 'Initiation',
      updated: '1 hour ago',
      value: '$680,000',
      documents: 2,
      type: 'Property Sale',
    },
    {
      id: '9550',
      title: 'Land Development Contract',
      parties: 'GreenSpace Developers',
      status: 'Initiation',
      updated: '3 hours ago',
      value: '$1,250,000',
      documents: 1,
      type: 'Property Sale',
    },
    {
      id: '9145',
      title: 'Construction Escrow',
      parties: 'BuildRight & Horizon Developers',
      status: 'Preparation',
      updated: '1 day ago',
      value: '$780,000',
      documents: 4,
      type: 'Construction Escrow',
    },
    {
      id: '8784',
      title: 'Commercial Lease Amendment',
      parties: 'Pacific Properties',
      status: 'Preparation',
      updated: '5 hours ago',
      value: '$325,000',
      documents: 4,
      type: 'Commercial Lease',
    },
    {
      id: '8423',
      title: 'Property Sale Contract',
      parties: 'John Smith & Emma Johnson',
      status: 'Preparation',
      updated: '2 hours ago',
      value: '$450,000',
      documents: 4,
      type: 'Property Sale',
    },
    {
      id: '7804',
      title: 'Investment Property Escrow',
      parties: 'Global Investors Group',
      status: 'Wire Details',
      updated: '1 day ago',
      value: '$1,750,000',
      documents: 3,
      type: 'Property Sale',
    },
    {
      id: '7234',
      title: 'Residential Sale Agreement',
      parties: 'David Miller & Sarah Thompson',
      status: 'Signatures',
      updated: '4 hours ago',
      value: '$525,000',
      documents: 3,
      type: 'Property Sale',
    },
    {
      id: '9102',
      title: 'Commercial Lease Escrow',
      parties: 'TechStart Inc. & Pacific Properties',
      status: 'Signatures',
      updated: '5 hours ago',
      value: '$325,000',
      documents: 1,
      type: 'Commercial Lease',
    },
    {
      id: '6891',
      title: 'Office Building Purchase',
      parties: 'Riverfront Ventures',
      status: 'Funds Disbursed',
      updated: '3 days ago',
      value: '$3,200,000',
      documents: 4,
      type: 'Property Sale',
    },
    {
      id: '6453',
      title: 'Retail Space Lease',
      parties: 'Urban Outfitters Co.',
      status: 'Completed',
      updated: '1 week ago',
      value: '$275,000',
      documents: 2,
      type: 'Commercial Lease',
    },
    // Additional sample contracts
    {
      id: '10001',
      title: 'Downtown Condo Sale',
      parties: 'Alice Lee & Bob Martin',
      status: 'Initiation',
      updated: '2 days ago',
      value: '$900,000',
      documents: 2,
      type: 'Property Sale',
    },
    {
      id: '10002',
      title: 'Warehouse Lease',
      parties: 'Logistics Corp & Storage Solutions',
      status: 'In Review',
      updated: '6 hours ago',
      value: '$1,100,000',
      documents: 3,
      type: 'Commercial Lease',
    },
    {
      id: '10003',
      title: 'Luxury Villa Purchase',
      parties: 'Samantha Fox & Elite Estates',
      status: 'Wire Details',
      updated: '3 days ago',
      value: '$2,500,000',
      documents: 5,
      type: 'Property Sale',
    },
    {
      id: '10004',
      title: 'Industrial Park Development',
      parties: 'MegaBuild Inc.',
      status: 'Funds Disbursed',
      updated: '1 week ago',
      value: '$5,000,000',
      documents: 6,
      type: 'Property Sale',
    },
    {
      id: '10005',
      title: 'Beachfront Property Sale',
      parties: 'Oceanic Realty & Sun Resorts',
      status: 'Completed',
      updated: '2 weeks ago',
      value: '$3,800,000',
      documents: 4,
      type: 'Property Sale',
    },
  ];

  // Remove filtering by activeTab for table data
  const filteredContracts = sampleContracts.filter((contract) => {
    const matchesSearch = 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.parties.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadgeStyle = (status: string, outlined: boolean = false) => {
    const baseStyle = outlined ? 'border border-gray-300' : '';
    switch (status) {
      case 'Initiation': return `${baseStyle} bg-blue-100 text-blue-800`;
      case 'Preparation': return `${baseStyle} bg-gray-100 text-gray-800`;
      case 'In Review': return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case 'Wire Details': return `${baseStyle} bg-orange-100 text-orange-800`;
      case 'Signatures': return `${baseStyle} bg-purple-100 text-purple-800`;
      case 'Funds Disbursed': return `${baseStyle} bg-teal-100 text-teal-800`;
      case 'Completed': return `${baseStyle} bg-green-100 text-green-800`;
      case 'Verified': return `${baseStyle} bg-green-100 text-green-800`;
      case 'Pending': return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case 'Rejected': return `${baseStyle} bg-red-100 text-red-800`;
      default: return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Initiation': return <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V20a2 2 0 01-2 2z" /></svg>;
      case 'Preparation': return <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2m10 0a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2" /></svg>;
      case 'Wire Details': return <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'Signatures': return <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2m10 0a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2" /></svg>;
      case 'Funds Disbursed': return <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'Completed': return <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'Verified': return <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'Pending': return <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'Rejected': return <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default: return null;
    }
  };

  // Update sampleDocuments to include uploadedBy and date values
  const sampleDocuments = [
    {
      id: 'd1',
      name: 'Purchase Agreement',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Alice Lee',
      dateUploaded: '2024-05-01',
      contractTitle: 'New Property Acquisition',
      contractId: '9548',
    },
    {
      id: 'd2',
      name: 'Inspection Report',
      type: 'PDF',
      size: '1.1 MB',
      uploadedBy: 'Bob Martin',
      dateUploaded: '2024-05-02',
      contractTitle: 'Land Development Contract',
      contractId: '9550',
    },
    {
      id: 'd3',
      name: 'Lease Agreement',
      type: 'DOCX',
      size: '900 KB',
      uploadedBy: 'Samantha Fox',
      dateUploaded: '2024-05-03',
      contractTitle: 'Commercial Lease Amendment',
      contractId: '8784',
    },
    {
      id: 'd4',
      name: 'Title Insurance',
      type: 'PDF',
      size: '1.7 MB',
      uploadedBy: 'David Miller',
      dateUploaded: '2024-05-04',
      contractTitle: 'Property Sale Contract',
      contractId: '8423',
    },
    {
      id: 'd5',
      name: 'Appraisal',
      type: 'PDF',
      size: '2.0 MB',
      uploadedBy: 'Emma Johnson',
      dateUploaded: '2024-05-05',
      contractTitle: 'Office Building Purchase',
      contractId: '6891',
    },
    {
      id: 'd6',
      name: 'Closing Disclosure',
      type: 'PDF',
      size: '1.3 MB',
      uploadedBy: 'Sarah Thompson',
      dateUploaded: '2024-05-06',
      contractTitle: 'Luxury Villa Purchase',
      contractId: '10003',
    },
    {
      id: 'd7',
      name: 'Wire Instructions',
      type: 'PDF',
      size: '1.2 MB',
      uploadedBy: 'Robert Chen',
      dateUploaded: '2024-05-07',
      contractTitle: 'Beachfront Property Sale',
      contractId: '10005',
    },
  ];

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [selectedType, setSelectedType] = useState('Property Sale');

  // Update editableTitle and selectedType when a contract is selected
  useEffect(() => {
    if (selectedContract) {
      setEditableTitle(selectedContract.title);
      setSelectedType(selectedContract.type || 'Property Sale');
    }
  }, [selectedContract]);

  return (
    <>
    <div className="space-y-4">
      {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <div className="pb-1">
            <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-0">Contracts</h1>
            <p className="text-gray-500 text-[15px] md:text-[16px] mt-0">
              Manage & monitor all your escrow contracts
          </p>
        </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
            <div className="inline-block rounded-full bg-teal-50 px-2 py-0.5 text-teal-500 font-semibold text-xs border border-teal-100 self-start sm:self-center">
              Logged in as: Creator
            </div>
            <div className="inline-flex rounded-md border border-gray-200 bg-white px-1 py-0.5 self-start sm:self-center">
              <button className="px-2 py-2 text-xs font-medium text-gray-700 bg-white rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:border-primary">Admin</button>
              <button className="px-2 py-2 text-xs font-medium text-white bg-primary z-10 hover:bg-primary-dark focus:outline-none focus:border-primary">Creator</button>
              <button className="px-2 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:z-10 focus:outline-none focus:border-primary">Editor</button>
              <button className="px-2 py-2 text-xs font-medium text-gray-700 bg-white rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:border-primary">Viewer</button>
            </div>
            <button 
              onClick={() => setShowNewContractForm(!showNewContractForm)}
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold w-full sm:w-auto"
            >
          <FaPlus className="mr-2 text-base" />
          New Contract
        </button>
          </div>
      </div>

      <hr className="my-6 border-gray-300" />

        {/* Expandable Contract Creation Form */}
        {showNewContractForm && (
          <div className="bg-white rounded-xl border border-gray-300 px-6 py-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                  <HiOutlineDocumentText className="text-primary text-2xl" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-black leading-tight">Create New Contract</h2>
                  <p className="text-gray-500 text-sm leading-tight">Fill in the contract details to get started</p>
                </div>
            </div>
              <button 
                onClick={() => { setShowNewContractForm(false); setModalStep(1); }} 
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          </div>

            {/* Stepper */}
            <div className="w-full overflow-x-auto">
              <div className="flex items-center justify-between mb-6 min-w-[340px] sm:min-w-0">
                <div className="flex items-center space-x-2 w-full flex-nowrap">
                  {[1, 2, 3].map((step, idx) => (
                    <React.Fragment key={step}>
                <button
                        type="button"
                        onClick={() => setModalStep(step)}
                        className={`flex items-center gap-2 rounded-full font-semibold border transition-all duration-300 text-sm px-6 py-2 whitespace-nowrap
                          ${modalStep === step
                            ? 'bg-white text-gray-900 border-gray-300 ring-1 ring-inset ring-gray-200 shadow-sm'
                            : 'text-gray-500 border-transparent hover:bg-gray-100'}
                        `}
                      >
                        <span className={`inline-block transition-all duration-300 ${modalStep === step ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: modalStep === step ? 18 : 0}}>
                          {modalStep === step && <Logo width={18} height={18} className="pointer-events-none" />}
                        </span>
                        {step === 1 && 'Step 1: Details'}
                        {step === 2 && 'Step 2: Parties'}
                        {step === 3 && 'Step 3: Documents'}
                </button>
                      {idx < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-2 min-w-[20px]" />}
                    </React.Fragment>
              ))}
            </div>
          </div>
        </div>

            {/* Form Content */}
            <div className="space-y-6">
              {modalStep === 1 && (
                <form onSubmit={e => { e.preventDefault(); setModalStep(2); }}>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Contract Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={modalForm.title}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter contract title"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="escrowNumber" className="block text-sm font-medium text-gray-700 mb-1">Escrow Number</label>
                      <input
                        type="text"
                        id="escrowNumber"
                        name="escrowNumber"
                        value={modalForm.escrowNumber}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter escrow number"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                      <select
                        id="type"
                        name="type"
                        value={modalForm.type}
                        onChange={handleModalChange}
                        className="contract-type-select w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs appearance-none bg-white bg-no-repeat bg-[length:20px] bg-[right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                        required
                      >
                        <option value="" disabled>Select a contract type</option>
                        {CONTRACT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={modalForm.propertyType}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs appearance-none bg-white bg-no-repeat bg-[length:20px] bg-[right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                        required
                      >
                        <option value="" disabled>Select property type</option>
                        {PROPERTY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="milestone" className="block text-sm font-medium text-gray-700 mb-1">Milestone Template</label>
                      <select
                        id="milestone"
                        name="milestone"
                        value={modalForm.milestone}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs appearance-none bg-white bg-no-repeat bg-[length:20px] bg-[right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                        required
                      >
                        <option value="" disabled>Select a milestone template</option>
                        {MILESTONE_TEMPLATES.map(template => (
                          <option key={template} value={template}>{template}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">Contract Value</label>
                      <input
                        type="text"
                        id="value"
                        name="value"
                        value={modalForm.value}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter contract value"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={modalForm.dueDate}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 pr-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-gray-500 bg-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                    <input
                      type="text"
                      id="propertyAddress"
                      name="propertyAddress"
                      value={modalForm.propertyAddress}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter property address"
                      required
                    />
                  </div>
                  <div className="mt-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={modalForm.notes}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[120px]"
                      placeholder="Enter any additional notes for this contract"
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base">Next</button>
        </div>
                </form>
              )}

              {modalStep === 2 && (
                <form onSubmit={e => { e.preventDefault(); setModalStep(3); }}>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="buyer" className="block text-sm font-medium text-gray-700 mb-1">Buyer / Client</label>
                      <input
                        type="text"
                        id="buyer"
                        name="buyer"
                        value={modalForm.buyer}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter buyer or client name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="buyerEmail" className="block text-sm font-medium text-gray-700 mb-1">Buyer Email</label>
                      <input
                        type="email"
                        id="buyerEmail"
                        name="buyerEmail"
                        value={modalForm.buyerEmail}
                        onChange={handleModalChange}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs ${
                          emailErrors.buyerEmail ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter buyer email"
                        required
                      />
                      {emailErrors.buyerEmail && (
                        <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="seller" className="block text-sm font-medium text-gray-700 mb-1">Seller / Provider</label>
                      <input
                        type="text"
                        id="seller"
                        name="seller"
                        value={modalForm.seller}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter seller or provider name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sellerEmail" className="block text-sm font-medium text-gray-700 mb-1">Seller Email</label>
                      <input
                        type="email"
                        id="sellerEmail"
                        name="sellerEmail"
                        value={modalForm.sellerEmail}
                        onChange={handleModalChange}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs ${
                          emailErrors.sellerEmail ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter seller email"
                        required
                      />
                      {emailErrors.sellerEmail && (
                        <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-1">Agent / Escrow Officer (Optional)</label>
                      <input
                        type="text"
                        id="agent"
                        name="agent"
                        value={modalForm.agent}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter agent or escrow officer name"
                      />
                    </div>
                    <div>
                      <label htmlFor="agentEmail" className="block text-sm font-medium text-gray-700 mb-1">Agent Email (Optional)</label>
                      <input
                        type="email"
                        id="agentEmail"
                        name="agentEmail"
                        value={modalForm.agentEmail}
                        onChange={handleModalChange}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs ${
                          emailErrors.agentEmail ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter agent email"
                      />
                      {emailErrors.agentEmail && (
                        <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">Lender Name</label>
                      <input
                        type="text"
                        id="lenderName"
                        name="lenderName"
                        value={modalForm.lenderName}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter lender name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="titleCompany" className="block text-sm font-medium text-gray-700 mb-1">Title Company</label>
                      <input
                        type="text"
                        id="titleCompany"
                        name="titleCompany"
                        value={modalForm.titleCompany}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter title company name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="insuranceCompany" className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
                      <input
                        type="text"
                        id="insuranceCompany"
                        name="insuranceCompany"
                        value={modalForm.insuranceCompany}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter insurance company name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700 mb-1">Expected Closing Date</label>
                      <input
                        type="date"
                        id="closingDate"
                        name="closingDate"
                        value={modalForm.closingDate}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 pr-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-gray-500 bg-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="earnestMoney" className="block text-sm font-medium text-gray-700 mb-1">Earnest Money</label>
                      <input
                        type="text"
                        id="earnestMoney"
                        name="earnestMoney"
                        value={modalForm.earnestMoney}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter earnest money amount"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                      <input
                        type="text"
                        id="downPayment"
                        name="downPayment"
                        value={modalForm.downPayment}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter down payment amount"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                      <input
                        type="text"
                        id="loanAmount"
                        name="loanAmount"
                        value={modalForm.loanAmount}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter loan amount"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                      <input
                        type="text"
                        id="interestRate"
                        name="interestRate"
                        value={modalForm.interestRate}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter interest rate"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Years)</label>
                      <input
                        type="text"
                        id="loanTerm"
                        name="loanTerm"
                        value={modalForm.loanTerm}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter loan term"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="inspectionPeriod" className="block text-sm font-medium text-gray-700 mb-1">Inspection Period (Days)</label>
              <input
                type="text"
                        id="inspectionPeriod"
                        name="inspectionPeriod"
                        value={modalForm.inspectionPeriod}
                        onChange={handleModalChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        placeholder="Enter inspection period"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="contingencies" className="block text-sm font-medium text-gray-700 mb-1">Contingencies</label>
                    <textarea
                      id="contingencies"
                      name="contingencies"
                      value={modalForm.contingencies}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[80px]"
                      placeholder="Enter any contingencies for this contract"
                      required
                    />
                  </div>
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => setModalStep(1)} className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold hover:bg-gray-50 transition-colors text-base">Previous</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base">Next</button>
                  </div>
                </form>
              )}

              {modalStep === 3 && (
                <form onSubmit={e => { e.preventDefault(); setShowNewContractForm(false); setModalStep(1); }}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents (Optional)</label>
                      <label htmlFor="file-upload" className="block cursor-pointer">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-8 px-4 text-center transition hover:border-primary">
                          <HiOutlineUpload className="text-3xl text-gray-400 mb-2" />
                          <div className="text-gray-700 font-medium">Click to upload or drag and drop</div>
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
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Place the search/filter bar above the contracts/documents tab and table outlined box */}
        <div className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0">
            <FaSearch className="text-gray-400 mr-2 text-lg" />
              <input
                type="text"
                placeholder="Search contracts or parties"
                value={searchTerm}
                onChange={handleSearchChange}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaFilter className="text-gray-400 text-lg" />
            <span>All Statuses</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaCalendarAlt className="text-gray-400 text-lg" />
            <span>Last 30 days</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[150px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaSort className="text-gray-400 text-lg" />
            <span>Recently Updated</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
            </div>

        {/* Table Section with Tabs in Outlined Box */}
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          {/* Tabs Row */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 w-full">
            {/* Contracts/Documents Tabs */}
            <div className="flex space-x-8 overflow-x-auto w-full md:w-auto">
              <button
                className={`pb-2 text-sm font-semibold whitespace-nowrap ${
                  activeContentTab === 'contractList'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveContentTab('contractList')}
              >
                Contracts
              </button>
              <button
                className={`pb-2 text-sm font-semibold whitespace-nowrap ${
                  activeContentTab === 'documents'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveContentTab('documents')}
              >
                Documents
              </button>
            </div>
            {/* Created by Me/Assigned to Me Tabs (styled like main tabs) */}
            <div className="flex flex-col items-end w-full md:w-auto">
              <div className="flex space-x-8 overflow-x-auto w-full md:w-auto">
                {TABS.filter(tab => tab.key !== 'allContracts').map(tab => (
                <button
                  key={tab.key}
                    className={`pb-2 text-sm font-semibold whitespace-nowrap ${
                      activeTab === tab.key
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                    onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
              </div>
              {activeContentTab === 'documents' && (
                <button className="flex items-center justify-center mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold w-full sm:w-auto">
                  <HiOutlineUpload className="mr-2 text-base" />
                  Upload Document
                </button>
              )}
            </div>
          </div>
          {/* Table */}
          {activeContentTab === 'contractList' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parties</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Hash</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                      <span
                        className="text-primary underline font-semibold cursor-pointer"
                        onClick={e => { e.stopPropagation(); setSelectedContract(contract); }}
                      >
                        {contract.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <div className="text-gray-900">{contract.parties}</div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                        <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getStatusBadgeStyle(contract.status)}`}
                          style={{ minWidth: '7rem', display: 'inline-flex' }}>
                        {contract.status}
                      </span>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-500">
                      {contract.updated}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-primary">
                      {contract.value}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                        <div className="flex items-center justify-center">
                          <span
                            className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                            style={{ maxWidth: '120px' }}
                            title={`0x${contract.id}0000000000000000000000000000000000000000000000000000000000000000`}
                          >
                            0x{contract.id}...{contract.id.slice(-4)}
                          </span>
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={() => navigator.clipboard.writeText(`0x${contract.id}0000000000000000000000000000000000000000000000000000000000000000`)}
                            aria-label="Copy contract hash"
                          >
                            <HiOutlineDuplicate className="w-4 h-4" />
                          </button>
                        </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-medium">
                        <div className="flex items-center justify-center space-x-1">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Edit">
                            <HiOutlinePencilAlt className="h-4 w-4" />
                        </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Upload">
                            <HiOutlineUpload className="h-4 w-4" />
                        </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                            <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          {/* Documents tab/table remains unchanged for now */}
          {activeContentTab === 'documents' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPLOADED BY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE UPLOADED</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CONTRACT ID</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.type} - {doc.size}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">{doc.uploadedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{doc.dateUploaded}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.contractTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                        <a
                          href={`#${doc.contractId}`}
                          className="text-primary underline font-semibold cursor-pointer"
                        >
                          {doc.contractId}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-medium">
                        <div className="flex items-center justify-center space-x-1">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Edit">
                            <HiOutlinePencilAlt className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Upload">
                            <HiOutlineUpload className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .contract-type-select option {
          background: #23B5B5;
          color: #fff;
        }
      `}</style>

      {/* Modal for contract details */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Close button (X) and Edit button */}
            <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
                <HiOutlinePencilAlt className="text-base" />
                Edit Contract
              </button>
              <button
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
                onClick={() => setSelectedContract(null)}
                aria-label="Close"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content (scrollable) */}
            <div className="overflow-y-auto p-6 flex-1">
              {/* Top Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10">
                    <span className="text-xs font-semibold text-primary">#{selectedContract.id}</span>
                  </div>
                  <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full text-xs ${getStatusBadgeStyle(selectedContract.status)}`}> 
                    {selectedContract.status}
                  </span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 w-full flex-nowrap">
                    {[
                      { key: 'initiation', label: 'Initiation', number: 1 },
                      { key: 'preparation', label: 'Preparation', number: 2 },
                      { key: 'wire-details', label: 'Wire Details', number: 3 },
                      { key: 'in-review', label: 'In Review', number: 4 },
                      { key: 'signatures', label: 'Signatures', number: 5 },
                      { key: 'funds-disbursed', label: 'Funds Disbursed', number: 6 },
                      { key: 'complete', label: 'Complete', number: 7 }
                    ].map((step, idx, arr) => {
                      const isActive = selectedContract.status.toLowerCase() === step.key;
                      const isPast = arr.findIndex(s => s.key === selectedContract.status.toLowerCase()) > idx;
                      return (
                        <React.Fragment key={step.key}>
                          <div
                            className={`flex items-center gap-2 rounded-full font-medium text-xs px-3 py-1.5 whitespace-nowrap
                              ${isActive 
                                ? 'bg-primary text-white' 
                                : isPast 
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-gray-50 text-gray-400'
                              }`}
                          >
                            <span className="font-semibold">{step.number}.</span> {step.label}
                          </div>
                          {idx < arr.length - 1 && (
                            <div className={`flex-1 h-0.5 ${isPast ? 'bg-primary' : 'bg-gray-200'} mx-2 min-w-[20px]`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contract Details Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 max-w-[600px] ml-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Contract Details</h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  {/* Row 1: Contract ID and Hash */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                    <div className="text-xs font-semibold text-primary">{selectedContract.id}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Contract Hash</div>
                    <div className="flex items-center">
                      <span
                        className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                        style={{ maxWidth: '120px' }}
                        title={`0x${selectedContract.id}0000000000000000000000000000000000000000000000000000000000000000`}
                      >
                        0x{selectedContract.id}...{selectedContract.id.slice(-4)}
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => navigator.clipboard.writeText(`0x${selectedContract.id}0000000000000000000000000000000000000000000000000000000000000000`)}
                        aria-label="Copy contract hash"
                      >
                        <HiOutlineDuplicate className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Row 2: Contract Title and Type */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Contract Title</div>
                    {isEditingTitle ? (
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        value={editableTitle}
                        autoFocus
                        onChange={e => setEditableTitle(e.target.value)}
                        onBlur={() => {
                          if (selectedContract) {
                            selectedContract.title = editableTitle;
                          }
                          setIsEditingTitle(false);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (selectedContract) {
                              selectedContract.title = editableTitle;
                            }
                            setIsEditingTitle(false);
                          }
                        }}
                      />
                    ) : (
                      <div
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 cursor-text hover:border-gray-300 transition-colors"
                        onClick={() => setIsEditingTitle(true)}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') setIsEditingTitle(true); }}
                      >
                        {editableTitle || 'Click to edit title'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Contract Type</div>
                    <div className="relative">
                      <select
                        className="contract-type-select w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs appearance-none bg-white bg-no-repeat bg-[length:20px] bg-[right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                      >
                        {CONTRACT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Status Row */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Status</div>
                    <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full text-xs ${getStatusBadgeStyle(selectedContract.status)}`}>{selectedContract.status}</span>
                  </div>
                  <div></div>
                  {/* Row 3: Current Milestone and Next Step */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Current Milestone</div>
                    <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full text-xs ${getStatusBadgeStyle('Wire Details')}`}>Wire Details</span>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Next Step</div>
                    <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full text-xs ${getStatusBadgeStyle('In Review')}`}>Document Review</span>
                  </div>
                  {/* Row 4: Created Date and Last Updated */}
                  <div className="col-span-2 grid grid-cols-2 gap-x-12">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Created Date</div>
                      <div className="text-xs font-semibold text-gray-900">May 1, 2024</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Last Updated</div>
                      <div className="text-xs font-semibold text-gray-900">May 2, 2024</div>
                    </div>
                  </div>
                  {/* Row 5: Total Value */}
                  <div className="col-span-2">
                    <div className="text-gray-500 text-xs mb-1">Total Value</div>
                    <div className="text-xs font-semibold text-primary">{selectedContract.value}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractsPage; 