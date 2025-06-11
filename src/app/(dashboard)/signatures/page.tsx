'use client';

import React, { useState, useRef, useEffect, RefObject, createRef } from 'react';
import { FaSearch, FaUser, FaFilter, FaSort, FaCheckCircle, FaPlus, FaTimes, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards, HiOutlineTrash, HiOutlineUpload, HiOutlineDocumentText, HiOutlineBell, HiOutlineCog, HiOutlineDuplicate, HiOutlineDocumentSearch } from 'react-icons/hi';
import { HiMiniChevronUpDown, HiMiniChevronDown } from 'react-icons/hi2';
import { LuPen, LuCalendarClock, LuBellRing, LuPenLine } from 'react-icons/lu';
import { MdCancelPresentation } from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';
import { PiWarningDiamondBold } from 'react-icons/pi';
import clsx from 'clsx';
import { IconBaseProps } from 'react-icons';
import { TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive, TbClockPin } from 'react-icons/tb';
import { SiBox } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { TiUserAddOutline } from 'react-icons/ti';
import { Modal } from '@/components/common/Modal';
import { RiLayoutColumnLine, RiDashboardLine, RiBox3Line, RiUserSharedLine, RiUserSearchLine } from 'react-icons/ri';
import { FaSignature } from 'react-icons/fa';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import { FaDochub } from 'react-icons/fa6';
import { SiAdobe } from 'react-icons/si';
import { mockContracts } from '@/data/mockContracts';

interface SignatureDocument {
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
}

type SortableKey = keyof SignatureDocument;

