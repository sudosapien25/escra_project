// RENDER-TEST-789
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter, FaFileAlt, FaCheckCircle, FaClock, FaCalendarAlt, FaSort, FaPlus, FaArrowUp, FaDollarSign, FaDownload, FaRegFileAlt, FaTimes } from 'react-icons/fa';
import { FaArrowUpFromBracket } from 'react-icons/fa6';
import { HiOutlineDocumentText, HiOutlineDuplicate, HiOutlineDownload, HiOutlineTrash, HiOutlinePencilAlt, HiOutlineDocument, HiOutlineDocumentDownload, HiOutlineUpload, HiOutlineEye, HiOutlineClipboardList, HiOutlineExclamation } from 'react-icons/hi';
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
  buyer?: string;
  seller?: string;
  agent?: string;
}

const ContractsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('allContracts');
  const [activeContentTab, setActiveContentTab] = useState('contractList');
  const [activeRole, setActiveRole] = useState('creator');
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
    sellerEmail: '',
    agentEmail: '',
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

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Initiation': return 'bg-blue-100 text-blue-800 border border-blue-500';
      case 'Preparation': return 'bg-gray-100 text-gray-800 border border-gray-400';
      case 'In Review': return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'Wire Details': return 'bg-orange-100 text-orange-800 border border-orange-400';
      case 'Signatures': return 'bg-purple-100 text-purple-800 border border-purple-500';
      case 'Funds Disbursed': return 'bg-teal-100 text-teal-800 border border-teal-500';
      case 'Completed': return 'bg-green-100 text-green-800 border border-green-500';
      case 'Verified': return 'bg-green-100 text-green-800 border border-green-500';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'Rejected': return 'bg-red-100 text-red-800 border border-red-500';
      default: return 'bg-gray-100 text-gray-800 border border-gray-400';
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
    {
      id: 'd8',
      name: 'Inspection Photos',
      type: 'JPG',
      size: '3.2 MB',
      uploadedBy: 'Bob Martin',
      dateUploaded: '2024-05-08',
      contractTitle: 'Land Development Contract',
      contractId: '9550',
    },
    {
      id: 'd9',
      name: 'Environmental Report',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'Samantha Fox',
      dateUploaded: '2024-05-09',
      contractTitle: 'Commercial Lease Amendment',
      contractId: '8784',
    },
    {
      id: 'd10',
      name: 'HOA Documents',
      type: 'PDF',
      size: '2.0 MB',
      uploadedBy: 'David Miller',
      dateUploaded: '2024-05-10',
      contractTitle: 'Property Sale Contract',
      contractId: '8423',
    },
    {
      id: 'd11',
      name: 'Final Walkthrough Checklist',
      type: 'DOCX',
      size: '0.7 MB',
      uploadedBy: 'Emma Johnson',
      dateUploaded: '2024-05-11',
      contractTitle: 'Office Building Purchase',
      contractId: '6891',
    },
    {
      id: 'd12',
      name: 'Loan Approval Letter',
      type: 'PDF',
      size: '1.1 MB',
      uploadedBy: 'Sarah Thompson',
      dateUploaded: '2024-05-12',
      contractTitle: 'Luxury Villa Purchase',
      contractId: '10003',
    },
    {
      id: 'd13',
      name: 'Title Commitment',
      type: 'PDF',
      size: '1.5 MB',
      uploadedBy: 'Robert Chen',
      dateUploaded: '2024-05-13',
      contractTitle: 'Beachfront Property Sale',
      contractId: '10005',
    },
    {
      id: 'd14',
      name: 'Survey',
      type: 'PDF',
      size: '2.2 MB',
      uploadedBy: 'Alice Lee',
      dateUploaded: '2024-05-14',
      contractTitle: 'New Property Acquisition',
      contractId: '9548',
    },
    {
      id: 'd15',
      name: 'Closing Statement',
      type: 'PDF',
      size: '1.9 MB',
      uploadedBy: 'Bob Martin',
      dateUploaded: '2024-05-15',
      contractTitle: 'Land Development Contract',
      contractId: '9550',
    },
    {
      id: 'd16',
      name: 'Warranty Deed',
      type: 'PDF',
      size: '1.3 MB',
      uploadedBy: 'Samantha Fox',
      dateUploaded: '2024-05-16',
      contractTitle: 'Commercial Lease Amendment',
      contractId: '8784',
    },
    {
      id: 'd17',
      name: 'Escrow Instructions',
      type: 'PDF',
      size: '2.6 MB',
      uploadedBy: 'David Miller',
      dateUploaded: '2024-05-17',
      contractTitle: 'Property Sale Contract',
      contractId: '8423',
    },
    {
      id: 'd18',
      name: 'Appraisal Report',
      type: 'PDF',
      size: '2.1 MB',
      uploadedBy: 'Emma Johnson',
      dateUploaded: '2024-05-18',
      contractTitle: 'Office Building Purchase',
      contractId: '6891',
    },
    {
      id: 'd19',
      name: 'Flood Certificate',
      type: 'PDF',
      size: '0.8 MB',
      uploadedBy: 'Sarah Thompson',
      dateUploaded: '2024-05-19',
      contractTitle: 'Luxury Villa Purchase',
      contractId: '10003',
    },
    {
      id: 'd20',
      name: 'Power of Attorney',
      type: 'PDF',
      size: '1.0 MB',
      uploadedBy: 'Robert Chen',
      dateUploaded: '2024-05-20',
      contractTitle: 'Beachfront Property Sale',
      contractId: '10005',
    },
  ];

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [selectedType, setSelectedType] = useState('Property Sale');
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);
  const [editableBuyer, setEditableBuyer] = useState('');
  const [isEditingSeller, setIsEditingSeller] = useState(false);
  const [editableSeller, setEditableSeller] = useState('');
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [editableAgent, setEditableAgent] = useState('');

  const [documentsBoxHeight, setDocumentsBoxHeight] = useState<number | undefined>(undefined);
  const documentsBoxRef = useRef<HTMLDivElement>(null);
  const TASKS_BOX_VERTICAL_PADDING = 48; // p-6 top + bottom = 24px + 24px = 48px
  const TASKS_HEADER_MARGIN_BOTTOM = 16; // mb-4 = 16px

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadContractId, setUploadContractId] = useState<string | null>(null);
  const [uploadModalFiles, setUploadModalFiles] = useState<File[]>([]);

  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ name: string; url: string } | null>(null);

  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);

  useEffect(() => {
    if (!documentsBoxRef.current) return;
    const updateHeight = () => {
      if (documentsBoxRef.current) {
        setDocumentsBoxHeight(documentsBoxRef.current.offsetHeight);
      }
    };
    updateHeight();
    const resizeObserver = new window.ResizeObserver(updateHeight);
    resizeObserver.observe(documentsBoxRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Update editableTitle and selectedType when a contract is selected
  useEffect(() => {
    if (selectedContract) {
      setEditableTitle(selectedContract.title);
      setSelectedType(selectedContract.type || 'Property Sale');
      setEditableBuyer(selectedContract.buyer || '');
      setEditableSeller(selectedContract.seller || '');
      setEditableAgent(selectedContract.agent || '');
    }
  }, [selectedContract]);

  // Helper function to generate contract hash
  const getContractHash = (id: string) => `0x${id}${'0'.repeat(66 - 2 - id.length)}`;

  // Add state for tooltip for contract details and table
  const [copiedContractId, setCopiedContractId] = useState<string | null>(null);
  const [hoveredContractId, setHoveredContractId] = useState<string | null>(null);

  const handleUploadModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    // Only allow PDF, DOC, DOCX, JPG and max 10MB each
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setUploadModalFiles(validFiles);
  };

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
            <div className="inline-flex self-start sm:self-center border border-gray-200 rounded-lg overflow-hidden">
              {['admin', 'creator', 'editor', 'viewer'].map((role, idx, arr) => (
                <button
                  key={role}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors border-0 ${
                    idx !== 0 ? 'border-l border-gray-200' : ''
                  } ${
                    idx === 0 ? 'rounded-l-lg' : ''
                  } ${
                    idx === arr.length - 1 ? 'rounded-r-lg' : ''
                  } ${
                    activeRole === role
                      ? 'bg-teal-50 text-teal-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveRole(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
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

      {/* Stat Boxes or New Contract Modal */}
      {showNewContractForm ? (
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
                          : 'text-gray-500 border-transparent hover:bg-gray-100'
                        }`}
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Contracts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
              <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <HiOutlineDocumentText size={18} color="#06b6d4" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Contracts</p>
                <p className="text-2xl font-bold text-gray-900">10</p>
                <p className="text-xs invisible">placeholder</p>
              </div>
            </div>
            {/* Pending Signatures */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <HiOutlinePencilAlt size={18} color="#7c3aed" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending Signatures</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-400">Requires action</p>
              </div>
            </div>
            {/* Awaiting Wire Instructions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <HiOutlineExclamation size={20} color="#f59e42" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Awaiting Wire Details</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-400">Needs attention</p>
              </div>
            </div>
            {/* Avg. Completion Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FaClock size={18} color="#3b82f6" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Avg. Completion Time</p>
                <p className="text-2xl font-bold text-gray-900">9.2 days</p>
                <p className="text-xs text-green-600 font-semibold">↓ 1.3 days faster</p>
              </div>
            </div>
          </div>
          {/* Total Contract Value Box */}
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4 w-full shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <FaDollarSign size={18} color="#06b6d4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Contract Value</p>
              <p className="text-xl font-bold text-primary">$8,255,000</p>
              <p className="text-xs text-green-600 font-semibold">↑ 12% from last month</p>
            </div>
          </div>
        </>
      )}

      {/* Search/Filter Bar */}
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
                <></>
              )}
            </div>
          </div>
          {/* Table */}
          {activeContentTab === 'contractList' && (
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }} className="relative overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Parties</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Hash</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <span className="text-primary underline font-semibold cursor-pointer" onClick={e => { e.stopPropagation(); setSelectedContract(contract); }}>{contract.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="text-gray-900">{contract.parties}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                        <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getStatusBadgeStyle(contract.status)}`}
                          style={{ minWidth: '7rem', display: 'inline-flex', borderWidth: '1px' }}>{contract.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-500">2024-05-01</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-500">{contract.updated}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-primary">{contract.value}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                        <div className="flex items-center justify-center">
                          <span className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer" style={{ maxWidth: '120px' }} title={getContractHash(contract.id)}>
                            0x{contract.id}...{contract.id.slice(-4)}
                          </span>
                          <div className="relative">
                            <button type="button" className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none" onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(getContractHash(contract.id)); setCopiedContractId(contract.id); setTimeout(() => setCopiedContractId(null), 1500); }} onMouseEnter={() => setHoveredContractId(contract.id)} onMouseLeave={() => setHoveredContractId(null)} aria-label="Copy contract hash">
                              <HiOutlineDuplicate className="w-4 h-4" />
                            </button>
                            {(hoveredContractId === contract.id || copiedContractId === contract.id) && (
                              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap z-20 pointer-events-none">
                                {copiedContractId === contract.id ? 'Copied' : 'Copy'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-medium">
                        <div className="flex items-center justify-center space-x-1">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Edit">
                            <HiOutlinePencilAlt className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Upload" onClick={e => { e.stopPropagation(); setShowUploadModal(true); setUploadContractId(contract.id); }}>
                            <HiOutlineUpload className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete" onClick={e => { e.stopPropagation(); /* Add your delete logic or confirmation modal here */ }}>
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
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }} className="relative overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">UPLOADED BY</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">DATE UPLOADED</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">CONTRACT ID</th>
                    <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>{doc.type}</span>
                          <span>&bull;</span>
                          <span>{doc.size}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">{doc.uploadedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{doc.dateUploaded}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.contractTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                        <a href={`#${doc.contractId}`} className="text-primary underline font-semibold cursor-pointer">{doc.contractId}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-medium">
                        <div className="flex items-center justify-center space-x-1">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View" onClick={() => { setSelectedPdf({ name: doc.name, url: `/documents/${doc.name}` }); setShowPdfViewer(true); }}>
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                            <HiOutlineDownload className="h-4 w-4" />
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
      

      {/* Modal for contract details */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header with Download Summary and Close buttons */}
            <div className="sticky top-0 z-40 bg-white px-6 py-4">
              <div className="flex items-start justify-between">
                {/* Left: Contract ID and Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10">
                      <span className="text-xs font-semibold text-primary">#{selectedContract.id}</span>
                    </div>
                    <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full text-xs ${getStatusBadgeStyle(selectedContract.status)}`}> 
                      {selectedContract.status}
                    </span>
                  </div>
                </div>
                {/* Right: Close Button (original, now sticky) */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                  onClick={() => setSelectedContract(null)}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Centered Status Bar */}
              <div className="w-full overflow-x-auto">
                <div className="flex justify-center w-full max-w-full">
                  <div className="flex items-center gap-x-4 max-w-3xl -ml-32">
                    {[
                      { key: 'initiation', label: 'Initiation', number: 1 },
                      { key: 'preparation', label: 'Preparation', number: 2 },
                      { key: 'wire-details', label: 'Wire Details', number: 3 },
                      { key: 'in-review', label: 'In Review', number: 4 },
                      { key: 'signatures', label: 'Signatures', number: 5 },
                      { key: 'funds-disbursed', label: 'Funds Disbursed', number: 6 },
                      { key: 'complete', label: 'Complete', number: 7 }
                    ].map((step, idx, arr) => (
                      <div key={step.key} className="flex items-center">
                        <div
                          className={`flex-shrink-0 flex items-center gap-1 rounded-full font-semibold text-xs px-2 py-1 whitespace-nowrap transition-all
                            ${selectedContract.status.toLowerCase() === step.key 
                              ? 'bg-primary text-white' 
                              : arr.findIndex(s => s.key === selectedContract.status.toLowerCase()) > idx
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-gray-50 text-gray-400'
                            }`}
                        >
                          <span className="font-semibold">{step.number}.</span> {step.label}
                        </div>
                        {idx < arr.length - 1 && (
                          <div className="w-8 h-0.5 mx-1 bg-gray-200" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Content (scrollable) */}
            <div className="overflow-y-auto p-6 flex-1">
              {/* Modal Content Grid: 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full min-h-0 -mt-2">
                {/* LEFT COLUMN: Contract Details, Wire Details, Documents */}
                <div className="flex flex-col gap-6 w-full h-full min-h-0">
                  {/* Contract Details Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
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
                            title={getContractHash(selectedContract.id)}
                          >
                            0x{selectedContract.id}...{selectedContract.id.slice(-4)}
                          </span>
                          <div className="relative">
                            <button
                              type="button"
                              className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                              onClick={() => {
                                navigator.clipboard.writeText(getContractHash(selectedContract.id));
                                setCopiedContractId(selectedContract.id);
                                setTimeout(() => setCopiedContractId(null), 1500);
                              }}
                              onMouseEnter={() => setHoveredContractId(selectedContract.id)}
                              onMouseLeave={() => setHoveredContractId(null)}
                              aria-label="Copy contract hash"
                            >
                              <HiOutlineDuplicate className="w-4 h-4" />
                            </button>
                            {(hoveredContractId === selectedContract.id || copiedContractId === selectedContract.id) && (
                              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap z-20 pointer-events-none">
                                {copiedContractId === selectedContract.id ? 'Copied' : 'Copy'}
                              </span>
                            )}
                          </div>
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
                  {/* Wire Details Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Wire Details</h3>
                    <div className="grid grid-cols-1 gap-y-4">
                      {/* Routing Number */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Routing Number</div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                          placeholder="Enter routing number"
                        />
                      </div>
                      {/* Account Number */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Account Number</div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                          placeholder="Enter account number"
                        />
                      </div>
                      {/* Bank Name */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Bank Name</div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                          placeholder="Enter bank name"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Documents Box */}
                  <div ref={documentsBoxRef} className="bg-white border border-gray-200 rounded-lg p-6 w-full box-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Documents</h3>
                      <button 
                        onClick={() => { setShowUploadModal(true); setUploadContractId(selectedContract?.id || null); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                      >
                        <HiOutlineUpload className="w-4 h-4 text-primary" />
                        <span>Upload</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '340px' }}>
                      {/* Mock document list (7 items) */}
                      {[{ name: 'Wire_Authorization', date: '2025-05-18', size: '1.2 MB', type: 'PDF' },
                        { name: 'Closing_Disclosure', date: '2025-05-15', size: '0.9 MB', type: 'PDF' },
                        { name: 'Purchase_Agreement', date: '2025-05-12', size: '2.1 MB', type: 'PDF' },
                        { name: 'Inspection_Report', date: '2025-05-10', size: '1.5 MB', type: 'PDF' },
                        { name: 'Appraisal', date: '2025-05-08', size: '1.0 MB', type: 'PDF' },
                        { name: 'Title_Insurance', date: '2025-05-05', size: '1.3 MB', type: 'PDF' },
                        { name: 'Loan_Estimate', date: '2025-05-02', size: '0.8 MB', type: 'PDF' },
                      ].map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-semibold text-xs text-black cursor-pointer hover:underline">{doc.name}</div>
                              <div className="text-xs text-gray-500">{doc.date} &bull; {doc.type} &bull; {doc.size}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View" onClick={() => { setSelectedPdf({ name: doc.name, url: `/documents/${doc.name}` }); setShowPdfViewer(true); }}>
                              <HiOutlineEye className="h-4 w-4" />
                            </button>
                            <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                              <HiOutlineDownload className="h-4 w-4" />
                            </button>
                            <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                              <HiOutlineTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* RIGHT COLUMN: Parties Involved, Signature Status, Tasks */}
                <div className="flex flex-col gap-6 w-full h-full min-h-0">
                  {/* Parties Involved Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Parties Involved</h3>
                    <div className="grid grid-cols-1 gap-y-4">
                      {/* Buyer */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Buyer / Client</div>
                        {isEditingBuyer ? (
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                            value={editableBuyer}
                            autoFocus
                            onChange={e => setEditableBuyer(e.target.value)}
                            onBlur={() => {
                              if (selectedContract) {
                                selectedContract.buyer = editableBuyer;
                              }
                              setIsEditingBuyer(false);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                if (selectedContract) {
                                  selectedContract.buyer = editableBuyer;
                                }
                                setIsEditingBuyer(false);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 cursor-text hover:border-gray-300 transition-colors"
                            onClick={() => setIsEditingBuyer(true)}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setIsEditingBuyer(true); }}
                          >
                            {editableBuyer || selectedContract?.buyer || selectedContract?.parties?.split('&')[0]?.trim() || 'Robert Chen'}
                          </div>
                        )}
                      </div>
                      {/* Seller */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Seller / Provider</div>
                        {isEditingSeller ? (
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                            value={editableSeller}
                            autoFocus
                            onChange={e => setEditableSeller(e.target.value)}
                            onBlur={() => {
                              if (selectedContract) {
                                selectedContract.seller = editableSeller;
                              }
                              setIsEditingSeller(false);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                if (selectedContract) {
                                  selectedContract.seller = editableSeller;
                                }
                                setIsEditingSeller(false);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 cursor-text hover:border-gray-300 transition-colors"
                            onClick={() => setIsEditingSeller(true)}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setIsEditingSeller(true); }}
                          >
                            {editableSeller || selectedContract?.seller || selectedContract?.parties?.split('&')[1]?.trim() || 'Eastside Properties'}
                          </div>
                        )}
                      </div>
                      {/* Agent */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Agent / Escrow Officer</div>
                        {isEditingAgent ? (
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                            value={editableAgent}
                            autoFocus
                            onChange={e => setEditableAgent(e.target.value)}
                            onBlur={() => {
                              if (selectedContract) {
                                selectedContract.agent = editableAgent;
                              }
                              setIsEditingAgent(false);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                if (selectedContract) {
                                  selectedContract.agent = editableAgent;
                                }
                                setIsEditingAgent(false);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 cursor-text hover:border-gray-300 transition-colors"
                            onClick={() => setIsEditingAgent(true)}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setIsEditingAgent(true); }}
                          >
                            {editableAgent || selectedContract?.agent || 'N/A'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Signature Status Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Signature Status</h3>
                    <div className="flex flex-col gap-3">
                      {/* Use contract parties for signature status */}
                      {[
                        { name: selectedContract?.buyer || selectedContract?.parties?.split('&')[0]?.trim() || 'Robert Chen', role: 'Client', status: 'Signed', date: 'May 18, 2025' },
                        { name: selectedContract?.seller || selectedContract?.parties?.split('&')[1]?.trim() || 'Eastside Properties', role: 'Seller', status: 'Signed', date: 'May 17, 2025' },
                        { name: selectedContract?.agent || 'N/A', role: 'Escrow Officer', status: 'Pending', date: null },
                      ].map((sig) => (
                        <div key={sig.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{sig.name}</div>
                            <div className="text-xs text-gray-500">{sig.role}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            {sig.status === 'Signed' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Signed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                                Pending
                              </span>
                            )}
                            <span className="text-xs text-gray-400 font-medium min-w-[90px] text-right">{sig.date || ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Tasks Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full flex flex-col min-h-0 box-border overflow-hidden" style={documentsBoxHeight ? { height: documentsBoxHeight } : {}}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Tasks</h3>
                    <div
                      className="flex flex-col gap-3 overflow-y-auto"
                      style={{ maxHeight: 495 }}
                    >
                      {[{ name: 'Review Title Report', due: 'May 20, 2025', desc: 'Ensure there are no liens or encumbrances on the property.', contract: '9548' },
                        { name: 'Schedule Inspection', due: 'May 21, 2025', desc: 'Arrange for a home inspection with a certified inspector.', contract: '9548' },
                        { name: 'Order Appraisal', due: 'May 22, 2025', desc: 'Request an appraisal to confirm property value.', contract: '9548' },
                        { name: 'Submit Loan Documents', due: 'May 23, 2025', desc: 'Provide all required documents to the lender.', contract: '9548' },
                        { name: 'Review Closing Disclosure', due: 'May 24, 2025', desc: 'Verify all fees and terms in the closing disclosure.', contract: '9548' },
                        { name: 'Schedule Final Walkthrough', due: 'May 25, 2025', desc: 'Conduct a final walkthrough of the property.', contract: '9548' },
                        { name: 'Sign Closing Documents', due: 'May 26, 2025', desc: 'Attend closing and sign all necessary documents.', contract: '9548' },
                        { name: 'Extra Task 1', due: 'May 27, 2025', desc: 'Additional task for testing.', contract: '9548' },
                        { name: 'Extra Task 2', due: 'May 28, 2025', desc: 'Another extra task.', contract: '9548' },
                      ].map((task, idx) => (
                        <div key={task.name} className="flex items-start justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                          <div>
                            <div className="font-semibold text-xs text-black mb-1">{task.name}</div>
                            <div className="text-xs text-gray-500 mb-1">Due: {task.due}</div>
                            <div className="text-xs text-gray-500 mb-1">{task.desc}</div>
                            <div className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold">ID #{task.contract}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 z-30 px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                <HiOutlineClipboardList className="w-5 h-5 text-primary-dark" />
                Download Summary
              </button>
              <button
                className="flex items-center justify-center px-5 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
                onClick={() => setSelectedContract(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Upload Documents</h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => { setShowUploadModal(false); setUploadModalFiles([]); }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-2 text-sm text-gray-500">
              {uploadContractId && (
                <span>
                  For contract: <span className="font-semibold text-primary">#{uploadContractId}</span>
                </span>
              )}
            </div>
            <form
              className="p-0"
              onSubmit={e => {
                e.preventDefault();
                setShowUploadModal(false);
                setUploadModalFiles([]);
              }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents (Optional)</label>
              <label htmlFor="upload-modal-file-upload" className="block cursor-pointer">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-8 px-4 text-center transition hover:border-primary">
                  <HiOutlineUpload className="text-3xl text-gray-400 mb-2" />
                  <div className="text-gray-700 font-medium">Click to upload or drag and drop</div>
                  <div className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
                  <input
                    id="upload-modal-file-upload"
                    name="upload-modal-file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                    className="hidden"
                    multiple
                    onChange={handleUploadModalFileChange}
                  />
                </div>
              </label>
              {uploadModalFiles.length > 0 && (
                <ul className="mt-3 text-sm text-gray-600">
                  {uploadModalFiles.map((file, idx) => (
                    <li key={idx} className="truncate">{file.name}</li>
                  ))}
                </ul>
              )}
              <button type="submit" className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">{selectedPdf.name}</h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPdfViewer(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50">
              {/* Blank area for PDF viewer */}
              <span className="text-gray-400 text-lg">No document available</span>
            </div>
          </div>
        </div>
      )}

      {/* New Contract Modal */}
      {isNewContractModalOpen && (
        <div className="fixed inset-x-0 top-[120px] bg-white z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">New Contract</h2>
                <button
                  onClick={() => setIsNewContractModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              {/* Modal content */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContractsPage;