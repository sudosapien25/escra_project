'use client';

import React, { useState, useRef, useEffect, RefObject, createRef } from 'react';
import { FaSearch, FaUser, FaFilter, FaSort, FaCheckCircle, FaPlus, FaTimes, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards, HiOutlineTrash, HiOutlineUpload, HiOutlineDocumentText, HiOutlineBell, HiOutlineCog, HiOutlineDuplicate, HiOutlineDocumentSearch, HiOutlineUserGroup, HiOutlineX } from 'react-icons/hi';
import { HiMiniChevronUpDown, HiMiniChevronDown } from 'react-icons/hi2';
import { LuPen, LuCalendarClock, LuBellRing, LuPenLine, LuCalendarFold, LuEraser } from 'react-icons/lu';
import { MdCancelPresentation } from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';
import { PiWarningDiamondBold } from 'react-icons/pi';
import clsx from 'clsx';
import { IconBaseProps } from 'react-icons';
import { TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive, TbClockPin, TbPencilShare, TbPencilPlus, TbClockEdit } from 'react-icons/tb';
import { SiBox } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { TiUserAddOutline } from 'react-icons/ti';
import { Modal } from '@/components/common/Modal';
import { RiLayoutColumnLine, RiDashboardLine, RiBox3Line, RiUserSharedLine, RiUserSearchLine } from 'react-icons/ri';
import { FaSignature } from 'react-icons/fa';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiChevronDown } from 'react-icons/hi';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import { FaDochub } from 'react-icons/fa6';
import { SiAdobe } from 'react-icons/si';
import { mockContracts } from '@/data/mockContracts';
import { useAssigneeStore } from '@/data/assigneeStore';
import { useDocumentStore } from '@/data/documentNameStore';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/common/Logo';
import { SignatureDocument, mockSignatures } from '@/data/mockSignatures';
import { SignatureModal, SignatureValue } from '@/components/common/SignatureModal';
import { SignatureConfirmationModal } from '@/components/common/SignatureConfirmationModal';
import { DocumentPreparationModal } from '@/components/DocumentPreparationModal';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  uploadedBy?: string;
  dateUploaded?: string;
  contractName?: string;
  contractId?: string;
  assignee?: string;
}

type SortableKey = keyof SignatureDocument;