export default function SignaturesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [inboxTab, setInboxTab] = useState('all');
  const [cancelledTab, setCancelledTab] = useState('all');
  const [pendingTab, setPendingTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [showSenderDropdown, setShowSenderDropdown] = useState(false);
  const [selectedSender, setSelectedSender] = useState('Sent by anyone');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SignatureDocument | null>(null);
  const [showRequestSignatureModal, setShowRequestSignatureModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [documentSearch, setDocumentSearch] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [copiedDocumentId, setCopiedDocumentId] = useState<string | null>(null);
  const [hoveredDocumentId, setHoveredDocumentId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const senderDropdownRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const documentDropdownRef = useRef<HTMLDivElement>(null);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showRecipientRoleDropdown, setShowRecipientRoleDropdown] = useState(false);
  const recipientRoleButtonRef = useRef<HTMLButtonElement>(null);
  const recipientRoleDropdownRef = useRef<HTMLDivElement>(null);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [contractSearch, setContractSearch] = useState('');
  const contractDropdownRef = useRef<HTMLDivElement>(null);
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
  const [showToolSelectorModal, setShowToolSelectorModal] = useState(false);
  const [showLast30DaysDropdown, setShowLast30DaysDropdown] = useState(false);
  const last30DaysDropdownRef = useRef<HTMLDivElement>(null);

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

  // Available sender options for the dropdown
  const availableSenders = [
    'Sent by anyone',
    'Sent by me',
    'Sent to me'
  ];

  // Mock data for signatures table
  const signaturesData = [
    {
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
    },
    {
      id: '2345',
      document: 'Closing Disclosure',
      parties: ['Sarah Johnson', 'Westside Holdings'],
      status: 'Pending',
      signatures: '0 of 2',
      contractId: '9550',
      contract: 'Land Development Contract',
      assignee: 'Sarah Johnson',
      dateSent: '2024-03-14',
      dueDate: '2024-03-29'
    },
    {
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
    },
    {
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
    },
    {
      id: '5678',
      document: 'Title Insurance',
      parties: ['John Smith', 'Emma Johnson'],
      status: 'Voided',
      signatures: '0 of 2',
      contractId: '8423',
      contract: 'Property Sale Contract',
      assignee: 'Robert Chen',
      dateSent: '2024-03-11',
      dueDate: '2024-03-26'
    },
    {
      id: '6789',
      document: 'Appraisal',
      parties: ['Robert Wilson', 'Investment Group'],
      status: 'Pending',
      signatures: '0 of 2',
      contractId: '7804',
      contract: 'Investment Property Escrow',
      assignee: 'Sarah Miller',
      dateSent: '2024-03-10',
      dueDate: '2024-03-25'
    },
    {
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
    },
    {
      id: '8901',
      document: 'Closing Disclosure',
      parties: ['David Taylor'],
      status: 'Completed',
      signatures: '1 of 1',
      contractId: '6891',
      contract: 'Office Building Purchase',
      assignee: 'Emily Davis',
      dateSent: '2024-03-09',
      dueDate: '2024-03-24'
    },
    {
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
    },
    {
      id: '0123',
      document: 'Property Survey',
      parties: ['James Thompson'],
      status: 'Completed',
      signatures: '1 of 1',
      contractId: '10003',
      contract: 'Luxury Villa Purchase',
      assignee: 'Samantha Fox',
      dateSent: '2024-03-07',
      dueDate: '2024-03-22'
    }
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

  // Function to check if a row should be shown based on sender relationship
  const shouldShowSender = (assignee: string, parties: string[]) => {
    switch (selectedSender) {
      case 'Sent by me':
        return assignee === currentUserName;
      case 'Sent to me':
        return parties.includes(currentUserName);
      default: // 'Sent by anyone'
        return true;
    }
  };

  // Function to check if a row should be shown based on selected contracts
  const shouldShowContract = (contractId: string) => {
    if (selectedContracts.length === 0) return true;
    return selectedContracts.includes(contractId);
  };

  // Handle click outside for status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (statusDropdownRef.current?.contains(target)) {
        return; // Don't close if clicking inside the dropdown
      }
      setShowStatusDropdown(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside for sender dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (senderDropdownRef.current?.contains(target)) {
        return; // Don't close if clicking inside the dropdown
      }
      setShowSenderDropdown(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside for assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (assigneeDropdownRef.current?.contains(target)) {
        return; // Don't close if clicking inside the dropdown
      }
      setShowAssigneeDropdown(false);
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

  // Show Tool Selector Modal when Request Signature is clicked
  const handleRequestSignatureClick = () => {
    setShowToolSelectorModal(true);
  };

  // Handle click outside for contract dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (contractDropdownRef.current?.contains(target)) {
        return; // Don't close if clicking inside the dropdown
      }
      setShowContractDropdown(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sorting functions
  const handleIdSort = () => {
    setSortConfig(current => ({
      key: 'id',
      direction: current?.key === 'id' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleDocumentSort = () => {
    setSortConfig(current => ({
      key: 'document',
      direction: current?.key === 'document' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleStatusSort = () => {
    setSortConfig(current => ({
      key: 'status',
      direction: current?.key === 'status' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleContractIdSort = () => {
    setSortConfig(current => ({
      key: 'contractId',
      direction: current?.key === 'contractId' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleContractSort = () => {
    setSortConfig(current => ({
      key: 'contract',
      direction: current?.key === 'contract' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleAssigneeSort = () => {
    setSortConfig(current => ({
      key: 'assignee',
      direction: current?.key === 'assignee' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleDateSentSort = () => {
    setSortConfig(current => ({
      key: 'dateSent',
      direction: current?.key === 'dateSent' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const handleDueDateSort = () => {
    setSortConfig(current => ({
      key: 'dueDate',
      direction: current?.key === 'dueDate' && current.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  // Sort the data based on the current sort configuration
  const getSortedData = (data: SignatureDocument[]) => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (sortConfig.key === 'id' || sortConfig.key === 'contractId') {
        const aValue = parseInt(a[sortConfig.key]);
        const bValue = parseInt(b[sortConfig.key]);
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      
      if (sortConfig.key === 'dateSent' || sortConfig.key === 'dueDate') {
        const aDate = new Date(a[sortConfig.key]);
        const bDate = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'ascending' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      if (sortConfig.key === 'parties') {
        const aValue = a[sortConfig.key].join(', ').toLowerCase();
        const bValue = b[sortConfig.key].join(', ').toLowerCase();
        return sortConfig.direction === 'ascending' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Get filtered and sorted data
  const filteredRows = getSortedData(signaturesData.filter(row => {
    return shouldShowRow(row.status) &&
           shouldShowCancelledRow(row.status) &&
           shouldShowAssignee(row.assignee) &&
           matchesSearch(row) &&
           shouldShowSender(row.assignee, row.parties);
  }));

  // Helper function to generate document hash
  const getDocumentHash = (id: string) => `0x${id}${'0'.repeat(66 - 2 - id.length)}`;

  return (
    <div className="space-y-4">
      {/* Signatures Title and Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-1">Signatures</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Manage electronic signatures for all your contracts</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRequestSignatureClick}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
          >
            <LuPen className="mr-2 text-base" />
            Request Signature
          </button>
        </div>
      </div>

      <hr className="my-6 border-gray-300 dark:border-gray-700" />

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
        <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0" style={{ width: 'calc(100% - 500px)' }}>
          <FaSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search documents, recipients, contracts or IDs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
            style={{ fontFamily: "Avenir, sans-serif" }}
          />
        </div>
        {/* Status Filter */}
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowStatusDropdown(prev => !prev);
            if (!showStatusDropdown) {
              setShowSenderDropdown(false);
              setShowAssigneeDropdown(false);
              setShowContractDropdown(false);
            }
          }}
          ref={statusDropdownRef as any}
        >
          <HiOutlineViewBoards className="text-gray-400 w-4 h-4" />
          <span>Status</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (status === 'All') {
                      setSelectedStatuses(['All']);
                    } else {
                      setSelectedStatuses(prev => {
                        const newStatuses = prev.filter(s => s !== 'All');
                        if (prev.includes(status)) {
                          return newStatuses.filter(s => s !== status);
                        } else {
                          return [...newStatuses, status];
                        }
                      });
                    }
                  }}
                >
                  <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                    {selectedStatuses.includes(status) && (
                      <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                        <FaCheck className="text-white" size={8} />
                      </div>
                    )}
                  </div>
                  {status}
                </button>
              ))}
            </div>
          )}
        </button>

        {/* Contract Filter */}
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowContractDropdown(prev => !prev);
            if (!showContractDropdown) {
              setShowStatusDropdown(false);
              setShowSenderDropdown(false);
              setShowAssigneeDropdown(false);
            }
          }}
          ref={contractDropdownRef as any}
        >
          <HiOutlineDocumentSearch className="text-gray-400 w-4 h-4" />
          <span>Contract</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showContractDropdown && (
            <div className="absolute top-full left-0 mt-2 min-w-[400px] w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ fontFamily: 'Avenir, sans-serif' }}>
              {/* Search Bar */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search contracts..."
                    value={contractSearch}
                    onChange={(e) => setContractSearch(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <button
                className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center"
                onClick={() => setSelectedContracts([])}
              >
                <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                  {selectedContracts.length === 0 && (
                    <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                      <FaCheck className="text-white" size={8} />
                    </div>
                  )}
                </div>
                All
              </button>
              {mockContracts
                .filter(contract => 
                  contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                  contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                )
                .map(contract => (
                  <button
                    key={contract.id}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center whitespace-nowrap truncate"
                    onClick={() => {
                      if (selectedContracts.includes(contract.id)) {
                        setSelectedContracts(prev => prev.filter(id => id !== contract.id));
                      } else {
                        setSelectedContracts(prev => [...prev, contract.id]);
                      }
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedContracts.includes(contract.id) && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    {contract.id} - {contract.title}
                  </button>
                ))}
            </div>
          )}
        </button>

        {/* Sender Filter */}
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSenderDropdown(prev => !prev);
            if (!showSenderDropdown) {
              setShowStatusDropdown(false);
              setShowAssigneeDropdown(false);
            }
          }}
          ref={senderDropdownRef as any}
        >
          <RiUserSharedLine className="text-gray-400 w-4 h-4" />
          <span>Sender</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showSenderDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
              {availableSenders.map((sender) => (
                <button
                  key={sender}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSender(sender);
                    setShowSenderDropdown(false);
                  }}
                >
                  <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                    {selectedSender === sender && (
                      <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                        <FaCheck className="text-white" size={8} />
                      </div>
                    )}
                  </div>
                  {sender}
                </button>
              ))}
            </div>
          )}
        </button>

        {/* Assignee Filter */}
        <button
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAssigneeDropdown(prev => !prev);
            if (!showAssigneeDropdown) {
              setShowStatusDropdown(false);
              setShowSenderDropdown(false);
            }
          }}
          ref={assigneeDropdownRef as any}
        >
          <RiUserSearchLine className="text-gray-400 w-4 h-4" />
          <span>Assignee</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showAssigneeDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
              <button
                className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedAssignees([]);
                }}
              >
                <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                  {selectedAssignees.length === 0 && (
                    <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                      <FaCheck className="text-white" size={8} />
                    </div>
                  )}
                </div>
                All
              </button>
              <button
                className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedAssignees(prev => 
                    prev.includes('__ME__') 
                      ? prev.filter(a => a !== '__ME__')
                      : [...prev, '__ME__']
                  );
                }}
              >
                <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                  {selectedAssignees.includes('__ME__') && (
                    <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                      <FaCheck className="text-white" size={8} />
                    </div>
                  )}
                </div>
                Me
              </button>
              {availableAssignees.map((assignee) => (
                <button
                  key={assignee}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedAssignees(prev => 
                      prev.includes(assignee)
                        ? prev.filter(a => a !== assignee)
                        : [...prev, assignee]
                    );
                  }}
                >
                  <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                    {selectedAssignees.includes(assignee) && (
                      <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                        <FaCheck className="text-white" size={8} />
                      </div>
                    )}
                  </div>
                  {assignee}
                </button>
              ))}
            </div>
          )}
        </button>
        {/* Last 30 Days Filter */}
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowLast30DaysDropdown(prev => !prev);
            if (!showLast30DaysDropdown) {
              setShowStatusDropdown(false);
              setShowSenderDropdown(false);
              setShowAssigneeDropdown(false);
              setShowContractDropdown(false);
            }
          }}
          ref={last30DaysDropdownRef as any}
        >
          <TbClockPin className="text-gray-400 w-4 h-4" />
          <span>Last 30 Days</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
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
            <div style={{ height: 'calc(10 * 3.5rem)', minHeight: '350px' }} className="relative overflow-x-auto overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '100px' }}
                      onClick={handleIdSort}
                    >
                      Document ID
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" 
                      style={{ minWidth: '200px' }}
                      onClick={handleDocumentSort}
                    >
                      Document
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '187px' }}>Recipients</th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleStatusSort}
                    >
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Signatures</th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleContractIdSort}
                    >
                      Contract ID
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" 
                      style={{ minWidth: '200px' }}
                      onClick={handleContractSort}
                    >
                      Contract
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" 
                      style={{ minWidth: '120px' }}
                      onClick={handleAssigneeSort}
                    >
                      Assignee
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleDateSentSort}
                    >
                      Date Sent
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleDueDateSort}
                    >
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRows.map((row) => {
                    return (
                      <tr 
                        key={row.id}
                        className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => {
                          setSelectedDocument({
                            id: row.id,
                            document: row.document,
                            parties: row.parties,
                            status: row.status,
                            signatures: row.signatures,
                            contractId: row.contractId,
                            contract: row.contract,
                            assignee: row.assignee,
                            dateSent: row.dateSent,
                            dueDate: row.dueDate
                          });
                        }}
                      >
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                          <span className="text-primary underline font-semibold cursor-pointer">{row.id}</span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                          <div className="text-xs font-bold text-gray-900">{row.document}</div>
                        </td>
                        <td className="px-6 py-2.5 text-xs">
                          <div className="flex flex-col space-y-1">
                            {row.parties.map((party, index) => (
                              <div key={index} className="text-gray-900">{party}</div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                          <span className={clsx(
                            "inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full border",
                            row.status === 'Pending' && "bg-yellow-100 text-yellow-800 border-yellow-500",
                            row.status === 'Completed' && "bg-green-100 text-green-800 border-green-500",
                            row.status === 'Rejected' && "bg-red-100 text-red-800 border-red-500",
                            row.status === 'Expired' && "bg-gray-100 text-gray-800 border-gray-500",
                            row.status === 'Voided' && "bg-gray-100 text-gray-800 border-gray-500"
                          )}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-600">{row.signatures}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                          <span className="text-primary underline font-semibold cursor-pointer">{row.contractId}</span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                          <div className="text-xs font-bold text-gray-900">{row.contract}</div>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                          <div className="text-xs text-gray-900">{row.assignee}</div>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">{row.dateSent}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">{row.dueDate}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button 
                              className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                              title="View"
                              onClick={(e) => {
                                e.preventDefault();
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
                                e.preventDefault();
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
                                e.preventDefault();
                                e.stopPropagation();
                                // Add download action here
                              }}
                            >
                              <HiOutlineDownload className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                      #{selectedDocument?.id}
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
                          <div className="text-xs text-black mb-4">{selectedDocument?.id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document Hash</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={selectedDocument ? getDocumentHash(selectedDocument.id) : ''}
                            >
                              {selectedDocument ? `0x${selectedDocument.id}...${selectedDocument.id.slice(-4)}` : ''}
                            </span>
                            <div className="relative">
                              <button 
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  if (selectedDocument) {
                                    navigator.clipboard.writeText(getDocumentHash(selectedDocument.id));
                                    setCopiedDocumentId(selectedDocument.id);
                                    setTimeout(() => setCopiedDocumentId(null), 1500);
                                  }
                                }}
                                onMouseEnter={() => selectedDocument && setHoveredDocumentId(selectedDocument.id)}
                                onMouseLeave={() => setHoveredDocumentId(null)}
                                aria-label="Copy document hash"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedDocumentId === selectedDocument?.id && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredDocumentId === selectedDocument?.id && copiedDocumentId !== selectedDocument?.id && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                          <div className="text-xs text-black mb-4">{selectedDocument?.contractId}</div>
                        </div>
                        {/* Row 2: Document Name and Contract Name */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document Name</div>
                          <div className="text-xs text-black mb-4">{selectedDocument?.document}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Hash</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={selectedDocument ? getDocumentHash(selectedDocument.contractId) : ''}
                            >
                              {selectedDocument ? `0x${selectedDocument.contractId}...${selectedDocument.contractId.slice(-4)}` : ''}
                            </span>
                            <div className="relative">
                              <button 
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  if (selectedDocument) {
                                    navigator.clipboard.writeText(getDocumentHash(selectedDocument.contractId));
                                    setCopiedDocumentId(selectedDocument.contractId);
                                    setTimeout(() => setCopiedDocumentId(null), 1500);
                                  }
                                }}
                                onMouseEnter={() => selectedDocument && setHoveredDocumentId(selectedDocument.contractId)}
                                onMouseLeave={() => setHoveredDocumentId(null)}
                                aria-label="Copy contract hash"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedDocumentId === selectedDocument?.contractId && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredDocumentId === selectedDocument?.contractId && copiedDocumentId !== selectedDocument?.contractId && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Name</div>
                          <div className="text-xs text-black mb-4">{selectedDocument?.contract}</div>
                        </div>
                        {/* Message Field */}
                        <div className="col-span-3">
                          <div className="text-gray-500 text-xs mb-1">Message</div>
                          <div className="w-full min-h-24 px-4 py-2 text-xs font-medium text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
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
                                {selectedDocument?.parties.map((party, idx) => (
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
                                      width: `${(parseInt(selectedDocument?.signatures.split(' of ')[0] || '0') / parseInt(selectedDocument?.signatures.split(' of ')[1] || '1')) * 100}%` 
                                    }}
                                  />
                                </div>
                                {selectedDocument?.signatures}
                              </div>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        {/* Row 2: Status */}
                        <div className="col-span-2">
                          <div className="text-gray-500 text-xs mb-1">Status</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${
                            selectedDocument?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-500' :
                            selectedDocument?.status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-500' :
                            selectedDocument?.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-500' :
                            'bg-gray-100 text-gray-800 border border-gray-500'
                          }`}>{selectedDocument?.status}</span>
                        </div>
                        {/* Row 3: Due Date, Last Reminder Date, and Date Sent */}
                        <div className="col-span-2">
                          <div className="grid grid-cols-3 gap-x-12">
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Due Date</div>
                              <div className="text-xs text-black mb-4">{selectedDocument?.dueDate}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Last Reminder Date</div>
                              <div className="text-xs text-black mb-4"></div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Date Sent</div>
                              <div className="text-xs text-black mb-4">{selectedDocument?.dateSent}</div>
                            </div>
                          </div>
                        </div>
                        {/* Row 4: Assignee */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Assignee</div>
                          <div className="text-xs text-black mb-4">{selectedDocument?.assignee}</div>
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
                      {selectedDocument?.parties.map((party, idx) => {
                        // Generate a placeholder email from the party name
                        const email = party.toLowerCase().replace(/[^a-z0-9]/g, '.') + '@example.com';
                        return (
                          <div key={party} className="grid grid-cols-[40px_40px_1.5fr_2fr_1fr_1.5fr_1.5fr] gap-2 items-center px-2 py-4 border-b border-gray-100 text-xs text-gray-800" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            <div className="text-center font-semibold">{idx + 1}</div>
                            <div className="flex justify-center items-center">
                              <div className="h-5 w-5 rounded-lg bg-primary flex items-center justify-center border-2 border-primary">
                                <FaCheck className="text-white" size={10} />
                              </div>
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

      {/* Tool Selector Modal */}
      <Modal
        isOpen={showToolSelectorModal}
        onClose={() => setShowToolSelectorModal(false)}
        title="Select your signing method..."
        description="Choose your preferred electronic signature platform"
        size="xl"
        className="font-avenir"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-row gap-6 w-full justify-center">
            {/* Escra Native */}
            <button
              className="flex flex-col items-center border border-gray-200 rounded-xl p-6 w-64 bg-white hover:shadow-lg transition-shadow focus:outline-none"
              onClick={() => {
                setShowToolSelectorModal(false);
                setShowRequestSignatureModal(true);
              }}
            >
              <div className="h-14 w-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                <img 
                  src="/assets/logos/escra-logo-teal.png" 
                  alt="Escra Logo" 
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="text-lg font-semibold mb-1">Escra</div>
              <div className="text-xs text-gray-500 mb-2 text-center">Native signature solution with blockchain security</div>
              <span className="text-xs bg-teal-50 text-teal-500 px-3 py-1 rounded-full font-semibold">Recommended</span>
            </button>
            {/* DocuSign */}
            <button
              className="flex flex-col items-center border border-gray-200 rounded-xl p-6 w-64 bg-white hover:shadow-lg transition-shadow focus:outline-none"
              onClick={() => {
                setShowToolSelectorModal(false);
                // TODO: Add DocuSign logic here
              }}
            >
              <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <FaDochub className="w-8 h-8 text-blue-500 transform translate-x-[2px]" />
              </div>
              <div className="text-lg font-semibold mb-1">DocuSign</div>
              <div className="text-xs text-gray-500 mb-2 text-center">
                Industry-leading<br />
                e-signature platform
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">External</span>
            </button>
            {/* Adobe Sign */}
            <button
              className="flex flex-col items-center border border-gray-200 rounded-xl p-6 w-64 bg-white hover:shadow-lg transition-shadow focus:outline-none"
              onClick={() => {
                setShowToolSelectorModal(false);
                // TODO: Add Adobe Sign logic here
              }}
            >
              <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <SiAdobe className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-lg font-semibold mb-1">Adobe Sign</div>
              <div className="text-xs text-gray-500 mb-2 text-center">
                Professional<br />
                PDF Signing Solution
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">External</span>
            </button>
          </div>
        </div>
      </Modal>

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
                                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
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
                                  <button className="absolute top-0 left-[1220px] text-gray-400 hover:text-gray-600 transition-colors" onClick={() => handleDeleteRecipient(idx)} disabled={recipients.length === 1}>
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