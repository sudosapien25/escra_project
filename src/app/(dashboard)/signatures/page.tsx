'use client';

import React, { useState, useRef, useEffect, RefObject, createRef } from 'react';
import { FaSearch, FaUser, FaFilter, FaSort, FaCheckCircle, FaPlus, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards, HiOutlineTrash, HiOutlineUpload, HiOutlineDocumentText } from 'react-icons/hi';
import { HiMiniChevronUpDown, HiMiniChevronDown } from 'react-icons/hi2';
import { LuPen, LuCalendarClock, LuBellRing, LuPenLine } from 'react-icons/lu';
import { MdCancelPresentation } from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';
import { PiWarningDiamondBold } from 'react-icons/pi';
import clsx from 'clsx';
import { IconBaseProps } from 'react-icons';
import { TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive } from 'react-icons/tb';
import { SiBox } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { TiUserAddOutline } from 'react-icons/ti';

export default function SignaturesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [inboxTab, setInboxTab] = useState('all');
  const [cancelledTab, setCancelledTab] = useState('all');
  const [pendingTab, setPendingTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    document: string;
    parties: string[];
    status: string;
    signatures: string;
    contractId: string;
    contract: string;
    assignee: string;
    dateSent: string;
    dueDate: string;
  } | null>(null);
  const [showRequestSignatureModal, setShowRequestSignatureModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [documentSearch, setDocumentSearch] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const documentDropdownRef = useRef<HTMLDivElement>(null);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showRecipientRoleDropdown, setShowRecipientRoleDropdown] = useState(false);
  const recipientRoleButtonRef = useRef<HTMLButtonElement>(null);
  const recipientRoleDropdownRef = useRef<HTMLDivElement>(null);
  // State for dynamic recipient cards
  type Recipient = {
    name: string;
    email: string;
    role: string;
    showRoleDropdown: boolean;
    roleButtonRef: RefObject<HTMLButtonElement>;
    roleDropdownRef: RefObject<HTMLDivElement>;
  };
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      name: '',
      email: '',
      role: 'Needs to Sign',
      showRoleDropdown: false,
      roleButtonRef: createRef<HTMLButtonElement>(),
      roleDropdownRef: createRef<HTMLDivElement>(),
    },
  ]);

  // Handler to add a new recipient card
  const handleAddRecipient = () => {
    setRecipients(prev => [
      ...prev,
      {
        name: '',
        email: '',
        role: 'Needs to Sign',
        showRoleDropdown: false,
        roleButtonRef: createRef<HTMLButtonElement>(),
        roleDropdownRef: createRef<HTMLDivElement>(),
      },
    ]);
  };

  // Handler to delete a recipient card
  const handleDeleteRecipient = (idx: number) => {
    setRecipients(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  };

  // Mock data for stat boxes
  const statBoxesData = {
    actionRequired: 5,
    waitingForOthers: 8,
    expiringSoon: 3,
    completed: 12
  };

  // Available statuses for the dropdown
  const availableStatuses = [
    'All',
    'Pending',
    'Completed',
    'Expired',
    'Rejected',
    'Voided'
  ];

  // Available assignees (synced with contracts page documents tab)
  const availableAssignees = [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Robert Chen',
    'Sarah Miller',
    'David Miller',
    'Emily Davis',
    'Alex Johnson',
    'Samantha Fox'
  ];

  // Placeholder for current user's name
  const currentUserName = 'John Smith'; // TODO: Replace with actual user context

  // Function to check if a row should be shown based on selected statuses
  const shouldShowRow = (status: string) => {
    if (selectedStatuses.includes('All')) return true;
    return selectedStatuses.includes(status);
  };

  // Function to check if a row should be shown based on cancelled tab
  const shouldShowCancelledRow = (status: string) => {
    if (activeTab !== 'cancelled') return true;
    
    if (cancelledTab === 'all') {
      return status === 'Rejected' || status === 'Expired' || status === 'Voided';
    } else if (cancelledTab === 'rejected') {
      return status === 'Rejected';
    } else if (cancelledTab === 'expired') {
      return status === 'Expired';
    } else if (cancelledTab === 'voided') {
      return status === 'Voided';
    }
    return false;
  };

  // Function to check if a row should be shown based on selected assignees
  const shouldShowAssignee = (assignee: string) => {
    if (selectedAssignees.length === 0) return true;
    if (selectedAssignees.includes('__ME__')) {
      return assignee === currentUserName;
    }
    return selectedAssignees.includes(assignee);
  };

  // Function to check if a row matches the search term
  const matchesSearch = (row: {
    document: string;
    parties: string[];
    contract: string;
    id: string;
    contractId: string;
  }) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.document.toLowerCase().includes(searchLower) ||
      row.parties.some(party => party.toLowerCase().includes(searchLower)) ||
      row.contract.toLowerCase().includes(searchLower) ||
      row.id.toLowerCase().includes(searchLower) ||
      row.contractId.toLowerCase().includes(searchLower)
    );
  };

  // Handle click outside for status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(event.target as Node)) {
        setShowAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (documentDropdownRef.current && !documentDropdownRef.current.contains(event.target as Node)) {
        setShowDocumentDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (uploadDropdownRef.current && !uploadDropdownRef.current.contains(event.target as Node)) {
        setShowUploadDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    // Only allow PDF, DOC, DOCX, JPG and max 10MB each
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setUploadedFiles(validFiles);
  };

  // Sample documents data (same as contracts page)
  const sampleDocuments = [
    {
      id: '1234',
      name: 'Wire Authorization',
      type: 'PDF',
      size: '2.4 MB',
      date: '2024-03-15',
      uploadedBy: 'John Smith',
      dateUploaded: '2024-03-15',
      contractTitle: 'New Property Acquisition',
      contractId: '9548',
      assignee: 'John Smith'
    },
    {
      id: '2345',
      name: 'Closing Disclosure',
      type: 'PDF',
      size: '1.8 MB',
      date: '2024-03-14',
      uploadedBy: 'Sarah Johnson',
      dateUploaded: '2024-03-14',
      contractTitle: 'Land Development Contract',
      contractId: '9550',
      assignee: 'Sarah Johnson'
    },
    {
      id: '3456',
      name: 'Purchase Agreement',
      type: 'PDF',
      size: '2.1 MB',
      date: '2024-03-13',
      uploadedBy: 'Michael Brown',
      dateUploaded: '2024-03-13',
      contractTitle: 'Construction Escrow',
      contractId: '9145',
      assignee: 'Michael Brown'
    },
    {
      id: '5678',
      name: 'Title Insurance',
      type: 'PDF',
      size: '1.5 MB',
      date: '2024-03-12',
      uploadedBy: 'Emily Davis',
      dateUploaded: '2024-03-12',
      contractTitle: 'Property Sale Contract',
      contractId: '8423',
      assignee: 'Robert Chen'
    },
    {
      id: '6789',
      name: 'Appraisal',
      type: 'PDF',
      size: '1.0 MB',
      date: '2024-03-11',
      uploadedBy: 'Robert Wilson',
      dateUploaded: '2024-03-11',
      contractTitle: 'Investment Property Escrow',
      contractId: '7804',
      assignee: 'Sarah Miller'
    },
    {
      id: '7890',
      name: 'Appraisal Report',
      type: 'PDF',
      size: '1.3 MB',
      date: '2024-03-10',
      uploadedBy: 'Lisa Anderson',
      dateUploaded: '2024-03-10',
      contractTitle: 'Residential Sale Agreement',
      contractId: '7234',
      assignee: 'David Miller'
    },
    {
      id: '8901',
      name: 'Closing Disclosure',
      type: 'PDF',
      size: '0.8 MB',
      date: '2024-03-09',
      uploadedBy: 'David Taylor',
      dateUploaded: '2024-03-09',
      contractTitle: 'Office Building Purchase',
      contractId: '6891',
      assignee: 'Emily Davis'
    },
    {
      id: '9012',
      name: 'Loan Estimate',
      type: 'PDF',
      size: '1.2 MB',
      date: '2024-03-08',
      uploadedBy: 'Jennifer Martinez',
      dateUploaded: '2024-03-08',
      contractTitle: 'Retail Space Lease',
      contractId: '6453',
      assignee: 'Alex Johnson'
    },
    {
      id: '0123',
      name: 'Property Survey',
      type: 'PDF',
      size: '1.6 MB',
      date: '2024-03-07',
      uploadedBy: 'James Thompson',
      dateUploaded: '2024-03-07',
      contractTitle: 'Luxury Villa Purchase',
      contractId: '10003',
      assignee: 'Samantha Fox'
    }
  ];

  // Filter documents based on search term
  const filteredDocuments = sampleDocuments.filter(doc => {
    const search = documentSearch.toLowerCase();
    return (
      doc.name.toLowerCase().includes(search) ||
      doc.id.toLowerCase().includes(search) ||
      doc.type.toLowerCase().includes(search) ||
      doc.contractTitle?.toLowerCase().includes(search) ||
      doc.contractId?.toLowerCase().includes(search)
    );
  });

  const handleDocumentButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDocumentDropdown(!showDocumentDropdown);
  };

  const handleDocumentItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't close the dropdown when clicking on items
  };

  // Click-off behavior for recipient role dropdown
  useEffect(() => {
    if (!showRecipientRoleDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        recipientRoleButtonRef.current?.contains(target) ||
        recipientRoleDropdownRef.current?.contains(target)
      ) {
        // Click inside button or dropdown: do nothing (button handles its own toggle)
        return;
      }
      setShowRecipientRoleDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRecipientRoleDropdown]);

  // Click-off behavior for each recipient role dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      recipients.forEach((recipient, idx) => {
        const target = event.target as Node;
        if (
          recipient.roleButtonRef.current?.contains(target) ||
          recipient.roleDropdownRef.current?.contains(target)
        ) {
          // Click inside button or dropdown: do nothing
          return;
        }
        if (recipient.showRoleDropdown) {
          setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showRoleDropdown: false } : r));
        }
      });
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [recipients]);

  return (
    <div className="space-y-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
      {/* Signatures Title and Subtitle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1">
          <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Signatures</h1>
          <p className="text-gray-500 text-[15px] md:text-[16px] mt-0" style={{ fontFamily: 'Avenir, sans-serif' }}>Manage electronic signatures for all your contracts</p>
        </div>
        {/* Placeholder for potential button/actions */}
        <div className="flex items-center space-x-0 md:space-x-4 w-full md:w-auto">
          {/* Request Signature Button */}
          <button 
            className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold" 
            style={{ fontFamily: 'Avenir, sans-serif' }}
            onClick={() => setShowRequestSignatureModal(true)}
          >
            <LuPen className="mr-2 text-base" />
            Request Signature
          </button>
        </div>
      </div>

      {/* Horizontal line below subtitle */}
      <hr className="my-6 border-gray-300" />

      {/* Filter Elements */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex gap-1 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px] ${
            activeTab === 'all' 
              ? 'bg-teal-50 text-teal-500' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setActiveTab('inbox');
            setInboxTab('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px] ${
            activeTab === 'inbox' 
              ? 'bg-teal-50 text-teal-500' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => {
            setActiveTab('pending');
            setPendingTab('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px] ${
            activeTab === 'pending' 
              ? 'bg-teal-50 text-teal-500' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px] ${
            activeTab === 'completed' 
              ? 'bg-teal-50 text-teal-500' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => {
            setActiveTab('cancelled');
            setCancelledTab('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px] ${
            activeTab === 'cancelled' 
              ? 'bg-teal-50 text-teal-500' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Stat Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Action Required */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center border-2 border-orange-200">
            <PiWarningDiamondBold size={20} color="#f97316" />
          </div>
          <div className="flex flex-col items-start h-full">
            <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Action Required</p>
            <p className="text-2xl font-bold text-gray-900">{statBoxesData.actionRequired}</p>
            <p className="text-xs text-gray-400">Needs your attention</p>
          </div>
        </div>

        {/* Waiting for Others */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
          <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center border-2 border-yellow-200">
            <FaRegClock size={18} color="#f59e0b" />
          </div>
          <div className="flex flex-col items-start h-full">
            <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Waiting for Others</p>
            <p className="text-2xl font-bold text-gray-900">{statBoxesData.waitingForOthers}</p>
            <p className="text-xs text-gray-400">Pending signatures</p>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
          <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center border-2 border-red-200">
            <LuCalendarClock size={18} color="#ef4444" />
          </div>
          <div className="flex flex-col items-start h-full">
            <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Expiring Soon</p>
            <p className="text-2xl font-bold text-gray-900">{statBoxesData.expiringSoon}</p>
            <p className="text-xs text-gray-400">Within 3 days</p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center border-2 border-green-200">
            <FaRegSquareCheck size={18} color="#22c55e" />
          </div>
          <div className="flex flex-col items-start h-full">
            <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</p>
            <p className="text-2xl font-bold text-gray-900">{statBoxesData.completed}</p>
            <p className="text-xs text-gray-400">This month</p>
          </div>
        </div>
      </div>

      {/* Search/Filter Bar - outlined box (identical to contracts page) */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0">
          <FaSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search documents, parties, contracts or IDs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          />
        </div>
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={() => {
            if (showStatusDropdown) {
              setShowStatusDropdown(false);
            } else {
              setShowStatusDropdown(true);
              setShowAssigneeDropdown(false);
            }
          }}
          ref={statusDropdownRef as any}
        >
          <HiOutlineViewBoards className="text-gray-400 text-lg" />
          <span>Status</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }} ref={statusDropdownRef}>
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                    selectedStatuses.includes(status) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                  }`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (status === 'All') {
                      setSelectedStatuses(['All']);
                    } else {
                      setSelectedStatuses(prev => {
                        const newStatuses = prev.filter(s => s !== 'All');
                        if (prev.includes(status)) {
                          const filtered = newStatuses.filter(s => s !== status);
                          return filtered.length === 0 ? ['All'] : filtered;
                        } else {
                          return [...newStatuses, status];
                        }
                      });
                    }
                  }}
                >
                  <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedStatuses.includes(status) ? 'bg-primary' : 'border border-gray-300'}`}>
                    {selectedStatuses.includes(status) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {status}
                </button>
              ))}
            </div>
          )}
        </button>
        <button
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={() => {
            if (showAssigneeDropdown) {
              setShowAssigneeDropdown(false);
            } else {
              setShowAssigneeDropdown(true);
              setShowStatusDropdown(false);
            }
          }}
          ref={assigneeDropdownRef as any}
        >
          <BsPerson className="text-gray-400 text-lg" />
          <span>Assignee</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showAssigneeDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }} ref={assigneeDropdownRef}>
              <button
                className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                  selectedAssignees.length === 0 ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                }`}
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssignees([]);
                }}
              >
                <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedAssignees.length === 0 ? 'bg-primary' : 'border border-gray-300'}`}>
                  {selectedAssignees.length === 0 && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                All
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                  selectedAssignees.includes('__ME__') ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                }`}
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssignees(['__ME__']);
                }}
              >
                <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedAssignees.includes('__ME__') ? 'bg-primary' : 'border border-gray-300'}`}>
                  {selectedAssignees.includes('__ME__') && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                Me
              </button>
              {availableAssignees.map((assignee) => (
                <button
                  key={assignee}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                    selectedAssignees.includes(assignee) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                  }`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAssignees(prev => {
                      if (prev.includes(assignee)) {
                        return prev.filter(a => a !== assignee);
                      } else {
                        return [...prev, assignee];
                      }
                    });
                  }}
                >
                  <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedAssignees.includes(assignee) ? 'bg-primary' : 'border border-gray-300'}`}>
                    {selectedAssignees.includes(assignee) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {assignee}
                </button>
              ))}
            </div>
          )}
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
          <LuCalendarClock className="text-gray-400" size={18} />
          <span>Last 30 days</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[150px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
          <MdCancelPresentation className="text-gray-400" size={18} />
          <span>Recently Updated</span>
          <HiMiniChevronUpDown className="ml-1 text-gray-400" size={16} />
        </button>
      </div>

      {/* Page content - Tabs and Signature List */}
      <div className="space-y-4">
        {/* White Box Container */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 border-b border-gray-200">
            {activeTab === 'inbox' ? (
              <>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    inboxTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setInboxTab('all')}
                >
                  All
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    inboxTab === 'received' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setInboxTab('received')}
                >
                  Received
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    inboxTab === 'action-required' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setInboxTab('action-required')}
                >
                  Action Required
                </button>
              </>
            ) : activeTab === 'cancelled' ? (
              <>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    cancelledTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setCancelledTab('all')}
                >
                  All
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    cancelledTab === 'rejected' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setCancelledTab('rejected')}
                >
                  Rejected
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    cancelledTab === 'voided' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setCancelledTab('voided')}
                >
                  Voided
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    cancelledTab === 'expired' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setCancelledTab('expired')}
                >
                  Expired
                </button>
              </>
            ) : activeTab === 'completed' ? (
              <>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    "border-primary text-primary"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  All
                </button>
              </>
            ) : (
              <>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    pendingTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setPendingTab('all')}
                >
                  All
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    pendingTab === 'waiting' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setPendingTab('waiting')}
                >
                  Waiting for Others
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                    pendingTab === 'expiring' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setPendingTab('expiring')}
                >
                  Expiring Soon
                </button>
              </>
            )}
          </div>

          {/* Signature List Content based on Active Tab */}
          <div className="mt-4">
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
              <div className="min-w-full divide-y divide-gray-200">
                <div className="sticky top-0 z-10 bg-gray-50">
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">ID</div>
                    <div className="text-left">Document</div>
                    <div className="text-left">Recipients</div>
                    <div className="text-center">Signing Status</div>
                    <div className="text-center">Signatures</div>
                    <div className="text-center whitespace-nowrap">ID</div>
                    <div className="text-left">Contract</div>
                    <div className="text-left">Assignee</div>
                    <div className="text-center">Date Sent</div>
                    <div className="text-center">Due Date</div>
                    <div className="text-center">Actions</div>
                  </div>
                </div>

                {/* Document Row 1 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('John Smith') && matchesSearch({
                  document: 'Purchase Agreement',
                  parties: ['Robert Chen', 'Eastside Properties'],
                  contract: 'New Property Acquisition',
                  id: '1234',
                  contractId: '9548'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '1234',
                      document: 'Purchase Agreement',
                      parties: ['Robert Chen', 'Eastside Properties'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '9548',
                      contract: 'New Property Acquisition',
                      assignee: 'John Smith',
                      dateSent: '2024-03-15',
                      dueDate: '2024-03-30'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">1234</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Purchase Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Robert Chen</div>
                      <div>Eastside Properties</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">9548</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>New Property Acquisition</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>John Smith</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-15</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-30</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 2 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Sarah Johnson') && matchesSearch({
                  document: 'Property Survey',
                  parties: ['GreenSpace Developers'],
                  contract: 'Land Development Contract',
                  id: '2345',
                  contractId: '9550'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '2345',
                      document: 'Property Survey',
                      parties: ['GreenSpace Developers'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '9550',
                      contract: 'Land Development Contract',
                      assignee: 'Sarah Johnson',
                      dateSent: '2024-03-14',
                      dueDate: '2024-03-29'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">2345</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Property Survey</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>GreenSpace Developers</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">9550</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Land Development Contract</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Sarah Johnson</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-14</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-29</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 3 */}
                {(activeTab === 'all' || activeTab === 'cancelled') && shouldShowRow('Rejected') && shouldShowCancelledRow('Rejected') && shouldShowAssignee('Michael Brown') && matchesSearch({
                  document: 'Inspection Report',
                  parties: ['BuildRight', 'Horizon Developers'],
                  contract: 'Construction Escrow',
                  id: '3456',
                  contractId: '9145'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '3456',
                      document: 'Inspection Report',
                      parties: ['BuildRight', 'Horizon Developers'],
                      status: 'Rejected',
                      signatures: '0 of 2',
                      contractId: '9145',
                      contract: 'Construction Escrow',
                      assignee: 'Michael Brown',
                      dateSent: '2024-03-13',
                      dueDate: '2024-03-28'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">3456</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Inspection Report</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>BuildRight</div>
                      <div>Horizon Developers</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Rejected</span>
                    </div>
                    <div className="text-center text-gray-600">0 of 2</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">9145</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Construction Escrow</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Michael Brown</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-13</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-28</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 4 */}
                {(activeTab === 'all' || activeTab === 'cancelled') && shouldShowRow('Expired') && shouldShowCancelledRow('Expired') && shouldShowAssignee('Emma Johnson') && matchesSearch({
                  document: 'Lease Agreement',
                  parties: ['Pacific Properties'],
                  contract: 'Commercial Lease Amendment',
                  id: '4567',
                  contractId: '8784'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '4567',
                      document: 'Lease Agreement',
                      parties: ['Pacific Properties'],
                      status: 'Expired',
                      signatures: '0 of 1',
                      contractId: '8784',
                      contract: 'Commercial Lease Amendment',
                      assignee: 'Emma Johnson',
                      dateSent: '2024-03-12',
                      dueDate: '2024-03-27'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">4567</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Lease Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Pacific Properties</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Expired</span>
                    </div>
                    <div className="text-center text-gray-600">0 of 1</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">8784</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Commercial Lease Amendment</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emma Johnson</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-12</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-27</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 5 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Robert Chen') && matchesSearch({
                  document: 'Title Insurance',
                  parties: ['John Smith', 'Emma Johnson'],
                  contract: 'Property Sale Contract',
                  id: '5678',
                  contractId: '8423'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '5678',
                      document: 'Title Insurance',
                      parties: ['John Smith', 'Emma Johnson'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '8423',
                      contract: 'Property Sale Contract',
                      assignee: 'Robert Chen',
                      dateSent: '2024-03-11',
                      dueDate: '2024-03-26'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">5678</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Title Insurance</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>John Smith</div>
                      <div>Emma Johnson</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">8423</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Property Sale Contract</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Robert Chen</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-11</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-26</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 6 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Sarah Miller') && matchesSearch({
                  document: 'Wire Authorization',
                  parties: ['Global Investors Group'],
                  contract: 'Investment Property Escrow',
                  id: '6789',
                  contractId: '7804'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '6789',
                      document: 'Wire Authorization',
                      parties: ['Global Investors Group'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '7804',
                      contract: 'Investment Property Escrow',
                      assignee: 'Sarah Miller',
                      dateSent: '2024-03-10',
                      dueDate: '2024-03-25'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">6789</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Wire Authorization</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Global Investors Group</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">7804</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Investment Property Escrow</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Sarah Miller</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-10</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-25</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 7 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('David Miller') && matchesSearch({
                  document: 'Appraisal Report',
                  parties: ['David Miller', 'Sarah Thompson'],
                  contract: 'Residential Sale Agreement',
                  id: '7890',
                  contractId: '7234'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '7890',
                      document: 'Appraisal Report',
                      parties: ['David Miller', 'Sarah Thompson'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '7234',
                      contract: 'Residential Sale Agreement',
                      assignee: 'David Miller',
                      dateSent: '2024-03-09',
                      dueDate: '2024-03-24'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">7890</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Appraisal Report</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>David Miller</div>
                      <div>Sarah Thompson</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">7234</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Residential Sale Agreement</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>David Miller</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-09</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-24</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 8 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Emily Davis') && matchesSearch({
                  document: 'Closing Disclosure',
                  parties: ['Riverfront Ventures'],
                  contract: 'Office Building Purchase',
                  id: '8901',
                  contractId: '6891'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '8901',
                      document: 'Closing Disclosure',
                      parties: ['Riverfront Ventures'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '6891',
                      contract: 'Office Building Purchase',
                      assignee: 'Emily Davis',
                      dateSent: '2024-03-08',
                      dueDate: '2024-03-23'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">8901</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Closing Disclosure</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Riverfront Ventures</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">6891</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Office Building Purchase</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emily Davis</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-08</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-23</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 9 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Alex Johnson') && matchesSearch({
                  document: 'Loan Estimate',
                  parties: ['Urban Outfitters Co.'],
                  contract: 'Retail Space Lease',
                  id: '9012',
                  contractId: '6453'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '9012',
                      document: 'Loan Estimate',
                      parties: ['Urban Outfitters Co.'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '6453',
                      contract: 'Retail Space Lease',
                      assignee: 'Alex Johnson',
                      dateSent: '2024-03-07',
                      dueDate: '2024-03-22'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">9012</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Loan Estimate</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Urban Outfitters Co.</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">6453</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Retail Space Lease</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Alex Johnson</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-07</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-22</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 10 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Samantha Fox') && matchesSearch({
                  document: 'Deed Transfer',
                  parties: ['Samantha Fox', 'Elite Estates'],
                  contract: 'Luxury Villa Purchase',
                  id: '0123',
                  contractId: '10003'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '0123',
                      document: 'Deed Transfer',
                      parties: ['Samantha Fox', 'Elite Estates'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '10003',
                      contract: 'Luxury Villa Purchase',
                      assignee: 'Samantha Fox',
                      dateSent: '2024-03-06',
                      dueDate: '2024-03-21'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">0123</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Deed Transfer</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Samantha Fox</div>
                      <div>Elite Estates</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-xs text-primary underline font-semibold cursor-pointer">10003</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Luxury Villa Purchase</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Samantha Fox</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-06</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-21</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header with Document ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-white px-6 py-4">
              <div className="flex items-start justify-between">
                {/* Left: Document ID and Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-bold bg-gray-700 text-white px-2 py-0.5 rounded border border-gray-600">
                      #{selectedDocument.id}
                    </span>
                  </div>
                </div>
                {/* Right: Close Button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                  onClick={() => setSelectedDocument(null)}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-6 flex-1">
                {/* Modal Content Grid: 2 columns */}
                <div className="grid grid-cols-2 gap-6 w-full h-full min-h-0">
                  {/* LEFT COLUMN: Document Details */}
                  <div className="flex flex-col gap-6 w-full h-full min-h-0">
                    {/* Document Details Box */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full h-full flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Details</h3>
                      <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                        {/* Row 1: Document ID, Document Hash, and Contract ID */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document ID</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document Hash</div>
                          <div className="text-xs text-black mb-4"></div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.contractId}</div>
                        </div>
                        {/* Row 2: Document Name and Contract Name */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document Name</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.document}</div>
                        </div>
                        <div></div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Name</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.contract}</div>
                        </div>
                        {/* Message Field */}
                        <div className="col-span-3">
                          <div className="text-gray-500 text-xs mb-1">Message</div>
                          <div className="w-full min-h-24 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50">
                            Please review and sign the attached document at your earliest convenience. This document requires your signature to proceed with the transaction.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Signature Details */}
                  <div className="flex flex-col gap-6 w-full h-full min-h-0">
                    {/* Signature Details Box */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full h-full flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Signature Details</h3>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        {/* Row 1: Parties and Signatures */}
                        <div className="col-span-2">
                          <div className="grid grid-cols-3 gap-x-12">
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Parties</div>
                              <div className="text-xs text-black mb-4">
                                {selectedDocument.parties.map((party, idx) => (
                                  <div key={idx}>{party}</div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Signatures</div>
                              <div className="text-xs text-black mb-4 flex flex-col gap-2">
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full" 
                                    style={{ 
                                      width: `${(parseInt(selectedDocument.signatures.split(' of ')[0]) / parseInt(selectedDocument.signatures.split(' of ')[1])) * 100}%` 
                                    }}
                                  />
                                </div>
                                {selectedDocument.signatures}
                              </div>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        {/* Row 2: Status */}
                        <div className="col-span-2">
                          <div className="text-gray-500 text-xs mb-1">Status</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${
                            selectedDocument.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-500' :
                            selectedDocument.status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-500' :
                            selectedDocument.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-500' :
                            'bg-gray-100 text-gray-800 border border-gray-500'
                          }`}>{selectedDocument.status}</span>
                        </div>
                        {/* Row 3: Due Date, Last Reminder Date, and Date Sent */}
                        <div className="col-span-2">
                          <div className="grid grid-cols-3 gap-x-12">
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Due Date</div>
                              <div className="text-xs text-black mb-4">{selectedDocument.dueDate}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Last Reminder Date</div>
                              <div className="text-xs text-black mb-4"></div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Date Sent</div>
                              <div className="text-xs text-black mb-4">{selectedDocument.dateSent}</div>
                            </div>
                          </div>
                        </div>
                        {/* Row 4: Assignee */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Assignee</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.assignee}</div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recipients Box - New Section */}
                <div className="col-span-2 mt-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Recipients</h3>
                    <div className="w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div className="grid grid-cols-[40px_40px_1.5fr_2fr_1fr_1.5fr_1.5fr] gap-2 px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <div className="text-center">#</div>
                        <div></div>
                        <div className="text-left">Name</div>
                        <div className="text-left">Email</div>
                        <div className="text-left">Status</div>
                        <div className="text-left">Date/Time</div>
                        <div className="text-left">Location</div>
                      </div>
                      {/* Recipients Data */}
                      {selectedDocument.parties.map((party, idx) => {
                        // Generate a placeholder email from the party name
                        const email = party.toLowerCase().replace(/[^a-z0-9]/g, '.') + '@example.com';
                        return (
                          <div key={party} className="grid grid-cols-[40px_40px_1.5fr_2fr_1fr_1.5fr_1.5fr] gap-2 items-center px-2 py-4 border-b border-gray-100 text-xs text-gray-800" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            <div className="text-center font-semibold">{idx + 1}</div>
                            <div className="flex justify-center items-center">
                              <FaCheckCircle className="text-primary" size={18} />
                            </div>
                            <div className="font-bold">{party}</div>
                            <div className="text-gray-500">{email}</div>
                            <div className="font-semibold text-primary flex items-center gap-1">
                              <span>Signed</span>
                            </div>
                            <div className="text-gray-700">12/31/2024 | 12:00:00 pm</div>
                            <div>
                              <a href="#" className="text-primary underline hover:text-primary-dark">Signed in location</a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Signature Modal */}
      {showRequestSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white px-6 py-4">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Avenir, sans-serif' }}>Request Signature</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                  onClick={() => { setShowRequestSignatureModal(false); setUploadedFiles([]); }}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-6 flex-1">
                <form onSubmit={(e) => { e.preventDefault(); setShowRequestSignatureModal(false); setUploadedFiles([]); }}>
                  <div className="space-y-6">
                    {/* Upload Area Box */}
                    <div 
                      className="bg-white border border-gray-200 rounded-lg p-6 relative"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingOver(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingOver(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingOver(false);
                        const files = Array.from(e.dataTransfer.files);
                        setUploadedFiles(prev => [...prev, ...files]);
                      }}
                    >
                      <h3 className="text-sm font-semibold text-gray-900 mb-4 relative z-10" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Documents</h3>
                      <div className="flex flex-col items-center mb-4">
                        <div className="h-11 w-11 rounded-lg bg-teal-50 flex items-center justify-center border-2 border-teal-200 mb-2">
                          <HiOutlineDocumentText size={22} color="#06b6d4" />
                        </div>
                        <div className="text-xs text-gray-700 font-semibold">Drop your files here or...</div>
                        {isDraggingOver && (
                          <div className="absolute inset-x-0 flex flex-col items-center justify-center" style={{ top: '0', height: '100%' }}>
                            <div className="h-full w-full flex flex-col items-center justify-center bg-white/95 rounded-lg" style={{ marginTop: '1px' }}>
                              <div className="h-11 w-11 rounded-lg bg-teal-50 flex items-center justify-center border-2 border-teal-200 mb-1.5">
                                <HiOutlineUpload size={22} color="#06b6d4" />
                              </div>
                              <div className="text-xs text-gray-700 font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                Supported Formats: PDF, DOC, DOCX, OR JPG (max. 10 MB each)
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`flex justify-center gap-1 ${isDraggingOver ? 'blur-sm' : ''}`}>
                        <div className="relative" ref={documentDropdownRef}>
                          <button
                            type="button"
                            onClick={handleDocumentButtonClick}
                            className="flex items-center gap-2 px-4 py-[10.75px] bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs font-semibold"
                          >
                            Select
                            <HiMiniChevronDown size={17} className="text-white -mt-[1px]" />
                          </button>
                          {showDocumentDropdown && (
                            <div className="absolute z-50 mt-1 w-[300px] bg-white rounded-lg shadow-lg border border-gray-200">
                              <div className="p-2">
                                <input
                                  type="text"
                                  placeholder="Search documents..."
                                  value={documentSearch}
                                  onChange={(e) => setDocumentSearch(e.target.value)}
                                  className="w-full px-3 py-2 text-xs border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                {filteredDocuments.map((doc) => (
                                  <button
                                    key={doc.id}
                                    onClick={handleDocumentItemClick}
                                    className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex flex-col"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedDocuments.includes(doc.id) ? 'bg-primary' : 'border border-gray-300'}`}>
                                        {selectedDocuments.includes(doc.id) && (
                                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </div>
                                      <span className="text-xs font-medium">{doc.name}</span>
                                    </div>
                                    <div className="ml-5 text-gray-500 text-[10px]">{doc.contractTitle} ({doc.contractId})</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative" ref={uploadDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowUploadDropdown(!showUploadDropdown)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            <HiOutlineUpload className="text-base text-primary" /> Upload
                          </button>
                          {showUploadDropdown && (
                            <div className="absolute z-50 mt-1 w-[200px] bg-white rounded-lg shadow-lg border border-gray-200">
                              <div className="py-1">
                                <label htmlFor="file-upload" className="block px-4 py-2 text-left hover:bg-primary/10 hover:text-primary cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <TbDeviceDesktopPlus className="text-base text-primary" />
                                    <span className="text-xs">Desktop</span>
                                  </div>
                                </label>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg"
                                  className="hidden"
                                  multiple
                                  onChange={handleFileChange}
                                />
                                <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2">
                                  <SiBox className="text-base text-primary" />
                                  <span className="text-xs">Box</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2">
                                  <SlSocialDropbox className="text-base text-primary" />
                                  <span className="text-xs">Dropbox</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2">
                                  <TbBrandGoogleDrive className="text-base text-primary" />
                                  <span className="text-xs">Google Drive</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2">
                                  <TbBrandOnedrive className="text-base text-primary" />
                                  <span className="text-xs">OneDrive</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Show selected documents */}
                      {selectedDocuments.length > 0 && (
                        <ul className="mt-3 text-sm text-gray-600">
                          {selectedDocuments.map(docId => {
                            const doc = sampleDocuments.find(d => d.id === docId);
                            return doc ? (
                              <li key={docId} className="truncate">{doc.name} ({doc.contractTitle})</li>
                            ) : null;
                          })}
                        </ul>
                      )}
                      {/* Show uploaded files */}
                      {uploadedFiles.length > 0 && (
                        <ul className="mt-3 text-sm text-gray-600">
                          {uploadedFiles.map((file, idx) => (
                            <li key={idx} className="truncate">{file.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Add Recipients Box */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Recipients</h3>
                      <div className="space-y-4">
                        {/* Render all recipient cards */}
                        {recipients.map((recipient, idx) => (
                          <div key={idx} className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-start" style={{ borderLeft: '3px solid #e5e7eb' }}>
                            <div className="flex-1 space-y-4 max-w-[30%]">
                              <div>
                                <div className="relative w-[800px]">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Name <span className="text-primary">*</span>
                                  </label>
                                  {/* Invisible button for role selection */}
                                  <button
                                    ref={recipient.roleButtonRef}
                                    type="button"
                                    className="absolute top-0 left-[504px] flex items-center gap-1 focus:outline-none"
                                    style={{ background: 'none', border: 'none', padding: 0, margin: 0, boxShadow: 'none', cursor: 'pointer' }}
                                    onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showRoleDropdown: !r.showRoleDropdown } : r))}
                                    tabIndex={0}
                                  >
                                    <LuPen className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-xs text-gray-500">{recipient.role}</span>
                                    <HiMiniChevronDown size={16} className="inline-block align-middle -mt-[3px] text-gray-500" />
                                  </button>
                                  {recipient.showRoleDropdown && (
                                    <div
                                      ref={recipient.roleDropdownRef}
                                      className="absolute left-[504px] top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                      {['Needs to Sign', 'In Person Signer', 'Receives a Copy', 'Needs to View'].map((role) => (
                                        <button
                                          key={role}
                                          className="w-full px-4 py-2 text-left text-xs hover:bg-primary/10 hover:text-primary text-gray-700"
                                          style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                          onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, role, showRoleDropdown: false } : r))}
                                        >
                                          {role}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  <span className="absolute top-0 left-[638px] text-xs text-gray-500">Customize <HiMiniChevronDown size={16} className="inline-block align-middle -mt-[3px]" /></span>
                                  <button className="absolute top-0 left-[756px] text-gray-400 hover:text-gray-600 transition-colors" onClick={() => handleDeleteRecipient(idx)} disabled={recipients.length === 1}>
                                    <HiOutlineTrash className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                  </span>
                                  <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    placeholder="Enter recipient's name..."
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    value={recipient.name}
                                    onChange={e => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, name: e.target.value } : r))}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  Email <span className="text-primary">*</span>
                                </label>
                                <input
                                  type="email"
                                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                  placeholder="Enter recipient's email address..."
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                  value={recipient.email}
                                  onChange={e => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, email: e.target.value } : r))}
                                />
                              </div>
                            </div>
                            {/* Right-side buttons remain unchanged for now */}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="flex items-center gap-2 px-4 py-[9.5px] bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs font-semibold mt-2"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                          onClick={handleAddRecipient}
                        >
                          <TiUserAddOutline className="text-[1.125rem]" />
                          <span className="mt-[1px]">Add Recipient</span>
                        </button>
                      </div>
                    </div>

                    {/* Due Date Field */}
                    <div>
                      <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date</div>
                      <div className="relative flex items-center" style={{ width: '115px', minWidth: '115px' }}>
                        <input
                          type="date"
                          className="pl-3 pr-2 py-2 border-2 border-gray-200 rounded-lg text-xs text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors w-full"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Avenir, sans-serif' }}>Message to Recipients</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={4}
                        placeholder="Enter a message for the recipients"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>

                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => { setShowRequestSignatureModal(false); setUploadedFiles([]); }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Request Signature
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 