export default function SignaturesPage() {
  const { user } = useAuth();
  const currentUserName = user?.name || '';
  const { getAllDocuments } = useDocumentStore();
  const { getAssignee } = useAssigneeStore();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('all');
  const [inboxTab, setInboxTab] = useState('all');
  const [cancelledTab, setCancelledTab] = useState('all');
  const [pendingTab, setPendingTab] = useState('all');
  const [signatureFilterTab, setSignatureFilterTab] = useState('Inbox');
  const signatureFilterTabs = ['Inbox', 'Outbox', 'Drafts', 'Completed', 'Canceled'];
  const [signatureAssignee, setSignatureAssignee] = useState('');
  const [showSignatureAssigneeDropdown, setShowSignatureAssigneeDropdown] = useState(false);
  const signatureAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const [recipientErrors, setRecipientErrors] = useState<Record<string, boolean>>({});
  const [documentError, setDocumentError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [showSenderDropdown, setShowSenderDropdown] = useState(false);
  const [selectedSender, setSelectedSender] = useState('Sent by anyone');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SignatureDocument | null>(null);
  const [showRequestSignatureModal, setShowRequestSignatureModal] = useState(false);
  const [showDocuSignModal, setShowDocuSignModal] = useState(false);
  const [showDocumentPreparationModal, setShowDocumentPreparationModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [docuSignUploadedFiles, setDocuSignUploadedFiles] = useState<File[]>([]);
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [editingDocuSignFileName, setEditingDocuSignFileName] = useState<string | null>(null);
  const [customFileNames, setCustomFileNames] = useState<{[key: string]: string}>({});
  const [customDocuSignFileNames, setCustomDocuSignFileNames] = useState<{[key: string]: string}>({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleRows, setVisibleRows] = useState(15); // Number of visible rows in the table
  const [isResizing, setIsResizing] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  // Contract association modal state
  const [showContractModal, setShowContractModal] = useState(false);
  const [currentUploadingFile, setCurrentUploadingFile] = useState<File | null>(null);
  const [currentUploadingFileName, setCurrentUploadingFileName] = useState('');
  const [currentUploadingContract, setCurrentUploadingContract] = useState('');
  const [currentUploadingAssignee, setCurrentUploadingAssignee] = useState('');
  const [isDocuSignUpload, setIsDocuSignUpload] = useState(false);
  const [uploadedFileContracts, setUploadedFileContracts] = useState<{[key: string]: string}>({});
  const [docuSignUploadedFileContracts, setDocuSignUploadedFileContracts] = useState<{[key: string]: string}>({});
  const [uploadedFileAssignees, setUploadedFileAssignees] = useState<{[key: string]: string}>({});
  const [docuSignUploadedFileAssignees, setDocuSignUploadedFileAssignees] = useState<{[key: string]: string}>({});
  
  // Contract dropdown state for modal
  const [showModalContractDropdown, setShowModalContractDropdown] = useState(false);
  const [modalContractSearch, setModalContractSearch] = useState('');
  const modalContractDropdownRef = useRef<HTMLDivElement>(null);
  const [showModalAssigneeDropdown, setShowModalAssigneeDropdown] = useState(false);
  const modalAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [showDocuSignDocumentDropdown, setShowDocuSignDocumentDropdown] = useState(false);
  const [documentSearch, setDocumentSearch] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [docuSignDocumentSearch, setDocuSignDocumentSearch] = useState('');
  const [docuSignSelectedDocuments, setDocuSignSelectedDocuments] = useState<string[]>([]);
  const [copiedDocumentId, setCopiedDocumentId] = useState<string | null>(null);
  const [hoveredDocumentId, setHoveredDocumentId] = useState<string | null>(null);
  const [expandedRecipientsRows, setExpandedRecipientsRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const senderDropdownRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const documentDropdownRef = useRef<HTMLDivElement>(null);
  const docuSignDocumentDropdownRef = useRef<HTMLDivElement>(null);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);
  const docuSignUploadDropdownRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [showDocuSignUploadDropdown, setShowDocuSignUploadDropdown] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDocuSignDraggingOver, setIsDocuSignDraggingOver] = useState(false);

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
    signerRole: string;
    contractRole: string;
    showSignerRoleDropdown: boolean;
    showContractRoleDropdown: boolean;
    signerRoleButtonRef: RefObject<HTMLButtonElement>;
    signerRoleDropdownRef: RefObject<HTMLDivElement>;
    contractRoleButtonRef: RefObject<HTMLButtonElement>;
    contractRoleDropdownRef: RefObject<HTMLDivElement>;
  };
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      name: '',
      email: '',
      signerRole: 'Signer Role',
      contractRole: '',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: createRef<HTMLDivElement>(),
      contractRoleButtonRef: createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: createRef<HTMLDivElement>(),
    },
  ]);
  const [docuSignRecipients, setDocuSignRecipients] = useState<Recipient[]>([
    {
      name: '',
      email: '',
      signerRole: 'Signer Role',
      contractRole: '',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: createRef<HTMLDivElement>(),
      contractRoleButtonRef: createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: createRef<HTMLDivElement>(),
    },
  ]);
  const [showToolSelectorModal, setShowToolSelectorModal] = useState(false);
  const [isOnlySigner, setIsOnlySigner] = useState(false);
  const [isDocuSignOnlySigner, setIsDocuSignOnlySigner] = useState(false);
  const [setSigningOrder, setSetSigningOrder] = useState(false);
  const [setDocuSignSigningOrder, setSetDocuSignSigningOrder] = useState(false);

  // Signature modal state
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSignatureConfirmationModal, setShowSignatureConfirmationModal] = useState(false);
  const [capturedSignatureData, setCapturedSignatureData] = useState<SignatureValue | null>(null);
  const [isFinalSigning, setIsFinalSigning] = useState(false);

  const [selectedRecentlyUpdated, setSelectedRecentlyUpdated] = useState('Last 24 hours');
  const [openRecentlyUpdatedDropdown, setOpenRecentlyUpdatedDropdown] = useState(false);
  const recentlyUpdatedDropdownRef = useRef<HTMLDivElement>(null);
  const recentlyUpdatedButtonRef = useRef<HTMLButtonElement>(null);
  const mobileRecentlyUpdatedButtonRef = useRef<HTMLButtonElement>(null);
  const mobileRecentlyUpdatedDropdownRef = useRef<HTMLDivElement>(null);
  const [openContractDropdown, setOpenContractDropdown] = useState(false);
  const contractButtonRef = useRef<HTMLButtonElement>(null);
  const senderButtonRef = useRef<HTMLButtonElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const assigneeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileStatusDropdownRef = useRef<HTMLDivElement>(null);
  const mobileContractDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSenderDropdownRef = useRef<HTMLDivElement>(null);
  const mobileAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const mobileAssigneeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileSenderButtonRef = useRef<HTMLButtonElement>(null);
  const mobileContractButtonRef = useRef<HTMLButtonElement>(null);
  const mobileStatusButtonRef = useRef<HTMLButtonElement>(null);

  // Get assignees from store
  const { allAssignees } = useAssigneeStore();

  // Handler to add a new recipient card
  const handleAddRecipient = () => {
    setRecipients(prev => [
      ...prev,
      {
        name: '',
        email: '',
        signerRole: 'Signer Role',
        contractRole: '',
        showSignerRoleDropdown: false,
        showContractRoleDropdown: false,
        signerRoleButtonRef: createRef<HTMLButtonElement>(),
        signerRoleDropdownRef: createRef<HTMLDivElement>(),
        contractRoleButtonRef: createRef<HTMLButtonElement>(),
        contractRoleDropdownRef: createRef<HTMLDivElement>(),
      },
    ]);
  };

  // Handler to add a new DocuSign recipient card
  const handleAddDocuSignRecipient = () => {
    setDocuSignRecipients(prev => [
      ...prev,
      {
        name: '',
        email: '',
        signerRole: 'Signer Role',
        contractRole: '',
        showSignerRoleDropdown: false,
        showContractRoleDropdown: false,
        signerRoleButtonRef: createRef<HTMLButtonElement>(),
        signerRoleDropdownRef: createRef<HTMLDivElement>(),
        contractRoleButtonRef: createRef<HTMLButtonElement>(),
        contractRoleDropdownRef: createRef<HTMLDivElement>(),
      },
    ]);
  };

  // Handler to delete a recipient card
  const handleDeleteRecipient = (idx: number) => {
    setRecipients(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  };

  // Handler to delete a DocuSign recipient card
  const handleDeleteDocuSignRecipient = (idx: number) => {
    setDocuSignRecipients(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
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



  // Available options for recently updated dropdown
  const availableRecentlyUpdatedOptions = [
    'Last 24 hours',
    'Last 7 days',
    'Last 30 days',
    'Last month',
    'This quarter',
    'Last quarter',
    'Last 6 months',
    'Last year',
    'Last 2 years'
  ];

  // State for signatures data
  const [signaturesData, setSignaturesData] = useState<SignatureDocument[]>(mockSignatures);
  
  // State for form fields
  const [dueDate, setDueDate] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [docuSignSubject, setDocuSignSubject] = useState('');
  const [docuSignMessage, setDocuSignMessage] = useState('');
  
  // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ name: string; url: string; id?: string } | null>(null);
  
  // Load signatures data on component mount
  useEffect(() => {
    const loadEnhancedSignatures = async () => {
      try {
        const response = await fetch('/api/signatures');
        if (response.ok) {
          const data = await response.json();
          // Only update if we got valid data that's different from initial mockSignatures
          if (data.signatures && data.signatures.length > 0) {
            setSignaturesData(data.signatures);
          }
        } else {
          console.error('Failed to load enhanced signatures');
          // Keep the initial mockSignatures that are already loaded
        }
      } catch (error) {
        console.error('Error loading enhanced signatures:', error);
        // Keep the initial mockSignatures that are already loaded
      }
    };

    // Small delay to let the initial render complete, then enhance with API data
    const timeoutId = setTimeout(loadEnhancedSignatures, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Table resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Only start resizing if the left mouse button is pressed
    if (e.button === 0) {
      setIsResizing(true);
      isDraggingRef.current = false; // Reset drag state
    }
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !tableContainerRef.current) return;

    // Only resize if the mouse button is actually pressed (button 0 = left mouse button)
    if (e.buttons !== 1) {
      setIsResizing(false);
      isDraggingRef.current = false;
      return;
    }

    // Set dragging to true on first move
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      return; // Skip the first move to avoid immediate resize
    }

    const container = tableContainerRef.current;
    const rect = container.getBoundingClientRect();
    const newHeight = e.clientY - rect.top;
    
    // Calculate number of visible rows based on height
    // Account for tabs, padding, and results bar
    const tabsHeight = 60; // Approximate tabs height
    const padding = 48; // Container padding (24px top + 24px bottom)
    const resultsBarHeight = 60; // Results bar height
    const headerHeight = 48; // Table header height
    const rowHeight = 56; // 3.5rem per row
    
    const availableHeight = newHeight - tabsHeight - padding - resultsBarHeight - headerHeight;
    const newVisibleRows = Math.max(5, Math.floor(availableHeight / rowHeight));
    
    setVisibleRows(newVisibleRows);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Additional check to prevent resize on mouse up if not actually dragging
  const handleMouseUp = () => {
    setIsResizing(false);
    isDraggingRef.current = false;
  };

  // Add resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);
  


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
      const desktopDropdown = statusDropdownRef.current;
      const mobileDropdown = mobileStatusDropdownRef.current;
      const desktopButton = statusButtonRef.current;
      const mobileButton = mobileStatusButtonRef.current;
      
      // Only check if dropdown is open
      if (showStatusDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setShowStatusDropdown(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  // Handle click outside for sender dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = senderDropdownRef.current;
      const mobileDropdown = mobileSenderDropdownRef.current;
      const desktopButton = senderButtonRef.current;
      const mobileButton = mobileSenderButtonRef.current;
      
      // Only check if dropdown is open
      if (showSenderDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setShowSenderDropdown(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSenderDropdown]);

  // Handle click outside for assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = assigneeDropdownRef.current;
      const mobileDropdown = mobileAssigneeDropdownRef.current;
      const desktopButton = assigneeButtonRef.current;
      const mobileButton = mobileAssigneeButtonRef.current;
      
      // Only check if dropdown is open
      if (showAssigneeDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setShowAssigneeDropdown(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAssigneeDropdown]);

  // Handle click outside for signature assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showSignatureAssigneeDropdown && !signatureAssigneeDropdownRef.current?.contains(event.target as Node)) {
        setShowSignatureAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSignatureAssigneeDropdown]);

  // Function to validate recipients and documents
  const validateRecipients = () => {
    const newRecipientErrors: Record<string, boolean> = {};
    let hasErrors = false;

    // Check if at least one document is selected or uploaded
    if (selectedDocuments.length === 0 && uploadedFiles.length === 0) {
      setDocumentError(true);
      hasErrors = true;
    } else {
      setDocumentError(false);
    }

    recipients.forEach((recipient, index) => {
      if (!recipient.name || recipient.name.trim() === '') {
        newRecipientErrors[`name-${index}`] = true;
        hasErrors = true;
      }
      if (!recipient.email || recipient.email.trim() === '') {
        newRecipientErrors[`email-${index}`] = true;
        hasErrors = true;
      }
      if (!recipient.signerRole || recipient.signerRole === 'Signer Role') {
        newRecipientErrors[`signerRole-${index}`] = true;
        hasErrors = true;
      }
      if (!recipient.contractRole || recipient.contractRole.trim() === '') {
        newRecipientErrors[`contractRole-${index}`] = true;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setRecipientErrors(newRecipientErrors);
      return false;
    }

    // Clear errors and return true
    setRecipientErrors({});
    setDocumentError(false);
    return true;
  };

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (docuSignDocumentDropdownRef.current && !docuSignDocumentDropdownRef.current.contains(event.target as Node)) {
        setShowDocuSignDocumentDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (docuSignUploadDropdownRef.current && !docuSignUploadDropdownRef.current.contains(event.target as Node)) {
        setShowDocuSignUploadDropdown(false);
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
    
    // Show contract association modal for the first file
    if (validFiles.length > 0) {
      setCurrentUploadingFile(validFiles[0]);
      setCurrentUploadingFileName(validFiles[0].name);
      setCurrentUploadingContract('');
      setCurrentUploadingAssignee('');
      setIsDocuSignUpload(false);
      setShowContractModal(true);
    }
  };

  const handleDocuSignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    // Only allow PDF, DOC, DOCX, JPG and max 10MB each
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    
    // Show contract association modal for the first file
    if (validFiles.length > 0) {
      setCurrentUploadingFile(validFiles[0]);
      setCurrentUploadingFileName(validFiles[0].name);
      setCurrentUploadingContract('');
      setCurrentUploadingAssignee('');
      setIsDocuSignUpload(true);
      setShowContractModal(true);
    }
  };

  // Helper function to get file key for uploaded files
  const getFileKey = (file: File, index: number) => `${file.name}-${index}`;

  // Helper function to get display name for uploaded files
  const getDisplayFileName = (file: File, index: number, isDocuSign: boolean = false) => {
    const fileKey = getFileKey(file, index);
    const customNames = isDocuSign ? customDocuSignFileNames : customFileNames;
    return customNames[fileKey] || file.name;
  };

  // Handle file name edit start
  const handleStartEditFileName = (file: File, index: number, isDocuSign: boolean = false) => {
    const fileKey = getFileKey(file, index);
    if (isDocuSign) {
      setEditingDocuSignFileName(fileKey);
    } else {
      setEditingFileName(fileKey);
    }
  };

  // Handle file name edit save
  const handleSaveFileName = (file: File, index: number, newName: string, isDocuSign: boolean = false) => {
    const fileKey = getFileKey(file, index);
    if (isDocuSign) {
      setCustomDocuSignFileNames(prev => ({ ...prev, [fileKey]: newName }));
      setEditingDocuSignFileName(null);
    } else {
      setCustomFileNames(prev => ({ ...prev, [fileKey]: newName }));
      setEditingFileName(null);
    }
  };

  // Handle file name edit cancel
  const handleCancelFileNameEdit = (isDocuSign: boolean = false) => {
    if (isDocuSign) {
      setEditingDocuSignFileName(null);
    } else {
      setEditingFileName(null);
    }
  };

  // Contract association modal handlers
  const handleContractModalSave = () => {
    if (currentUploadingFile && currentUploadingContract && currentUploadingAssignee) {
      const fileKey = getFileKey(currentUploadingFile, 0);
      
      if (isDocuSignUpload) {
        // Add to DocuSign uploaded files
        setDocuSignUploadedFiles(prev => [...prev, currentUploadingFile]);
        setCustomDocuSignFileNames(prev => ({ ...prev, [fileKey]: currentUploadingFileName }));
        setDocuSignUploadedFileContracts(prev => ({ ...prev, [fileKey]: currentUploadingContract }));
        setDocuSignUploadedFileAssignees(prev => ({ ...prev, [fileKey]: currentUploadingAssignee }));
        
        // Clear document error when files are uploaded
        setDocumentError(false);
      } else {
        // Add to regular uploaded files
        setUploadedFiles(prev => [...prev, currentUploadingFile]);
        setCustomFileNames(prev => ({ ...prev, [fileKey]: currentUploadingFileName }));
        setUploadedFileContracts(prev => ({ ...prev, [fileKey]: currentUploadingContract }));
        setUploadedFileAssignees(prev => ({ ...prev, [fileKey]: currentUploadingAssignee }));
        
        // Clear document error when files are uploaded
        setDocumentError(false);
      }
    }
    
    // Reset modal state
    setShowContractModal(false);
    setCurrentUploadingFile(null);
    setCurrentUploadingFileName('');
    setCurrentUploadingContract('');
    setCurrentUploadingAssignee('');
  };

  const handleContractModalCancel = () => {
    setShowContractModal(false);
    setCurrentUploadingFile(null);
    setCurrentUploadingFileName('');
    setCurrentUploadingContract('');
    setCurrentUploadingAssignee('');
  };

  // Click outside handler for modal contract dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = modalContractDropdownRef.current;
      if (showModalContractDropdown && dropdown && !dropdown.contains(event.target as Node)) {
        setShowModalContractDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModalContractDropdown]);

  // Click outside handler for modal assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = modalAssigneeDropdownRef.current;
      if (showModalAssigneeDropdown && dropdown && !dropdown.contains(event.target as Node)) {
        setShowModalAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModalAssigneeDropdown]);

  // Sample documents data (same as contracts page)
  // Convert stored documents to Document interface format (same as contracts page)
  const convertStoredToDocument = (storedDoc: any, contractTitle?: string): Document => {
    return {
      id: storedDoc.id,
      name: storedDoc.name,
      type: storedDoc.type && storedDoc.type.includes('pdf') ? 'PDF' : 
            storedDoc.type && storedDoc.type.includes('doc') ? 'DOC' : 
            storedDoc.type && storedDoc.type.includes('image') ? 'JPG' : 'PDF',
      size: storedDoc.size ? `${(storedDoc.size / (1024 * 1024)).toFixed(1)} MB` : '',
      date: storedDoc.uploadedDate ? new Date(storedDoc.uploadedDate).toISOString().split('T')[0] : '',
      uploadedBy: storedDoc.uploadedBy || currentUserName,
      dateUploaded: storedDoc.uploadedDate ? new Date(storedDoc.uploadedDate).toISOString().split('T')[0] : '',
      contractName: contractTitle || 'Unknown Contract',
      contractId: storedDoc.contractId || '',
      assignee: getAssignee(storedDoc.id) || '',
    };
  };

  // Get stored documents and convert them to Document interface (same source as contracts page)
  const storedDocuments = getAllDocuments();
  const convertedStoredDocuments = storedDocuments.map(storedDoc => {
    // Use the stored contractName if available, otherwise try to find it in mockContracts
    const contractTitle = storedDoc.contractName || mockContracts.find(c => c.id === storedDoc.contractId)?.title || 'Unknown Contract';
    return convertStoredToDocument(storedDoc, contractTitle);
  });

  // Sample documents for backward compatibility
  const sampleDocuments: Document[] = [
    {
      id: '1234',
      name: 'Wire Authorization',
      type: 'PDF',
      size: '2.4 MB',
      date: '2024-03-15',
      uploadedBy: 'John Smith',
      dateUploaded: '2024-03-15',
      contractName: 'New Property Acquisition',
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
      contractName: 'Land Development Contract',
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
      contractName: 'Construction Escrow',
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
      contractName: 'Property Sale Contract',
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
      contractName: 'Investment Property Escrow',
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
      contractName: 'Residential Sale Agreement',
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
      contractName: 'Office Building Purchase',
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
      contractName: 'Retail Space Lease',
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
      contractName: 'Luxury Villa Purchase',
      contractId: '10003',
      assignee: 'Samantha Fox'
    }
  ];

  // Combine sample documents with stored documents (same as contracts page)
  const allDocuments = [...sampleDocuments, ...convertedStoredDocuments];

  // Filter documents based on search term (now using real-time documents)
  const filteredDocuments = allDocuments.filter(doc => {
    const search = documentSearch.toLowerCase();
    return (
      doc.name.toLowerCase().includes(search) ||
      doc.id.toLowerCase().includes(search) ||
      doc.type.toLowerCase().includes(search) ||
      doc.contractName?.toLowerCase().includes(search) ||
      doc.contractId?.toLowerCase().includes(search)
    );
  });

  const handleDocumentButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDocumentDropdown(!showDocumentDropdown);
  };

  const handleDocuSignDocumentButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDocuSignDocumentDropdown(!showDocuSignDocumentDropdown);
  };

  const handleDocumentItemClick = (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleDocumentSelection(docId, false);
  };

  const handleDocuSignDocumentItemClick = (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleDocumentSelection(docId, true);
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
          recipient.signerRoleButtonRef.current?.contains(target) ||
          recipient.signerRoleDropdownRef.current?.contains(target) ||
          recipient.contractRoleButtonRef.current?.contains(target) ||
          recipient.contractRoleDropdownRef.current?.contains(target)
        ) {
          // Click inside button or dropdown: do nothing
          return;
        }
        if (recipient.showSignerRoleDropdown) {
          setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showSignerRoleDropdown: false } : r));
        }
        if (recipient.showContractRoleDropdown) {
          setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: false } : r));
        }
      });
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [recipients]);

  // Click-off behavior for each DocuSign recipient role dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      docuSignRecipients.forEach((recipient, idx) => {
        const target = event.target as Node;
        if (
          recipient.signerRoleButtonRef.current?.contains(target) ||
          recipient.signerRoleDropdownRef.current?.contains(target) ||
          recipient.contractRoleButtonRef.current?.contains(target) ||
          recipient.contractRoleDropdownRef.current?.contains(target)
        ) {
          // Click inside button or dropdown: do nothing
          return;
        }
        if (recipient.showSignerRoleDropdown) {
          setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showSignerRoleDropdown: false } : r));
        }
        if (recipient.showContractRoleDropdown) {
          setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: false } : r));
        }
      });
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [docuSignRecipients]);

  // Show Tool Selector Modal when Request Signature is clicked
  const handleRequestSignatureClick = () => {
    setShowToolSelectorModal(true);
  };

  // Handle click outside for contract dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = contractDropdownRef.current;
      const mobileDropdown = mobileContractDropdownRef.current;
      const desktopButton = contractButtonRef.current;
      const mobileButton = mobileContractButtonRef.current;
      
      // Only check if dropdown is open
      if (openContractDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setOpenContractDropdown(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openContractDropdown]);

  // Add click-outside handler for recently updated dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = recentlyUpdatedDropdownRef.current;
      const mobileDropdown = mobileRecentlyUpdatedDropdownRef.current;
      const desktopButton = recentlyUpdatedButtonRef.current;
      const mobileButton = mobileRecentlyUpdatedButtonRef.current;
      
      // Only check if dropdown is open
      if (openRecentlyUpdatedDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setOpenRecentlyUpdatedDropdown(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openRecentlyUpdatedDropdown]);

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

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle arrays (like parties)
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const aStr = aValue.join(', ').toLowerCase();
        const bStr = bValue.join(', ').toLowerCase();
        if (aStr < bStr) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
      
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aStr = aValue.toLowerCase();
        const bStr = bValue.toLowerCase();
        if (aStr < bStr) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
      
      // Handle undefined/null values
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (!bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      
      // Default fallback
      return 0;
    });
  };

  // Get filtered and sorted data
  const filteredRows = getSortedData(signaturesData.filter(row => {
    return shouldShowRow(row.status) &&
           shouldShowCancelledRow(row.status) &&
           shouldShowAssignee(row.assignee) &&
           matchesSearch(row) &&
           shouldShowSender(row.assignee, row.parties) &&
           shouldShowContract(row.contractId);
  }));

  // Helper function to generate document hash
  const getSmartContractChainId = (id: string) => {
    // Generate 10-digit Algorand-style Smart Contract Chain ID from string ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Ensure 10 digits by padding with zeros if needed
    const hashStr = Math.abs(hash).toString();
    return hashStr.padStart(10, '0').slice(0, 10);
  };

  const getDocumentChainId = (id: string) => {
    // Generate 9-digit Algorand-style Document Chain ID from string ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Ensure 9 digits by padding with zeros if needed
    const hashStr = Math.abs(hash).toString();
    return hashStr.padStart(9, '0').slice(0, 9);
  };

  // Helper function to get status badge styling (consistent with contracts page)
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-800 dark:border-yellow-800';
      case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-800 dark:border-red-800';
      case 'Expired': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      case 'Voided': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
    }
  };

  // Helper function to get distinct colors for signature cards
  const getSignatureCardBorderColor = (index: number, isDocuSign: boolean = false) => {
    if (index === 0) {
      // First card uses brand color
      return isDocuSign ? '#3b82f6' : '#0d9488'; // blue-500 for DocuSign, teal-600 for Escra
    }
    
    const colors = [
      '#8b5cf6', // violet-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#06b6d4', // cyan-500
      '#84cc16', // lime-500
      '#f97316', // orange-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
      '#10b981', // emerald-500
      '#3b82f6', // blue-500
    ];
    return colors[(index - 1) % colors.length];
  };

  // Function to populate recipient cards when documents are selected
  const populateRecipientCardsFromDocument = (documentId: string, isDocuSign: boolean = false) => {
    console.log('populateRecipientCardsFromDocument called with:', { documentId, isDocuSign });
    
    // Find the document
    const document = allDocuments.find(doc => doc.id === documentId);
    console.log('Found document:', document);
    
    if (!document || !document.contractId) {
      console.log('No document or contractId found');
      return;
    }

    // Try to find the contract from the API first (full contract data with party info)
    const fetchContractData = async () => {
      try {
        const response = await fetch('/api/contracts');
        if (response.ok) {
          const data = await response.json();
          const fullContract = data.contracts?.find((c: any) => c.id === document.contractId);
          
          if (fullContract) {
            console.log('Found full contract data:', fullContract);
            createRecipientsFromFullContract(fullContract, isDocuSign);
            return;
          }
        }
      } catch (error) {
        console.log('Error fetching contract data:', error);
      }
      
      // Fallback to mockContracts if API fails
      const contract = mockContracts.find(c => c.id === document.contractId);
      console.log('Fallback to mockContracts:', contract);
      
      if (contract) {
        createRecipientsFromBasicContract(contract, isDocuSign);
      }
    };

    fetchContractData();
  };

  // Function to create recipients from full contract data (with emails and roles)
  const createRecipientsFromFullContract = (contract: any, isDocuSign: boolean) => {
    const recipients: Recipient[] = [];
    
    // Add first party (buyer) - typically needs to sign
    if (contract.buyer) {
      recipients.push({
        name: contract.buyer,
        email: contract.buyerEmail || '',
        signerRole: 'Needs to Sign', // Default for buyer
        contractRole: contract.party1Role || 'Buyer',
        showSignerRoleDropdown: false,
        showContractRoleDropdown: false,
        signerRoleButtonRef: createRef<HTMLButtonElement>(),
        signerRoleDropdownRef: createRef<HTMLDivElement>(),
        contractRoleButtonRef: createRef<HTMLButtonElement>(),
        contractRoleDropdownRef: createRef<HTMLDivElement>(),
      });
    }
    
    // Add second party (seller) - typically needs to sign
    if (contract.seller) {
      recipients.push({
        name: contract.seller,
        email: contract.sellerEmail || '',
        signerRole: 'Needs to Sign', // Default for seller
        contractRole: contract.party2Role || 'Seller',
        showSignerRoleDropdown: false,
        showContractRoleDropdown: false,
        signerRoleButtonRef: createRef<HTMLButtonElement>(),
        signerRoleDropdownRef: createRef<HTMLDivElement>(),
        contractRoleButtonRef: createRef<HTMLButtonElement>(),
        contractRoleDropdownRef: createRef<HTMLDivElement>(),
      });
    }
    
    // Add additional parties with appropriate signer roles based on their contract roles
    if (contract.additionalParties && contract.additionalParties.length > 0) {
      contract.additionalParties.forEach((party: any) => {
        // Determine signer role based on contract role
        let signerRole = 'Needs to Sign'; // Default
        if (party.role === 'Buyer Agent' || party.role === 'Seller Agent') {
          signerRole = 'Receives a Copy'; // Agents typically receive copies
        } else if (party.role === 'Closing Agent') {
          signerRole = 'Needs to Sign'; // Closing agents need to sign
        } else if (party.role === 'Inspector' || party.role === 'Appraiser') {
          signerRole = 'Receives a Copy'; // Inspectors/appraisers typically receive copies
        }
        
        recipients.push({
          name: party.name,
          email: party.email || '',
          signerRole: signerRole,
          contractRole: party.role || 'Standard',
          showSignerRoleDropdown: false,
          showContractRoleDropdown: false,
          signerRoleButtonRef: createRef<HTMLButtonElement>(),
          signerRoleDropdownRef: createRef<HTMLDivElement>(),
          contractRoleButtonRef: createRef<HTMLButtonElement>(),
          contractRoleDropdownRef: createRef<HTMLDivElement>(),
        });
      });
    }
    
    console.log('Created recipients from full contract:', recipients);
    
    // Update the appropriate recipient state
    if (isDocuSign) {
      setDocuSignRecipients(recipients);
    } else {
      setRecipients(recipients);
    }
  };

  // Function to create recipients from basic contract data (fallback)
  const createRecipientsFromBasicContract = (contract: any, isDocuSign: boolean) => {
    const parties = contract.parties ? contract.parties.split(' & ').map((p: string) => p.trim()) : [];
    
    const recipients: Recipient[] = parties.map((party: string, index: number) => ({
      name: party,
      email: '', // Will be empty since basic contracts don't have email data
      signerRole: 'Needs to Sign',
      contractRole: index === 0 ? 'Buyer' : index === 1 ? 'Seller' : 'Standard',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: createRef<HTMLDivElement>(),
      contractRoleButtonRef: createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: createRef<HTMLDivElement>(),
    }));
    
    console.log('Created recipients from basic contract:', recipients);
    
    // Update the appropriate recipient state
    if (isDocuSign) {
      setDocuSignRecipients(recipients);
    } else {
      setRecipients(recipients);
    }
  };

  // Function to handle document selection and populate recipients
  const handleDocumentSelection = (docId: string, isDocuSign: boolean = false) => {
    console.log('handleDocumentSelection called with:', { docId, isDocuSign });
    
    // Add/remove document from selection
    if (isDocuSign) {
      setDocuSignSelectedDocuments(prev => {
        console.log('DocuSign previous selection:', prev);
        const newSelection = prev.includes(docId) 
          ? prev.filter(id => id !== docId)
          : [...prev, docId];
        
        console.log('DocuSign new selection:', newSelection);
        
        // If this is the first document being selected, populate recipients
        if (newSelection.length === 1 && !prev.includes(docId)) {
          console.log('Populating DocuSign recipients for first document');
          populateRecipientCardsFromDocument(docId, true);
        }
        
        return newSelection;
      });
    } else {
      setSelectedDocuments(prev => {
        console.log('Escra previous selection:', prev);
        const newSelection = prev.includes(docId) 
          ? prev.filter(id => id !== docId)
          : [...prev, docId];
        
        console.log('Escra new selection:', newSelection);
        
        // Clear document error if documents are selected or uploaded
        if (newSelection.length > 0 || uploadedFiles.length > 0) {
          setDocumentError(false);
        }
        
        // If this is the first document being selected, populate recipients
        if (newSelection.length === 1 && !prev.includes(docId)) {
          console.log('Populating Escra recipients for first document');
          populateRecipientCardsFromDocument(docId, false);
        }
        
        return newSelection;
      });
    }
  };

  // Function to download a stored document
  const downloadDocument = (documentId: string) => {
    const { getDocument } = useDocumentStore.getState();
    const storedDoc = getDocument(documentId);
    
    if (!storedDoc) {
      toast({
        title: "Error",
        description: "Document not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert base64 back to file and trigger download
      const byteCharacters = atob(storedDoc.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: storedDoc.type });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = storedDoc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${storedDoc.name}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download Error",
        description: "Failed to download document.",
        variant: "destructive",
      });
    }
  };

  // Function to download an uploaded file
  const downloadUploadedFile = (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${file.name}`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Error",
        description: "Failed to download file.",
        variant: "destructive",
      });
    }
  };

  // Helper function to generate unique signature ID
  // Helper function to toggle expanded state for recipients in a row
  const toggleRecipientsExpansion = (signatureId: string) => {
    setExpandedRecipientsRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(signatureId)) {
        newSet.delete(signatureId);
      } else {
        newSet.add(signatureId);
      }
      return newSet;
    });
  };

  // Function to reset all modal data
  const resetModalData = () => {
    // Reset form fields
    setDueDate('');
    setSubject('');
    setMessage('');
    setDocuSignSubject('');
    setDocuSignMessage('');
    setSignatureAssignee('');
    
    // Reset file uploads
    setUploadedFiles([]);
    setDocuSignUploadedFiles([]);
    setCustomFileNames({});
    setCustomDocuSignFileNames({});
    setEditingFileName(null);
    setEditingDocuSignFileName(null);
    
    // Reset document selections
    setSelectedDocuments([]);
    setDocuSignSelectedDocuments([]);
    setDocumentSearch('');
    setDocuSignDocumentSearch('');
    
    // Reset recipients
    setRecipients([{
      name: '',
      email: '',
      signerRole: 'Signer Role',
      contractRole: '',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: createRef<HTMLDivElement>(),
      contractRoleButtonRef: createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: createRef<HTMLDivElement>(),
    }]);
    setDocuSignRecipients([{
      name: '',
      email: '',
      signerRole: 'Signer Role',
      contractRole: '',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: createRef<HTMLDivElement>(),
      contractRoleButtonRef: createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: createRef<HTMLDivElement>(),
    }]);
    
    // Reset validation errors
    setRecipientErrors({});
    setDocumentError(false);
    
    // Reset dropdown states
    setShowSignatureAssigneeDropdown(false);
    setShowDocumentDropdown(false);
    setShowDocuSignDocumentDropdown(false);
    setShowUploadDropdown(false);
    setShowDocuSignUploadDropdown(false);
    setShowRecipientRoleDropdown(false);
    setShowContractDropdown(false);
    
    // Reset drag states
    setIsDraggingOver(false);
    setIsDocuSignDraggingOver(false);
  };

  const generateSignatureId = (): string => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Helper function to get document name from selected documents or uploaded files
  const getDocumentName = (): string => {
    if (selectedDocuments.length > 0) {
      const selectedDoc = allDocuments.find(doc => doc.id === selectedDocuments[0]);
      return selectedDoc?.name || 'Unknown Document';
    }
    if (uploadedFiles.length > 0) {
      return uploadedFiles[0].name;
    }
    return 'New Document';
  };

  // Helper function to get contract info from selected document
  const getContractInfo = () => {
    if (selectedDocuments.length > 0) {
      const selectedDoc = allDocuments.find(doc => doc.id === selectedDocuments[0]);
      return {
        contractId: selectedDoc?.contractId || '',
        contract: selectedDoc?.contractName || 'Unknown Contract'
      };
    }
    return {
      contractId: '',
      contract: 'New Contract'
    };
  };

  // Helper function to extract parties from recipients
  const extractPartiesFromRecipients = (): string[] => {
    return recipients
      .filter(recipient => recipient.name && recipient.name.trim() !== '')
      .map(recipient => recipient.name);
  };

  // Helper function to calculate signatures required
  const calculateSignaturesRequired = (): string => {
    const signerRecipients = recipients.filter(recipient => 
      recipient.signerRole && recipient.signerRole !== 'Signer Role'
    );
    return `0 of ${signerRecipients.length}`;
  };

  // Function to create and save new signature request
    const createSignatureRequest = async () => {
    console.log('createSignatureRequest called');
    console.log('Current state:', { dueDate, subject, message, signatureAssignee, recipients, selectedDocuments, uploadedFiles });

    const { contractId, contract } = getContractInfo();

    // Create clean recipients data without React refs
    const cleanRecipients = recipients.map(recipient => ({
      name: recipient.name,
      email: recipient.email,
      signerRole: recipient.signerRole,
      contractRole: recipient.contractRole
    }));

    const newSignatureRequest: SignatureDocument = {
      id: generateSignatureId(),
      document: getDocumentName(),
      parties: extractPartiesFromRecipients(),
      status: 'Pending',
      signatures: calculateSignaturesRequired(),
      contractId: contractId,
      contract: contract,
      assignee: signatureAssignee || currentUserName,
      dateSent: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      message: message,
      subject: subject,
      documentId: selectedDocuments[0] || '',
      recipients: cleanRecipients
    };

    console.log('New signature request:', newSignatureRequest);

    try {
      console.log('Sending API request to /api/signatures');
      // Save to API
      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSignatureRequest),
      });

      console.log('API response status:', response.status);
      const responseData = await response.json();
      console.log('API response data:', responseData);

      if (response.ok) {
        // Add to state
        setSignaturesData(prev => [newSignatureRequest, ...prev]);

        // Show success feedback
        toast({
          title: "Signature request created successfully",
          description: `"${newSignatureRequest.document}" has been sent for signature`,
          duration: 5000,
        });
      } else {
        throw new Error('Failed to save signature request');
      }
    } catch (error) {
      console.error('Error creating signature request:', error);
      toast({
        title: "Error",
        description: "Failed to create signature request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to create DocuSign signature request
  const createDocuSignSignatureRequest = async () => {
    console.log('createDocuSignSignatureRequest called');
    console.log('Current state:', { dueDate, docuSignSubject, docuSignMessage, signatureAssignee, docuSignRecipients, docuSignSelectedDocuments, docuSignUploadedFiles });

    const { contractId, contract } = getContractInfo();

    // Create clean recipients data without React refs
    const cleanRecipients = docuSignRecipients.map(recipient => ({
      name: recipient.name,
      email: recipient.email,
      signerRole: recipient.signerRole,
      contractRole: recipient.contractRole
    }));

    const newSignatureRequest: SignatureDocument = {
      id: generateSignatureId(),
      document: getDocumentName(),
      parties: docuSignRecipients.filter(r => r.name && r.name.trim() !== '').map(r => r.name),
      status: 'Pending',
      signatures: `${docuSignRecipients.filter(r => r.name && r.name.trim() !== '').length} of ${docuSignRecipients.filter(r => r.name && r.name.trim() !== '').length}`,
      contractId: contractId,
      contract: contract,
      assignee: signatureAssignee || currentUserName,
      dateSent: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      message: docuSignMessage,
      subject: docuSignSubject,
      documentId: docuSignSelectedDocuments[0] || '',
      recipients: cleanRecipients
    };

    console.log('New DocuSign signature request:', newSignatureRequest);

    try {
      console.log('Sending API request to /api/signatures');
      // Save to API
      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSignatureRequest),
      });

      console.log('API response status:', response.status);
      const responseData = await response.json();
      console.log('API response data:', responseData);

      if (response.ok) {
        // Add to state
        setSignaturesData(prev => [newSignatureRequest, ...prev]);

        // Show success feedback
        toast({
          title: "DocuSign signature request created successfully",
          description: `"${newSignatureRequest.document}" has been sent to DocuSign for signature`,
          duration: 5000,
        });
      } else {
        throw new Error('Failed to save DocuSign signature request');
      }
    } catch (error) {
      console.error('Error creating DocuSign signature request:', error);
      toast({
        title: "Error",
        description: "Failed to create DocuSign signature request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to delete signature request
  // Function to open PDF viewer
  const openPdfViewer = (documentName: string, signatureId: string) => {
    // Find the signature document to get the actual document ID
    const signatureDoc = signaturesData.find(sig => sig.id === signatureId);
    const actualDocumentId = signatureDoc?.documentId || signatureId;
    
    setSelectedPdf({ 
      name: documentName, 
      url: `/documents/${documentName}`, 
      id: actualDocumentId 
    });
    setShowPdfViewer(true);
  };

  const deleteSignature = async (signatureId: string, documentName: string) => {
    try {
      // Delete the signature from the backend
      const response = await fetch('/api/signatures', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signatureId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete signature from backend');
      }

      // Remove the signature from the signatures array
      setSignaturesData(prev => prev.filter(signature => signature.id !== signatureId));

      // If the deleted signature was selected, clear the selection
      if (selectedDocument && selectedDocument.id === signatureId) {
        setSelectedDocument(null);
      }

      // Show success message with detailed information
      const deletedSignature = signaturesData.find(s => s.id === signatureId);
      toast({
        title: "Signature Request Deleted",
        description: `"${documentName}" (Document ID: ${deletedSignature?.documentId || 'N/A'}, Contract: ${deletedSignature?.contract || 'N/A'}, Contract ID: ${deletedSignature?.contractId || 'N/A'}) has been permanently deleted.`,
      });

    } catch (error) {
      console.error('Error deleting signature:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete signature. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle sign button click - open signature modal
  const handleSign = () => {
    if (!selectedDocument) return;
    setShowSignatureModal(true);
  };

  // Handle signature completion - open confirmation modal
  const handleSignatureComplete = (signature: SignatureValue) => {
    if (!selectedDocument) return;
    
    // Store the captured signature data
    setCapturedSignatureData(signature);
    
    // Close the signature capture modal
    setShowSignatureModal(false);
    
    // Open the confirmation modal
    setShowSignatureConfirmationModal(true);
  };

  // Handle final signature submission
  const handleFinalSignatureSubmit = async () => {
    if (!selectedDocument || !capturedSignatureData) return;
    
    setIsFinalSigning(true);
    
    try {
      // Simulate signing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse current signature count
      const [currentSignatures, totalRequired] = selectedDocument.signatures.split(" of ").map(num => parseInt(num));
      const newSignatureCount = currentSignatures + 1;
      
      // Determine if this completes all required signatures
      const isCompleted = newSignatureCount >= totalRequired;
      
      // Update the signature status
      const updatedSignature = {
        ...selectedDocument,
        status: isCompleted ? "Completed" : "Pending",
        signatures: `${newSignatureCount} of ${totalRequired}`
      };
      
      // Update the signatures data
      setSignaturesData(prev => 
        prev.map(sig => sig.id === selectedDocument.id ? updatedSignature : sig)
      );
      
      // Update the selected document
      setSelectedDocument(updatedSignature);
      
      // Close the confirmation modal
      setShowSignatureConfirmationModal(false);
      
      // Reset captured signature data
      setCapturedSignatureData(null);
      
      // Show appropriate success message
      const message = isCompleted 
        ? `"${selectedDocument.document}" has been signed and completed.`
        : `"${selectedDocument.document}" has been signed. ${totalRequired - newSignatureCount} signature(s) remaining.`;
      
      toast({
        title: isCompleted ? "Document Signed Successfully" : "Signature Added Successfully",
        description: message,
      });
      
    } catch (error) {
      console.error("Error signing document:", error);
      toast({
        title: "Signing Error",
        description: "Failed to sign document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFinalSigning(false);
    }
  };

  // Handle confirmation modal close
  const handleConfirmationModalClose = () => {
    setShowSignatureConfirmationModal(false);
    setCapturedSignatureData(null);
  };

  return (
    <div className="space-y-4 cursor-default select-none">
      {/* Signatures Title and Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 gap-4 cursor-default select-none">
        <div className="cursor-default select-none">
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-1 cursor-default select-none">Signatures</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0 cursor-default select-none">Manage electronic signatures for all your contracts</p>
        </div>
        <button
          onClick={handleRequestSignatureClick}
          className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
          style={{ fontFamily: 'Avenir, sans-serif' }}
        >
          <TbPencilPlus className="mr-2 text-lg" />
          <span className="whitespace-nowrap">Request Signature</span>
        </button>
      </div>

      <hr className="my-3 sm:my-6 border-gray-300 cursor-default select-none" />

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:hidden">
        {/* Signature Filter Tabs */}
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden cursor-default select-none mb-6">
        <div className="flex flex-col gap-2 cursor-default select-none">
          {signatureFilterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSignatureFilterTab(tab)}
              className={`flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 font-medium text-xs shadow-sm whitespace-nowrap transition-all duration-300 ${
                signatureFilterTab === tab 
                  ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 border-2 border-gray-200 dark:border-gray-700' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
              style={{ fontFamily: 'Avenir, sans-serif' }}
            >
              <span className="flex items-center">
                <span className={`inline-block transition-all duration-300 ${signatureFilterTab === tab ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: signatureFilterTab === tab ? 16 : 0}}>
                  {signatureFilterTab === tab && <Logo width={16} height={16} className="pointer-events-none" />}
                </span>
                {tab}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden lg:flex gap-1 cursor-default select-none mb-6">
        {signatureFilterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSignatureFilterTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
              signatureFilterTab === tab 
                ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className={`inline-block transition-all duration-300 ${signatureFilterTab === tab ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: signatureFilterTab === tab ? 16 : 0}}>
              {signatureFilterTab === tab && <Logo width={16} height={16} className="pointer-events-none" />}
            </span>
            {tab}
          </button>
        ))}
      </div>

      {/* Stat Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 cursor-default select-none" style={{ gridTemplateRows: 'minmax(0, 120px)' }}>
        {/* Action Required */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border-2 border-orange-200 dark:border-orange-800 cursor-default select-none">
            <PiWarningDiamondBold size={20} className="text-orange-500 dark:text-orange-400" />
          </div>
          <div className="flex flex-col items-start h-full cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Action Required</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{statBoxesData.actionRequired}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">Needs your attention</p>
            <p className="text-xs invisible cursor-default select-none">placeholder</p>
          </div>
        </div>

        {/* Waiting for Others */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center border-2 border-yellow-200 dark:border-yellow-800 cursor-default select-none">
            <TbClockEdit size={20} className="text-yellow-500 dark:text-yellow-400" />
          </div>
          <div className="flex flex-col items-start h-full cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Waiting on Others</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{signaturesData.filter(sig => sig.status === 'Pending' && sig.signatures.split(' of ')[0] !== '0').length}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">Requires action</p>
            <p className="text-xs invisible cursor-default select-none">placeholder</p>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-200 dark:border-red-800 cursor-default select-none">
            <LuCalendarClock size={20} className="text-red-500 dark:text-red-400" />
          </div>
          <div className="flex flex-col items-start h-full cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Expiring Soon</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{statBoxesData.expiringSoon}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">Within 3 days</p>
            <p className="text-xs invisible cursor-default select-none">placeholder</p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-200 dark:border-green-800 cursor-default select-none">
            <FaRegSquareCheck size={20} className="text-green-500 dark:text-green-400" />
          </div>
          <div className="flex flex-col items-start h-full cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{statBoxesData.completed}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">This month</p>
            <p className="text-xs invisible cursor-default select-none">placeholder</p>
          </div>
        </div>
      </div>

      <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

      {/* Search/Filter Bar - Responsive Design */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-6 mt-2">
        {/* Mobile: Stacked layout */}
        <div className="lg:hidden">
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 w-full">
            <FaSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search documents, recipients, contracts or IDs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium"
              style={{ fontFamily: "Avenir, sans-serif" }}
            />
          </div>
          {/* Filter Buttons - Stacked, full width, visually soothing */}
          <div className="flex flex-col gap-2 mt-2">
            {/* Status Filter */}
            <div className="relative">
              <button 
                ref={mobileStatusButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap" 
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowStatusDropdown(prev => !prev);
                  if (!showStatusDropdown) {
                    setShowSenderDropdown(false);
                    setShowAssigneeDropdown(false);
                    setOpenContractDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><HiOutlineViewBoards className="text-gray-400 text-base mr-2" />Status</span>
                <HiMiniChevronDown className="text-gray-400" size={16} />
              </button>
              {showStatusDropdown && (
                <div ref={mobileStatusDropdownRef} className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                  {availableStatuses.map((status) => (
                    <button
                      key={status}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes(status) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
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
                        // Do NOT close the dropdown here
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
            </div>

            {/* Contract Filter */}
            <div className="relative">
              <button
                ref={mobileContractButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenContractDropdown(prev => !prev);
                  if (!openContractDropdown) {
                    setShowStatusDropdown(false);
                    setShowAssigneeDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><HiOutlineDocumentSearch className="text-gray-400 text-base mr-2" />Contract</span>
                <HiMiniChevronDown className="text-gray-400" size={16} />
              </button>
              {openContractDropdown && (
                <div 
                  ref={mobileContractDropdownRef}
                  className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 min-w-[300px] max-w-[90vw] contract-dropdown" 
                  style={{ 
                    fontFamily: 'Avenir, sans-serif',
                    maxWidth: 'calc(100vw - 2rem)',
                    right: '0',
                    transform: 'translateX(0)'
                  }}
                >
                  {/* Search Bar */}
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search contracts..."
                        value={contractSearch}
                        onChange={(e) => setContractSearch(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                      <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedContracts.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedContracts([]);
                    }}
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
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${selectedContracts.includes(String(contract.id)) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedContracts(prev => {
                            if (prev.includes(String(contract.id))) {
                              return prev.filter(id => id !== contract.id);
                            } else {
                              return [...prev, String(contract.id)];
                            }
                          });
                        }}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                          {selectedContracts.includes(String(contract.id)) && (
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
            </div>

            {/* Sender Filter */}
            <div className="relative">
              <button
                ref={mobileSenderButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSenderDropdown(prev => !prev);
                  if (!showSenderDropdown) {
                    setShowStatusDropdown(false);
                    setOpenContractDropdown(false);
                    setShowAssigneeDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><RiUserSharedLine className="text-gray-400 text-base mr-2" />Sender</span>
                <HiMiniChevronDown className="text-gray-400" size={16} />
              </button>
              {showSenderDropdown && (
                <div 
                  ref={mobileSenderDropdownRef}
                  className="absolute top-full left-0 mt-2 min-w-[180px] w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 sender-dropdown" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  {availableSenders.map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedSender === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSender(option);
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedSender === option && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assignee Filter */}
            <div className="relative">
              <button
                ref={mobileAssigneeButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap" 
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAssigneeDropdown(prev => !prev);
                  if (!showAssigneeDropdown) {
                    setShowStatusDropdown(false);
                    setShowSenderDropdown(false);
                    setOpenContractDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><RiUserSearchLine className="text-gray-400 text-base mr-2" />Assignee</span>
                <HiMiniChevronDown className="text-gray-400" size={16} />
              </button>
              {showAssigneeDropdown && (
                <div ref={mobileAssigneeDropdownRef} className="absolute top-full left-0 mt-2 min-w-[180px] w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
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
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes('__ME__') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
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
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes(assignee) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
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
            </div>

            {/* Last 30 Days Filter */}
            <div className="relative">
              <button 
                ref={mobileRecentlyUpdatedButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap" 
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenRecentlyUpdatedDropdown(prev => !prev);
                  if (!openRecentlyUpdatedDropdown) {
                    setShowStatusDropdown(false);
                    setShowSenderDropdown(false);
                    setShowAssigneeDropdown(false);
                    setOpenContractDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><TbClockPin className="text-gray-400 text-base mr-2" />{selectedRecentlyUpdated}</span>
                <HiMiniChevronDown className="text-gray-400" size={16} />
              </button>
              {openRecentlyUpdatedDropdown && (
                <div 
                  ref={mobileRecentlyUpdatedDropdownRef}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" 
                  style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
                >
                  {availableRecentlyUpdatedOptions.map((option) => (
                    <button
                      key={option}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedRecentlyUpdated === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedRecentlyUpdated(option);
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedRecentlyUpdated === option && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden lg:flex items-center gap-1 cursor-default select-none">
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 flex-1 min-w-0 cursor-default select-none">
            <FaSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search documents, recipients, contracts or IDs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium min-w-0"
              style={{ fontFamily: "Avenir, sans-serif" }}
            />
          </div>
          {/* Filter Buttons - fixed width based on max content */}
          <div className="flex items-center flex-shrink-0 cursor-default select-none">
                    {/* Status Filter */}
            <div className="relative flex-shrink-0">
        <button 
                ref={statusButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowStatusDropdown(prev => !prev);
            if (!showStatusDropdown) {
              setShowSenderDropdown(false);
              setShowAssigneeDropdown(false);
              setOpenContractDropdown(false);
            }
          }}
        >
                <HiOutlineViewBoards className="text-gray-400 w-4 h-4" />
                <span>Status</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
              {showStatusDropdown && (
                <div ref={statusDropdownRef} className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                  {availableStatuses.map((status) => (
                    <button
                      key={status}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes(status) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
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
                        // Do NOT close the dropdown here
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
            </div>
            {/* Contract Filter */}
            <div className="relative flex-shrink-0 ml-1">
              <button
                ref={contractButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenContractDropdown(prev => !prev);
            if (!openContractDropdown) {
              setShowStatusDropdown(false);
              setShowAssigneeDropdown(false);
            }
          }}
              >
                <HiOutlineDocumentSearch className="text-gray-400 w-4 h-4" />
                <span>Contract</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
                        {openContractDropdown && (
            <div 
              ref={contractDropdownRef}
              className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 min-w-[400px] w-96 contract-dropdown" 
              style={{ fontFamily: 'Avenir, sans-serif' }}
            >
                  {/* Search Bar */}
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search contracts..."
                        value={contractSearch}
                        onChange={(e) => setContractSearch(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                      <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedContracts.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedContracts([]);
                    }}
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
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${selectedContracts.includes(String(contract.id)) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedContracts(prev => {
                            if (prev.includes(String(contract.id))) {
                              return prev.filter(id => id !== contract.id);
                            } else {
                              return [...prev, String(contract.id)];
                            }
                          });
                        }}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                          {selectedContracts.includes(String(contract.id)) && (
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
            </div>
                    {/* Sender Filter */}
            <div className="relative flex-shrink-0 ml-1">
          <button
            ref={senderButtonRef}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
            style={{ fontFamily: 'Avenir, sans-serif' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSenderDropdown(prev => !prev);
              if (!showSenderDropdown) {
                setShowStatusDropdown(false);
                setOpenContractDropdown(false);
                setShowAssigneeDropdown(false);
              }
            }}
          >
                <RiUserSharedLine className="text-gray-400 w-4 h-4" />
                <span>Sender</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
                        {showSenderDropdown && (
            <div 
              ref={senderDropdownRef}
              className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 min-w-[200px] sender-dropdown" 
              style={{ fontFamily: 'Avenir, sans-serif' }}
            >
                  {availableSenders.map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedSender === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSender(option);
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedSender === option && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
                    {/* Assignee Filter */}
            <div className="relative flex-shrink-0 ml-1">
        <button
                ref={assigneeButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAssigneeDropdown(prev => !prev);
            if (!showAssigneeDropdown) {
              setShowStatusDropdown(false);
              setShowSenderDropdown(false);
              setOpenContractDropdown(false);
            }
          }}
        >
                <RiUserSearchLine className="text-gray-400 w-4 h-4" />
                <span>Assignee</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
                        {showAssigneeDropdown && (
            <div ref={assigneeDropdownRef} className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
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
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes('__ME__') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
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
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes(assignee) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
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
            </div>
            {/* Last 30 Days Filter */}
            <div className="relative flex-shrink-0 ml-1">
              <button
                ref={recentlyUpdatedButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs w-[160px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenRecentlyUpdatedDropdown(prev => !prev);
                  if (!openRecentlyUpdatedDropdown) {
                    setShowStatusDropdown(false);
                    setOpenContractDropdown(false);
                    setShowAssigneeDropdown(false);
                  }
                }}
              >
                <TbClockPin className="text-gray-400 w-4 h-4" />
                <span>{selectedRecentlyUpdated}</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
              {openRecentlyUpdatedDropdown && (
                <div 
                  ref={recentlyUpdatedDropdownRef}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" 
                  style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
                >
                  {availableRecentlyUpdatedOptions.map((option) => (
                    <button
                      key={option}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedRecentlyUpdated === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedRecentlyUpdated(option);
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedRecentlyUpdated === option && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page content - Tabs and Signature List */}
      <div className="space-y-4 cursor-default select-none">
        {/* White Box Container */}
        <div 
          ref={tableContainerRef}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 cursor-default select-none relative"
        >
          {/* Tabs Row with Divider */}
          <div className="border-b border-gray-200 dark:border-gray-700 cursor-default select-none">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 cursor-default select-none">
            {activeTab === 'inbox' ? (
              <>
                <button
                  className={clsx(
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
                    inboxTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setInboxTab('all')}
                >
                  All
                </button>
                <button
                  className={clsx(
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
                    inboxTab === 'received' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setInboxTab('received')}
                >
                  Received
                </button>
                <button
                  className={clsx(
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
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
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
                    cancelledTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setCancelledTab('all')}
                >
                  All
                </button>
                <button
                  className={clsx(
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
                    cancelledTab === 'rejected' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setCancelledTab('rejected')}
                >
                  Rejected
                </button>
                <button
                  className={clsx(
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
                    cancelledTab === 'voided' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setCancelledTab('voided')}
                >
                  Voided
                </button>
                <button
                  className={clsx(
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
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
                    "pb-3 sm:pb-2 border-b-2 text-sm font-bold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
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
                    "pb-2 border-b-2 text-sm font-semibold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
                    pendingTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setPendingTab('all')}
                >
                  All
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm font-semibold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
                    pendingTab === 'waiting' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={() => setPendingTab('waiting')}
                >
                  Waiting for Others
                </button>
                <button
                  className={clsx(
                    "pb-2 border-b-2 text-sm font-semibold transition-colors duration-200",
                    "w-full sm:w-auto text-center sm:text-left px-4 py-2 sm:px-0 sm:py-0",
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
          </div>

          {/* Signature List Content based on Active Tab */}
          <div className="mt-4">
            <div style={{ height: `calc(${visibleRows} * 3.5rem + 3rem)`, minHeight: '300px' }} className="relative overflow-x-auto overflow-y-auto mt-4 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '100px' }}
                      onClick={handleIdSort}
                    >
                      Document ID
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" 
                      style={{ minWidth: '200px' }}
                      onClick={handleDocumentSort}
                    >
                      Document
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '187px' }}>Recipients</th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleStatusSort}
                    >
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Signatures</th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleContractIdSort}
                    >
                      Contract ID
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" 
                      style={{ minWidth: '200px' }}
                      onClick={handleContractSort}
                    >
                      Contract
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" 
                      style={{ minWidth: '120px' }}
                      onClick={handleAssigneeSort}
                    >
                      Assignee
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleDateSentSort}
                    >
                      Date Sent
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" 
                      style={{ minWidth: '120px' }}
                      onClick={handleDueDateSort}
                    >
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRows.map((row) => {
                    return (
                      <tr 
                        key={row.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" 
                        onClick={() => {
                          console.log('Row data being passed to modal:', row);
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
                            dueDate: row.dueDate,
                            documentId: row.documentId,
                            message: row.message,
                            subject: row.subject,
                            recipients: row.recipients
                          });
                        }}
                      >
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                          <span className="text-primary underline font-semibold cursor-pointer">{row.documentId || row.id}</span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                          <div className="text-xs font-bold text-gray-900 dark:text-white">{row.document}</div>
                        </td>
                        <td className="px-6 py-2.5 text-xs">
                          {(() => {
                            const parties = row.parties;
                            const isExpanded = expandedRecipientsRows.has(row.id);
                            const hasMoreThanTwo = parties.length > 2;
                            
                            return (
                              <div className="flex flex-col space-y-1">
                                {/* Show first 2 parties always */}
                                {parties.slice(0, 2).map((party, index) => (
                                  <div key={index} className="text-gray-900 dark:text-white">{party}</div>
                                ))}
                                
                                {/* Show additional parties if expanded */}
                                {isExpanded && parties.slice(2).map((party, index) => (
                                  <div key={index + 2} className="text-gray-900 dark:text-white">{party}</div>
                                ))}
                                
                                {/* Show chevron and expand/collapse button if more than 2 parties */}
                                {hasMoreThanTwo && (
                                  <button
                                    className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleRecipientsExpansion(row.id);
                                    }}
                                  >
                                    <HiMiniChevronDown 
                                      size={14} 
                                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                    <span className="ml-1 text-xs">
                                      {isExpanded ? 'Show less' : `+${parties.length - 2} more`}
                                    </span>
                                  </button>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                          <span className={clsx(
                            "inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full border",
                            getStatusBadgeStyle(row.status)
                          )}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-500 dark:text-gray-400">{row.signatures}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                          <span className="text-primary underline font-semibold cursor-pointer">{row.contractId}</span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                          <div className="text-xs font-bold text-gray-900 dark:text-white">{row.contract}</div>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                          <div className="text-xs text-gray-900 dark:text-white">{row.assignee}</div>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-500 dark:text-gray-400">{row.dateSent}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-500 dark:text-gray-400">{row.dueDate}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button 
                              className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openPdfViewer(row.document, row.id);
                              }}
                            >
                              <HiOutlineEye className="text-sm sm:text-base transition-colors" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                View
                              </span>
                            </button>
                            <button 
                              className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add send reminder action here
                              }}
                            >
                              <LuBellRing className="text-sm sm:text-base transition-colors" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Send Reminder
                              </span>
                            </button>
                            <button 
                              className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add download action here
                              }}
                            >
                              <HiOutlineDownload className="text-sm sm:text-base transition-colors" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Download
                              </span>
                            </button>
                            <button 
                              className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteSignature(row.id, row.document);
                              }}
                            >
                              <MdCancelPresentation className="text-sm sm:text-base transition-colors" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Void
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Results Bar */}
            <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  Showing {Math.min(visibleRows, filteredRows.length)} of {filteredRows.length} results.
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                    <div className="relative">
                      <select 
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                        <HiChevronDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    Page 1 of 1
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 cursor-not-allowed">
                      <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 cursor-not-allowed">
                      <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                    </button>
                    <button className="p-1 text-gray-400 cursor-not-allowed">
                      <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                    </button>
                    <button className="p-1 text-gray-400 cursor-not-allowed">
                      <HiOutlineChevronDoubleRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resize Handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity z-10"
              onMouseDown={handleResizeStart}
              style={{ cursor: isResizing ? 'nw-resize' : 'nw-resize' }}
            />
          </div>
        </div>
      </div>

      {/* Signature Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2 sm:p-4 cursor-default select-none">
          <div className="relative bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[1400px] max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden cursor-default select-none">
            {/* Sticky Header with Document ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-4 cursor-default select-none">
              <div className="flex items-start justify-between cursor-default select-none">
                {/* Left: Document ID and Status */}
                <div className="flex-1 min-w-0 cursor-default select-none">
                  <div className="flex items-center gap-2 sm:gap-4 mb-4 cursor-default select-none">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary cursor-default select-none">
                      # {selectedDocument?.documentId || selectedDocument?.id}
                    </span>
                  </div>
                </div>
                {/* Right: Close Button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-2 sm:ml-4 mt-1 cursor-pointer"
                  onClick={() => setSelectedDocument(null)}
                  aria-label="Close"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0 cursor-default select-none">
              <div className="overflow-y-auto p-4 sm:p-6 flex-1 bg-gray-50 dark:bg-gray-900 cursor-default select-none">
                {/* Modal Content Grid: 2 columns on desktop, 1 column on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full h-full min-h-0 -mt-2 items-stretch cursor-default select-none">
                  {/* LEFT COLUMN: Document Details */}
                  <div className="flex flex-col gap-4 sm:gap-6 w-full cursor-default select-none">
                    {/* Document Details Box */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 w-full h-full cursor-default select-none">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Document Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-x-12 gap-y-4 cursor-default select-none">
                        {/* Row 1: Document ID, Document Hash, and Contract ID */}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Document ID</div>
                          <div className="text-xs text-black dark:text-white select-none cursor-default">{selectedDocument?.documentId || selectedDocument?.id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Document Chain ID</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 dark:text-white truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-default select-none"
                              style={{ maxWidth: '120px' }}
                                                                            title={selectedDocument && selectedDocument.documentId ? getDocumentChainId(selectedDocument.documentId) : ''}
                            >
                              {selectedDocument && selectedDocument.documentId ? getDocumentChainId(selectedDocument.documentId) : ''}
                            </span>
                            <div className="relative">
                              <button 
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                                onClick={() => {
                                  if (selectedDocument) {
                                    navigator.clipboard.writeText(getDocumentChainId(selectedDocument.documentId || ''));
                                    setCopiedDocumentId(selectedDocument.documentId || '');
                                    setTimeout(() => setCopiedDocumentId(null), 1500);
                                  }
                                }}
                                onMouseEnter={() => selectedDocument && setHoveredDocumentId(selectedDocument.documentId || '')}
                                onMouseLeave={() => setHoveredDocumentId(null)}
                                aria-label="Copy document chain ID"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedDocumentId === selectedDocument?.documentId && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                  Copied!
                                </div>
                              )}
                              {hoveredDocumentId === selectedDocument?.documentId && copiedDocumentId !== selectedDocument?.documentId && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Contract ID</div>
                          <div className="text-xs text-black dark:text-white select-none cursor-default">{selectedDocument?.contractId}</div>
                        </div>
                        {/* Row 2: Document Name and Contract Name */}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Document Name</div>
                          <div className="text-xs text-black dark:text-white select-none cursor-default">{selectedDocument?.document}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Smart Contract Chain ID</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 dark:text-white truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-default select-none"
                              style={{ maxWidth: '120px' }}
                              title={selectedDocument ? getSmartContractChainId(selectedDocument.contractId) : ''}
                            >
                              {selectedDocument ? getSmartContractChainId(selectedDocument.contractId) : ''}
                            </span>
                            <div className="relative">
                              <button 
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                                onClick={() => {
                                  if (selectedDocument) {
                                    navigator.clipboard.writeText(getSmartContractChainId(selectedDocument.contractId));
                                    setCopiedDocumentId(selectedDocument.contractId);
                                    setTimeout(() => setCopiedDocumentId(null), 1500);
                                  }
                                }}
                                onMouseEnter={() => selectedDocument && setHoveredDocumentId(selectedDocument.contractId)}
                                onMouseLeave={() => setHoveredDocumentId(null)}
                                aria-label="Copy smart contract chain ID"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedDocumentId === selectedDocument?.contractId && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                  Copied!
                                </div>
                              )}
                              {hoveredDocumentId === selectedDocument?.contractId && copiedDocumentId !== selectedDocument?.contractId && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Contract Name</div>
                          <div className="text-xs text-black dark:text-white select-none cursor-default">{selectedDocument?.contract}</div>
                        </div>
                        {/* Subject Field */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Subject</div>
                          <div className="w-full px-4 py-2 text-xs font-medium text-black dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900">
                            {selectedDocument?.subject || 'No subject provided'}
                          </div>
                        </div>
                        {/* Message Field */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Message</div>
                          <div className="w-full min-h-24 px-4 py-2 text-xs font-medium text-black dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900">
                            {selectedDocument?.message || 'Please review and sign the attached document at your earliest convenience. This document requires your signature to proceed with the transaction.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Signature Details */}
                  <div className="flex flex-col gap-4 sm:gap-6 w-full cursor-default select-none">
                    {/* Signature Details Box */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 w-full h-full cursor-default select-none">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Signature Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 gap-y-4 cursor-default select-none">
                        {/* Row 1: Parties and Signatures */}
                        <div className="col-span-1 sm:col-span-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-x-12">
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Parties</div>
                              <div className="text-xs text-black dark:text-white select-none cursor-default mb-4">
                                {selectedDocument?.parties.map((party, idx) => (
                                  <div key={idx}>{party}</div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Signatures</div>
                              <div className="text-xs text-black dark:text-white select-none cursor-default mb-4 flex flex-col gap-2">
                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                            <div className="hidden sm:block"></div>
                          </div>
                        </div>
                        {/* Row 2: Status */}
                        <div className="col-span-1 sm:col-span-2">
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Status</div>
                          <span className={clsx(
                            "inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs cursor-default select-none border",
                            selectedDocument?.status ? getStatusBadgeStyle(selectedDocument.status) : getStatusBadgeStyle('')
                          )}>{selectedDocument?.status}</span>
                        </div>
                        {/* Row 3: Due Date, Last Reminder Date, and Date Sent */}
                        <div className="col-span-1 sm:col-span-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-x-12">
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Due Date</div>
                              <div className="text-xs text-black dark:text-white select-none cursor-default mb-4">{selectedDocument?.dueDate}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Last Reminder Date</div>
                              <div className="text-xs text-black dark:text-white select-none cursor-default mb-4"></div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Date Sent</div>
                              <div className="text-xs text-black dark:text-white select-none cursor-default mb-4">{selectedDocument?.dateSent}</div>
                            </div>
                          </div>
                        </div>
                        {/* Row 4: Assignee */}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Assignee</div>
                          <div className="text-xs text-black dark:text-white select-none cursor-default mb-4">{selectedDocument?.assignee}</div>
                        </div>
                        <div className="hidden sm:block"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recipients Box - New Section */}
                <div className="col-span-1 lg:col-span-2 mt-4 sm:mt-6">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 w-full cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Recipients</h3>
                    <div className="w-full cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      {/* Mobile: Card-based layout */}
                      <div className="lg:hidden space-y-3">
                        {selectedDocument?.recipients?.map((recipient, idx) => (
                          <div key={recipient.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="text-center font-semibold text-sm bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                                {idx + 1}
                              </div>
                                                              <div className="h-5 w-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                                </div>
                              <div className="font-bold text-sm text-gray-900 dark:text-white">{recipient.name}</div>
                            </div>
                                                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                  <div className="text-gray-700 dark:text-gray-300">{recipient.email}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                                  <div className="font-semibold text-primary">Pending</div>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Date/Time:</span>
                                  <div className="text-gray-700 dark:text-gray-300">--</div>
                                </div>
                              </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Desktop: Original table layout */}
                      <div className="hidden lg:block">
                        <div className="grid grid-cols-[40px_40px_1.5fr_2fr_1fr_1.5fr] gap-2 px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          <div className="text-center">#</div>
                          <div></div>
                          <div className="text-left">Name</div>
                          <div className="text-left">Email</div>
                          <div className="text-left">Status</div>
                          <div className="text-left">Date/Time</div>
                        </div>
                        {/* Recipients Data */}
                        {selectedDocument?.recipients?.map((recipient, idx) => (
                          <div key={recipient.name} className="grid grid-cols-[40px_40px_1.5fr_2fr_1fr_1.5fr] gap-2 items-center px-2 py-4 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            <div className="text-center font-semibold">{idx + 1}</div>
                                                          <div className="flex justify-center items-center">
                                <div className="h-5 w-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                                </div>
                              </div>
                            <div className="font-bold">{recipient.name}</div>
                            <div className="text-gray-500 dark:text-gray-400">{recipient.email}</div>
                            <div className="font-semibold text-primary flex items-center justify-start">
                              <span>Pending</span>
                            </div>
                            <div className="text-gray-700 dark:text-gray-300">--</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sign Button - Bottom of Modal */}
            <div className="flex justify-end pt-0 pb-6 px-6 mt-0 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={handleSign}
                disabled={selectedDocument?.status === 'Completed' || selectedDocument?.status === 'Rejected' || selectedDocument?.status === 'Expired' || selectedDocument?.status === 'Voided'}
                className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                <TbPencilShare className="mr-2 text-lg" />
                <span className="whitespace-nowrap">Sign</span>
              </button>
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
              className="flex flex-col items-center border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 w-48 sm:w-64 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow focus:outline-none"
              onClick={() => {
                setShowToolSelectorModal(false);
                setShowRequestSignatureModal(true);
              }}
            >
              <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <img 
                  src="/assets/logos/escra-logo-teal.png" 
                  alt="Escra Logo" 
                  className="w-6 h-6 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <div className="text-sm sm:text-lg font-semibold mb-1 text-gray-900 dark:text-white">Escra</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Native signature solution with blockchain security</div>
              <span className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400 px-2 sm:px-3 py-1 rounded-full font-semibold">Recommended</span>
            </button>
            {/* DocuSign */}
            <button
              className="flex flex-col items-center border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 w-48 sm:w-64 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow focus:outline-none"
              onClick={() => {
                setShowToolSelectorModal(false);
                setShowDocuSignModal(true);
              }}
            >
              <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <FaDochub className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400 transform translate-x-[2px]" />
              </div>
              <div className="text-sm sm:text-lg font-semibold mb-1 text-gray-900 dark:text-white">DocuSign</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
                Industry-leading<br />
                e-signature platform
              </div>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full font-semibold">External</span>
            </button>
            {/* Adobe Sign */}
            <button
              className="flex flex-col items-center border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 w-48 sm:w-64 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow focus:outline-none"
              onClick={() => {
                setShowToolSelectorModal(false);
                // TODO: Add Adobe Sign logic here
              }}
            >
              <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <SiAdobe className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 dark:text-red-400" />
              </div>
              <div className="text-sm sm:text-lg font-semibold mb-1 text-gray-900 dark:text-white">Adobe Sign</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
                Professional<br />
                PDF Signing Solution
              </div>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full font-semibold">External</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Request Signature Modal */}
      {showRequestSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4">
              <div className="flex items-start justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Request Signature</h2>
                <button
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full ml-4 mt-1"
                    onClick={() => { 
                      setShowRequestSignatureModal(false); 
                      resetModalData();
                    }}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-6 flex-1 bg-gray-50 dark:bg-gray-900 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                <form onSubmit={async (e) => { 
                  e.preventDefault(); 
                  
                  // Validate recipients before proceeding
                  if (!validateRecipients()) {
                    return;
                  }
                  
                  // Close the current modal and open document preparation modal
                  setShowRequestSignatureModal(false);
                  setShowDocumentPreparationModal(true);
                }}>
                  <div className="space-y-6">
                    {/* Two Column Layout for Documents */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column: Add Documents Box */}
                    <div 
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 relative"
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
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 relative z-10" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Documents</h3>
                        
                        {/* Upload interface - always visible */}
                      <div className="flex flex-col items-center mb-4">
                          <div className="h-11 w-11 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800 mb-2">
                            <HiOutlineDocumentText size={22} className="text-teal-500 dark:text-teal-400" />
                        </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Drop your files here or...</div>
                        {isDraggingOver && (
                          <div className="absolute inset-x-0 flex flex-col items-center justify-center" style={{ top: '0', height: '100%' }}>
                            <div className="h-full w-full flex flex-col items-center justify-center bg-white/95 dark:bg-gray-800/95 rounded-lg" style={{ marginTop: '1px' }}>
                              <div className="-mt-4">
                                <div className="h-11 w-11 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800 mb-1.5 mx-auto">
                                  <HiOutlineUpload size={22} className="text-teal-500 dark:text-teal-400" />
                                </div>
                                <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  Supported Formats: PDF, DOC, DOCX, OR JPG (max. 10 MB each)
                                </div>
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
                              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs font-semibold border border-transparent"
                          >
                            Select
                            <HiMiniChevronDown size={17} className="text-white -mt-[1px]" />
                          </button>
                          {showDocumentDropdown && (
                              <div className="absolute z-50 mt-1 w-[300px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                              <div className="p-2">
                                <input
                                  type="text"
                                  placeholder="Search documents..."
                                  value={documentSearch}
                                  onChange={(e) => setDocumentSearch(e.target.value)}
                                    className="w-full px-3 py-2 text-xs border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                                {filteredDocuments.map((doc) => (
                                  <button
                                    key={doc.id}
                                      onClick={(e) => handleDocumentItemClick(e, doc.id)}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    <div className="flex items-center">
                                        <div className={`w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center ${selectedDocuments.includes(doc.id) ? 'bg-primary' : 'border border-gray-300'}`}>
                                        {selectedDocuments.includes(doc.id) && (
                                            <FaCheck className="text-white" size={8} />
                                        )}
                                      </div>
                                        <span 
                                          className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]"
                                          title={doc.name}
                                        >
                                          {doc.name}
                                        </span>
                                    </div>
                                      <div className="ml-6 text-gray-500 dark:text-gray-400 text-[10px]">{doc.contractName} ({doc.contractId})</div>
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
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            <HiOutlineUpload className="text-base text-primary" /> Upload
                          </button>
                          {showUploadDropdown && (
                              <div className="absolute z-50 mt-1 w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="py-2">
                                  <label htmlFor="file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer">
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
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <SiBox className="text-base text-primary" />
                                  <span className="text-xs">Box</span>
                                </button>
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <SlSocialDropbox className="text-base text-primary" />
                                  <span className="text-xs">Dropbox</span>
                                </button>
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <TbBrandGoogleDrive className="text-base text-primary" />
                                  <span className="text-xs">Google Drive</span>
                                </button>
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <TbBrandOnedrive className="text-base text-primary" />
                                  <span className="text-xs">OneDrive</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {documentError && (
                        <div className="flex justify-center mt-2">
                          <p className="text-xs text-red-600 font-medium cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            Select an existing or upload a new document
                          </p>
                        </div>
                      )}
                      </div>

                      {/* Right Column: Documents Box */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Documents</h3>
                        
                        {/* Show document thumbnails when documents are selected */}
                        {(selectedDocuments.length > 0 || uploadedFiles.length > 0) ? (
                          <div className="space-y-3">
                            {/* Selected Documents */}
                          {selectedDocuments.map(docId => {
                            const doc = allDocuments.find(d => d.id === docId);
                            return doc ? (
                                <div key={docId} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center gap-3">
                                    <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                                    <div className="flex-1 min-w-0">
                                      <div 
                                        className="font-semibold text-xs text-black dark:text-white truncate max-w-[140px]"
                                        title={doc.name}
                                      >
                                        {doc.name}
                                      </div>
                                      <div className="text-xs text-gray-500">{doc.dateUploaded} &bull; {doc.type} &bull; {doc.size}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <button type="button" className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group">
                                      <HiOutlineEye className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        View
                                      </span>
                                    </button>
                                    <button 
                                      type="button"
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Check if this is a stored document 
                                        // (ID >= 8000 or old format with 'doc_' prefix indicates stored document)
                                        const docIdNum = parseInt(doc.id);
                                        if (docIdNum >= 8000 || doc.id.startsWith('doc_')) {
                                          downloadDocument(doc.id);
                                        } else {
                                          // Handle sample document download (placeholder)
                                          toast({
                                            title: "Download",
                                            description: `Downloading ${doc.name}`,
                                          });
                                        }
                                      }}
                                    >
                                      <HiOutlineDownload className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Download
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedDocuments(prev => prev.filter(id => id !== docId));
                                        // Clear all recipient cards and reset first card when documents are removed
                                        setRecipients([{
                                          name: '',
                                          email: '',
                                          signerRole: 'Signer Role',
                                          contractRole: 'Contract Role',
                                          showSignerRoleDropdown: false,
                                          showContractRoleDropdown: false,
                                          signerRoleButtonRef: createRef<HTMLButtonElement>(),
                                          signerRoleDropdownRef: createRef<HTMLDivElement>(),
                                          contractRoleButtonRef: createRef<HTMLButtonElement>(),
                                          contractRoleDropdownRef: createRef<HTMLDivElement>(),
                                        }]);
                                      }}
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group"
                                    >
                                      <HiOutlineTrash className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Delete
                                      </span>
                                    </button>
                                  </div>
                                </div>
                            ) : null;
                          })}
                            
                            {/* Uploaded Files */}
                            {uploadedFiles.map((file, idx) => {
                              const fileKey = getFileKey(file, idx);
                              const isEditing = editingFileName === fileKey;
                              const displayName = getDisplayFileName(file, idx);
                              const associatedContract = uploadedFileContracts[fileKey];
                              const associatedAssignee = uploadedFileAssignees[fileKey];
                              
                              return (
                                <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center gap-3">
                                    <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                                    <div className="flex-1 min-w-0">
                                      {isEditing ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => {
                                              const fileKey = getFileKey(file, idx);
                                              setCustomFileNames(prev => ({ ...prev, [fileKey]: e.target.value }));
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleSaveFileName(file, idx, displayName);
                                              } else if (e.key === 'Escape') {
                                                handleCancelFileNameEdit();
                                              }
                                            }}
                                            onBlur={() => handleSaveFileName(file, idx, displayName)}
                                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            style={{ fontFamily: 'Avenir, sans-serif' }}
                                            autoFocus
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleSaveFileName(file, idx, displayName)}
                                            className="text-green-800 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-1"
                                          >
                                            <FaCheck className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleCancelFileNameEdit()}
                                            className="text-red-500 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 p-1"
                                          >
                                            <FaTimes className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 group">
                                          <div 
                                            className="font-semibold text-xs text-black dark:text-white cursor-pointer hover:text-primary transition-colors flex-1 min-w-0 truncate max-w-[140px]"
                                            onClick={() => handleStartEditFileName(file, idx)}
                                            title={`${displayName} - Click to edit name`}
                                          >
                                            {displayName}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleStartEditFileName(file, idx)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-all p-1 flex-shrink-0"
                                          >
                                            <LuPen className="w-3 h-3" />
                                          </button>
                                        </div>
                                      )}
                                      <div className="text-xs text-gray-500">{file.type} &bull; {(file.size / 1024 / 1024).toFixed(1)} MB</div>
                                      {associatedContract && (
                                        <div className="text-xs text-primary font-medium mt-1">
                                          {mockContracts.find(c => c.id === associatedContract)?.id} - {mockContracts.find(c => c.id === associatedContract)?.title || associatedContract}
                                        </div>
                                      )}
                                      {associatedAssignee && (
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                          Assignee: {associatedAssignee}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <button type="button" className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group">
                                      <HiOutlineEye className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        View
                                      </span>
                                    </button>
                                    <button 
                                      type="button"
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        downloadUploadedFile(file);
                                      }}
                                    >
                                      <HiOutlineDownload className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Download
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group"
                                    >
                                      <HiOutlineTrash className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Delete
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                            <HiOutlineDocumentText size={32} className="mb-2" />
                            <p className="text-sm">No documents selected</p>
                            <p className="text-xs">Select or upload documents from the left panel</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add Recipients Box */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Recipients</h3>
                      <div className="space-y-4">
                        {/* I am the only signer checkbox */}
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => {
                            const newValue = !isOnlySigner;
                            setIsOnlySigner(newValue);
                          }}>
                            {isOnlySigner && (
                              <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                <FaCheck className="text-white" size={10} />
                              </div>
                            )}
                          </div>
                          <label 
                            className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                            onClick={() => {
                              const newValue = !isOnlySigner;
                              setIsOnlySigner(newValue);
                            }}
                          >
                            I am the only signer
                          </label>
                        </div>
                        
                        {/* Set signing order checkbox */}
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => {
                            const newValue = !setSigningOrder;
                            setSetSigningOrder(newValue);
                          }}>
                            {setSigningOrder && (
                              <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                <FaCheck className="text-white" size={10} />
                              </div>
                            )}
                          </div>
                          <label 
                            className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                            onClick={() => {
                              const newValue = !setSigningOrder;
                              setSetSigningOrder(newValue);
                            }}
                          >
                            Set signing order
                          </label>
                        </div>
                        
                        {/* Render all recipient cards */}
                        {recipients.map((recipient, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            {/* Signing order number field */}
                            {setSigningOrder && (
                              <div className="flex-shrink-0 mt-4">
                                <input
                                  type="number"
                                  min="1"
                                  max={recipients.length}
                                  className="w-12 h-8 text-center border border-gray-300 rounded text-xs font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                  value={idx + 1}
                                  onChange={(e) => {
                                    // Handle signing order change logic here
                                  }}
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                />
                              </div>
                            )}
                            <div className="flex-1 relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm" style={{ borderLeft: `3px solid ${getSignatureCardBorderColor(idx, false)}` }}>
                            {/* Header with role controls and delete button */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                              <div className="flex flex-col sm:flex-row gap-1">
                                {/* Role selection button */}
                                <div className="relative">
                                  <button
                                    ref={recipient.signerRoleButtonRef}
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white border border-gray-200 dark:border-transparent bg-primary rounded-md hover:bg-primary-dark transition-colors"
                                    onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showSignerRoleDropdown: !r.showSignerRoleDropdown } : r))}
                                    tabIndex={0}
                                  >
                                    <LuPen className="w-3 h-3 text-white" />
                                    <span>{recipient.signerRole || 'Signer Role'}</span>
                                    <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px] text-white" />
                                  </button>
                                  {recipient.showSignerRoleDropdown && (
                                    <div
                                      ref={recipient.signerRoleDropdownRef}
                                      className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                      {['Needs to Sign', 'In Person Signer', 'Receives a Copy', 'Needs to View'].map((role) => (
                                        <button
                                          key={role}
                                          className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${recipient.signerRole === role ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                          style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                          onClick={() => {
                                            setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, signerRole: role, showSignerRoleDropdown: false } : r));
                                            setRecipientErrors(prev => ({ ...prev, [`signerRole-${idx}`]: false }));
                                          }}
                                        >
                                          {role}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  {recipientErrors[`signerRole-${idx}`] && (
                                    <p className="text-red-600 text-xs mt-1.5" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                      Select signer role
                                    </p>
                                  )}
                                </div>
                                
                                {/* Contract Role button */}
                                <div className="relative">
                                  <button
                                    ref={recipient.contractRoleButtonRef}
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white border border-gray-200 dark:border-transparent bg-primary rounded-md hover:bg-primary-dark transition-colors whitespace-nowrap"
                                    onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: !r.showContractRoleDropdown } : r))}
                                    tabIndex={0}
                                  >
                                    <span>{recipient.contractRole || 'Contract Role'}</span>
                                    <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px] text-white" />
                                  </button>
                                  {recipient.showContractRoleDropdown && (
                                    <div
                                      ref={recipient.contractRoleDropdownRef}
                                      className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                      {['Standard', 'Buyer', 'Seller', 'Buyer Agent', 'Seller Agent', 'Closing Agent', 'Inspector', 'Appraiser'].map((role) => (
                                        <button
                                          key={role}
                                          className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${recipient.contractRole === role ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                          style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                          onClick={() => {
                                            setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, contractRole: role, showContractRoleDropdown: false } : r));
                                            setRecipientErrors(prev => ({ ...prev, [`contractRole-${idx}`]: false }));
                                          }}
                                        >
                                          {role}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  {recipientErrors[`contractRole-${idx}`] && (
                                    <p className="text-red-600 text-xs mt-1.5" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                      Select contract role
                                    </p>
                                  )}
                                </div>
                                
                                {/* Customize button */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 border border-gray-200 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
                                    tabIndex={0}
                                  >
                                    <span>Customize</span>
                                    <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px]" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Clear and Delete buttons */}
                              <div className="flex items-center gap-1">
                                <button 
                                  className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, name: '', email: '' } : r));
                                  }}
                                >
                                  <LuEraser className="w-4 h-4" />
                                </button>
                                <button 
                                  className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteRecipient(idx);
                                  }} 
                                  disabled={recipients.length === 1}
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                  </button>
                                </div>
                            </div>
                            
                            {/* Form fields */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  Name <span className="text-primary">*</span>
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                  </span>
                                  <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                    placeholder="Enter recipient's name..."
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    value={recipient.name}
                                    onChange={e => {
                                      setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, name: e.target.value } : r));
                                      setRecipientErrors(prev => ({ ...prev, [`name-${idx}`]: false }));
                                    }}
                                  />
                                </div>
                                {recipientErrors[`name-${idx}`] && (
                                  <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Name is required
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  Email <span className="text-primary">*</span>
                                </label>
                                <input
                                  type="email"
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                  placeholder="Enter recipient's email address..."
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                  value={recipient.email}
                                  onChange={e => {
                                    setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, email: e.target.value } : r));
                                    setRecipientErrors(prev => ({ ...prev, [`email-${idx}`]: false }));
                                  }}
                                />
                                {recipientErrors[`email-${idx}`] && (
                                  <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Email is required
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors cursor-pointer mt-2"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                          onClick={handleAddRecipient}
                        >
                          <TiUserAddOutline className="text-base sm:text-lg text-primary dark:text-white" />
                          <span className="mt-[1px]">Add Recipient</span>
                        </button>
                      </div>
                    </div>

                    {/* Signature Details Box */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Signature Details</h3>
                      
                      <div className="space-y-4">
                        {/* Assignee and Due Date Row */}
                        <div className="flex gap-4">
                          {/* Assignee Field */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee <span className="text-red-500">*</span></div>
                            <div className="relative" style={{ width: '200px', minWidth: '200px' }} ref={signatureAssigneeDropdownRef}>
                              <input
                                type="text"
                                className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                                placeholder="Choose an assignee..."
                                value={signatureAssignee}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  if (newValue.length < signatureAssignee.length) {
                                    // If the new value is shorter (backspace was pressed), clear the entire field
                                    setSignatureAssignee('');
                                  } else {
                                    setSignatureAssignee(newValue);
                                  }
                                }}
                                onClick={() => {
                                  if (showSignatureAssigneeDropdown) {
                                    setShowSignatureAssigneeDropdown(false);
                                  } else {
                                    setShowSignatureAssigneeDropdown(true);
                                  }
                                }}
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                autoComplete="off"
                              />
                              <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              
                              {showSignatureAssigneeDropdown && (
                                <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none w-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  {allAssignees.length > 0 ? (
                                    <>
                                      {allAssignees.map((assignee: string) => (
                                        <div
                                          key={assignee}
                                          className={`px-4 py-2 text-xs cursor-pointer ${signatureAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                          onClick={() => {
                                            setSignatureAssignee(assignee);
                                            setShowSignatureAssigneeDropdown(false);
                                          }}
                                        >
                                          {assignee}
                                        </div>
                                      ))}
                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                      <div
                                        className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                        onClick={() => {
                                          // TODO: Add logic to create new assignee
                                          setShowSignatureAssigneeDropdown(false);
                                        }}
                                      >
                                        <FaPlus className="text-xs" />
                                        Add new assignee
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">No assignees found</div>
                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                      <div
                                        className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                        onClick={() => {
                                          // TODO: Add logic to create new assignee
                                          setShowSignatureAssigneeDropdown(false);
                                        }}
                                      >
                                        <FaPlus className="text-xs" />
                                        Add new assignee
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Due Date Field */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date <span className="text-red-500">*</span></div>
                            <div className="relative flex items-center" style={{ width: '200px', minWidth: '200px' }}>
                              <input
                                type="date"
                                className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-black dark:text-white bg-white dark:bg-gray-900 [&::-webkit-calendar-picker-indicator]:hidden"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace') {
                                    e.preventDefault();
                                    e.currentTarget.value = '';
                                    setDueDate('');
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => (document.querySelector('input[type="date"]') as HTMLInputElement)?.showPicker()}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                              >
                                <LuCalendarFold className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>



                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => { 
                          setShowRequestSignatureModal(false); 
                          setUploadedFiles([]); 
                          setSelectedDocuments([]); 
                          setRecipients([{
                            name: '',
                            email: '',
                            signerRole: 'Signer Role',
                            contractRole: '',
                            showSignerRoleDropdown: false,
                            showContractRoleDropdown: false,
                            signerRoleButtonRef: createRef<HTMLButtonElement>(),
                            signerRoleDropdownRef: createRef<HTMLDivElement>(),
                            contractRoleButtonRef: createRef<HTMLButtonElement>(),
                            contractRoleDropdownRef: createRef<HTMLDivElement>(),
                          }]);
                          setIsOnlySigner(false);
                          setSetSigningOrder(false);
                          setEditingFileName(null);
                          setShowDocumentDropdown(false);
                          setDocumentSearch('');
                          setIsDraggingOver(false);
                          setDueDate('');
                          setSubject('');
                          setMessage('');
                        }}
                        className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Prepare Document
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DocuSign Request Signature Modal */}
      {showDocuSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <FaDochub className="w-5 h-5 text-blue-500 dark:text-blue-400 transform translate-x-[1px]" />
    </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Request Signature via DocuSign</h2>
                </div>
                                  <button
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full ml-4 mt-1"
                    onClick={() => { 
                      setShowDocuSignModal(false); 
                      resetModalData();
                    }}
                  aria-label="Close"
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto p-6 flex-1 bg-gray-50 dark:bg-gray-900 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                <form onSubmit={async (e) => { 
                  e.preventDefault(); 
                  
                  // Validate recipients before proceeding
                  if (!validateRecipients()) {
                    return;
                  }
                  
                  // Create and save DocuSign signature request
                  await createDocuSignSignatureRequest();
                  
                  // Reset form
                  setShowDocuSignModal(false); 
                  resetModalData();
                }}>
                  <div className="space-y-6">
                    {/* Two Column Layout for Documents */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column: Add Documents Box */}
                      <div 
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 relative"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDocuSignDraggingOver(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDocuSignDraggingOver(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDocuSignDraggingOver(false);
                          const files = Array.from(e.dataTransfer.files);
                          setDocuSignUploadedFiles(prev => [...prev, ...files]);
                        }}
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 relative z-10" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Documents</h3>
                        
                        {/* Upload interface - always visible */}
                        <div className="flex flex-col items-center mb-4">
                          <div className="h-11 w-11 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800 mb-2">
                            <HiOutlineDocumentText size={22} className="text-blue-500 dark:text-blue-400" />
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Drop your files here or...</div>
                          {isDocuSignDraggingOver && (
                            <div className="absolute inset-x-0 flex flex-col items-center justify-center" style={{ top: '0', height: '100%' }}>
                              <div className="h-full w-full flex flex-col items-center justify-center bg-white/95 dark:bg-gray-800/95 rounded-lg" style={{ marginTop: '1px' }}>
                                <div className="-mt-4">
                                  <div className="h-11 w-11 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800 mb-1.5 mx-auto">
                                    <HiOutlineUpload size={22} className="text-blue-500 dark:text-blue-400" />
                                  </div>
                                  <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Supported Formats: PDF, DOC, DOCX, OR JPG (max. 10 MB each)
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`flex justify-center gap-1 ${isDocuSignDraggingOver ? 'blur-sm' : ''}`}>
                          <div className="relative" ref={docuSignDocumentDropdownRef}>
                            <button
                              type="button"
                              onClick={handleDocuSignDocumentButtonClick}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold border border-transparent"
                            >
                              Select
                              <HiMiniChevronDown size={17} className="text-white -mt-[1px]" />
                            </button>
                            {showDocuSignDocumentDropdown && (
                              <div className="absolute z-50 mt-1 w-[300px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="p-2">
                                  <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={docuSignDocumentSearch}
                                    onChange={(e) => setDocuSignDocumentSearch(e.target.value)}
                                    className="w-full px-3 py-2 text-xs border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                                  {allDocuments
                                    .filter(doc => {
                                      const search = docuSignDocumentSearch.toLowerCase();
                                      return (
                                        doc.name.toLowerCase().includes(search) ||
                                        doc.id.toLowerCase().includes(search) ||
                                        doc.type.toLowerCase().includes(search) ||
                                        doc.contractName?.toLowerCase().includes(search) ||
                                        doc.contractId?.toLowerCase().includes(search)
                                      );
                                    })
                                    .map((doc) => (
                                      <button
                                        key={doc.id}
                                        onClick={(e) => handleDocuSignDocumentItemClick(e, doc.id)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col"
                                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                      >
                                        <div className="flex items-center">
                                          <div className={`w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center ${docuSignSelectedDocuments.includes(doc.id) ? 'bg-primary' : 'border border-gray-300'}`}>
                                            {docuSignSelectedDocuments.includes(doc.id) && (
                                              <FaCheck className="text-white" size={8} />
                                            )}
                                          </div>
                                          <span 
                                            className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]"
                                            title={doc.name}
                                          >
                                            {doc.name}
                                          </span>
                                        </div>
                                        <div className="ml-6 text-gray-500 dark:text-gray-400 text-[10px]">{doc.contractName} ({doc.contractId})</div>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative" ref={docuSignUploadDropdownRef}>
                            <button
                              type="button"
                              onClick={() => setShowDocuSignUploadDropdown(!showDocuSignUploadDropdown)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                            >
                              <HiOutlineUpload className="text-base text-blue-500" /> Upload
                            </button>
                            {showDocuSignUploadDropdown && (
                              <div className="absolute z-50 mt-1 w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="py-2">
                                  <label htmlFor="docuSign-file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                      <TbDeviceDesktopPlus className="text-base text-blue-500" />
                                      <span className="text-xs">Desktop</span>
                                    </div>
                                  </label>
                                  <input
                                    id="docuSign-file-upload"
                                    name="docuSign-file-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                                    className="hidden"
                                    multiple
                                    onChange={handleDocuSignFileChange}
                                  />
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <SiBox className="text-base text-blue-500" />
                                    <span className="text-xs">Box</span>
                                  </button>
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <SlSocialDropbox className="text-base text-blue-500" />
                                    <span className="text-xs">Dropbox</span>
                                  </button>
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <TbBrandGoogleDrive className="text-base text-blue-500" />
                                    <span className="text-xs">Google Drive</span>
                                  </button>
                                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <TbBrandOnedrive className="text-base text-blue-500" />
                                    <span className="text-xs">OneDrive</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Documents Box */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Documents</h3>
                        
                        {/* Show document thumbnails when documents are selected */}
                        {(docuSignSelectedDocuments.length > 0 || docuSignUploadedFiles.length > 0) ? (
                          <div className="space-y-3">
                            {/* Selected Documents */}
                            {docuSignSelectedDocuments.map(docId => {
                              const doc = allDocuments.find(d => d.id === docId);
                              return doc ? (
                                <div key={docId} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center gap-3">
                                    <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                                    <div className="flex-1 min-w-0">
                                      <div 
                                        className="font-semibold text-xs text-black dark:text-white truncate max-w-[140px]"
                                        title={doc.name}
                                      >
                                        {doc.name}
                                      </div>
                                      <div className="text-xs text-gray-500">{doc.dateUploaded} &bull; {doc.type} &bull; {doc.size}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <button type="button" className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group">
                                      <HiOutlineEye className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        View
                                      </span>
                                    </button>
                                    <button 
                                      type="button"
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Check if this is a stored document 
                                        // (ID >= 8000 or old format with 'doc_' prefix indicates stored document)
                                        const docIdNum = parseInt(doc.id);
                                        if (docIdNum >= 8000 || doc.id.startsWith('doc_')) {
                                          downloadDocument(doc.id);
                                        } else {
                                          // Handle sample document download (placeholder)
                                          toast({
                                            title: "Download",
                                            description: `Downloading ${doc.name}`,
                                          });
                                        }
                                      }}
                                    >
                                      <HiOutlineDownload className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Download
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDocuSignSelectedDocuments(prev => prev.filter(id => id !== docId));
                                        // Clear all recipient cards and reset first card when documents are removed
                                        setDocuSignRecipients([{
                                          name: '',
                                          email: '',
                                          signerRole: 'Signer Role',
                                          contractRole: 'Contract Role',
                                          showSignerRoleDropdown: false,
                                          showContractRoleDropdown: false,
                                          signerRoleButtonRef: createRef<HTMLButtonElement>(),
                                          signerRoleDropdownRef: createRef<HTMLDivElement>(),
                                          contractRoleButtonRef: createRef<HTMLButtonElement>(),
                                          contractRoleDropdownRef: createRef<HTMLDivElement>(),
                                        }]);
                                      }}
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group"
                                    >
                                      <HiOutlineTrash className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Delete
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              ) : null;
                            })}
                            
                            {/* Uploaded Files */}
                            {docuSignUploadedFiles.map((file, idx) => {
                              const fileKey = getFileKey(file, idx);
                              const isEditing = editingDocuSignFileName === fileKey;
                              const displayName = getDisplayFileName(file, idx, true);
                              const associatedContract = docuSignUploadedFileContracts[fileKey];
                              const associatedAssignee = docuSignUploadedFileAssignees[fileKey];
                              
                              return (
                                <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center gap-3">
                                    <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                                    <div className="flex-1 min-w-0">
                                      {isEditing ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => {
                                              const fileKey = getFileKey(file, idx);
                                              setCustomDocuSignFileNames(prev => ({ ...prev, [fileKey]: e.target.value }));
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleSaveFileName(file, idx, displayName, true);
                                              } else if (e.key === 'Escape') {
                                                handleCancelFileNameEdit(true);
                                              }
                                            }}
                                            onBlur={() => handleSaveFileName(file, idx, displayName, true)}
                                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{ fontFamily: 'Avenir, sans-serif' }}
                                            autoFocus
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleSaveFileName(file, idx, displayName, true)}
                                            className="text-green-800 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-1"
                                          >
                                            <FaCheck className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleCancelFileNameEdit(true)}
                                            className="text-red-500 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 p-1"
                                          >
                                            <FaTimes className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 group">
                                          <div 
                                            className="font-semibold text-xs text-black dark:text-white cursor-pointer hover:text-blue-500 transition-colors flex-1 min-w-0 truncate max-w-[140px]"
                                            onClick={() => handleStartEditFileName(file, idx, true)}
                                            title={`${displayName} - Click to edit name`}
                                          >
                                            {displayName}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleStartEditFileName(file, idx, true)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all p-1 flex-shrink-0"
                                          >
                                            <LuPen className="w-3 h-3" />
                                          </button>
                                        </div>
                                      )}
                                      <div className="text-xs text-gray-500">{file.type} &bull; {(file.size / 1024 / 1024).toFixed(1)} MB</div>
                                      {associatedContract && (
                                        <div className="text-xs text-primary font-medium mt-1">
                                          {mockContracts.find(c => c.id === associatedContract)?.id} - {mockContracts.find(c => c.id === associatedContract)?.title || associatedContract}
                                        </div>
                                      )}
                                      {associatedAssignee && (
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                          Assignee: {associatedAssignee}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <button type="button" className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group">
                                      <HiOutlineEye className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        View
                                      </span>
                                    </button>
                                    <button 
                                      type="button"
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        downloadUploadedFile(file);
                                      }}
                                    >
                                      <HiOutlineDownload className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Download
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDocuSignUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group"
                                    >
                                      <HiOutlineTrash className="h-4 w-4 transition-colors" />
                                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Delete
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                            <HiOutlineDocumentText size={32} className="mb-2" />
                            <p className="text-sm">No documents selected</p>
                            <p className="text-xs">Select or upload documents from the left panel</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add Recipients Box */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Recipients</h3>
                      <div className="space-y-4">
                        {/* I am the only signer checkbox */}
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => {
                            const newValue = !isDocuSignOnlySigner;
                            setIsDocuSignOnlySigner(newValue);
                          }}>
                            {isDocuSignOnlySigner && (
                              <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                                <FaCheck className="text-white" size={10} />
                              </div>
                            )}
                          </div>
                          <label 
                            className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                            onClick={() => {
                              const newValue = !isDocuSignOnlySigner;
                              setIsDocuSignOnlySigner(newValue);
                            }}
                          >
                            I am the only signer
                          </label>
                        </div>
                        
                        {/* Set signing order checkbox */}
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => {
                            const newValue = !setDocuSignSigningOrder;
                            setSetDocuSignSigningOrder(newValue);
                          }}>
                            {setDocuSignSigningOrder && (
                              <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                                <FaCheck className="text-white" size={10} />
                              </div>
                            )}
                          </div>
                          <label 
                            className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                            onClick={() => {
                              const newValue = !setDocuSignSigningOrder;
                              setSetDocuSignSigningOrder(newValue);
                            }}
                          >
                            Set signing order
                          </label>
                        </div>
                        
                        {/* Render all DocuSign recipient cards */}
                        {docuSignRecipients.map((recipient, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            {/* Signing order number field */}
                            {setDocuSignSigningOrder && (
                              <div className="flex-shrink-0 mt-4">
                                <input
                                  type="number"
                                  min="1"
                                  max={docuSignRecipients.length}
                                  className="w-12 h-8 text-center border border-gray-300 rounded text-xs font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                  value={idx + 1}
                                  onChange={(e) => {
                                    // Handle signing order change logic here
                                  }}
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                />
                              </div>
                            )}
                            <div className="flex-1 relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm" style={{ borderLeft: `3px solid ${getSignatureCardBorderColor(idx, true)}` }}>
                            {/* Header with role controls and delete button */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                              <div className="flex flex-col sm:flex-row gap-1">
                                {/* Role selection button */}
                                <div className="relative">
                                  <button
                                    ref={recipient.signerRoleButtonRef}
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white border border-gray-200 dark:border-transparent bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                                    onClick={() => setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showSignerRoleDropdown: !r.showSignerRoleDropdown } : r))}
                                    tabIndex={0}
                                  >
                                    <LuPen className="w-3 h-3 text-white" />
                                    <span>{recipient.signerRole || 'Signer Role'}</span>
                                    <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px] text-white" />
                                  </button>
                                  {recipient.showSignerRoleDropdown && (
                                    <div
                                      ref={recipient.signerRoleDropdownRef}
                                      className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                      {['Needs to Sign', 'In Person Signer', 'Receives a Copy', 'Needs to View'].map((role) => (
                                        <button
                                          key={role}
                                          className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${recipient.signerRole === role ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
                                          style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                          onClick={() => setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, signerRole: role, showSignerRoleDropdown: false } : r))}
                                        >
                                          {role}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Contract Role button */}
                                <div className="relative">
                                  <button
                                    ref={recipient.contractRoleButtonRef}
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white border border-gray-200 dark:border-transparent bg-blue-500 rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
                                    onClick={() => setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: !r.showContractRoleDropdown } : r))}
                                    tabIndex={0}
                                  >
                                    <span>{recipient.contractRole || 'Contract Role'}</span>
                                    <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px] text-white" />
                                  </button>
                                  {recipient.showContractRoleDropdown && (
                                    <div
                                      ref={recipient.contractRoleDropdownRef}
                                      className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                      {['Standard', 'Buyer', 'Seller', 'Buyer Agent', 'Seller Agent', 'Closing Agent', 'Inspector', 'Appraiser'].map((role) => (
                                        <button
                                          key={role}
                                          className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${recipient.contractRole === role ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
                                          style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                          onClick={() => setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, contractRole: role, showContractRoleDropdown: false } : r))}
                                        >
                                          {role}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Customize button */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 border border-gray-200 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
                                    tabIndex={0}
                                  >
                                    <span>Customize</span>
                                    <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px]" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Clear and Delete buttons */}
                              <div className="flex items-center gap-1">
                                <button 
                                  className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, name: '', email: '' } : r));
                                  }}
                                >
                                  <LuEraser className="w-4 h-4" />
                                </button>
                                <button 
                                  className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteDocuSignRecipient(idx);
                                  }} 
                                  disabled={docuSignRecipients.length === 1}
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Form fields */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  Name <span className="text-blue-500">*</span>
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                  </span>
                                  <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                    placeholder="Enter recipient's name..."
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    value={recipient.name}
                                    onChange={e => setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, name: e.target.value } : r))}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  Email <span className="text-blue-500">*</span>
                                </label>
                                <input
                                  type="email"
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                  placeholder="Enter recipient's email address..."
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                  value={recipient.email}
                                  onChange={e => setDocuSignRecipients(prev => prev.map((r, i) => i === idx ? { ...r, email: e.target.value } : r))}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        ))}
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-blue-500 text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-blue-600 transition-colors cursor-pointer mt-2"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                          onClick={handleAddDocuSignRecipient}
                        >
                          <TiUserAddOutline className="text-base sm:text-lg text-blue-500 dark:text-white" />
                          <span className="mt-[1px]">Add Recipient</span>
                        </button>
                      </div>
                    </div>

                    {/* Due Date Field */}
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date</div>
                      <div className="relative flex items-center" style={{ width: '140px', minWidth: '140px' }}>
                        <input
                          type="date"
                          className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs text-black dark:text-white bg-white dark:bg-gray-900 [&::-webkit-calendar-picker-indicator]:hidden"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                        <button
                          type="button"
                          onClick={() => (document.querySelector('input[type="date"]') as HTMLInputElement)?.showPicker()}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                        >
                          <LuCalendarFold className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Message</h3>
                      
                      {/* Subject Field */}
                      <div className="mb-4">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          placeholder="Enter subject..."
                          value={docuSignSubject}
                          onChange={(e) => setDocuSignSubject(e.target.value)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                      </div>
                      
                      {/* Message Textarea */}
                      <textarea
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        rows={4}
                        placeholder="Enter your message..."
                        value={docuSignMessage}
                        onChange={(e) => setDocuSignMessage(e.target.value)}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>

                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => { 
                          setShowDocuSignModal(false); 
                          resetModalData();
                        }}
                        className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Send to DocuSign
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Association Modal */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 upload-modal cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Associate Document with Contract</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={handleContractModalCancel}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form
              className="p-0 cursor-default select-none"
              onSubmit={e => {
                e.preventDefault();
                handleContractModalSave();
              }}
            >
              <div className="flex flex-col gap-4 mb-4 cursor-default select-none">
                <div className="flex gap-4 cursor-default select-none">
                  <div className="flex-1 w-0 cursor-default select-none">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter document name..."
                      className={`w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text ${isDocuSignUpload ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-2 focus:ring-primary focus:border-primary'}`}
                      value={currentUploadingFileName}
                      onChange={(e) => setCurrentUploadingFileName(e.target.value)}
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                  </div>
                </div>
                <div className="flex gap-4 cursor-default select-none">
                  <div className="flex-1 w-0 cursor-default select-none">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract <span className="text-red-500">*</span></label>
                    <div className="relative" ref={modalContractDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowModalContractDropdown(!showModalContractDropdown)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && currentUploadingContract) {
                            e.preventDefault();
                            setCurrentUploadingContract('');
                          }
                        }}
                        className={`w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors flex items-center justify-between cursor-pointer ${isDocuSignUpload ? 'focus:ring-0 focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-0 focus:ring-primary focus:border-primary'}`}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                        tabIndex={0}
                      >
                        {currentUploadingContract ? (
                          <span className="text-gray-900 dark:text-white">
                            {mockContracts.find(c => c.id === currentUploadingContract)?.id} - {mockContracts.find(c => c.id === currentUploadingContract)?.title || currentUploadingContract}
                          </span>
                        ) : (
                          <span className="text-gray-400">Select a contract...</span>
                        )}
                        <HiMiniChevronDown className="text-gray-400" size={16} />
                      </button>
                      {showModalContractDropdown && (
                        <div className="absolute top-full left-0 mt-1 min-w-[280px] w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 contract-dropdown">
                          {/* Search Bar */}
                          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search contracts..."
                                value={modalContractSearch}
                                onChange={(e) => setModalContractSearch(e.target.value)}
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 transition-colors ${isDocuSignUpload ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-2 focus:ring-primary focus:border-primary'}`}
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              />
                              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>

                          {mockContracts
                            .filter(contract => 
                              contract.id.toLowerCase().includes(modalContractSearch.toLowerCase()) ||
                              contract.title.toLowerCase().includes(modalContractSearch.toLowerCase())
                            )
                            .map(contract => (
                              <button
                                key={contract.id}
                                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${currentUploadingContract === contract.id ? (isDocuSignUpload ? 'text-blue-500' : 'text-primary') : 'text-gray-700 dark:text-gray-300'}`}
                                onClick={() => {
                                  setCurrentUploadingContract(contract.id);
                                  setShowModalContractDropdown(false);
                                }}
                              >
                                <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                                  {currentUploadingContract === contract.id && (
                                    <div className={`w-3 h-3 rounded-sm flex items-center justify-center ${isDocuSignUpload ? 'bg-blue-500' : 'bg-primary'}`}>
                                      <FaCheck className="text-white" size={8} />
                                    </div>
                                  )}
                                </div>
                                {contract.id} - {contract.title}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 cursor-default select-none">
                  <div className="flex-1 w-0 cursor-default select-none">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee <span className="text-red-500">*</span></label>
                    <div className="relative" ref={modalAssigneeDropdownRef}>
                      <input
                        type="text"
                        className={`w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text ${isDocuSignUpload ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-2 focus:ring-primary focus:border-primary'}`}
                        placeholder="Choose an assignee..."
                        value={currentUploadingAssignee}
                        onChange={(e) => setCurrentUploadingAssignee(e.target.value)}
                        onFocus={() => setShowModalAssigneeDropdown(true)}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                        autoComplete="off"
                      />
                      {showModalAssigneeDropdown && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {allAssignees.length > 0 ? (
                            <>
                              {allAssignees.map((assignee: string) => (
                                <div
                                  key={assignee}
                                  className={`px-4 py-2 text-xs cursor-pointer ${currentUploadingAssignee === assignee ? (isDocuSignUpload ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary') : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                  onClick={() => {
                                    setCurrentUploadingAssignee(assignee);
                                    setShowModalAssigneeDropdown(false);
                                  }}
                                >
                                  {assignee}
                                </div>
                              ))}
                              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                              <div
                                className={`px-4 py-2 text-xs cursor-pointer ${isDocuSignUpload ? 'text-blue-500 hover:bg-blue-500/10' : 'text-primary hover:bg-primary/10'} select-none flex items-center gap-2`}
                                onClick={() => {
                                  // TODO: Add logic to create new assignee
                                  setShowModalAssigneeDropdown(false);
                                }}
                              >
                                <FaPlus className="text-xs" />
                                Add new assignee
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">No assignees found</div>
                              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                              <div
                                className={`px-4 py-2 text-xs cursor-pointer ${isDocuSignUpload ? 'text-blue-500 hover:bg-blue-500/10' : 'text-primary hover:bg-primary/10'} select-none flex items-center gap-2`}
                                onClick={() => {
                                  // TODO: Add logic to create new assignee
                                  setShowModalAssigneeDropdown(false);
                                }}
                              >
                                <FaPlus className="text-xs" />
                                Add new assignee
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-1 mt-6">
                <button 
                  type="button"
                  onClick={handleContractModalCancel}
                  className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  disabled={!currentUploadingContract || !currentUploadingFileName.trim() || !currentUploadingAssignee.trim()}
                  className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isDocuSignUpload ? 'bg-blue-500 hover:bg-blue-600' : 'bg-primary hover:bg-primary-dark'}`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col cursor-default select-none">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 cursor-default select-none">
              <div className="flex justify-between items-center cursor-default select-none">
                <div className="flex flex-col gap-2 items-start cursor-default select-none">
                  <span className="inline-block max-w-max text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 cursor-default select-none">
                    # {selectedPdf.id}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5 cursor-default select-none">{selectedPdf.name}</h2>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  onClick={() => setShowPdfViewer(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50 dark:bg-gray-900 cursor-default select-none">
              {/* Blank area for PDF viewer */}
              <span className="text-gray-400 dark:text-gray-500 text-lg cursor-default select-none">PDF Viewer will be implemented here</span>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && selectedDocument && (
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          onSave={handleSignatureComplete}
          drawEnabled={true}
          typeEnabled={true}
          uploadEnabled={true}
          title={`Sign Document: ${selectedDocument?.document || 'Document'}`}
          confirmText="Confirm Signature"
          cancelText="Cancel"
        />
      )}

      {/* Signature Confirmation Modal */}
      {showSignatureConfirmationModal && selectedDocument && capturedSignatureData && (
        <SignatureConfirmationModal
          isOpen={showSignatureConfirmationModal}
          onClose={handleConfirmationModalClose}
          onConfirm={handleFinalSignatureSubmit}
          signature={capturedSignatureData}
          document={selectedDocument}
          isLoading={isFinalSigning}
        />
      )}

      {/* Document Preparation Modal */}
      <DocumentPreparationModal
        isOpen={showDocumentPreparationModal}
        onClose={() => setShowDocumentPreparationModal(false)}
        documentData={{
          recipients: recipients,
          uploadedFiles: uploadedFiles,
          selectedDocuments: selectedDocuments,
        }}
      />

      </div>
      <Toaster />
    </div>
  );
} 