// RENDER-TEST-789
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaClock, FaSort, FaPlus, FaDollarSign, FaTimes, FaChevronDown, FaChevronUp, FaRegClock, FaCheck } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { HiOutlineDocumentText, HiOutlineDuplicate, HiOutlineDownload, HiOutlineEye, HiOutlineEyeOff, HiOutlineClipboardList, HiOutlineExclamation, HiChevronDown, HiOutlineDocumentSearch, HiOutlineDocumentAdd, HiOutlineUpload, HiOutlineTrash, HiOutlineX, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlinePencil } from 'react-icons/hi';
import { HiOutlineViewBoards } from 'react-icons/hi';
import { LuCalendarFold, LuPen } from 'react-icons/lu';
import { BiDotsHorizontal, BiCommentAdd } from 'react-icons/bi';
import { TbWorldDollar, TbEdit, TbClockUp, TbCubeSend, TbClockPin, TbFilePlus, TbScript } from 'react-icons/tb';
import { Logo } from '@/components/common/Logo';
import { mockContracts } from '@/data/mockContracts';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import { EditorContent } from '@tiptap/react';
import { BsPerson } from 'react-icons/bs';
import { LuSendHorizontal } from 'react-icons/lu';
import { RxCaretSort } from 'react-icons/rx';
import { MdOutlineEditCalendar, MdOutlineUpdate, MdOutlineAddToPhotos, MdCancelPresentation } from 'react-icons/md';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { HiMiniChevronUpDown, HiMiniChevronDown } from 'react-icons/hi2';
import { useTaskStore } from '@/data/taskStore';
import { X } from 'lucide-react';
import { useAssigneeStore } from '@/data/assigneeStore';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';
import { useDocumentStore } from '@/data/documentNameStore';
import { PiMoneyWavyBold, PiBankBold, PiSignatureBold, PiCaretUpDownBold } from 'react-icons/pi';
import { TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive, TbChevronsDownRight, TbMailPlus, TbLibraryPlus, TbStatusChange, TbDragDrop, TbHistory } from 'react-icons/tb';
import { SiBox } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { FaCheckCircle } from 'react-icons/fa';
import { RiUserSearchLine } from 'react-icons/ri';
import { GrMoney } from 'react-icons/gr';
import { TiUserAddOutline } from 'react-icons/ti';

// Add date formatting utilities
function formatDatePretty(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  // Adjust for timezone offset to prevent date shifting
  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() + offset);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Add currency formatting utility
function formatCurrency(value: string | number): string {
  if (!value) return '$0';
  
  // Convert to number if it's a string
  let numValue: number;
  if (typeof value === 'string') {
    // Remove any existing currency formatting
    const cleanValue = value.replace(/[$,]/g, '');
    numValue = parseFloat(cleanValue) || 0;
  } else {
    numValue = value;
  }
  
  // Format as currency with dollar sign and commas
  return numValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Add function to parse and format currency input
function parseAndFormatCurrency(input: string): string {
  // Remove all non-numeric characters except decimal point
  const cleanInput = input.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleanInput.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Convert to number and format
  const numValue = parseFloat(cleanInput) || 0;
  return formatCurrency(numValue);
}

// Add function to format date in YYYY-MM-DD format
function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Add Comment interface
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarColor: string;
  textColor: string;
}

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
  // Additional form fields
  milestone?: string;
  notes?: string;
  closingDate?: string;
  dueDate?: string;
  propertyAddress?: string;
  propertyType?: string;
  escrowNumber?: string;
  buyerEmail?: string;
  sellerEmail?: string;
  agentEmail?: string;
  earnestMoney?: string;
  downPayment?: string;
  loanAmount?: string;
  interestRate?: string;
  loanTerm?: string;
  lenderName?: string;
  sellerFinancialInstitution?: string;
  buyerFinancialInstitution?: string;
  buyerAccountNumber?: string;
  sellerAccountNumber?: string;
  buyerFinancialInstitutionRoutingNumber?: string;
  sellerFinancialInstitutionRoutingNumber?: string;
  titleCompany?: string;
  insuranceCompany?: string;
  inspectionPeriod?: string;
  contingencies?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  additionalParties?: { name: string; email: string; role: string }[];
  party1Role?: string;
  party2Role?: string;
  documentIds?: string[]; // IDs of stored documents
}

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
  documentType?: string;
}

// Sample data
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

const ContractsPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserName = user?.name || '';
  const { toast } = useToast();
  const { addDocument, getDocumentsByContract, removeDocument, updateDocumentContract } = useDocumentStore();

  const [activeTab, setActiveTab] = useState('allContracts');
  const [activeContentTab, setActiveContentTab] = useState('contractList');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['All']);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [openContractDropdown, setOpenContractDropdown] = useState(false);
  const [contractSearch, setContractSearch] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [openAssigneeDropdown, setOpenAssigneeDropdown] = useState(false);
  const [openRecentlyUpdatedDropdown, setOpenRecentlyUpdatedDropdown] = useState(false);
  const [selectedRecentlyUpdated, setSelectedRecentlyUpdated] = useState('Last 24 hours');
  const [openCompletionTimeDropdown, setOpenCompletionTimeDropdown] = useState(false);
  const [selectedCompletionTime, setSelectedCompletionTime] = useState('Last 30 days');
  const assigneeButtonRef = useRef<HTMLButtonElement>(null);
  const contractButtonRef = useRef<HTMLButtonElement>(null);
  const completionTimeDropdownRef = useRef<HTMLDivElement>(null);
  const completionTimeButtonRef = useRef<HTMLButtonElement>(null);
  const [showNewContractForm, setShowNewContractForm] = useState(false);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [documentModalStep, setDocumentModalStep] = useState(1);
  const [showNewDocumentFileSourceDropdown, setShowNewDocumentFileSourceDropdown] = useState(false);
  const [selectedNewDocumentFileSource, setSelectedNewDocumentFileSource] = useState('');
  const [showNewDocumentAssigneeDropdown, setShowNewDocumentAssigneeDropdown] = useState(false);
  const [showNewDocumentContractDropdown, setShowNewDocumentContractDropdown] = useState(false);
  const [showNewDocumentUploadDropdown, setShowNewDocumentUploadDropdown] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newDocumentType, setNewDocumentType] = useState('');
  const [newDocumentAssignee, setNewDocumentAssignee] = useState('');
  const [newDocumentDocuments, setNewDocumentDocuments] = useState<Array<{file: File, name: string, type: string, assignee: string, contract: string}>>([]);
  const [editingNewDocumentIndex, setEditingNewDocumentIndex] = useState<number | null>(null);
  const [inlineEditingNewDocumentName, setInlineEditingNewDocumentName] = useState('');
  const [inlineEditingNewDocumentType, setInlineEditingNewDocumentType] = useState('');
  const [inlineEditingNewDocumentAssignee, setInlineEditingNewDocumentAssignee] = useState('');
  const [inlineEditingNewDocumentContract, setInlineEditingNewDocumentContract] = useState('');
  const [showInlineEditingNewDocumentAssigneeDropdown, setShowInlineEditingNewDocumentAssigneeDropdown] = useState(false);
  const [showInlineEditingNewDocumentContractDropdown, setShowInlineEditingNewDocumentContractDropdown] = useState(false);
  const [inlineEditingNewDocumentContractSearch, setInlineEditingNewDocumentContractSearch] = useState('');
  const [newDocumentContractSearch, setNewDocumentContractSearch] = useState('');
  const [modalStep, setModalStep] = useState(1);
  const [lastUpdatedSort, setLastUpdatedSort] = useState<'asc' | 'desc'>('desc');
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
    sellerFinancialInstitution: '',
    buyerFinancialInstitution: '',
    buyerAccountNumber: '',
    sellerAccountNumber: '',
    buyerFinancialInstitutionRoutingNumber: '',
    sellerFinancialInstitutionRoutingNumber: '',
    titleCompany: '',
    insuranceCompany: '',
    inspectionPeriod: '',
    contingencies: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [documentModalForm, setDocumentModalForm] = useState({
    name: '',
    type: '',
    description: '',
    assignee: '',
    contract: '',
  });
  const [documentFormErrors, setDocumentFormErrors] = useState<Record<string, boolean>>({});
  const [documentUploadErrors, setDocumentUploadErrors] = useState<{
    files: boolean;
  }>({
    files: false
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [documentModalUploadedFiles, setDocumentModalUploadedFiles] = useState<File[]>([]);
  // Separate state for new document form
  const [newDocumentFormUploadedFiles, setNewDocumentFormUploadedFiles] = useState<File[]>([]);
  const [selectedNewDocumentFormFileSource, setSelectedNewDocumentFormFileSource] = useState('');
  const [uploadedDocumentIds, setUploadedDocumentIds] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState('');
  const [documentNameError, setDocumentNameError] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);

  // State for expanded parties rows
  const [expandedPartiesRows, setExpandedPartiesRows] = useState<Set<string>>(new Set());

  // Helper function to parse parties string into array
  const parseParties = (partiesString: string): string[] => {
    return partiesString.split(' & ').map(party => party.trim());
  };

  // Helper function to toggle expanded state for a row
  const togglePartiesExpansion = (contractId: string) => {
    setExpandedPartiesRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contractId)) {
        newSet.delete(contractId);
      } else {
        newSet.add(contractId);
      }
      return newSet;
    });
  };

  // Generate unique contract ID with Algorand Smart Contract Chain ID format
  const generateContractId = (): string => {
    // Generate a unique contract ID following the existing pattern
    // Most contracts have 4-digit IDs (1000-9999), some have 5-digit IDs (10000+)
    const random = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return random.toString();
  };

  // Create parties string from form data
  const createPartiesString = (): string => {
    // Use the recipients data from step 2 instead of modalForm fields
    const parties = recipients
      .filter(recipient => recipient.name && recipient.name.trim() !== '')
      .map(recipient => recipient.name.trim());
    return parties.join(' & ');
  };

  // Reset form to initial state
  const resetForm = () => {
    setModalForm({
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
      sellerFinancialInstitution: '',
      buyerFinancialInstitution: '',
      buyerAccountNumber: '',
      sellerAccountNumber: '',
      buyerFinancialInstitutionRoutingNumber: '',
      sellerFinancialInstitutionRoutingNumber: '',
      titleCompany: '',
      insuranceCompany: '',
      inspectionPeriod: '',
      contingencies: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
    setModalStep(1);
    setFormErrors({});
    setRecipientErrors({});
    // Reset recipients to initial state
    setRecipients([{
      name: '',
      email: '',
      signerRole: '',
      contractRole: '',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: React.createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: React.createRef<HTMLDivElement>(),
      contractRoleButtonRef: React.createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
    }]);
    setIsOnlySigner(false);
    // Clear uploaded files and document IDs
    setUploadedFiles([]);
    setUploadedDocumentIds([]);
    setStep4Documents([]);
    setStep4DocumentName('');
    setStep4DocumentType('');
    setStep4DocumentAssignee('');
    setDocumentName('');
    setDocumentNameError(false);
  };

  // Routing number masking state
  const [buyerRoutingDisplay, setBuyerRoutingDisplay] = useState('');
  const [sellerRoutingDisplay, setSellerRoutingDisplay] = useState('');
  const [contractRoutingDisplay, setContractRoutingDisplay] = useState('');
  const [contractRoutingValue, setContractRoutingValue] = useState('');
  
  // Account number masking state
  const [buyerAccountDisplay, setBuyerAccountDisplay] = useState('');
  const [sellerAccountDisplay, setSellerAccountDisplay] = useState('');
  const [contractAccountDisplay, setContractAccountDisplay] = useState('');
  const [contractAccountValue, setContractAccountValue] = useState('');
  // Account number visibility state
  const [buyerAccountVisible, setBuyerAccountVisible] = useState(false);
  const [sellerAccountVisible, setSellerAccountVisible] = useState(false);
  
  // Contract details modal visibility states for wire details
  const [contractDetailsBuyerRoutingVisible, setContractDetailsBuyerRoutingVisible] = useState(false);
  const [contractDetailsSellerRoutingVisible, setContractDetailsSellerRoutingVisible] = useState(false);
  const [contractDetailsBuyerAccountVisible, setContractDetailsBuyerAccountVisible] = useState(false);
  const [contractDetailsSellerAccountVisible, setContractDetailsSellerAccountVisible] = useState(false);
  
  // Refs to track timeouts for masking
  const buyerRoutingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellerRoutingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contractRoutingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buyerAccountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellerAccountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contractAccountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to handle routing number masking (9 digits)
  const handleRoutingNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentActualValue: string,
    setDisplayValue: (value: string) => void,
    updateFormValue: (value: string) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const inputValue = e.target.value;
    const inputElement = e.target;
    
    // Check if this is a backspace/delete operation
    const isDeleting = inputValue.length < (currentActualValue.length > 0 ? currentActualValue.length : 1);
    
    if (isDeleting) {
      // Handle deletion
      const newValue = currentActualValue.slice(0, -1);
      updateFormValue(newValue);
      
      if (newValue.length === 0) {
        setDisplayValue('');
      } else {
        // Show all as asterisks when deleting
        const maskedValue = newValue.split('').map(() => '*').join('');
        setDisplayValue(maskedValue);
      }
      return;
    }
    
    // Extract only the new digit(s) from the input
    const newDigits = inputValue.replace(/\*/g, '').replace(/\D/g, '');
    
    // If we have new digits and haven't reached the limit
    if (newDigits.length > 0 && currentActualValue.length < 9) {
      // Take only the first new digit to add to our actual value
      const digitToAdd = newDigits.slice(-1);
      const newValue = (currentActualValue + digitToAdd).slice(0, 9);
      
      updateFormValue(newValue);
      
      // Create display value with asterisks for all but the last digit
      const displayValue = newValue.split('').map((digit, index) => {
        if (index === newValue.length - 1) {
          // Show the last digit briefly
          return digit;
        } else {
          // Show asterisk for previous digits
          return '*';
        }
      }).join('');
      
      setDisplayValue(displayValue);
      
      // Set cursor position to end
      setTimeout(() => {
        inputElement.setSelectionRange(newValue.length, newValue.length);
      }, 0);
      
      // After 1 second, mask the last digit too
      timeoutRef.current = setTimeout(() => {
        const maskedValue = newValue.split('').map(() => '*').join('');
        setDisplayValue(maskedValue);
        timeoutRef.current = null;
      }, 1000);
    }
  };

  // Helper function to handle account number masking (12 digits)
  const handleAccountNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentActualValue: string,
    setDisplayValue: (value: string) => void,
    updateFormValue: (value: string) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const inputValue = e.target.value;
    const inputElement = e.target;
    
    // Check if this is a backspace/delete operation
    const isDeleting = inputValue.length < (currentActualValue.length > 0 ? currentActualValue.length : 1);
    
    if (isDeleting) {
      // Handle deletion
      const newValue = currentActualValue.slice(0, -1);
      updateFormValue(newValue);
      
      if (newValue.length === 0) {
        setDisplayValue('');
      } else {
        // Show all as asterisks when deleting
        const maskedValue = newValue.split('').map(() => '*').join('');
        setDisplayValue(maskedValue);
      }
      return;
    }
    
    // Extract only the new digit(s) from the input
    const newDigits = inputValue.replace(/\*/g, '').replace(/\D/g, '');
    
    // If we have new digits and haven't reached the limit (12 digits for account numbers)
    if (newDigits.length > 0 && currentActualValue.length < 12) {
      // Take only the first new digit to add to our actual value
      const digitToAdd = newDigits.slice(-1);
      const newValue = (currentActualValue + digitToAdd).slice(0, 12);
      
      updateFormValue(newValue);
      
      // Create display value with asterisks for all but the last digit
      const displayValue = newValue.split('').map((digit, index) => {
        if (index === newValue.length - 1) {
          // Show the last digit briefly
          return digit;
        } else {
          // Show asterisk for previous digits
          return '*';
        }
      }).join('');
      
      setDisplayValue(displayValue);
      
      // Set cursor position to end
      setTimeout(() => {
        inputElement.setSelectionRange(newValue.length, newValue.length);
      }, 0);
      
      // After 1 second, mask the last digit too
      timeoutRef.current = setTimeout(() => {
        const maskedValue = newValue.split('').map(() => '*').join('');
        setDisplayValue(maskedValue);
        timeoutRef.current = null;
      }, 1000);
    }
  };

  const [emailErrors, setEmailErrors] = useState({
    buyerEmail: false,
    sellerEmail: false,
    agentEmail: false,
  });

  // Recipients state for Step 2
  type Recipient = {
    name: string;
    email: string;
    signerRole: string;
    contractRole: string;
    showSignerRoleDropdown: boolean;
    showContractRoleDropdown: boolean;
    signerRoleButtonRef: React.RefObject<HTMLButtonElement>;
    signerRoleDropdownRef: React.RefObject<HTMLDivElement>;
    contractRoleButtonRef: React.RefObject<HTMLButtonElement>;
    contractRoleDropdownRef: React.RefObject<HTMLDivElement>;
  };

  const [isOnlySigner, setIsOnlySigner] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      name: '',
      email: '',
      signerRole: '',
      contractRole: '',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: React.createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: React.createRef<HTMLDivElement>(),
      contractRoleButtonRef: React.createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
    },
  ]);

  // Handler to add a new recipient card
  const handleAddRecipient = () => {
    setRecipients(prev => {
      return [
        ...prev,
        {
          name: '',
          email: '',
          signerRole: '',
          contractRole: '',
          showSignerRoleDropdown: false,
          showContractRoleDropdown: false,
          signerRoleButtonRef: React.createRef<HTMLButtonElement>(),
          signerRoleDropdownRef: React.createRef<HTMLDivElement>(),
          contractRoleButtonRef: React.createRef<HTMLButtonElement>(),
          contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
        },
      ];
    });
  };

  // Handler to delete a recipient card
  const handleDeleteRecipient = (idx: number) => {
    setRecipients(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  };

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

  const PROPERTY_TYPES = [
    'Single Family',
    'Multi Family',
    'Commercial',
    'Land',
    'Industrial',
    'Other'
  ];

  const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];
  const COUNTRIES = [
    // Most commonly used countries first
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'MX', label: 'Mexico' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'BE', label: 'Belgium' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'AT', label: 'Austria' },
    { value: 'SE', label: 'Sweden' },
    { value: 'NO', label: 'Norway' },
    { value: 'DK', label: 'Denmark' },
    { value: 'FI', label: 'Finland' },
    { value: 'PL', label: 'Poland' },
    { value: 'CZ', label: 'Czech Republic' },
    { value: 'HU', label: 'Hungary' },
    { value: 'RO', label: 'Romania' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'HR', label: 'Croatia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'LT', label: 'Lithuania' },
    { value: 'LV', label: 'Latvia' },
    { value: 'EE', label: 'Estonia' },
    { value: 'IE', label: 'Ireland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'GR', label: 'Greece' },
    { value: 'CY', label: 'Cyprus' },
    { value: 'MT', label: 'Malta' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'IS', label: 'Iceland' },
    { value: 'AU', label: 'Australia' },
    { value: 'NZ', label: 'New Zealand' },
    { value: 'JP', label: 'Japan' },
    { value: 'KR', label: 'South Korea' },
    { value: 'CN', label: 'China' },
    { value: 'IN', label: 'India' },
    { value: 'BR', label: 'Brazil' },
    { value: 'AR', label: 'Argentina' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colombia' },
    { value: 'PE', label: 'Peru' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'PY', label: 'Paraguay' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'GY', label: 'Guyana' },
    { value: 'SR', label: 'Suriname' },
    { value: 'FK', label: 'Falkland Islands' },
    { value: 'GF', label: 'French Guiana' },
    // All other countries alphabetically
    { value: 'AF', label: 'Afghanistan' },
    { value: 'AL', label: 'Albania' },
    { value: 'DZ', label: 'Algeria' },
    { value: 'AD', label: 'Andorra' },
    { value: 'AO', label: 'Angola' },
    { value: 'AG', label: 'Antigua and Barbuda' },
    { value: 'AM', label: 'Armenia' },
    { value: 'AZ', label: 'Azerbaijan' },
    { value: 'BS', label: 'Bahamas' },
    { value: 'BH', label: 'Bahrain' },
    { value: 'BD', label: 'Bangladesh' },
    { value: 'BB', label: 'Barbados' },
    { value: 'BY', label: 'Belarus' },
    { value: 'BZ', label: 'Belize' },
    { value: 'BJ', label: 'Benin' },
    { value: 'BT', label: 'Bhutan' },
    { value: 'BA', label: 'Bosnia and Herzegovina' },
    { value: 'BW', label: 'Botswana' },
    { value: 'BN', label: 'Brunei' },
    { value: 'BF', label: 'Burkina Faso' },
    { value: 'BI', label: 'Burundi' },
    { value: 'KH', label: 'Cambodia' },
    { value: 'CM', label: 'Cameroon' },
    { value: 'CV', label: 'Cape Verde' },
    { value: 'CF', label: 'Central African Republic' },
    { value: 'TD', label: 'Chad' },
    { value: 'KM', label: 'Comoros' },
    { value: 'CG', label: 'Congo' },
    { value: 'CR', label: 'Costa Rica' },
    { value: 'CU', label: 'Cuba' },
    { value: 'DJ', label: 'Djibouti' },
    { value: 'DM', label: 'Dominica' },
    { value: 'DO', label: 'Dominican Republic' },
    { value: 'EG', label: 'Egypt' },
    { value: 'SV', label: 'El Salvador' },
    { value: 'GQ', label: 'Equatorial Guinea' },
    { value: 'ER', label: 'Eritrea' },
    { value: 'ET', label: 'Ethiopia' },
    { value: 'FJ', label: 'Fiji' },
    { value: 'GA', label: 'Gabon' },
    { value: 'GM', label: 'Gambia' },
    { value: 'GE', label: 'Georgia' },
    { value: 'GH', label: 'Ghana' },
    { value: 'GD', label: 'Grenada' },
    { value: 'GT', label: 'Guatemala' },
    { value: 'GN', label: 'Guinea' },
    { value: 'GW', label: 'Guinea-Bissau' },
    { value: 'HT', label: 'Haiti' },
    { value: 'HN', label: 'Honduras' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'IR', label: 'Iran' },
    { value: 'IQ', label: 'Iraq' },
    { value: 'IL', label: 'Israel' },
    { value: 'JM', label: 'Jamaica' },
    { value: 'JO', label: 'Jordan' },
    { value: 'KZ', label: 'Kazakhstan' },
    { value: 'KE', label: 'Kenya' },
    { value: 'KI', label: 'Kiribati' },
    { value: 'KP', label: 'North Korea' },
    { value: 'KW', label: 'Kuwait' },
    { value: 'KG', label: 'Kyrgyzstan' },
    { value: 'LA', label: 'Laos' },
    { value: 'LB', label: 'Lebanon' },
    { value: 'LS', label: 'Lesotho' },
    { value: 'LR', label: 'Liberia' },
    { value: 'LY', label: 'Libya' },
    { value: 'LI', label: 'Liechtenstein' },
    { value: 'MK', label: 'North Macedonia' },
    { value: 'MG', label: 'Madagascar' },
    { value: 'MW', label: 'Malawi' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'MV', label: 'Maldives' },
    { value: 'ML', label: 'Mali' },
    { value: 'MH', label: 'Marshall Islands' },
    { value: 'MR', label: 'Mauritania' },
    { value: 'MU', label: 'Mauritius' },
    { value: 'FM', label: 'Micronesia' },
    { value: 'MD', label: 'Moldova' },
    { value: 'MC', label: 'Monaco' },
    { value: 'MN', label: 'Mongolia' },
    { value: 'ME', label: 'Montenegro' },
    { value: 'MA', label: 'Morocco' },
    { value: 'MZ', label: 'Mozambique' },
    { value: 'MM', label: 'Myanmar' },
    { value: 'NA', label: 'Namibia' },
    { value: 'NR', label: 'Nauru' },
    { value: 'NP', label: 'Nepal' },
    { value: 'NI', label: 'Nicaragua' },
    { value: 'NE', label: 'Niger' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'OM', label: 'Oman' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'PW', label: 'Palau' },
    { value: 'PS', label: 'Palestine' },
    { value: 'PA', label: 'Panama' },
    { value: 'PG', label: 'Papua New Guinea' },
    { value: 'PH', label: 'Philippines' },
    { value: 'QA', label: 'Qatar' },
    { value: 'RU', label: 'Russia' },
    { value: 'RW', label: 'Rwanda' },
    { value: 'KN', label: 'Saint Kitts and Nevis' },
    { value: 'LC', label: 'Saint Lucia' },
    { value: 'VC', label: 'Saint Vincent and the Grenadines' },
    { value: 'WS', label: 'Samoa' },
    { value: 'SM', label: 'San Marino' },
    { value: 'ST', label: 'Sao Tome and Principe' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'SN', label: 'Senegal' },
    { value: 'RS', label: 'Serbia' },
    { value: 'SC', label: 'Seychelles' },
    { value: 'SL', label: 'Sierra Leone' },
    { value: 'SG', label: 'Singapore' },
    { value: 'SB', label: 'Solomon Islands' },
    { value: 'SO', label: 'Somalia' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'SS', label: 'South Sudan' },
    { value: 'LK', label: 'Sri Lanka' },
    { value: 'SD', label: 'Sudan' },
    { value: 'SZ', label: 'Eswatini' },
    { value: 'SY', label: 'Syria' },
    { value: 'TW', label: 'Taiwan' },
    { value: 'TJ', label: 'Tajikistan' },
    { value: 'TZ', label: 'Tanzania' },
    { value: 'TH', label: 'Thailand' },
    { value: 'TL', label: 'Timor-Leste' },
    { value: 'TG', label: 'Togo' },
    { value: 'TO', label: 'Tonga' },
    { value: 'TT', label: 'Trinidad and Tobago' },
    { value: 'TN', label: 'Tunisia' },
    { value: 'TR', label: 'Turkey' },
    { value: 'TM', label: 'Turkmenistan' },
    { value: 'TV', label: 'Tuvalu' },
    { value: 'UG', label: 'Uganda' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'UZ', label: 'Uzbekistan' },
    { value: 'VU', label: 'Vanuatu' },
    { value: 'VA', label: 'Vatican City' },
    { value: 'VN', label: 'Vietnam' },
    { value: 'YE', label: 'Yemen' },
    { value: 'ZM', label: 'Zambia' },
    { value: 'ZW', label: 'Zimbabwe' }
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [recipientErrors, setRecipientErrors] = useState<Record<string, boolean>>({});
  const [onlySignerError, setOnlySignerError] = useState(false);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModalForm({ ...modalForm, [name]: value });
    setFormErrors(prev => ({ ...prev, [name]: false }));

    // Email validation
    if (name === 'buyerEmail' || name === 'sellerEmail' || name === 'agentEmail') {
      if (value && !validateEmail(value)) {
        setEmailErrors(prev => ({ ...prev, [name]: true }));
      } else {
        setEmailErrors(prev => ({ ...prev, [name]: false }));
      }
    }
  };

  const handleCountrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountrySearchTerm(value);
    
    // Always show dropdown when user is typing
    if (!showCountryDropdown) {
      setShowCountryDropdown(true);
    }
  };

  const scrollToSelectedCountry = () => {
    if (showCountryDropdown && modalForm.country) {
      setTimeout(() => {
        const selectedElement = document.querySelector(`[data-country-value="${modalForm.country}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleStateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStateSearchTerm(value);
    
    // Always show dropdown when user is typing
    if (!showStateDropdown) {
      setShowStateDropdown(true);
    }
  };

  const scrollToSelectedState = () => {
    if (showStateDropdown && modalForm.state) {
      setTimeout(() => {
        const selectedElement = document.querySelector(`[data-state-value="${modalForm.state}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Skip browser validation and use custom validation for step 1

    if (modalStep === 1) {
      // For step 1, validate the essential fields for contract creation
      const newErrors: Record<string, boolean> = {};
      
      if (!modalForm.title.trim()) {
        newErrors.title = true;
      }
      if (!modalForm.type.trim()) {
        newErrors.type = true;
      }
      
      if (Object.keys(newErrors).length > 0) {
        setFormErrors(newErrors);
        return;
      }
      
      setFormErrors({});
      setModalStep(2);
    } else if (modalStep === 2) {
      // Step 2: Validate recipients (parties) with visual error feedback
      const newRecipientErrors: Record<string, boolean> = {};
      let hasErrors = false;

      recipients.forEach((recipient, index) => {
        if (!recipient.name || recipient.name.trim() === '') {
          newRecipientErrors[`name-${index}`] = true;
          hasErrors = true;
        }
        if (!recipient.email || recipient.email.trim() === '') {
          newRecipientErrors[`email-${index}`] = true;
          hasErrors = true;
        } else if (!validateEmail(recipient.email)) {
          newRecipientErrors[`email-${index}`] = true;
          hasErrors = true;
        }
        if (!recipient.signerRole || recipient.signerRole.trim() === '') {
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
        return;
      }

      // Clear errors and proceed
      setRecipientErrors({});
      setModalStep(3);
    } else if (modalStep === 3) {
      // Step 3: Just progress to step 4 (document upload)
      setModalStep(4);
    } else if (modalStep === 4) {
      // Step 4: Create the contract (document upload is optional)
      // Validate essential fields for contract creation
      const requiredFields = ['title', 'type'];
      const missingFields = requiredFields.filter(field => !modalForm[field as keyof typeof modalForm]);
      
      if (missingFields.length > 0) {
        const newErrors: Record<string, boolean> = {};
        missingFields.forEach(field => {
          newErrors[field] = true;
        });
        setFormErrors(newErrors);
        return;
      }

      // Create new contract
      const newContractId = generateContractId();
      const partiesString = createPartiesString();
      
      // Map recipients by position: first = buyer, second = seller
      const buyerRecipient = recipients[0];
      const sellerRecipient = recipients[1];
      
      // Store party roles for the contract details modal
      const party1ContractRole = buyerRecipient?.contractRole || 'Buyer';
      const party2ContractRole = sellerRecipient?.contractRole || 'Seller';
      
      // Capture additional parties (Party 3 and beyond) with their emails
      const additionalPartiesData = recipients.slice(2).map(r => ({
        name: r.name,
        email: r.email,
        role: r.contractRole || 'Standard',
      }));

      
      const newContract: Contract = {
        id: newContractId,
        title: modalForm.title,
        parties: partiesString,
        status: 'Initiation',
        updated: 'Just now',
        value: formatCurrency(modalForm.value), // Format value as currency
        documents: uploadedFiles.length, // Count uploaded files
        type: modalForm.type,
        buyer: buyerRecipient?.name || '',
        seller: sellerRecipient?.name || '',
        // Include all form data
        milestone: modalForm.milestone,
        notes: modalForm.notes,
        closingDate: modalForm.closingDate,
        dueDate: modalForm.dueDate,
        propertyAddress: modalForm.propertyAddress,
        propertyType: modalForm.propertyType,
        escrowNumber: modalForm.escrowNumber,
        buyerEmail: buyerRecipient?.email || '',
        sellerEmail: sellerRecipient?.email || '',
        earnestMoney: formatCurrency(modalForm.earnestMoney),
        downPayment: formatCurrency(modalForm.downPayment),
        loanAmount: formatCurrency(modalForm.loanAmount),
        interestRate: modalForm.interestRate,
        loanTerm: modalForm.loanTerm,
        lenderName: modalForm.lenderName,
        sellerFinancialInstitution: modalForm.sellerFinancialInstitution,
        buyerFinancialInstitution: modalForm.buyerFinancialInstitution,
        buyerAccountNumber: modalForm.buyerAccountNumber,
        sellerAccountNumber: modalForm.sellerAccountNumber,
        buyerFinancialInstitutionRoutingNumber: modalForm.buyerFinancialInstitutionRoutingNumber,
        sellerFinancialInstitutionRoutingNumber: modalForm.sellerFinancialInstitutionRoutingNumber,
        titleCompany: modalForm.titleCompany,
        insuranceCompany: modalForm.insuranceCompany,
        inspectionPeriod: modalForm.inspectionPeriod,
        contingencies: modalForm.contingencies,
        city: modalForm.city,
        state: modalForm.state,
        zipCode: modalForm.zipCode,
        country: modalForm.country,
        additionalParties: additionalPartiesData,
        party1Role: party1ContractRole,
        party2Role: party2ContractRole,
        documentIds: uploadedDocumentIds, // Store document IDs
      };

      // Save the new contract to the mockContracts.ts file
      try {
        const response = await fetch('/api/contracts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContract),
        });

        if (!response.ok) {
          console.error('Failed to save contract to file');
        } else {
          // Create documents with proper IDs and associate them with the new contract
          const finalDocumentIds: string[] = [];
          
          // Process step4Documents (documents added during contract creation)
          if (step4Documents.length > 0) {
            try {
              for (const docInfo of step4Documents) {
                // Create document with proper ID and contract association
                const documentId = await addDocument(docInfo.file, newContractId, newContract.title, currentUserName);
                
                // Update the document name and assignee
                const { updateDocumentName } = useDocumentStore.getState();
                updateDocumentName(documentId, docInfo.name);

               // Set the assignee in the assignee store
               const { setAssignee } = useAssigneeStore.getState();
               setAssignee(documentId, docInfo.assignee);
                
                finalDocumentIds.push(documentId);
              }
            } catch (error) {
              console.error('Error creating documents for contract:', error);
            }
          }
          
          // Process any previously uploaded files (from handleFileChange)
          if (uploadedFiles.length > 0) {
            try {
              for (const file of uploadedFiles) {
                // Create document with proper ID and contract association
                const documentId = await addDocument(file, newContractId, newContract.title, currentUserName);
              
                // Set the assignee in the assignee store (using current user as default)
                const { setAssignee } = useAssigneeStore.getState();
                setAssignee(documentId, currentUserName);
                finalDocumentIds.push(documentId);
              }
            } catch (error) {
              console.error('Error creating documents from uploaded files:', error);
            }
          }
          
          // Update the contract with the final document IDs
          newContract.documentIds = finalDocumentIds;
        }
      } catch (error) {
        console.error('Error saving contract:', error);
      }

      // Add new contract to the contracts array
      setContracts(prev => [newContract, ...prev]);
      
      // Save new contract to localStorage for other pages to pick up
      try {
        localStorage.setItem('newContract', JSON.stringify(newContract));
        // Trigger storage event for other tabs/pages
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'newContract',
          newValue: JSON.stringify(newContract)
        }));
      } catch (error) {
        console.error('Error saving new contract to localStorage:', error);
      }
      
      // Close modal and reset form
      setShowNewContractForm(false);
      resetForm();
      setCountrySearchTerm('');
      setStateSearchTerm('');
      setUploadedFiles([]); // Clear uploaded files
      setUploadedDocumentIds([]); // Clear uploaded document IDs
      setStep4Documents([]); // Clear step 4 documents
      setDocumentName(''); // Clear document name
      setDocumentNameError(false); // Clear document name error
      
      // Show success feedback
      toast({
        title: "Contract created successfully",
        description: `"${newContract.title}" has been created with ID ${newContract.id}`,
        duration: Infinity, // Make toast persistent - user must close it manually
        onClick: () => {
          setSelectedContract(newContract);
        },
      });
    } else {
      setShowNewContractForm(false);
      setModalStep(1);
      setCountrySearchTerm('');
      setStateSearchTerm('');
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    // Validate document name is provided
    if (!documentName.trim()) {
      setDocumentNameError(true);
      return;
    }
    setDocumentNameError(false);
    
    const files = Array.from(e.target.files);
    // Only allow PDF, DOC, DOCX, JPG and max 10MB each
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "File Type/Size Warning",
        description: "Some files were skipped. Only PDF, DOC, DOCX, JPG files under 10MB are allowed.",
        variant: "destructive",
      });
    }
    
    try {
      // Store files with custom document name for later processing
      const renamedFiles = validFiles.map(file => {
        const fileExtension = file.name.split('.').pop() || '';
        const customFileName = `${documentName.trim()}.${fileExtension}`;
        return new File([file], customFileName, { type: file.type });
      });
      
      setUploadedFiles(renamedFiles);
      
      if (validFiles.length > 0) {
        toast({
          title: "Files Uploaded",
          description: `${validFiles.length} file(s) have been successfully uploaded as "${documentName.trim()}".`,
        });
      }
    } catch (error) {
      console.error('Error storing files:', error);
      toast({
        title: "Upload Error",
        description: "Failed to store some files. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter contracts based on search term and selected statuses
  const filteredContracts = contracts.filter(contract => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      contract.title.toLowerCase().includes(search) ||
      contract.parties.toLowerCase().includes(search) ||
      contract.id.toLowerCase().includes(search) ||
      contract.type.toLowerCase().includes(search)
    );
    const matchesStatus = selectedStatuses.includes('All') || selectedStatuses.includes(contract.status);
    const matchesContract = selectedContracts.length === 0 || selectedContracts.includes(contract.id);
    return matchesSearch && matchesStatus && matchesContract;
  }).sort((a, b) => {
    // Sort by last updated
    function parseUpdated(str: string) {
      if (!str) return 0;
      const n = parseInt(str);
      if (str.includes('hour')) return Date.now() - n * 60 * 60 * 1000;
      if (str.includes('day')) return Date.now() - n * 24 * 60 * 60 * 1000;
      if (str.includes('week')) return Date.now() - n * 7 * 24 * 60 * 60 * 1000;
      if (str.includes('minute')) return Date.now() - n * 60 * 1000;
      return Date.now();
    }
    const aTime = parseUpdated(a.updated);
    const bTime = parseUpdated(b.updated);
    if (lastUpdatedSort === 'desc') {
      return bTime - aTime;
    } else {
      return aTime - bTime;
    }
  });

  // Convert stored documents to Document interface format
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
      assignee: storedDoc.assignee || '',
      documentType: storedDoc.documentType || '',
    };
  };

  // Get stored documents and convert them to Document interface
  const { getAllDocuments } = useDocumentStore.getState();
  const storedDocuments = getAllDocuments();
  const convertedStoredDocuments = storedDocuments.map(storedDoc => {
    // Use the stored contractName if available, otherwise try to find it in contracts
    const contractTitle = storedDoc.contractName || contracts.find(c => c.id === storedDoc.contractId)?.title || 'Unknown Contract';
    return convertStoredToDocument(storedDoc, contractTitle);
  });

  // Combine sample documents with stored documents
  const allDocuments = [...sampleDocuments, ...convertedStoredDocuments];

  // Filter documents based on search term
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doc.contractName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.contractId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.assignee?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesContract = selectedContracts.length === 0 || 
      (doc.contractId && selectedContracts.includes(doc.contractId));

    const matchesAssignee = selectedAssignees.length === 0 || 
      (selectedAssignees.includes('__ME__') ? 
        (doc.assignee === currentUserName) : 
        (doc.assignee && selectedAssignees.includes(doc.assignee)));

    return matchesSearch && matchesContract && matchesAssignee;
  });

  // Get unique statuses from contracts
  const availableStatuses = [
    'All',
    'Initiation',
    'Preparation',
    'Wire Details',
    'In Review',
    'Signatures',
    'Funds Disbursed',
    'Complete'
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

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Initiation': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-800 dark:border-blue-800';
      case 'Preparation': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      case 'In Review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-800 dark:border-yellow-800';
      case 'Wire Details': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-800 dark:border-orange-800';
      case 'Signatures': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-800 dark:border-purple-800';
      case 'Funds Disbursed': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400 border border-teal-800 dark:border-teal-800';
      case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'Complete': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
      case 'Verified': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
      case 'Pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-800 dark:border-yellow-800';
      case 'Rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-800 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
    }
  };

  const getTaskStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
      case 'in progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-800 dark:border-blue-800';
      case 'in review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-800 dark:border-yellow-800';
      case 'done': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
      case 'blocked': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-800 dark:border-red-800';
      case 'on hold': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-800 dark:border-orange-800';
      case 'canceled': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
    }
  };

  const getTaskStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do': return 'To Do';
      case 'in progress': return 'In Progress';
      case 'in review': return 'In Review';
      case 'done': return 'Done';
      case 'blocked': return 'Blocked';
      case 'on hold': return 'On Hold';
      case 'canceled': return 'Canceled';
      default: return status;
    }
  };

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [selectedType, setSelectedType] = useState('Property Sale');
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);
  const [editableBuyer, setEditableBuyer] = useState('');
  const [isEditingSeller, setIsEditingSeller] = useState(false);
  const [editableSeller, setEditableSeller] = useState('');
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [editableAgent, setEditableAgent] = useState('');

  // Add state for party emails and roles
  const [party1Email, setParty1Email] = useState('');
  const [party2Email, setParty2Email] = useState('');
  const [party1Role, setParty1Role] = useState('Buyer');
  const [party2Role, setParty2Role] = useState('Seller');
  const [showParty1RoleDropdown, setShowParty1RoleDropdown] = useState(false);
  const [showParty2RoleDropdown, setShowParty2RoleDropdown] = useState(false);
  const party1RoleDropdownRef = useRef<HTMLDivElement>(null);
  const party2RoleDropdownRef = useRef<HTMLDivElement>(null);

  // Add state for additional parties
  const [additionalParties, setAdditionalParties] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isEditing: boolean;
    showRoleDropdown: boolean;
  }>>([]);
  const additionalPartyRoleDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showAdditionalParties, setShowAdditionalParties] = useState(false);

  // Add contract comments state and functions
  const [contractComments, setContractComments] = useState<Record<string, Comment[]>>(() => {
    if (typeof window !== 'undefined') {
      const savedComments = localStorage.getItem('contractComments');
      if (savedComments) {
        return JSON.parse(savedComments);
      }
    }
    return {};
  });

  const [editingContractCommentId, setEditingContractCommentId] = useState<string | null>(null);

  // Save contract comments to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contractComments', JSON.stringify(contractComments));
    }
  }, [contractComments]);

  const handlePostContractComment = () => {
    if (!selectedContract || !commentEditor || !commentEditor.getText().trim()) return;

    const contractId = selectedContract.id;
    const currentComments = contractComments[contractId] || [];

    if (editingContractCommentId) {
      // Update existing comment
      setContractComments({
        ...contractComments,
        [contractId]: currentComments.map((comment: Comment) => 
          comment.id === editingContractCommentId 
            ? { ...comment, content: commentEditor.getHTML() }
            : comment
        )
      });
      setEditingContractCommentId(null);
    } else {
      // Add new comment at the end
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'Current User',
        content: commentEditor.getHTML(),
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        avatarColor: 'bg-primary/10',
        textColor: 'text-primary'
      };
      setContractComments({
        ...contractComments,
        [contractId]: [...currentComments, newComment]
      });
    }
    commentEditor.commands.clearContent();
  };

  const handleEditContractComment = (commentId: string) => {
    if (!selectedContract) return;
    const contractId = selectedContract.id;
    const currentComments = contractComments[contractId] || [];
    const comment = currentComments.find((c: Comment) => c.id === commentId);
    if (comment && commentEditor) {
      commentEditor.commands.setContent(comment.content);
      setEditingContractCommentId(commentId);
    }
  };
  const handleDeleteContractComment = (commentId: string) => {
    if (!selectedContract) return;
    const contractId = selectedContract.id;
    const currentComments = contractComments[contractId] || [];
    setContractComments({
      ...contractComments,
      [contractId]: currentComments.filter((comment: Comment) => comment.id !== commentId)
    });
  };

  const [documentsBoxHeight, setDocumentsBoxHeight] = useState<number | undefined>(undefined);
  const documentsBoxRef = useRef<HTMLDivElement>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalFiles, setUploadModalFiles] = useState<File[]>([]);
  const [uploadContractId, setUploadContractId] = useState<string | null>(null);
  const [uploadModalAssignee, setUploadModalAssignee] = useState<string>('');
  const [uploadModalDocumentName, setUploadModalDocumentName] = useState<string>('');
  const [uploadModalDocumentType, setUploadModalDocumentType] = useState<string>('');
  const [showUploadModalAssigneeDropdown, setShowUploadModalAssigneeDropdown] = useState(false);
  const [uploadModalErrors, setUploadModalErrors] = useState<{
    fileSource: boolean;
    documentName: boolean;
    assignee: boolean;
    files: boolean;
  }>({
    fileSource: false,
    documentName: false,
    assignee: false,
    files: false
  });
  const uploadModalAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const uploadModalAssigneeInputRef = useRef<HTMLInputElement>(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);
  const [showClickToUploadDropdown, setShowClickToUploadDropdown] = useState(false);
  const clickToUploadDropdownRef = useRef<HTMLDivElement>(null);

  // State for tracking added documents in upload modal
  const [uploadModalAddedDocuments, setUploadModalAddedDocuments] = useState<Array<{
    files: File[];
    documentName: string;
    documentType: string;
    assignee: string;
  }>>([]);

  // State for inline editing of upload modal documents
  const [editingUploadModalDocumentIndex, setEditingUploadModalDocumentIndex] = useState<number | null>(null);
  const [inlineEditingUploadModalDocumentName, setInlineEditingUploadModalDocumentName] = useState('');
  const [inlineEditingUploadModalDocumentType, setInlineEditingUploadModalDocumentType] = useState('');
  const [inlineEditingUploadModalDocumentAssignee, setInlineEditingUploadModalDocumentAssignee] = useState('');
  const [showInlineEditingUploadModalAssigneeDropdown, setShowInlineEditingUploadModalAssigneeDropdown] = useState(false);
  const inlineEditingUploadModalAssigneeDropdownRef = useRef<HTMLDivElement>(null);

  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ name: string; url: string; id?: string } | null>(null);

  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);

  // Add state for editing value at the top with other edit states
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editableValue, setEditableValue] = useState('');

  // Add state for editing contract details fields
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editableAddress, setEditableAddress] = useState('');
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [editableCity, setEditableCity] = useState('');
  const [isEditingZipCode, setIsEditingZipCode] = useState(false);
  const [editableZipCode, setEditableZipCode] = useState('');
  const [isEditingEscrowNumber, setIsEditingEscrowNumber] = useState(false);
  const [editableEscrowNumber, setEditableEscrowNumber] = useState('');
  const [isEditingLoanAmount, setIsEditingLoanAmount] = useState(false);
  const [editableLoanAmount, setEditableLoanAmount] = useState('');
  const [isEditingLoanTerm, setIsEditingLoanTerm] = useState(false);
  const [editableLoanTerm, setEditableLoanTerm] = useState('');
  const [isEditingInterestRate, setIsEditingInterestRate] = useState(false);
  const [editableInterestRate, setEditableInterestRate] = useState('');
  const [isEditingDownPayment, setIsEditingDownPayment] = useState(false);
  const [editableDownPayment, setEditableDownPayment] = useState('');
  const [isEditingEarnestMoney, setIsEditingEarnestMoney] = useState(false);
  const [editableEarnestMoney, setEditableEarnestMoney] = useState('');
  const [isEditingInspectionPeriod, setIsEditingInspectionPeriod] = useState(false);
  const [editableInspectionPeriod, setEditableInspectionPeriod] = useState('');
  const [isEditingTitleCompany, setIsEditingTitleCompany] = useState(false);
  const [editableTitleCompany, setEditableTitleCompany] = useState('');
  const [isEditingInsuranceCompany, setIsEditingInsuranceCompany] = useState(false);
  const [editableInsuranceCompany, setEditableInsuranceCompany] = useState('');
  const [isEditingContingencies, setIsEditingContingencies] = useState(false);
  const [editableContingencies, setEditableContingencies] = useState('');

  // Add state for dropdown fields
  const [showContractDetailsStateDropdown, setShowContractDetailsStateDropdown] = useState(false);
  const [showContractDetailsCountryDropdown, setShowContractDetailsCountryDropdown] = useState(false);
  const [showContractDetailsPropertyTypeDropdown, setShowContractDetailsPropertyTypeDropdown] = useState(false);
  const [contractDetailsStateSearchTerm, setContractDetailsStateSearchTerm] = useState('');
  const [contractDetailsCountrySearchTerm, setContractDetailsCountrySearchTerm] = useState('');

  // Add state for contract details expand functionality
  const [showContractDetailsExpanded, setShowContractDetailsExpanded] = useState(false);

  // Add state for document name editing in contract details modal
  const [editingDocumentName, setEditingDocumentName] = useState<string | null>(null);
  const [customDocumentNames, setCustomDocumentNames] = useState<{[key: string]: string}>({});

  // Ref for status dropdown
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const contractDropdownRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const recentlyUpdatedDropdownRef = useRef<HTMLDivElement>(null);
  const recentlyUpdatedButtonRef = useRef<HTMLButtonElement>(null);
  const mobileStatusButtonRef = useRef<HTMLButtonElement>(null);
  const mobileStatusDropdownRef = useRef<HTMLDivElement>(null);
  const mobileContractButtonRef = useRef<HTMLButtonElement>(null);
  const mobileContractDropdownRef = useRef<HTMLDivElement>(null);
  const mobileAssigneeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const mobileRecentlyUpdatedButtonRef = useRef<HTMLButtonElement>(null);
  const mobileRecentlyUpdatedDropdownRef = useRef<HTMLDivElement>(null);

  const [showContractTypeDropdown, setShowContractTypeDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showMilestoneDropdown, setShowMilestoneDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const contractTypeDropdownRef = useRef<HTMLDivElement>(null);
  const propertyTypeDropdownRef = useRef<HTMLDivElement>(null);
  const milestoneDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const contractDetailsStateDropdownRef = useRef<HTMLDivElement>(null);
  const contractDetailsCountryDropdownRef = useRef<HTMLDivElement>(null);
  const contractDetailsPropertyTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const documentDetailsAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const documentDetailsAssigneeInputRef = useRef<HTMLInputElement>(null);

  const { allAssignees } = useAssigneeStore();

  const [docIdSortDirection, setDocIdSortDirection] = useState<'asc' | 'desc'>('asc');
  const [docNameSortDirection, setDocNameSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [docAssigneeSortDirection, setDocAssigneeSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [docUploadedBySortDirection, setDocUploadedBySortDirection] = useState<'asc' | 'desc' | null>(null);
  const [docContractSortDirection, setDocContractSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [docContractIdSortDirection, setDocContractIdSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [docDateUploadedSortDirection, setDocDateUploadedSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Add state at the top of the component:
  const [selectedUploadSource, setSelectedUploadSource] = useState<string | null>(null);

  // Add state for document upload modal
  const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentUploadName, setDocumentUploadName] = useState('');
  const [documentUploadAssignee, setDocumentUploadAssignee] = useState('');
  const [showDocumentUploadAssigneeDropdown, setShowDocumentUploadAssigneeDropdown] = useState(false);
  

  const newDocumentFileSourceDropdownRef = useRef<HTMLDivElement>(null);
  const newDocumentAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const inlineEditingNewDocumentAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const inlineEditingNewDocumentContractDropdownRef = useRef<HTMLDivElement>(null);
  const newDocumentContractDropdownRef = useRef<HTMLDivElement>(null);
  const newDocumentUploadDropdownRef = useRef<HTMLDivElement>(null);
  
  // Selected files state for step 4 documents
  const [step4SelectedFiles, setStep4SelectedFiles] = useState<File[]>([]);
  
  // Document data for step 4 (with custom names)
  const [step4Documents, setStep4Documents] = useState<Array<{file: File, name: string, type: string, assignee: string}>>([]);
  const newContractDesktopFileInputRef = useRef<HTMLInputElement>(null);
  
  // State for step 4 document name editing
  const [editingStep4DocumentName, setEditingStep4DocumentName] = useState<number | null>(null);
  
  // State for editing existing step 4 documents
  const [editingStep4Document, setEditingStep4Document] = useState<number | null>(null);

  // State for step 4 direct document upload fields
  const [step4FileSource, setStep4FileSource] = useState('');
  const [step4DocumentName, setStep4DocumentName] = useState('');
  const [step4DocumentType, setStep4DocumentType] = useState('');
  const [step4DocumentAssignee, setStep4DocumentAssignee] = useState('');
  const [showStep4FileSourceDropdown, setShowStep4FileSourceDropdown] = useState(false);
  const [showStep4AssigneeDropdown, setShowStep4AssigneeDropdown] = useState(false);
  const [showStep4UploadDropdown, setShowStep4UploadDropdown] = useState(false);
  const step4FileSourceDropdownRef = useRef<HTMLDivElement>(null);
  const step4AssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const step4UploadDropdownRef = useRef<HTMLDivElement>(null);
  
  // State for inline editing of step 4 documents
  const [editingStep4DocumentIndex, setEditingStep4DocumentIndex] = useState<number | null>(null);
  const [inlineEditingStep4DocumentName, setInlineEditingStep4DocumentName] = useState('');
  const [inlineEditingStep4DocumentType, setInlineEditingStep4DocumentType] = useState('');
  const [inlineEditingStep4DocumentAssignee, setInlineEditingStep4DocumentAssignee] = useState('');
  const [showStep4DocumentAssigneeDropdown, setShowStep4DocumentAssigneeDropdown] = useState(false);
  const step4DocumentAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  
  // State for rows per page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleRows, setVisibleRows] = useState(15); // Number of visible rows in the table
  const [isResizing, setIsResizing] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Function to handle dropdown clicks
  const handleDropdownClick = (
    event: React.MouseEvent,
    currentDropdown: boolean,
    setCurrentDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    otherDropdownSetters: Array<React.Dispatch<React.SetStateAction<boolean>>>
  ) => {
    event.stopPropagation();
    otherDropdownSetters.forEach(setter => setter(false));
    setCurrentDropdown(!currentDropdown);
  };

  // Click outside handler for form dropdowns (excluding country which has its own handler)
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const contractTypeDropdown = contractTypeDropdownRef.current;
      const milestoneDropdown = milestoneDropdownRef.current;
      const propertyTypeDropdown = propertyTypeDropdownRef.current;
      const stateDropdown = stateDropdownRef.current;
      
      if (!contractTypeDropdown?.contains(target) && 
          !milestoneDropdown?.contains(target) && 
          !propertyTypeDropdown?.contains(target) &&
          !stateDropdown?.contains(target)) {
        setShowContractTypeDropdown(false);
        setShowMilestoneDropdown(false);
        setShowPropertyTypeDropdown(false);
        setShowStateDropdown(false);
      }
    }

    if (showContractTypeDropdown || showMilestoneDropdown || showPropertyTypeDropdown || showStateDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContractTypeDropdown, showMilestoneDropdown, showPropertyTypeDropdown, showStateDropdown]);

  // Click outside handler for new document assignee dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const newDocumentAssigneeDropdown = newDocumentAssigneeDropdownRef.current;
      
      if (newDocumentAssigneeDropdown && !newDocumentAssigneeDropdown.contains(target)) {
        setShowNewDocumentAssigneeDropdown(false);
      }
    }

    if (showNewDocumentAssigneeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewDocumentAssigneeDropdown]);

  // Click outside handler for inline editing new document assignee dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const inlineEditingNewDocumentAssigneeDropdown = inlineEditingNewDocumentAssigneeDropdownRef.current;
      
      if (inlineEditingNewDocumentAssigneeDropdown && !inlineEditingNewDocumentAssigneeDropdown.contains(target)) {
        setShowInlineEditingNewDocumentAssigneeDropdown(false);
      }
    }

    if (showInlineEditingNewDocumentAssigneeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInlineEditingNewDocumentAssigneeDropdown]);

  // Separate click outside handler for country dropdown
  React.useEffect(() => {
    function handleCountryClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const countryDropdown = countryDropdownRef.current;
      
      if (countryDropdown && !countryDropdown.contains(target)) {
        setShowCountryDropdown(false);
        setCountrySearchTerm('');
      }
    }

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleCountryClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleCountryClickOutside);
    };
  }, [showCountryDropdown]);

  // Separate click outside handler for state dropdown
  React.useEffect(() => {
    function handleStateClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const stateDropdown = stateDropdownRef.current;
      
      if (stateDropdown && !stateDropdown.contains(target)) {
        setShowStateDropdown(false);
        setStateSearchTerm('');
      }
    }

    if (showStateDropdown) {
      document.addEventListener('mousedown', handleStateClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleStateClickOutside);
    };
  }, [showStateDropdown]);

  // Scroll to selected country when dropdown opens
  useEffect(() => {
    if (showCountryDropdown && modalForm.country && !countrySearchTerm) {
      scrollToSelectedCountry();
    }
  }, [showCountryDropdown, modalForm.country, countrySearchTerm]);

  // Scroll to selected state when dropdown opens
  useEffect(() => {
    if (showStateDropdown && modalForm.state && !stateSearchTerm) {
      scrollToSelectedState();
    }
  }, [showStateDropdown, modalForm.state, stateSearchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Handle contract type dropdown
      if (showContractTypeDropdown && contractTypeDropdownRef.current && !contractTypeDropdownRef.current.contains(target)) {
        setShowContractTypeDropdown(false);
      }
      
      // Handle property type dropdown
      if (showPropertyTypeDropdown && propertyTypeDropdownRef.current && !propertyTypeDropdownRef.current.contains(target)) {
        setShowPropertyTypeDropdown(false);
      }
      
      // Handle milestone dropdown
      if (showMilestoneDropdown && milestoneDropdownRef.current && !milestoneDropdownRef.current.contains(target)) {
        setShowMilestoneDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContractTypeDropdown, showPropertyTypeDropdown, showMilestoneDropdown]);

  // Add click outside handler for party role dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Handle party 1 role dropdown
      if (showParty1RoleDropdown && party1RoleDropdownRef.current && !party1RoleDropdownRef.current.contains(target)) {
        setShowParty1RoleDropdown(false);
      }
      
      // Handle party 2 role dropdown
      if (showParty2RoleDropdown && party2RoleDropdownRef.current && !party2RoleDropdownRef.current.contains(target)) {
        setShowParty2RoleDropdown(false);
      }

      // Handle additional party role dropdowns
      additionalParties.forEach(party => {
        if (party.showRoleDropdown && additionalPartyRoleDropdownRefs.current[party.id] && !additionalPartyRoleDropdownRefs.current[party.id]?.contains(target)) {
          toggleAdditionalPartyRoleDropdown(party.id);
        }
      });
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showParty1RoleDropdown, showParty2RoleDropdown, additionalParties]);

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

  // Add click outside handler for upload dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = uploadDropdownRef.current;
      
      // If clicking inside the dropdown (including any buttons), don't close
      if (dropdown?.contains(target)) {
        return;
      }
      
      // If clicking anywhere else, close the dropdown
      setShowUploadDropdown(false);
    }

    if (showUploadDropdown) {
      // Use 'mousedown' with a small delay to allow button clicks to process first
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 10);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUploadDropdown]);

  // Update editableTitle and selectedType when a contract is selected
  useEffect(() => {
    if (selectedContract) {
      setEditableTitle(selectedContract.title);
      setSelectedType(selectedContract.type || 'Property Sale');
      setEditableBuyer(selectedContract.buyer || selectedContract.parties?.split('&')[0]?.trim() || 'Robert Chen');
      setEditableSeller(selectedContract.seller || selectedContract.parties?.split('&')[1]?.trim() || 'Eastside Properties');
      setEditableAgent(selectedContract.agent || 'N/A');
      setEditableValue(selectedContract.value || '');
      
      // Set party roles from contract data
      setParty1Role(selectedContract.party1Role || 'Buyer');
      setParty2Role(selectedContract.party2Role || 'Seller');
      
      // Use stored additional parties data from contract if available
      if (selectedContract.additionalParties && selectedContract.additionalParties.length > 0) {
        const additional = selectedContract.additionalParties.map((party, index) => ({
          id: `party-${index + 3}`,
          name: party.name,
          email: party.email,
          role: party.role,
          isEditing: false,
          showRoleDropdown: false
        }));
        setAdditionalParties(additional);
      } else {
        // Fallback: parse from parties string for existing contracts without additionalParties data
        const allParties = selectedContract.parties?.split('&').map(p => p.trim()).filter(p => p) || [];
        if (allParties.length > 2) {
          const additional = allParties.slice(2).map((party, index) => ({
            id: `party-${index + 3}`,
            name: party,
            email: '',
            role: 'Standard',
            isEditing: false,
            showRoleDropdown: false
          }));
          setAdditionalParties(additional);
        } else {
          setAdditionalParties([]);
        }
      }
    }
  }, [selectedContract]);

  // Load enhanced contracts (updates + additional) on component mount
  useEffect(() => {
    const loadEnhancedContracts = async () => {
      try {
        const response = await fetch('/api/contracts');
        if (response.ok) {
          const data = await response.json();
          // Only update if we got valid data that's different from initial mockContracts
          if (data.contracts && data.contracts.length > 0) {
            setContracts(data.contracts);
          }
        } else {
          console.error('Failed to load enhanced contracts');
          // Keep the initial mockContracts that are already loaded
        }
      } catch (error) {
        console.error('Error loading enhanced contracts:', error);
        // Keep the initial mockContracts that are already loaded
      }
    };

    // Small delay to let the initial render complete, then enhance with API data
    const timeoutId = setTimeout(loadEnhancedContracts, 100);
    
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

  // Function to delete a stored document
  const deleteDocument = (documentId: string, documentName: string) => {
    try {
      // Check if this is a stored document (ID >= 8000 or old format with 'doc_' prefix)
      const docIdNum = parseInt(documentId);
      if (docIdNum >= 8000 || documentId.startsWith('doc_')) {
        // Remove from document store
        removeDocument(documentId);
        
        toast({
          title: "Document Deleted",
          description: `${documentName} has been permanently deleted.`,
        });
      } else {
        // Handle sample document deletion (placeholder)
        toast({
          title: "Cannot Delete Sample Document",
          description: "Sample documents cannot be deleted. Only uploaded documents can be removed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteContract = async (contractId: string, contractTitle: string) => {
    try {
      // First, delete all documents associated with this contract
      const { getAllDocuments, removeDocument } = useDocumentStore.getState();
      const allDocuments = getAllDocuments();
      const contractDocuments = allDocuments.filter(doc => doc.contractId === contractId);
      
      // Remove all documents associated with this contract
      contractDocuments.forEach(doc => {
        removeDocument(doc.id);
      });

      // Delete the contract from the backend
      const response = await fetch('/api/contracts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete contract from backend');
      }

      // Remove the contract from the contracts array
      setContracts(prev => prev.filter(contract => contract.id !== contractId));

      // If the deleted contract was selected, clear the selection
      if (selectedContract && selectedContract.id === contractId) {
        setSelectedContract(null);
      }

      // Show success message
      toast({
        title: "Contract Deleted",
        description: `"${contractTitle}" has been permanently deleted along with all associated documents.`,
      });

    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to update contract field and persist to backend
  const updateContractField = async (contractId: string, field: string, value: string) => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractId, field, value }),
      });

      if (response.ok) {
        // Update the contract in local state
        setContracts(prev => 
          prev.map(contract => 
            contract.id === contractId 
              ? { ...contract, [field]: value }
              : contract
          )
        );
        
        // Update the selected contract if it's the one being edited
        if (selectedContract && selectedContract.id === contractId) {
          setSelectedContract({ ...selectedContract, [field]: value });
        }
      } else {
        console.error('Failed to update contract');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  // Function to handle contract details field updates
  const handleContractDetailsFieldUpdate = (field: string, value: string) => {
    if (selectedContract) {
      updateContractField(selectedContract.id, field, value);
    }
  };

  // Helper function to generate contract hash
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

  // Helper functions for additional parties
  const handleAdditionalPartyNameChange = (partyId: string, newName: string) => {
    setAdditionalParties(prev => prev.map(party => 
      party.id === partyId ? { ...party, name: newName } : party
    ));
  };

  const handleAdditionalPartyEmailChange = (partyId: string, newEmail: string) => {
    setAdditionalParties(prev => prev.map(party => 
      party.id === partyId ? { ...party, email: newEmail } : party
    ));
  };

  const handleAdditionalPartyRoleChange = (partyId: string, newRole: string) => {
    setAdditionalParties(prev => prev.map(party => 
      party.id === partyId ? { ...party, role: newRole, showRoleDropdown: false } : party
    ));
  };

  const toggleAdditionalPartyEditing = (partyId: string) => {
    setAdditionalParties(prev => prev.map(party => 
      party.id === partyId ? { ...party, isEditing: !party.isEditing } : party
    ));
  };

  const toggleAdditionalPartyRoleDropdown = (partyId: string) => {
    setAdditionalParties(prev => prev.map(party => 
      party.id === partyId ? { ...party, showRoleDropdown: !party.showRoleDropdown } : party
    ));
  };

  // Helper function to get distinct colors for recipient cards
  const getRecipientCardBorderColor = (index: number) => {
    if (index === 0) {
      // First card uses brand color (teal)
      return '#0d9488'; // teal-600
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
    
    // Pre-populate document name with first file name (without extension) only if field is empty
    if (validFiles.length > 0 && !uploadModalDocumentName.trim()) {
      const fileName = validFiles[0].name;
      const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
      setUploadModalDocumentName(nameWithoutExtension);
    }
    
    // Ensure files are properly set for display
    if (validFiles.length > 0) {
      console.log('Files uploaded:', validFiles.length);
    }
  };

  // Handler for removing files from upload modal
  const handleRemoveUploadModalFile = (index: number) => {
    setUploadModalFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handler for adding documents to the upload modal
  const handleAddUploadModalDocument = () => {
    if (!uploadModalDocumentName.trim() || !uploadModalAssignee.trim() || uploadModalFiles.length === 0) {
      // Show validation errors
      setUploadModalErrors({
        fileSource: false,
        documentName: !uploadModalDocumentName.trim(),
        assignee: !uploadModalAssignee.trim(),
        files: uploadModalFiles.length === 0
      });
      return;
    }

    // Add the document to the list
    setUploadModalAddedDocuments(prev => [...prev, {
      files: [...uploadModalFiles],
      documentName: uploadModalDocumentName.trim(),
      documentType: uploadModalDocumentType.trim(),
      assignee: uploadModalAssignee.trim()
    }]);

    // Clear the form for next document
    setUploadModalFiles([]);
    setUploadModalDocumentName('');
    setUploadModalDocumentType('');
    setUploadModalAssignee('');
    setSelectedUploadSource(null);
    setUploadModalErrors({
      fileSource: false,
      documentName: false,
      assignee: false,
      files: false
    });
  };

  // Handler for removing added documents
  const handleRemoveUploadModalAddedDocument = (index: number) => {
    setUploadModalAddedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Function to start inline editing of an upload modal document
  const handleStartInlineEditUploadModalDocument = (index: number) => {
    const doc = uploadModalAddedDocuments[index];
    setEditingUploadModalDocumentIndex(index);
    setInlineEditingUploadModalDocumentName(doc.documentName);
    setInlineEditingUploadModalDocumentType(doc.documentType);
    setInlineEditingUploadModalDocumentAssignee(doc.assignee);
    setShowInlineEditingUploadModalAssigneeDropdown(false);
  };

  // Function to save inline edits of an upload modal document
  const handleSaveInlineEditUploadModalDocument = (index: number) => {
    if (inlineEditingUploadModalDocumentName.trim() && inlineEditingUploadModalDocumentAssignee.trim()) {
      setUploadModalAddedDocuments(prev => prev.map((doc, i) => 
        i === index 
          ? { 
              ...doc, 
              documentName: inlineEditingUploadModalDocumentName.trim(), 
              documentType: inlineEditingUploadModalDocumentType.trim(), 
              assignee: inlineEditingUploadModalDocumentAssignee.trim() 
            }
          : doc
      ));
      setEditingUploadModalDocumentIndex(null);
      setInlineEditingUploadModalDocumentName('');
      setInlineEditingUploadModalDocumentType('');
      setInlineEditingUploadModalDocumentAssignee('');
      setShowInlineEditingUploadModalAssigneeDropdown(false);
    }
  };

  // Function to cancel inline editing of an upload modal document
  const handleCancelInlineEditUploadModalDocument = () => {
    setEditingUploadModalDocumentIndex(null);
    setInlineEditingUploadModalDocumentName('');
    setInlineEditingUploadModalDocumentType('');
    setInlineEditingUploadModalDocumentAssignee('');
    setShowInlineEditingUploadModalAssigneeDropdown(false);
  };

  // Handler for document upload modal file selection
  const handleDocumentUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file type and size
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"];
    const isValidType = validTypes.includes(file.type);
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
    
    if (!isValidType || !isValidSize) {
      toast({
        title: "File Type/Size Error",
        description: "Only PDF, DOC, DOCX, JPG files under 10MB are allowed.",
        variant: "destructive",
      });
      return;
    }
    
    // Set the selected file and show the modal
    setSelectedFile(file);
    setDocumentUploadName(file.name.split('.')[0]); // Set default name without extension
    setShowDocumentUploadModal(true);
  };

  // Handler for saving document from upload modal
  const handleSaveDocumentUpload = async () => {
    if (!selectedFile || !documentUploadName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a document name.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new File object with the custom name but keep the original extension
      const fileExtension = selectedFile.name.split('.').pop() || '';
      const customFileName = `${documentUploadName.trim()}.${fileExtension}`;
      const customFile = new File([selectedFile], customFileName, { type: selectedFile.type });
      
      // Add file to uploaded files for later processing
      setUploadedFiles(prev => [...prev, customFile]);
      
      // Show success message
      toast({
        title: "Document Uploaded",
        description: `"${customFileName}" has been successfully uploaded.`,
      });
      
      // Close modal and reset state
      setShowDocumentUploadModal(false);
      setSelectedFile(null);
      setDocumentUploadName('');
      setDocumentUploadAssignee('');
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handler for closing document upload modal
  const handleCloseDocumentUploadModal = () => {
    setShowDocumentUploadModal(false);
    setSelectedFile(null);
    setDocumentUploadName('');
    setDocumentUploadAssignee('');
  };

  // Handler for upload modal submission
  const handleUploadModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any added documents
    if (uploadModalAddedDocuments.length === 0) {
      toast({
        title: "No Documents",
        description: "Please add at least one document before uploading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { addDocument } = useDocumentStore.getState();
      const contract = contracts.find(c => c.id === uploadContractId);
      const contractName = contract?.title || `Contract #${uploadContractId}`;
      
      // Create documents for each added document
      const createdDocumentIds: string[] = [];
      
      for (const doc of uploadModalAddedDocuments) {
        try {
          // Use the first file from the document's files array
          const file = doc.files[0];
          if (!file) continue;
          
          // Create a new File object with the custom document name but keep the original extension
          const fileExtension = file.name.split('.').pop() || '';
          const customFileName = `${doc.documentName.trim()}.${fileExtension}`;
          const customFile = new File([file], customFileName, { type: file.type });
          
          // Add document to the store
          const documentId = await addDocument(
            customFile, 
            uploadContractId!, 
            contractName, 
            currentUserName,
            doc.assignee,
            doc.documentType
          );
          
          createdDocumentIds.push(documentId);
          
        } catch (error) {
          console.error('Error creating document:', error);
          toast({
            title: "Document Creation Error",
            description: `Failed to create document "${doc.documentName}". Please try again.`,
            variant: "destructive",
          });
        }
      }

      // Show success message
      toast({
        title: "Documents Created",
        description: `${createdDocumentIds.length} document(s) have been successfully created and associated with contract #${uploadContractId}.`,
      });

      // Close modal and reset all state
      setShowUploadModal(false);
      setUploadModalFiles([]);
      setUploadModalDocumentName('');
      setUploadModalAssignee('');
      setSelectedUploadSource(null);
      setUploadContractId(null);
      setUploadModalAddedDocuments([]);
      setUploadModalErrors({
        fileSource: false,
        documentName: false,
        assignee: false,
        files: false
      });
      
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    }
  };



  // Calculate total contract value
  const calculateTotalValue = () => {
    const total = contracts.reduce((total, contract) => {
      // Remove '$' and ',' from value string and convert to number
      const value = parseFloat(contract.value?.replace(/[$,]/g, '') || '0');
      return total + value;
    }, 0);
    
    // Debug: Log contract count and total value to verify all contracts are included
    console.log('Contracts Page - Total Contracts:', contracts.length);
    console.log('Contracts Page - Total Value:', total);
    console.log('Contracts Page - Contract Values:', contracts.map(c => ({ id: c.id, title: c.title, value: c.value })));
    
    return total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Document name editing functions for contract details modal
  const getDocumentDisplayName = (doc: Document): string => {
    return customDocumentNames[doc.id] || doc.name;
  };

  const handleStartEditDocumentName = (doc: Document) => {
    setEditingDocumentName(doc.id);
  };

  const handleSaveDocumentName = (doc: Document, newName: string) => {
    if (newName.trim()) {
      setCustomDocumentNames(prev => ({ ...prev, [doc.id]: newName.trim() }));
      
      // Update the document in the document store if it's a stored document
      const docIdNum = parseInt(doc.id);
      if (docIdNum >= 8000 || doc.id.startsWith('doc_')) {
        const { updateDocumentName } = useDocumentStore.getState();
        updateDocumentName(doc.id, newName.trim());
      }
    }
    setEditingDocumentName(null);
  };

  const handleCancelEditDocumentName = () => {
    setEditingDocumentName(null);
  };

  // Step 4 document name editing functions
  const handleStartEditStep4DocumentName = (index: number) => {
    setEditingStep4DocumentName(index);
  };

  const handleSaveStep4DocumentName = (index: number, newName: string) => {
    if (newName.trim()) {
      setStep4Documents(prev => prev.map((doc, i) => 
        i === index ? { ...doc, name: newName.trim() } : doc
      ));
    }
    setEditingStep4DocumentName(null);
  };

  const handleCancelEditStep4DocumentName = () => {
    setEditingStep4DocumentName(null);
  };

  // Function to handle adding documents directly from step 4
  const handleAddStep4Document = () => {
    if (step4DocumentName.trim() && step4DocumentType.trim() && step4DocumentAssignee.trim() && step4SelectedFiles.length > 0) {
      const newDocument = {
        file: step4SelectedFiles[0],
        name: step4DocumentName.trim(),
        type: step4DocumentType.trim(),
        assignee: step4DocumentAssignee.trim()
      };
      setStep4Documents(prev => [...prev, newDocument]);
      
      // Reset form
      setStep4DocumentName('');
      setStep4DocumentType('');
      setStep4DocumentAssignee('');
      setStep4FileSource('');
      setStep4SelectedFiles([]);
    }
  };

  const handleAddNewDocument = () => {
    if (newDocumentName.trim() && documentModalForm.contract.trim() && newDocumentAssignee.trim() && newDocumentFormUploadedFiles.length > 0) {
      // Create a document for each uploaded file
      const newDocuments = newDocumentFormUploadedFiles.map(file => ({
        file: file,
        name: newDocumentName.trim(),
        type: newDocumentType.trim(),
        assignee: newDocumentAssignee.trim(),
        contract: documentModalForm.contract.trim()
      }));
      
      setNewDocumentDocuments(prev => [...prev, ...newDocuments]);
      
      // Reset form
      setNewDocumentName('');
      setNewDocumentType('');
      setNewDocumentAssignee('');
      setNewDocumentFormUploadedFiles([]);
    }
  };

  const handleStartInlineEditNewDocument = (index: number) => {
    const doc = newDocumentDocuments[index];
    setEditingNewDocumentIndex(index);
    setInlineEditingNewDocumentName(doc.name);
    setInlineEditingNewDocumentType(doc.type);
    setInlineEditingNewDocumentAssignee(doc.assignee);
    setInlineEditingNewDocumentContract(doc.contract || '');
    setShowInlineEditingNewDocumentAssigneeDropdown(false);
    setShowInlineEditingNewDocumentContractDropdown(false);
  };

  const handleSaveInlineEditNewDocument = (index: number) => {
    // Validate that contract is a valid selection from the contracts list
    const isValidContract = contracts.some(contract => 
      `${contract.id} - ${contract.title}` === inlineEditingNewDocumentContract.trim()
    );
    
    // Validate that assignee is a valid selection from the assignees list
    const isValidAssignee = allAssignees.includes(inlineEditingNewDocumentAssignee.trim());
    
    if (inlineEditingNewDocumentName.trim() && 
        inlineEditingNewDocumentType.trim() && 
        inlineEditingNewDocumentAssignee.trim() && 
        inlineEditingNewDocumentContract.trim() &&
        isValidContract &&
        isValidAssignee) {
      setNewDocumentDocuments(prev => prev.map((doc, i) => 
        i === index 
          ? { ...doc, name: inlineEditingNewDocumentName.trim(), type: inlineEditingNewDocumentType.trim(), assignee: inlineEditingNewDocumentAssignee.trim(), contract: inlineEditingNewDocumentContract.trim() }
          : doc
      ));
      setEditingNewDocumentIndex(null);
      setInlineEditingNewDocumentName('');
      setInlineEditingNewDocumentType('');
      setInlineEditingNewDocumentAssignee('');
      setInlineEditingNewDocumentContract('');
      setShowInlineEditingNewDocumentAssigneeDropdown(false);
      setShowInlineEditingNewDocumentContractDropdown(false);
    }
  };

  const handleCancelInlineEditNewDocument = () => {
    setEditingNewDocumentIndex(null);
    setInlineEditingNewDocumentName('');
    setInlineEditingNewDocumentType('');
    setInlineEditingNewDocumentAssignee('');
    setInlineEditingNewDocumentContract('');
    setShowInlineEditingNewDocumentAssigneeDropdown(false);
    setShowInlineEditingNewDocumentContractDropdown(false);
  };

  // Function to handle editing existing step 4 document
  const handleEditStep4Document = (index: number) => {
    const doc = step4Documents[index];
    setStep4DocumentName(doc.name);
    setStep4DocumentType(doc.type || '');
    setStep4DocumentAssignee(doc.assignee);
    setEditingStep4Document(index);
  };

  // Function to start inline editing of a step 4 document
  const handleStartInlineEditStep4Document = (index: number) => {
    const doc = step4Documents[index];
    setEditingStep4DocumentIndex(index);
    setInlineEditingStep4DocumentName(doc.name);
    setInlineEditingStep4DocumentType(doc.type || '');
    setInlineEditingStep4DocumentAssignee(doc.assignee);
    setShowStep4DocumentAssigneeDropdown(false);
  };

  // Function to save inline edits of a step 4 document
  const handleSaveInlineEditStep4Document = (index: number) => {
    if (inlineEditingStep4DocumentName.trim() && inlineEditingStep4DocumentType.trim() && inlineEditingStep4DocumentAssignee.trim()) {
      setStep4Documents(prev => prev.map((doc, i) => 
        i === index 
          ? { ...doc, name: inlineEditingStep4DocumentName.trim(), type: inlineEditingStep4DocumentType.trim(), assignee: inlineEditingStep4DocumentAssignee.trim() }
          : doc
      ));
      setEditingStep4DocumentIndex(null);
      setInlineEditingStep4DocumentName('');
      setInlineEditingStep4DocumentType('');
      setInlineEditingStep4DocumentAssignee('');
      setShowStep4DocumentAssigneeDropdown(false);
    }
  };

  // Function to cancel inline editing of a step 4 document
  const handleCancelInlineEditStep4Document = () => {
    setEditingStep4DocumentIndex(null);
    setInlineEditingStep4DocumentName('');
    setInlineEditingStep4DocumentType('');
    setInlineEditingStep4DocumentAssignee('');
    setShowStep4DocumentAssigneeDropdown(false);
  };

  // Add commentEditor setup
  const commentEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Link,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: '',
  });
  // Add state for sorting
  const [idSortDirection, setIdSortDirection] = useState<'asc' | 'desc'>('asc');
  const [contractSortDirection, setContractSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [partiesSortDirection, setPartiesSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [contractTypeSortDirection, setContractTypeSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [statusSortDirection, setStatusSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [createdDateSortDirection, setCreatedDateSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [lastUpdatedSortDirection, setLastUpdatedSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [valueSortDirection, setValueSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Sorting handlers
  const handleIdSort = () => {
    setIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setContractTypeSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleContractSort = () => {
    setContractSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPartiesSortDirection(null);
    setContractTypeSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handlePartiesSort = () => {
    setPartiesSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setContractTypeSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleContractTypeSort = () => {
    setContractTypeSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleStatusSort = () => {
    setStatusSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setContractTypeSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleCreatedDateSort = () => {
    setCreatedDateSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setContractTypeSortDirection(null);
    setStatusSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleLastUpdatedSort = () => {
    setLastUpdatedSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setContractTypeSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setValueSortDirection(null);
  };
  const handleValueSort = () => {
    setValueSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setContractTypeSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
  };

  // Helper to parse 'updated' field
  function parseUpdated(str: string) {
    if (!str) return 0;
    const n = parseInt(str);
    if (str.includes('hour')) return Date.now() - n * 60 * 60 * 1000;
    if (str.includes('day')) return Date.now() - n * 24 * 60 * 60 * 1000;
    if (str.includes('week')) return Date.now() - n * 7 * 24 * 60 * 60 * 1000;
    if (str.includes('minute')) return Date.now() - n * 60 * 1000;
    return Date.now();
  }

  // Helper to parse value string
  function parseValue(val?: string) {
    if (!val) return 0;
    return parseFloat(val.replace(/[$,]/g, ''));
  }

      // Sort filteredContracts by id, contract name, parties, contract type, status, created date, last updated, or value
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    if (valueSortDirection) {
      const aValue = parseValue(a.value);
      const bValue = parseValue(b.value);
      if (valueSortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    } else if (lastUpdatedSortDirection) {
      const aTime = parseUpdated(a.updated);
      const bTime = parseUpdated(b.updated);
      if (lastUpdatedSortDirection === 'asc') {
        return aTime - bTime;
      } else {
        return bTime - aTime;
      }
    } else if (createdDateSortDirection) {
      const aDate = new Date('2024-05-01');
      const bDate = new Date('2024-05-01');
      if (createdDateSortDirection === 'asc') {
        return aDate.getTime() - bDate.getTime();
      } else {
        return bDate.getTime() - aDate.getTime();
      }
    } else if (statusSortDirection) {
      const aStatus = a.status.toLowerCase();
      const bStatus = b.status.toLowerCase();
      if (statusSortDirection === 'asc') {
        return aStatus.localeCompare(bStatus);
      } else {
        return bStatus.localeCompare(aStatus);
      }
    } else if (contractTypeSortDirection) {
      const aType = (a.type || '').toLowerCase();
      const bType = (b.type || '').toLowerCase();
      if (contractTypeSortDirection === 'asc') {
        return aType.localeCompare(bType);
      } else {
        return bType.localeCompare(aType);
      }
    } else if (partiesSortDirection) {
      const aParties = a.parties.toLowerCase();
      const bParties = b.parties.toLowerCase();
      if (partiesSortDirection === 'asc') {
        return aParties.localeCompare(bParties);
      } else {
        return bParties.localeCompare(aParties);
      }
    } else if (contractSortDirection) {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      if (contractSortDirection === 'asc') {
        return aTitle.localeCompare(bTitle);
      } else {
        return bTitle.localeCompare(aTitle);
      }
    } else {
      const aId = Number(a.id);
      const bId = Number(b.id);
      if (idSortDirection === 'asc') {
        return aId - bId;
      } else {
        return bId - aId;
      }
    }
  });

  const { getTasksByContract, initializeTasks } = useTaskStore();

  useEffect(() => {
    initializeTasks();
  }, [initializeTasks]);

  // Add click-off behavior for upload modal assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = uploadModalAssigneeDropdownRef.current;
      const input = uploadModalAssigneeInputRef.current;

      if (showUploadModalAssigneeDropdown && 
          !dropdown?.contains(target) && 
          !input?.contains(target)) {
        setShowUploadModalAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUploadModalAssigneeDropdown]);

  // Add click-outside handler for document details assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = documentDetailsAssigneeDropdownRef.current;
      const input = documentDetailsAssigneeInputRef.current;

      if (showAssigneeDropdown && 
          !dropdown?.contains(target) && 
          !input?.contains(target)) {
        setShowAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAssigneeDropdown]);

  // Document sorting handlers
  const handleDocIdSort = () => {
    setDocIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setDocNameSortDirection(null);
    setDocAssigneeSortDirection(null);
    setDocUploadedBySortDirection(null);
    setDocDateUploadedSortDirection(null);
    setDocContractSortDirection(null);
    setDocContractIdSortDirection(null);
  };

  const handleDocNameSort = () => {
    setDocNameSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setDocIdSortDirection('asc');
    setDocAssigneeSortDirection(null);
    setDocUploadedBySortDirection(null);
    setDocDateUploadedSortDirection(null);
    setDocContractSortDirection(null);
    setDocContractIdSortDirection(null);
  };

  const handleDocAssigneeSort = () => {
    setDocAssigneeSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setDocIdSortDirection('asc');
    setDocNameSortDirection(null);
    setDocUploadedBySortDirection(null);
    setDocDateUploadedSortDirection(null);
    setDocContractSortDirection(null);
    setDocContractIdSortDirection(null);
  };

  const handleDocUploadedBySort = () => {
    setDocUploadedBySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setDocIdSortDirection('asc');
    setDocNameSortDirection(null);
    setDocAssigneeSortDirection(null);
    setDocContractSortDirection(null);
    setDocContractIdSortDirection(null);
  };

  const handleDocContractSort = () => {
    setDocContractSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setDocIdSortDirection('asc');
    setDocNameSortDirection(null);
    setDocAssigneeSortDirection(null);
    setDocUploadedBySortDirection(null);
    setDocContractIdSortDirection(null);
  };

  const handleDocContractIdSort = () => {
    setDocContractIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setDocIdSortDirection('asc');
    setDocNameSortDirection(null);
    setDocAssigneeSortDirection(null);
    setDocUploadedBySortDirection(null);
    setDocContractSortDirection(null);
  };

  const handleDocDateUploadedSort = () => {
    setDocDateUploadedSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setDocIdSortDirection('asc');
    setDocNameSortDirection(null);
    setDocAssigneeSortDirection(null);
    setDocUploadedBySortDirection(null);
    setDocContractSortDirection(null);
    setDocContractIdSortDirection(null);
  };

  // Sort filteredDocuments based on selected sort direction
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (docContractIdSortDirection) {
      const aId = Number(a.contractId?.replace(/[^0-9]/g, '') || '0');
      const bId = Number(b.contractId?.replace(/[^0-9]/g, '') || '0');
      return docContractIdSortDirection === 'asc' ? aId - bId : bId - aId;
    } else if (docContractSortDirection) {
              const aTitle = (a.contractName || '').toLowerCase();
        const bTitle = (b.contractName || '').toLowerCase();
      return docContractSortDirection === 'asc' 
        ? aTitle.localeCompare(bTitle)
        : bTitle.localeCompare(aTitle);
    } else if (docDateUploadedSortDirection) {
      const aDate = new Date(a.dateUploaded || '').getTime();
      const bDate = new Date(b.dateUploaded || '').getTime();
      return docDateUploadedSortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    } else if (docUploadedBySortDirection) {
      const aUploader = (a.uploadedBy || '').toLowerCase();
      const bUploader = (b.uploadedBy || '').toLowerCase();
      return docUploadedBySortDirection === 'asc'
        ? aUploader.localeCompare(bUploader)
        : bUploader.localeCompare(aUploader);
    } else if (docAssigneeSortDirection) {
      const aAssignee = (a.assignee || '').toLowerCase();
      const bAssignee = (b.assignee || '').toLowerCase();
      return docAssigneeSortDirection === 'asc'
        ? aAssignee.localeCompare(bAssignee)
        : bAssignee.localeCompare(aAssignee);
    } else if (docNameSortDirection) {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      return docNameSortDirection === 'asc'
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    } else {
      const aId = Number(a.id.replace(/[^0-9]/g, ''));
      const bId = Number(b.id.replace(/[^0-9]/g, ''));
      return docIdSortDirection === 'asc' ? aId - bId : bId - aId;
    }
  });

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

  // Add click-outside handler for contract dropdown
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

  // Add click-outside handler for assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = assigneeDropdownRef.current;
      const mobileDropdown = mobileAssigneeDropdownRef.current;
      const desktopButton = assigneeButtonRef.current;
      const mobileButton = mobileAssigneeButtonRef.current;
      
      // Only check if dropdown is open
      if (openAssigneeDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setOpenAssigneeDropdown(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openAssigneeDropdown]);

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

  // Add click-outside handler for new document upload dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = newDocumentUploadDropdownRef.current;
      
      // Only check if dropdown is open
      if (showNewDocumentUploadDropdown) {
        // Check if clicking inside the dropdown
        const isInsideDropdown = dropdown?.contains(target);
        
        // If clicking outside the dropdown, close it
        if (!isInsideDropdown) {
          setShowNewDocumentUploadDropdown(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewDocumentUploadDropdown]);

  // Click-off behavior for each recipient role dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      recipients.forEach((recipient, idx) => {
        const target = event.target as Node;
        if (
          recipient.signerRoleButtonRef.current?.contains(target) ||
          recipient.signerRoleDropdownRef.current?.contains(target)
        ) {
          // Click inside signer role button or dropdown: do nothing
          return;
        }
        if (recipient.showSignerRoleDropdown) {
          setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showSignerRoleDropdown: false } : r));
        }
        if (
          recipient.contractRoleButtonRef.current?.contains(target) ||
          recipient.contractRoleDropdownRef.current?.contains(target)
        ) {
          // Click inside contract role button or dropdown: do nothing
          return;
        }
        if (recipient.showContractRoleDropdown) {
          setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: false } : r));
        }
      });
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [recipients]);
  // Add style element for dark mode autofill fix
  React.useEffect(() => {
    const styleId = 'dark-mode-autofill-fix';
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create new style element
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .dark input:-webkit-autofill,
      .dark input:-webkit-autofill:hover,
      .dark input:-webkit-autofill:focus,
      .dark input:-webkit-autofill:active,
      .dark textarea:-webkit-autofill,
      .dark textarea:-webkit-autofill:hover,
      .dark textarea:-webkit-autofill:focus,
      .dark textarea:-webkit-autofill:active {
        -webkit-box-shadow: 
          0 0 0 1000px rgb(17 24 39) inset !important,
          0 0 0 2000px rgb(17 24 39) inset !important;
        box-shadow: 
          0 0 0 1000px rgb(17 24 39) inset !important,
          0 0 0 2000px rgb(17 24 39) inset !important;
        -webkit-text-fill-color: rgb(255 255 255) !important;
        color: rgb(255 255 255) !important;
        background-color: rgb(17 24 39) !important;
        background-image: none !important;
        background: rgb(17 24 39) !important;
        border-color: rgb(75 85 99) !important;
        font-family: 'Avenir', sans-serif !important;
        font-size: 0.75rem !important;
        font-weight: normal !important;
        transition: all 0s !important;
        -webkit-transition: all 0s !important;
        -moz-transition: all 0s !important;
        -webkit-animation: none !important;
        animation: none !important;
        -webkit-animation-delay: 99999s !important;
        animation-delay: 99999s !important;
      }
      
      .dark input:-webkit-autofill::selection {
        background-color: rgb(59 130 246) !important;
        color: rgb(255 255 255) !important;
      }
      
             .dark input:focus:-webkit-autofill,
       .dark input:not(:focus):-webkit-autofill {
         -webkit-box-shadow: 0 0 0 1000px rgb(17 24 39) inset !important;
         box-shadow: 0 0 0 1000px rgb(17 24 39) inset !important;
         background-color: rgb(17 24 39) !important;
         border-color: rgb(75 85 99) !important;
       }
       
       .dark input:-webkit-autofill-strong-password,
       .dark input:-webkit-autofill-strong-password:hover,
       .dark input:-webkit-autofill-strong-password:focus,
       .dark input:-webkit-autofill-and-obscured,
       .dark input:-webkit-autofill-and-obscured:hover,
       .dark input:-webkit-autofill-and-obscured:focus {
         -webkit-box-shadow: 0 0 0 1000px rgb(17 24 39) inset !important;
         box-shadow: 0 0 0 1000px rgb(17 24 39) inset !important;
         -webkit-text-fill-color: rgb(255 255 255) !important;
         color: rgb(255 255 255) !important;
         background-color: rgb(17 24 39) !important;
         background-image: none !important;
         border-color: rgb(75 85 99) !important;
         transition: none !important;
         -webkit-transition: none !important;
         animation: none !important;
         -webkit-animation: none !important;
       }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);



  // Click outside handler for new document file source dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showNewDocumentFileSourceDropdown && !newDocumentFileSourceDropdownRef.current?.contains(event.target as Node)) {
        setShowNewDocumentFileSourceDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewDocumentFileSourceDropdown]);

  // Click outside handler for new document assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
          if (showNewDocumentAssigneeDropdown && !newDocumentAssigneeDropdownRef.current?.contains(event.target as Node)) {
      setShowNewDocumentAssigneeDropdown(false);
    }
    if (showNewDocumentContractDropdown && !newDocumentContractDropdownRef.current?.contains(event.target as Node)) {
      setShowNewDocumentContractDropdown(false);
    }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewDocumentAssigneeDropdown, showNewDocumentContractDropdown]);

  // Click outside handler for completion time dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openCompletionTimeDropdown && !completionTimeDropdownRef.current?.contains(event.target as Node)) {
        setOpenCompletionTimeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openCompletionTimeDropdown]);

  // Click outside handler for step 4 file source dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showStep4FileSourceDropdown && !step4FileSourceDropdownRef.current?.contains(event.target as Node)) {
        setShowStep4FileSourceDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStep4FileSourceDropdown]);

  // Click outside handler for step 4 assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showStep4AssigneeDropdown && !step4AssigneeDropdownRef.current?.contains(event.target as Node)) {
        setShowStep4AssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStep4AssigneeDropdown]);

  // Click outside handler for step 4 upload dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showStep4UploadDropdown && !step4UploadDropdownRef.current?.contains(event.target as Node)) {
        setShowStep4UploadDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStep4UploadDropdown]);

  // Click outside handler for step 4 document inline editing assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showStep4DocumentAssigneeDropdown && !step4DocumentAssigneeDropdownRef.current?.contains(event.target as Node)) {
        setShowStep4DocumentAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStep4DocumentAssigneeDropdown]);

  // Click outside handler for inline editing new document assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showInlineEditingNewDocumentAssigneeDropdown && !inlineEditingNewDocumentAssigneeDropdownRef.current?.contains(event.target as Node)) {
        setShowInlineEditingNewDocumentAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInlineEditingNewDocumentAssigneeDropdown]);

  // Click outside handler for inline editing new document contract dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showInlineEditingNewDocumentContractDropdown && !inlineEditingNewDocumentContractDropdownRef.current?.contains(event.target as Node)) {
        setShowInlineEditingNewDocumentContractDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInlineEditingNewDocumentContractDropdown]);

  // Click outside handler for upload modal inline editing assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showInlineEditingUploadModalAssigneeDropdown && !inlineEditingUploadModalAssigneeDropdownRef.current?.contains(event.target as Node)) {
        setShowInlineEditingUploadModalAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInlineEditingUploadModalAssigneeDropdown]);

  // Click outside handlers for contract details dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showContractDetailsStateDropdown && !contractDetailsStateDropdownRef.current?.contains(event.target as Node)) {
        setShowContractDetailsStateDropdown(false);
      }
      if (showContractDetailsCountryDropdown && !contractDetailsCountryDropdownRef.current?.contains(event.target as Node)) {
        setShowContractDetailsCountryDropdown(false);
      }
      if (showContractDetailsPropertyTypeDropdown && !contractDetailsPropertyTypeDropdownRef.current?.contains(event.target as Node)) {
        setShowContractDetailsPropertyTypeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContractDetailsStateDropdown, showContractDetailsCountryDropdown, showContractDetailsPropertyTypeDropdown]);

  // Click outside handler for click to upload dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showClickToUploadDropdown && !clickToUploadDropdownRef.current?.contains(event.target as Node)) {
        setShowClickToUploadDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClickToUploadDropdown]);

  return (
    <>
      <div className="space-y-4 select-none cursor-default">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-3 sm:mb-6 cursor-default select-none">
          <div className="pb-1 cursor-default select-none">
            <h1 className="text-[30px] font-bold text-black dark:text-white mb-0 cursor-default select-none">Contracts</h1>
            <p className="text-gray-500 text-[16px] mt-0 cursor-default select-none">
              Manage & monitor all your contracts
            </p>
          </div>
          <div className="flex w-full sm:w-auto">
            <button 
              onClick={() => {
                setShowNewDocumentModal(true);
                setShowNewContractForm(false);
                setDocumentModalStep(2);
                setCountrySearchTerm('');
                setStateSearchTerm('');
                setRecipientErrors({});
                resetForm();
                // Reset new document form state
                setNewDocumentFormUploadedFiles([]);
                setSelectedNewDocumentFormFileSource('');
                setShowNewDocumentUploadDropdown(false);
                setNewDocumentName('');
                setNewDocumentType('');
                setNewDocumentAssignee('');
                setNewDocumentDocuments([]);
                setEditingNewDocumentIndex(null);
                setInlineEditingNewDocumentName('');
                setInlineEditingNewDocumentType('');
                setInlineEditingNewDocumentAssignee('');
                setShowInlineEditingNewDocumentAssigneeDropdown(false);
              }}
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold w-full sm:w-auto cursor-pointer"
            >
              <TbLibraryPlus className="mr-2 text-xl" />
              New Document
            </button>
            <button 
              onClick={() => {
                setShowNewContractForm(true);
                setShowNewDocumentModal(false);
                setNewDocumentFormUploadedFiles([]);
                setSelectedNewDocumentFormFileSource('');
                setShowNewDocumentUploadDropdown(false);
              }}
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold w-full sm:w-auto cursor-pointer ml-1"
            >
              <TbFilePlus className="mr-2 text-xl" />
              New Contract
            </button>
          </div>
        </div>

        <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:hidden">
        {/* Stat Boxes or New Contract Modal or New Document Modal */}
      {showNewContractForm ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 px-6 py-4 mb-6 select-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                <TbFilePlus size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white leading-tight">Create New Contract</h2>
                <p className="text-gray-500 text-xs leading-tight cursor-default select-none">Fill in the contract details to get started</p>
              </div>
            </div>
              <button
              onClick={() => { setShowNewContractForm(false); setModalStep(1); setCountrySearchTerm(''); setStateSearchTerm(''); setRecipientErrors({}); resetForm(); }} 
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
              >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>
          </div>

          {/* Stepper */}
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
            <div className="flex items-center justify-between mb-6 min-w-[340px] sm:min-w-0">
              <div className="flex items-center space-x-2 w-full flex-nowrap">
                {[1, 2, 3, 4].map((step, idx) => (
                  <React.Fragment key={step}>
                    <button
                      type="button"
                      onClick={() => setModalStep(step)}
                      className={`flex items-center gap-2 rounded-xl font-semibold border transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap
                        ${modalStep === step
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ring-1 ring-inset ring-gray-200 dark:ring-gray-600 shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      <span className={`inline-block transition-all duration-300 ${modalStep === step ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: modalStep === step ? 18 : 0}}>
                        {modalStep === step && <Logo width={18} height={18} className="pointer-events-none" />}
                      </span>
                      {step === 1 && 'Step 1: General'}
                      {step === 2 && 'Step 2: Parties'}
                      {step === 3 && 'Step 3: Details'}
                      {step === 4 && 'Step 4: Documents'}
                    </button>
                    {idx < 3 && <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2 min-w-[20px]" />}
                  </React.Fragment>
            ))}
          </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-6 pt-4">
            {modalStep === 1 && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Contract Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={modalForm.title}
                      onChange={(e) => {
                        handleModalChange(e);
                        if (formErrors.title) {
                          setFormErrors(prev => ({ ...prev, title: false }));
                        }
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter contract name..."
                      required
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Contract name is required</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="escrowNumber" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Escrow Number</label>
                    <input
                      type="text"
                      id="escrowNumber"
                      name="escrowNumber"
                      value={modalForm.escrowNumber}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter escrow number..."
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Contract Type <span className="text-red-500">*</span></label>
                    <div className="relative w-full" ref={contractTypeDropdownRef}>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900 caret-transparent"
                        placeholder="Select contract type"
                        value={CONTRACT_TYPES.find(t => t === modalForm.type) || ''}
                        readOnly
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault();
                            setModalForm(prev => ({ ...prev, type: '' }));
                          }
                        }}
                        onFocus={(e) => {
                          // Move cursor to end of text when focused
                          e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                        }}
                        onClick={(e) => handleDropdownClick(e, showContractTypeDropdown, setShowContractTypeDropdown, [setShowMilestoneDropdown, setShowPropertyTypeDropdown])}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showContractTypeDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {CONTRACT_TYPES.map(type => (
                            <button
                              key={type}
                              className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.type === type ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={e => {
                                e.preventDefault();
                                setModalForm(prev => ({ ...prev, type }));
                                setShowContractTypeDropdown(false);
                                setFormErrors(prev => ({ ...prev, type: false }));
                              }}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {formErrors.type && (
                      <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Select a contract type</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Property Type</label>
                    <div className="relative w-full" ref={propertyTypeDropdownRef}>
                      <input
                        type="text"
                        className={`w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900 caret-transparent`}
                        placeholder="Select property type"
                        value={PROPERTY_TYPES.find(t => t === modalForm.propertyType) || ''}
                        readOnly
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault();
                            setModalForm(prev => ({ ...prev, propertyType: '' }));
                          }
                        }}
                        onFocus={(e) => {
                          // Move cursor to end of text when focused
                          e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                        }}
                        onClick={(e) => handleDropdownClick(e, showPropertyTypeDropdown, setShowPropertyTypeDropdown, [setShowContractTypeDropdown, setShowMilestoneDropdown])}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showPropertyTypeDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {PROPERTY_TYPES.map(type => (
                            <button
                              key={type}
                              className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.propertyType === type ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={e => {
                                e.preventDefault();
                                setModalForm(prev => ({ ...prev, propertyType: type }));
                                setShowPropertyTypeDropdown(false);
                              }}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="milestone" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Milestone Template</label>
                    <div className="relative w-full" ref={milestoneDropdownRef}>
                      <input
                        type="text"
                        className={`w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900 caret-transparent`}
                        placeholder="Select milestone template"
                        value={MILESTONE_TEMPLATES.find(t => t === modalForm.milestone) || ''}
                        readOnly
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault();
                            setModalForm(prev => ({ ...prev, milestone: '' }));
                          }
                        }}
                        onFocus={(e) => {
                          // Move cursor to end of text when focused
                          e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                        }}
                        onClick={(e) => handleDropdownClick(e, showMilestoneDropdown, setShowMilestoneDropdown, [setShowContractTypeDropdown, setShowPropertyTypeDropdown])}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showMilestoneDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {MILESTONE_TEMPLATES.map(template => (
                            <button
                              key={template}
                              className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.milestone === template ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={e => {
                                e.preventDefault();
                                setModalForm(prev => ({ ...prev, milestone: template }));
                                setShowMilestoneDropdown(false);
                              }}
                            >
                              {template}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="value" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Contract Value</label>
                    <input
                      type="text"
                      id="value"
                      name="value"
                      value={modalForm.value}
                      onChange={(e) => {
                        const formattedValue = parseAndFormatCurrency(e.target.value);
                        setModalForm(prev => ({ ...prev, value: formattedValue }));
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter contract value..."
                    />
                  </div>
                  <div>
                    <label htmlFor="dueDate" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={modalForm.dueDate}
                        onChange={handleModalChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault();
                            setModalForm(prev => ({ ...prev, dueDate: '' }));
                          }
                        }}
                        className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-black dark:text-white bg-white dark:bg-gray-900 [&::-webkit-calendar-picker-indicator]:hidden"
                      />
                      <button
                        type="button"
                        onClick={() => (document.getElementById('dueDate') as HTMLInputElement)?.showPicker()}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                      >
                        <LuCalendarFold className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </button>
                    </div>
                    {formErrors.dueDate && (
                      <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Please select a due date</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="propertyAddress" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Address</label>
                    <input
                      type="text"
                      id="propertyAddress"
                      name="propertyAddress"
                      value={modalForm.propertyAddress}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter address..."
                    />
                  </div>
                  <div></div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={modalForm.city}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter City..."
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">State</label>
                    <div className="relative w-full" ref={stateDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 bg-white dark:bg-gray-900"
                        placeholder="Select State..."
                        value={stateSearchTerm || US_STATES.find(s => s.value === modalForm.state)?.label || ''}
                        onChange={handleStateSearch}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !stateSearchTerm) {
                            e.preventDefault();
                            setModalForm(prev => ({ ...prev, state: '' }));
                          }
                        }}
                        onFocus={(e) => {
                          // Show dropdown when focused
                          if (!showStateDropdown) {
                            setShowStateDropdown(true);
                          }
                        }}
                        onInput={(e) => {
                          // Handle browser autofill by mapping state names to codes
                          const inputValue = e.currentTarget.value;
                          if (inputValue && !stateSearchTerm) {
                            const matchingState = US_STATES.find(s => 
                              s.label.toLowerCase() === inputValue.toLowerCase()
                            );
                            if (matchingState) {
                              setModalForm(prev => ({ ...prev, state: matchingState.value }));
                            }
                          }
                        }}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showStateDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {US_STATES
                            .filter(state => 
                              state.label.toLowerCase().includes(stateSearchTerm.toLowerCase())
                            )
                            .map(state => (
                            <button
                              key={state.value}
                              data-state-value={state.value}
                              className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.state === state.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={e => {
                                e.preventDefault();
                                setModalForm(prev => ({ ...prev, state: state.value }));
                                setShowStateDropdown(false);
                                setStateSearchTerm('');
                              }}
                            >
                              {state.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={modalForm.zipCode}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter ZIP code..."
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Country</label>
                    <div className="relative w-full" ref={countryDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 bg-white dark:bg-gray-900"
                        placeholder="Select Country..."
                        value={countrySearchTerm || COUNTRIES.find(c => c.value === modalForm.country)?.label || ''}
                        onChange={handleCountrySearch}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !countrySearchTerm) {
                            e.preventDefault();
                            setModalForm(prev => ({ ...prev, country: '' }));
                          }
                        }}
                        onFocus={(e) => {
                          // Show dropdown when focused
                          if (!showCountryDropdown) {
                            setShowCountryDropdown(true);
                          }
                        }}
                        onInput={(e) => {
                          // Handle browser autofill by mapping country names to codes
                          const inputValue = e.currentTarget.value;
                          if (inputValue && !countrySearchTerm) {
                            const matchingCountry = COUNTRIES.find(c => 
                              c.label.toLowerCase() === inputValue.toLowerCase()
                            );
                            if (matchingCountry) {
                              setModalForm(prev => ({ ...prev, country: matchingCountry.value }));
                            }
                          }
                        }}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showCountryDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {COUNTRIES
                            .filter(country => 
                              country.label.toLowerCase().includes(countrySearchTerm.toLowerCase())
                            )
                            .map(country => (
                            <button
                              key={country.value}
                              data-country-value={country.value}
                              className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.country === country.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={e => {
                                e.preventDefault();
                                setModalForm(prev => ({ ...prev, country: country.value }));
                                setShowCountryDropdown(false);
                                setCountrySearchTerm('');
                              }}
                            >
                              {country.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="notes" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={modalForm.notes}
                    onChange={handleModalChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[120px] dark:bg-gray-900 dark:text-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:dark:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                    placeholder="Enter any additional notes for this contract..."
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm">Continue</button>
        </div>
              </form>
            )}



            {modalStep === 2 && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  {/* Only Signer Checkbox */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => {
                      const newValue = !isOnlySigner;
                      
                      if (newValue) {
                        // Check if first recipient is complete before checking and advancing
                        const firstRecipient = recipients[0];
                        const isComplete = 
                          firstRecipient.name && firstRecipient.name.trim() !== '' &&
                          firstRecipient.email && firstRecipient.email.trim() !== '' &&
                          validateEmail(firstRecipient.email) &&
                          firstRecipient.signerRole && firstRecipient.signerRole.trim() !== '' &&
                          firstRecipient.contractRole && firstRecipient.contractRole.trim() !== '';

                        if (isComplete) {
                          // All conditions met - check box and clear error
                          setIsOnlySigner(true);
                          setOnlySignerError(false);
                        } else {
                          // Conditions not met - show error, don't check box
                          setOnlySignerError(true);
                        }
                      } else {
                        // Unchecking - allow it and clear error
                        setIsOnlySigner(false);
                        setOnlySignerError(false);
                      }
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
                        
                        if (newValue) {
                          // Check if first recipient is complete before checking and advancing
                          const firstRecipient = recipients[0];
                          const isComplete = 
                            firstRecipient.name && firstRecipient.name.trim() !== '' &&
                            firstRecipient.email && firstRecipient.email.trim() !== '' &&
                            validateEmail(firstRecipient.email) &&
                            firstRecipient.signerRole && firstRecipient.signerRole.trim() !== '' &&
                            firstRecipient.contractRole && firstRecipient.contractRole.trim() !== '';

                          if (isComplete) {
                            // All conditions met - check box and clear error
                            setIsOnlySigner(true);
                            setOnlySignerError(false);
                          } else {
                            // Conditions not met - show error, don't check box
                            setOnlySignerError(true);
                          }
                        } else {
                          // Unchecking - allow it and clear error
                          setIsOnlySigner(false);
                          setOnlySignerError(false);
                        }
                      }}
                    >
                      I am the only signer
                    </label>
                  </div>
                  {onlySignerError && (
                    <p className="text-red-600 text-xs mt-1 mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      Add your details below to proceed
                    </p>
                  )}
                  
                  {/* Render all recipient cards */}
                  {recipients.map((recipient, idx) => (
                      <div key={idx} className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm" style={{ borderLeft: `3px solid ${getRecipientCardBorderColor(idx)}` }}>
                        {/* Header with role controls and delete button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                          <div className="flex flex-col sm:flex-row gap-1">
                            {/* Signer Role selection button */}
                            <div className="relative">
                              <button
                                ref={recipient.signerRoleButtonRef}
                                type="button"
                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 dark:text-white border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary rounded-md hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors"
                                onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showSignerRoleDropdown: !r.showSignerRoleDropdown } : r))}
                                tabIndex={0}
                              >
                                <LuPen className="w-3 h-3 text-primary dark:text-white" />
                                <span>{recipient.signerRole || 'Signer Role'}</span>
                                <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px]" />
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
                                        if (idx === 0) setOnlySignerError(false); // Clear checkbox error when first party selects signer role
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
                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 dark:text-white border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary rounded-md hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors whitespace-nowrap"
                                onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: !r.showContractRoleDropdown } : r))}
                                tabIndex={0}
                              >
                                <span>{recipient.contractRole || 'Contract Role'}</span>
                                <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px]" />
                              </button>
                              {recipient.showContractRoleDropdown && (
                                <div
                                  ref={recipient.contractRoleDropdownRef}
                                  className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                >
                                  {['Standard', 'Buyer', 'Seller', 'Buyer Agent', 'Seller Agent', 'Closing Agent', 'Inspector', 'Appraiser'].map((contractRole) => (
                                    <button
                                      key={contractRole}
                                      className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${recipient.contractRole === contractRole ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                      style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                      onClick={() => {
                                        setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, contractRole, showContractRoleDropdown: false } : r));
                                        setRecipientErrors(prev => ({ ...prev, [`contractRole-${idx}`]: false }));
                                        if (idx === 0) setOnlySignerError(false); // Clear checkbox error when first party selects contract role
                                      }}
                                                                          >
                                        {contractRole}
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
                          </div>
                          
                          {/* Delete button */}
                          <button 
                            className="self-end sm:self-auto text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1" 
                            onClick={() => handleDeleteRecipient(idx)} 
                            disabled={recipients.length === 1}
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Form fields */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                              </span>
                              <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                placeholder="Enter party name..."
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                value={recipient.name}
                                onChange={e => {
                                  setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, name: e.target.value } : r));
                                  setRecipientErrors(prev => ({ ...prev, [`name-${idx}`]: false }));
                                  if (idx === 0) setOnlySignerError(false); // Clear checkbox error when first party fills name
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
                              Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <TbMailPlus className="w-4 h-4" />
                              </span>
                              <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                placeholder="Enter party email address..."
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                value={recipient.email}
                                onChange={e => {
                                  setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, email: e.target.value } : r));
                                  setRecipientErrors(prev => ({ ...prev, [`email-${idx}`]: false }));
                                  if (idx === 0) setOnlySignerError(false); // Clear checkbox error when first party fills email
                                }}
                              />
                            </div>
                            {recipientErrors[`email-${idx}`] && (
                              <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                {!recipient.email || recipient.email.trim() === '' ? 'Email is required' : 'Please enter a valid email address'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs sm:text-sm font-semibold mt-2"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                      onClick={handleAddRecipient}
                    >
                      <TiUserAddOutline className="text-base sm:text-lg" />
                      <span className="mt-[1px]">Add Party</span>
                    </button>
                  </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => { setModalStep(1); setCountrySearchTerm(''); setStateSearchTerm(''); }} className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Previous</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm" style={{ fontFamily: 'Avenir, sans-serif' }}>Continue</button>
                </div>
              </form>
            )}
            {modalStep === 3 && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="titleCompany" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Title Company</label>
                    <input
                      type="text"
                      id="titleCompany"
                      name="titleCompany"
                      value={modalForm.titleCompany}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter title company name..."
                    />
                    {formErrors.titleCompany && (
                      <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Please fill out this field</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="insuranceCompany" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Insurance Company</label>
                    <input
                      type="text"
                      id="insuranceCompany"
                      name="insuranceCompany"
                      value={modalForm.insuranceCompany}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter insurance company name..."
                    />
                  </div>
                  <div>
                    <label htmlFor="buyerFinancialInstitution" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Buyer Financial Institution</label>
                    <input
                      type="text"
                      id="buyerFinancialInstitution"
                      name="buyerFinancialInstitution"
                      value={modalForm.buyerFinancialInstitution}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter buyer financial institution..."
                    />
                  </div>
                  <div>
                    <label htmlFor="buyerFinancialInstitutionRoutingNumber" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Buyer Routing Number</label>
                    <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors cursor-default select-none">
                      <input
                        type="text"
                        id="buyerFinancialInstitutionRoutingNumber"
                        name="buyerFinancialInstitutionRoutingNumber"
                        className="w-full px-4 py-2 bg-transparent text-xs text-gray-900 dark:text-white border-none focus:outline-none"
                        style={{ fontFamily: buyerRoutingDisplay ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif' }}
                        placeholder="Enter buyer routing number..."
                        maxLength={9}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={buyerRoutingDisplay}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          handleRoutingNumberInput(
                            e,
                            modalForm.buyerFinancialInstitutionRoutingNumber,
                            setBuyerRoutingDisplay,
                            (value) => handleModalChange({ target: { name: 'buyerFinancialInstitutionRoutingNumber', value } } as any),
                            buyerRoutingTimeoutRef
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div></div>
                  <div>
                    <label htmlFor="buyerAccountNumber" className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">
                      Buyer Account Number
                      <button
                        type="button"
                        onClick={() => setBuyerAccountVisible(!buyerAccountVisible)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        {buyerAccountVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </label>
                    <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors cursor-default select-none">
                      <input
                        type="text"
                        id="buyerAccountNumber"
                        name="buyerAccountNumber"
                        className="w-full px-4 py-2 bg-transparent text-xs text-gray-900 dark:text-white border-none focus:outline-none"
                        style={{ fontFamily: buyerAccountVisible ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : (buyerAccountDisplay ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif') }}
                        placeholder="Enter buyer account number..."
                        maxLength={12}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={buyerAccountVisible ? modalForm.buyerAccountNumber : buyerAccountDisplay}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          handleAccountNumberInput(
                            e,
                            modalForm.buyerAccountNumber,
                            setBuyerAccountDisplay,
                            (value) => handleModalChange({ target: { name: 'buyerAccountNumber', value } } as any),
                            buyerAccountTimeoutRef
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sellerFinancialInstitution" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Seller Financial Institution</label>
                    <input
                      type="text"
                      id="sellerFinancialInstitution"
                      name="sellerFinancialInstitution"
                      value={modalForm.sellerFinancialInstitution}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter seller financial institution..."
                    />
                  </div>
                  <div>
                    <label htmlFor="sellerFinancialInstitutionRoutingNumber" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Seller Routing Number</label>
                    <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors cursor-default select-none">
                      <input
                        type="text"
                        id="sellerFinancialInstitutionRoutingNumber"
                        name="sellerFinancialInstitutionRoutingNumber"
                        className="w-full px-4 py-2 bg-transparent text-xs text-gray-900 dark:text-white border-none focus:outline-none"
                        style={{ fontFamily: sellerRoutingDisplay ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif' }}
                        placeholder="Enter seller routing number..."
                        maxLength={9}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={sellerRoutingDisplay}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          handleRoutingNumberInput(
                            e,
                            modalForm.sellerFinancialInstitutionRoutingNumber,
                            setSellerRoutingDisplay,
                            (value) => handleModalChange({ target: { name: 'sellerFinancialInstitutionRoutingNumber', value } } as any),
                            sellerRoutingTimeoutRef
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div></div>
                  <div>
                    <label htmlFor="sellerAccountNumber" className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">
                      Seller Account Number
                      <button
                        type="button"
                        onClick={() => setSellerAccountVisible(!sellerAccountVisible)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        {sellerAccountVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </label>
                    <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors cursor-default select-none">
                      <input
                        type="text"
                        id="sellerAccountNumber"
                        name="sellerAccountNumber"
                        className="w-full px-4 py-2 bg-transparent text-xs text-gray-900 dark:text-white border-none focus:outline-none"
                        style={{ fontFamily: sellerAccountVisible ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : (sellerAccountDisplay ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif') }}
                        placeholder="Enter seller account number..."
                        maxLength={12}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={sellerAccountVisible ? modalForm.sellerAccountNumber : sellerAccountDisplay}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          handleAccountNumberInput(
                            e,
                            modalForm.sellerAccountNumber,
                            setSellerAccountDisplay,
                            (value) => handleModalChange({ target: { name: 'sellerAccountNumber', value } } as any),
                            sellerAccountTimeoutRef
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="loanAmount" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Loan Amount</label>
                                          <input
                        type="text"
                        id="loanAmount"
                        name="loanAmount"
                        value={modalForm.loanAmount}
                        onChange={(e) => {
                          const formattedValue = parseAndFormatCurrency(e.target.value);
                          setModalForm(prev => ({ ...prev, loanAmount: formattedValue }));
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                        placeholder="Enter loan amount..."
                      />
                  </div>
                  <div>
                    <label htmlFor="loanTerm" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Loan Term (Years)</label>
                    <input
                      type="text"
                      id="loanTerm"
                      name="loanTerm"
                      value={modalForm.loanTerm}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter loan term..."
                    />
                  </div>
                  <div>
                    <label htmlFor="interestRate" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Interest Rate (%)</label>
                    <input
                      type="text"
                      id="interestRate"
                      name="interestRate"
                      value={modalForm.interestRate}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter interest rate..."
                    />
                  </div>
                  <div>
                    <label htmlFor="downPayment" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Down Payment</label>
                    <input
                      type="text"
                      id="downPayment"
                      name="downPayment"
                      value={modalForm.downPayment}
                      onChange={(e) => {
                        const formattedValue = parseAndFormatCurrency(e.target.value);
                        setModalForm(prev => ({ ...prev, downPayment: formattedValue }));
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter down payment amount..."
                    />
                  </div>
                  <div>
                    <label htmlFor="earnestMoney" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Earnest Money</label>
                    <input
                      type="text"
                      id="earnestMoney"
                      name="earnestMoney"
                      value={modalForm.earnestMoney}
                      onChange={(e) => {
                        const formattedValue = parseAndFormatCurrency(e.target.value);
                        setModalForm(prev => ({ ...prev, earnestMoney: formattedValue }));
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter earnest money amount..."
                    />
                  </div>
                  <div>
                    <label htmlFor="inspectionPeriod" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Inspection Period (Days)</label>
                    <input
                      type="text"
                      id="inspectionPeriod"
                      name="inspectionPeriod"
                      value={modalForm.inspectionPeriod}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                      placeholder="Enter inspection period..."
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="contingencies" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Contingencies</label>
                  <textarea
                    id="contingencies"
                    name="contingencies"
                    value={modalForm.contingencies}
                    onChange={handleModalChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[120px] dark:bg-gray-900 dark:text-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:dark:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                    placeholder="Enter any contingencies for this contract..."
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => { setModalStep(2); setCountrySearchTerm(''); setStateSearchTerm(''); }} className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Previous</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm" style={{ fontFamily: 'Avenir, sans-serif' }}>Continue</button>
                </div>
              </form>
            )}

            {modalStep === 4 && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-6">
                  <div>
                    
                    {/* Direct Document Upload Fields */}
                    <div className="space-y-6">
                      


                      {/* Document Name and Assignee - Side by Side */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            placeholder="Enter document name..."
                            className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                            value={step4DocumentName}
                            onChange={(e) => setStep4DocumentName(e.target.value)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                          
                          {/* Assignee - Moved to left column */}
                          <div className="mt-6">
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee <span className="text-red-500">*</span></label>
                          <div className="relative" ref={step4AssigneeDropdownRef}>
                            <input
                              type="text"
                              className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                              placeholder="Choose an assignee..."
                              value={step4DocumentAssignee}
                              onChange={(e) => setStep4DocumentAssignee(e.target.value)}
                              onFocus={() => setShowStep4AssigneeDropdown(true)}
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                              autoComplete="off"
                            />
                            <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            
                            {showStep4AssigneeDropdown && (
                              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                {allAssignees.length > 0 ? (
                                  <>
                                    {allAssignees.map((assignee: string) => (
                                      <div
                                        key={assignee}
                                        className={`px-4 py-2 text-xs cursor-pointer ${step4DocumentAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                        onClick={() => {
                                          setStep4DocumentAssignee(assignee);
                                          setShowStep4AssigneeDropdown(false);
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
                                        setShowStep4AssigneeDropdown(false);
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
                                        setShowStep4AssigneeDropdown(false);
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
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Type</label>
                          <input
                            type="text"
                            placeholder="Enter document type..."
                            className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                            value={step4DocumentType}
                            onChange={(e) => setStep4DocumentType(e.target.value)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                        </div>
                      </div>


                    </div>

                                         {/* Direct File Upload Option */}
                     <div className="mt-6">
  
                       <div className="relative" ref={step4UploadDropdownRef}>
                         <div 
                           className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 py-8 px-4 text-center transition hover:border-primary cursor-pointer"
                           onClick={() => {
                             setShowStep4UploadDropdown(!showStep4UploadDropdown);
                           }}
                           onDragOver={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                           }}
                           onDrop={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             
                             const files = Array.from(e.dataTransfer.files);
                             if (files.length > 0) {
                               // Set file source to Desktop
                               setStep4FileSource('Desktop');
                               
                               // Add files to selected files
                               setStep4SelectedFiles(prev => [...prev, ...files]);
                               
                               // Pre-populate document name with first file name (without extension) only if field is empty
                               if (!step4DocumentName.trim()) {
                                 const fileName = files[0].name;
                                 const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                                 setStep4DocumentName(nameWithoutExtension);
                               }
                             }
                           }}
                         >
                           <TbDragDrop className="text-3xl text-gray-400 mb-2" />
                           <div className="text-xs text-gray-700 dark:text-gray-300 font-medium cursor-default select-none">Click to upload or drag and drop</div>
                           <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 cursor-default select-none">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
                         </div>
                         
                         {/* Upload Source Dropdown */}
                         {showStep4UploadDropdown && (
                           <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 cursor-default select-none">
                             <div className="py-2">
                               <label htmlFor="step4-upload-desktop-file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                 <div className="flex items-center gap-2">
                                   <TbDeviceDesktopPlus className="text-base text-primary" />
                                   <span className="text-xs cursor-default select-none">Desktop</span>
                                 </div>
                               </label>
                               <input
                                 id="step4-upload-desktop-file-upload"
                                 name="step4-upload-desktop-file-upload"
                                 type="file"
                                 accept=".pdf,.doc,.docx,.jpg,.jpeg"
                                 className="hidden"
                                 multiple
                                 onChange={(e) => {
                                   setStep4FileSource('Desktop');
                                   setShowStep4UploadDropdown(false);
                                   if (e.target.files) {
                                     const newFiles = Array.from(e.target.files);
                                     setStep4SelectedFiles(prev => [...prev, ...newFiles]);
                                     // Pre-populate document name with first file name (without extension) only if field is empty
                                     if (newFiles.length > 0 && !step4DocumentName.trim()) {
                                       const fileName = newFiles[0].name;
                                       const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                                       setStep4DocumentName(nameWithoutExtension);
                                     }
                                   }
                                 }}
                               />
                               <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setStep4FileSource('Box'); setShowStep4UploadDropdown(false); }}>
                                 <SiBox className="text-base text-primary" />
                                 <span className="text-xs cursor-default select-none">Box</span>
                               </button>
                               <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setStep4FileSource('Dropbox'); setShowStep4UploadDropdown(false); }}>
                                 <SlSocialDropbox className="text-base text-primary" />
                                 <span className="text-xs cursor-default select-none">Dropbox</span>
                               </button>
                               <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setStep4FileSource('Google Drive'); setShowStep4UploadDropdown(false); }}>
                                 <TbBrandGoogleDrive className="text-base text-primary" />
                                 <span className="text-xs cursor-default select-none">Google Drive</span>
                               </button>
                               <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setStep4FileSource('OneDrive'); setShowStep4UploadDropdown(false); }}>
                                 <TbBrandOnedrive className="text-base text-primary" />
                                 <span className="text-xs cursor-default select-none">OneDrive</span>
                               </button>
                             </div>
                           </div>
                         )}

                       </div>
                     </div>

                     {/* Added Documents Display - Below the upload box */}
                     {step4Documents.length > 0 && (
                       <div className="mt-6">
                         <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Added Documents</h4>
                         <div className="flex flex-col gap-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                           {step4Documents.map((doc, idx) => (
                             <div 
                               key={idx} 
                               className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 transition-colors"
                             >
                               {editingStep4DocumentIndex === idx ? (
                                 // Inline editing mode
                                 <div className="space-y-3">
                                   <div className="flex items-center justify-between">
                                     <div className="flex-1 min-w-0">
                                       <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">Document Name</label>
                                       <input
                                         type="text"
                                         value={inlineEditingStep4DocumentName}
                                         onChange={(e) => setInlineEditingStep4DocumentName(e.target.value)}
                                         className="w-full h-[28px] px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                                         style={{ fontFamily: 'Avenir, sans-serif' }}
                                       />
                                     </div>
                                     <div className="flex-1 min-w-0 ml-3">
                                       <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">Document Type</label>
                                       <input
                                         type="text"
                                         value={inlineEditingStep4DocumentType}
                                         onChange={(e) => setInlineEditingStep4DocumentType(e.target.value)}
                                         className="w-full h-[28px] px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                                         style={{ fontFamily: 'Avenir, sans-serif' }}
                                       />
                                     </div>
                                     <div className="flex-1 min-w-0 ml-3">
                                       <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">Assignee</label>
                                       <div className="relative" ref={step4DocumentAssigneeDropdownRef}>
                                         <input
                                           type="text"
                                           value={inlineEditingStep4DocumentAssignee}
                                           onChange={(e) => {
                                             setInlineEditingStep4DocumentAssignee(e.target.value);
                                             if (e.target.value === '') {
                                               setShowStep4DocumentAssigneeDropdown(false);
                                             } else if (!showStep4DocumentAssigneeDropdown) {
                                               setShowStep4DocumentAssigneeDropdown(true);
                                             }
                                           }}
                                           onFocus={() => setShowStep4DocumentAssigneeDropdown(true)}
                                           className="w-full h-[28px] px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary pr-8"
                                           style={{ fontFamily: 'Avenir, sans-serif' }}
                                           autoComplete="off"
                                         />
                                         <HiMiniChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                         
                                         {showStep4DocumentAssigneeDropdown && (
                                           <div className="fixed inset-0 z-[9999] pointer-events-none">
                                             <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto pointer-events-auto" 
                                                  style={{
                                                    left: step4DocumentAssigneeDropdownRef.current?.getBoundingClientRect().left || 0,
                                                    top: (step4DocumentAssigneeDropdownRef.current?.getBoundingClientRect().bottom || 0) + 4,
                                                    width: step4DocumentAssigneeDropdownRef.current?.getBoundingClientRect().width || 'auto',
                                                    minWidth: '200px'
                                                  }}>
                                               {allAssignees
                                                 .filter(assignee => assignee.toLowerCase().includes(inlineEditingStep4DocumentAssignee.toLowerCase()))
                                                 .map((assignee: string) => (
                                                   <div
                                                     key={assignee}
                                                     className={`px-3 py-2 text-xs cursor-pointer ${inlineEditingStep4DocumentAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                     onClick={() => {
                                                       setInlineEditingStep4DocumentAssignee(assignee);
                                                       setShowStep4DocumentAssigneeDropdown(false);
                                                     }}
                                                   >
                                                     {assignee}
                                                   </div>
                                                 ))}
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     </div>
                                   </div>
                                   
                                   <div className="flex items-center justify-between">
                                     <div className="text-xs text-gray-500 cursor-default select-none">
                                       {formatDateYYYYMMDD(new Date())} &bull; {doc.file.name.split('.').pop()?.toUpperCase() || 'Unknown'} &bull; {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                     </div>
                                     <div className="flex">
                                       <button
                                         type="button"
                                         onClick={() => handleSaveInlineEditStep4Document(idx)}
                                         disabled={!inlineEditingStep4DocumentName.trim() || !inlineEditingStep4DocumentType.trim() || !inlineEditingStep4DocumentAssignee.trim()}
                                         className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                       >
                                         Save
                                       </button>
                                       <button
                                         type="button"
                                         onClick={handleCancelInlineEditStep4Document}
                                         className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-1"
                                       >
                                         Cancel
                                       </button>
                                     </div>
                                   </div>
                                 </div>
                               ) : (
                                 // Display mode
                                 <div className="flex items-center justify-between">
                                   <div className="flex-1 min-w-0 pl-3">
                                     <div className="font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate">
                                       {doc.name}
                                     </div>
                                     <div className="text-xs text-gray-500 cursor-default select-none">
                                       {formatDateYYYYMMDD(new Date())} &bull; {doc.type || 'Unknown Type'} &bull; {doc.file.name.split('.').pop()?.toUpperCase() || 'Unknown'} &bull; {(doc.file.size / 1024 / 1024).toFixed(2)} MB &bull; {doc.assignee}
                                     </div>
                                   </div>
                                   <div className="flex items-center gap-1">
                                     <button 
                                       type="button"
                                       onClick={() => handleStartInlineEditStep4Document(idx)}
                                       className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1"
                                     >
                                       <HiOutlinePencil className="h-4 w-4" />
                                     </button>
                                     <button 
                                       className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 pr-3"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         setStep4Documents(prev => prev.filter((_, i) => i !== idx));
                                       }}
                                     >
                                       <HiOutlineTrash className="h-4 w-4" />
                                     </button>
                                   </div>
                                 </div>
                               )}
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                  </div>
                  <div className="flex justify-between mt-12">
                    <button type="button" onClick={() => setModalStep(3)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm cursor-default select-none">Previous</button>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={handleAddStep4Document}
                        disabled={!step4DocumentName.trim() || !step4DocumentType.trim() || !step4DocumentAssignee.trim() || step4SelectedFiles.length === 0}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Add Document
                      </button>
                      <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm ml-1">Create Contract</button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : showNewDocumentModal ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 px-6 py-4 mb-6 select-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                <TbLibraryPlus size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white leading-tight">Create New Document</h2>
                <p className="text-gray-500 text-xs leading-tight cursor-default select-none">Fill in the document details to get started</p>
              </div>
            </div>
            <button
              onClick={() => { 
                setShowNewDocumentModal(false); 
                setDocumentModalStep(2); 
                setDocumentModalForm({ name: '', type: '', description: '', assignee: '', contract: '' }); 
                setDocumentFormErrors({});
                setDocumentUploadErrors({
                  files: false
                });
                setNewDocumentFormUploadedFiles([]);
                setSelectedNewDocumentFormFileSource('');
                setShowNewDocumentUploadDropdown(false);
              }} 
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>



          {/* Form Content */}
          <div className="space-y-6 pt-4">
            {documentModalStep === 2 && (
              <div className="space-y-6">
                <div>
                  {/* Added Documents Display - Above the upload box */}
                  {step4Documents.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Added Documents</h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                        {step4Documents.map((doc, idx) => (
                          <div 
                            key={idx} 
                            className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 transition-colors"
                          >
                            {editingStep4DocumentIndex === idx ? (
                              // Inline editing mode
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">Document Name</label>
                                    <input
                                      type="text"
                                      value={inlineEditingStep4DocumentName}
                                      onChange={(e) => setInlineEditingStep4DocumentName(e.target.value)}
                                      className="w-full h-[28px] px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 ml-3">
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">Document Type</label>
                                    <input
                                      type="text"
                                      value={inlineEditingStep4DocumentType}
                                      onChange={(e) => setInlineEditingStep4DocumentType(e.target.value)}
                                      className="w-full h-[28px] px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 ml-3">
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">Assignee</label>
                                    <div className="relative" ref={step4DocumentAssigneeDropdownRef}>
                                      <input
                                        type="text"
                                        value={inlineEditingStep4DocumentAssignee}
                                        onChange={(e) => {
                                          setInlineEditingStep4DocumentAssignee(e.target.value);
                                          if (e.target.value === '') {
                                            setShowStep4DocumentAssigneeDropdown(false);
                                          } else if (!showStep4DocumentAssigneeDropdown) {
                                            setShowStep4DocumentAssigneeDropdown(true);
                                          }
                                        }}
                                        onFocus={() => setShowStep4DocumentAssigneeDropdown(true)}
                                        className="w-full h-[28px] px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary pr-8"
                                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                        autoComplete="off"
                                      />
                                      <HiMiniChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      
                                                                             {showStep4DocumentAssigneeDropdown && (
                                         <div className="fixed inset-0 z-[9999] pointer-events-none">
                                           <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto pointer-events-auto" 
                                                style={{
                                                  left: step4DocumentAssigneeDropdownRef.current?.getBoundingClientRect().left || 0,
                                                  top: (step4DocumentAssigneeDropdownRef.current?.getBoundingClientRect().bottom || 0) + 4,
                                                  width: step4DocumentAssigneeDropdownRef.current?.getBoundingClientRect().width || 'auto',
                                                  minWidth: '200px'
                                                }}>
                                             {allAssignees
                                               .filter(assignee => assignee.toLowerCase().includes(inlineEditingStep4DocumentAssignee.toLowerCase()))
                                               .map((assignee: string) => (
                                                 <div
                                                   key={assignee}
                                                   className={`px-3 py-2 text-xs cursor-pointer ${inlineEditingStep4DocumentAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                   onClick={() => {
                                                     setInlineEditingStep4DocumentAssignee(assignee);
                                                     setShowStep4DocumentAssigneeDropdown(false);
                                                   }}
                                                 >
                                                   {assignee}
                                                 </div>
                                               ))}
                                           </div>
                                         </div>
                                       )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-500 cursor-default select-none">
                                    {formatDateYYYYMMDD(new Date())} &bull; {doc.file.name.split('.').pop()?.toUpperCase() || 'Unknown'} &bull; {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                  <div className="flex">
                                    <button
                                      type="button"
                                      onClick={() => handleSaveInlineEditStep4Document(idx)}
                                      disabled={!inlineEditingStep4DocumentName.trim() || !inlineEditingStep4DocumentType.trim() || !inlineEditingStep4DocumentAssignee.trim()}
                                      className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelInlineEditStep4Document}
                                      className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-1"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Display mode
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0 pl-3">
                                  <div className="font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate">
                                    {doc.name}
                                  </div>
                                  <div className="text-xs text-gray-500 cursor-default select-none">
                                    {formatDateYYYYMMDD(new Date())} &bull; {doc.type || 'Unknown Type'} &bull; {doc.file.name.split('.').pop()?.toUpperCase() || 'Unknown'} &bull; {(doc.file.size / 1024 / 1024).toFixed(2)} MB &bull; {doc.assignee}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    type="button"
                                    onClick={() => handleStartInlineEditStep4Document(idx)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1"
                                  >
                                    <HiOutlinePencil className="h-4 w-4" />
                                  </button>
                                  <button 
                                    className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 pr-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setStep4Documents(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                  >
                                    <HiOutlineTrash className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  

                  

                                    {/* Direct Document Upload Fields */}
                  <div className="space-y-6">
                    {/* Document Name and Assignee - Side by Side */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="Enter document name..."
                          className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                          value={newDocumentName}
                          onChange={(e) => setNewDocumentName(e.target.value)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                        
                        {/* Contract - Added under Document Name in left column */}
                        <div className="mt-6">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract <span className="text-red-500">*</span></label>
                          <div className="relative" ref={newDocumentContractDropdownRef}>
                            <input
                              type="text"
                              className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                              placeholder="Choose a contract..."
                              value={documentModalForm.contract}
                              onChange={(e) => {
                                setDocumentModalForm(prev => ({ ...prev, contract: e.target.value }));
                                if (e.target.value === '') {
                                  setShowNewDocumentContractDropdown(false);
                                } else if (!showNewDocumentContractDropdown) {
                                  setShowNewDocumentContractDropdown(true);
                                }
                              }}
                              onFocus={() => setShowNewDocumentContractDropdown(true)}
                              onClick={() => setShowNewDocumentContractDropdown(true)}
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                              autoComplete="off"
                            />
                            <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            {showNewDocumentContractDropdown && (
                              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                {/* Search Bar */}
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      placeholder="Search contracts..."
                                      value={newDocumentContractSearch}
                                      onChange={(e) => setNewDocumentContractSearch(e.target.value)}
                                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    />
                                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                  </div>
                                </div>
                                {contracts
                                  .filter(contract => 
                                    contract.id.toLowerCase().includes(newDocumentContractSearch.toLowerCase()) ||
                                    contract.title.toLowerCase().includes(newDocumentContractSearch.toLowerCase())
                                  )
                                  .sort((a, b) => Number(a.id) - Number(b.id))
                                  .map(contract => (
                                    <div
                                      key={contract.id}
                                      className={`px-4 py-2 text-xs cursor-pointer ${documentModalForm.contract === `${contract.id} - ${contract.title}` ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                      onClick={() => {
                                        setDocumentModalForm(prev => ({ ...prev, contract: `${contract.id} - ${contract.title}` }));
                                        setShowNewDocumentContractDropdown(false);
                                      }}
                                    >
                                      {contract.id} - {contract.title}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Type</label>
                        <input
                          type="text"
                          placeholder="Enter document type..."
                          className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                          value={newDocumentType}
                          onChange={(e) => setNewDocumentType(e.target.value)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                        
                        {/* Assignee - Added under Document Type in right column */}
                        <div className="mt-6">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee <span className="text-red-500">*</span></label>
                          <div className="relative" ref={newDocumentAssigneeDropdownRef}>
                            <input
                              type="text"
                              className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                              placeholder="Choose an assignee..."
                              value={newDocumentAssignee}
                              onChange={(e) => setNewDocumentAssignee(e.target.value)}
                              onFocus={() => setShowNewDocumentAssigneeDropdown(true)}
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                              autoComplete="off"
                            />
                            <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            
                            {showNewDocumentAssigneeDropdown && (
                              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                {allAssignees.length > 0 ? (
                                  <>
                                    {allAssignees.map((assignee: string) => (
                                      <div
                                        key={assignee}
                                        className={`px-4 py-2 text-xs cursor-pointer ${newDocumentAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                        onClick={() => {
                                          setNewDocumentAssignee(assignee);
                                          setShowNewDocumentAssigneeDropdown(false);
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
                                        setShowNewDocumentAssigneeDropdown(false);
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
                                        setShowNewDocumentAssigneeDropdown(false);
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
                  </div>

                  <div className="relative mb-1 mt-6" ref={newDocumentUploadDropdownRef}>
                    <div 
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 py-8 px-4 text-center transition hover:border-primary cursor-pointer"
                      onClick={() => {
                        setShowNewDocumentUploadDropdown(!showNewDocumentUploadDropdown);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length > 0) {
                          // Set file source to Desktop
                          setSelectedNewDocumentFormFileSource('Desktop');
                          
                          // Add files to uploaded files
                          setNewDocumentFormUploadedFiles(prev => [...prev, ...files]);
                          
                          // Pre-populate document name with first file name (without extension) only if field is empty
                          if (!newDocumentName.trim()) {
                            const fileName = files[0].name;
                            const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                            setNewDocumentName(nameWithoutExtension);
                          }
                        }
                      }}
                    >
                      <TbDragDrop className="text-3xl text-gray-400 mb-2" />
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium cursor-default select-none">Click to upload or drag and drop</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 cursor-default select-none">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
                    </div>
                    
                    {/* Upload Source Dropdown */}
                    {showNewDocumentUploadDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 cursor-default select-none">
                        <div className="py-2">
                          <label htmlFor="new-document-upload-desktop-file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            <div className="flex items-center gap-2">
                              <TbDeviceDesktopPlus className="text-base text-primary" />
                              <span className="text-xs cursor-default select-none">Desktop</span>
                            </div>
                          </label>
                          <input
                            id="new-document-upload-desktop-file-upload"
                            name="new-document-upload-desktop-file-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              setSelectedNewDocumentFormFileSource('Desktop');
                              setShowNewDocumentUploadDropdown(false);
                              if (e.target.files) {
                                const newFiles = Array.from(e.target.files);
                                setNewDocumentFormUploadedFiles(prev => [...prev, ...newFiles]);
                                
                                // Pre-populate document name with first file name (without extension) only if field is empty
                                if (!newDocumentName.trim()) {
                                  const fileName = newFiles[0].name;
                                  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                                  setNewDocumentName(nameWithoutExtension);
                                }
                              }
                            }}
                          />
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewDocumentFormFileSource('Box'); setShowNewDocumentUploadDropdown(false); }}>
                            <SiBox className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Box</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewDocumentFormFileSource('Dropbox'); setShowNewDocumentUploadDropdown(false); }}>
                            <SlSocialDropbox className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Dropbox</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewDocumentFormFileSource('Google Drive'); setShowNewDocumentUploadDropdown(false); }}>
                            <TbBrandGoogleDrive className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Google Drive</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewDocumentFormFileSource('OneDrive'); setShowNewDocumentUploadDropdown(false); }}>
                            <TbBrandOnedrive className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">OneDrive</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  

                  
                  {documentUploadErrors.files && (
                    <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Please select one file</p>
                  )}
                  {/* Added Documents Display - Below the upload box */}
                  {newDocumentDocuments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Added Documents</h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                        {/* Show added documents with inline editing */}
                        {newDocumentDocuments.map((doc, idx) => (
                          <div 
                            key={`doc-${idx}`} 
                            className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 transition-colors"
                          >
                            {editingNewDocumentIndex === idx ? (
                              // Inline editing form
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Document name..."
                                    className="flex-1 h-[28px] px-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary"
                                    value={inlineEditingNewDocumentName}
                                    onChange={(e) => setInlineEditingNewDocumentName(e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Document type..."
                                    className="flex-1 h-[28px] px-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary"
                                    value={inlineEditingNewDocumentType}
                                    onChange={(e) => setInlineEditingNewDocumentType(e.target.value)}
                                  />
                                  <div className="flex-1 relative" ref={inlineEditingNewDocumentAssigneeDropdownRef}>
                                    <input
                                      type="text"
                                      placeholder="Assignee..."
                                      className="w-full h-[28px] px-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary pr-8"
                                      value={inlineEditingNewDocumentAssignee}
                                      onChange={(e) => {
                                        setInlineEditingNewDocumentAssignee(e.target.value);
                                        if (e.target.value === '') {
                                          setShowInlineEditingNewDocumentAssigneeDropdown(false);
                                        } else if (!showInlineEditingNewDocumentAssigneeDropdown) {
                                          setShowInlineEditingNewDocumentAssigneeDropdown(true);
                                        }
                                      }}
                                      onFocus={() => setShowInlineEditingNewDocumentAssigneeDropdown(true)}
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                      autoComplete="off"
                                    />
                                    <HiMiniChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    
                                    {showInlineEditingNewDocumentAssigneeDropdown && (
                                      <div className="fixed inset-0 z-[9999] pointer-events-none">
                                        <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto pointer-events-auto" 
                                             style={{
                                               left: inlineEditingNewDocumentAssigneeDropdownRef.current?.getBoundingClientRect().left || 0,
                                               top: (inlineEditingNewDocumentAssigneeDropdownRef.current?.getBoundingClientRect().bottom || 0) + 4,
                                               width: inlineEditingNewDocumentAssigneeDropdownRef.current?.getBoundingClientRect().width || 'auto',
                                               minWidth: '200px'
                                             }}>
                                          {allAssignees
                                            .filter(assignee => assignee.toLowerCase().includes(inlineEditingNewDocumentAssignee.toLowerCase()))
                                            .map((assignee: string) => (
                                              <div
                                                key={assignee}
                                                className={`px-3 py-2 text-xs cursor-pointer ${inlineEditingNewDocumentAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                onClick={() => {
                                                  setInlineEditingNewDocumentAssignee(assignee);
                                                  setShowInlineEditingNewDocumentAssigneeDropdown(false);
                                                }}
                                              >
                                                {assignee}
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 relative" ref={inlineEditingNewDocumentContractDropdownRef}>
                                    <input
                                      type="text"
                                      placeholder="Contract..."
                                      className="w-full h-[28px] px-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary pr-8"
                                      value={inlineEditingNewDocumentContract}
                                      onChange={(e) => {
                                        setInlineEditingNewDocumentContract(e.target.value);
                                        if (e.target.value === '') {
                                          setShowInlineEditingNewDocumentContractDropdown(false);
                                        } else if (!showInlineEditingNewDocumentContractDropdown) {
                                          setShowInlineEditingNewDocumentContractDropdown(true);
                                        }
                                      }}
                                      onFocus={() => setShowInlineEditingNewDocumentContractDropdown(true)}
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                      autoComplete="off"
                                    />
                                    <HiMiniChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    
                                    {showInlineEditingNewDocumentContractDropdown && (
                                      <div className="fixed inset-0 z-[9999] pointer-events-none">
                                        <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto pointer-events-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" 
                                             style={{
                                               left: inlineEditingNewDocumentContractDropdownRef.current?.getBoundingClientRect().left || 0,
                                               top: (inlineEditingNewDocumentContractDropdownRef.current?.getBoundingClientRect().bottom || 0) + 4,
                                               width: inlineEditingNewDocumentContractDropdownRef.current?.getBoundingClientRect().width || 'auto',
                                               minWidth: '200px'
                                             }}>
                                          {/* Search Bar */}
                                          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                                            <div className="relative">
                                              <input
                                                type="text"
                                                placeholder="Search contracts..."
                                                value={inlineEditingNewDocumentContractSearch}
                                                onChange={(e) => setInlineEditingNewDocumentContractSearch(e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                              />
                                              <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            </div>
                                          </div>
                                          {contracts
                                            .filter(contract => 
                                              contract.id.toLowerCase().includes(inlineEditingNewDocumentContractSearch.toLowerCase()) ||
                                              contract.title.toLowerCase().includes(inlineEditingNewDocumentContractSearch.toLowerCase())
                                            )
                                            .sort((a, b) => Number(a.id) - Number(b.id))
                                            .map(contract => (
                                              <div
                                                key={contract.id}
                                                className={`px-3 py-2 text-xs cursor-pointer ${inlineEditingNewDocumentContract === `${contract.id} - ${contract.title}` ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                onClick={() => {
                                                  setInlineEditingNewDocumentContract(`${contract.id} - ${contract.title}`);
                                                  setShowInlineEditingNewDocumentContractDropdown(false);
                                                }}
                                              >
                                                {contract.id} - {contract.title}
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveInlineEditNewDocument(idx)}
                                    disabled={!inlineEditingNewDocumentName.trim() || 
                                             !inlineEditingNewDocumentType.trim() || 
                                             !inlineEditingNewDocumentAssignee.trim() || 
                                             !inlineEditingNewDocumentContract.trim() ||
                                             !contracts.some(contract => `${contract.id} - ${contract.title}` === inlineEditingNewDocumentContract.trim()) ||
                                             !allAssignees.includes(inlineEditingNewDocumentAssignee.trim())}
                                    className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelInlineEditNewDocument}
                                    className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-1"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Display mode
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate">
                                    {doc.name}
                                  </div>
                                  <div className="text-xs text-gray-500 cursor-default select-none">
                                    {formatDateYYYYMMDD(new Date())} &bull; {doc.type || 'Unknown Type'} &bull; {doc.file.name.split('.').pop()?.toUpperCase() || 'Unknown'} &bull; {(doc.file.size / 1024 / 1024).toFixed(2)} MB &bull; {doc.assignee} &bull; {doc.contract || 'No Contract'}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    type="button"
                                    onClick={() => handleStartInlineEditNewDocument(idx)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1"
                                  >
                                    <HiOutlinePencil className="h-4 w-4" />
                                  </button>
                                  <button 
                                    className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 pr-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewDocumentDocuments(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                  >
                                    <HiOutlineTrash className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-12">
                  <div className="flex">
                    <button
                      type="button"
                      onClick={handleAddNewDocument}
                      disabled={!newDocumentName.trim() || !documentModalForm.contract.trim() || !newDocumentAssignee.trim() || newDocumentFormUploadedFiles.length === 0}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Document
                    </button>
                    <button 
                      disabled={newDocumentDocuments.length === 0 && newDocumentFormUploadedFiles.length === 0}
                      onClick={async () => {
                        // Reset upload errors first
                        setDocumentUploadErrors({
                          files: false
                        });
                        
                        // Check for upload validation errors
                        const uploadErrors = {
                          files: newDocumentFormUploadedFiles.length === 0 && newDocumentDocuments.length === 0
                        };
                        
                        // Check if contract is selected
                        if (!documentModalForm.contract.trim()) {
                          toast({
                            title: "Contract required",
                            description: "Please select a contract for the document.",
                            duration: 5000,
                          });
                          return;
                        }
                        
                        // Validation logic depends on whether we're creating from form fields or added documents
                        if (newDocumentDocuments.length > 0) {
                          // Creating from added documents - validate that each document has required fields
                          for (const docInfo of newDocumentDocuments) {
                            if (!docInfo.name.trim()) {
                              toast({
                                title: "Document name required",
                                description: "Please provide a name for all documents.",
                                duration: 5000,
                              });
                              return;
                            }
                            if (!docInfo.assignee.trim()) {
                              toast({
                                title: "Assignee required",
                                description: "Please provide an assignee for all documents.",
                                duration: 5000,
                              });
                              return;
                            }
                            if (!docInfo.contract.trim()) {
                              toast({
                                title: "Contract required",
                                description: "Please provide a contract for all documents.",
                                duration: 5000,
                              });
                              return;
                            }
                          }
                        } else if (newDocumentFormUploadedFiles.length > 0) {
                          // Creating from uploaded files - validate form fields
                          if (!documentModalForm.assignee.trim()) {
                            toast({
                              title: "Assignee required",
                              description: "Please select an assignee for the document.",
                              duration: 5000,
                            });
                            return;
                          }
                          
                          if (!documentModalForm.name.trim()) {
                            toast({
                              title: "Document name required",
                              description: "Please provide a name for the document.",
                              duration: 5000,
                            });
                            return;
                          }
                          
                          if (!documentModalForm.type.trim()) {
                            toast({
                              title: "Document type required",
                              description: "Please provide a type for the document.",
                              duration: 5000,
                            });
                            return;
                          }
                        }
                        
                        // Set upload errors
                        setDocumentUploadErrors(uploadErrors);
                        
                        // If there are upload errors, don't proceed
                        if (Object.values(uploadErrors).some(error => error)) {
                          return;
                        }
                        
                        // Handle document creation
                        console.log('Creating document:', documentModalForm);
                        
                        // Create documents with proper IDs and associate them with the contract
                        const finalDocumentIds: string[] = [];
                        
                        try {
                          // Process newDocumentDocuments (documents added during document creation)
                          if (newDocumentDocuments.length > 0) {
                            for (const docInfo of newDocumentDocuments) {
                              // Extract contract ID from the contract field (format: "ID - Title")
                              const contractId = docInfo.contract.includes(' - ') ? docInfo.contract.split(' - ')[0] : docInfo.contract;
                              const contractTitle = docInfo.contract.includes(' - ') ? docInfo.contract.split(' - ')[1] : docInfo.contract;
                              
                              // Create document with proper ID and contract association
                              const documentId = await addDocument(docInfo.file, contractId, contractTitle, currentUserName, docInfo.assignee, docInfo.type);
                              
                              // Update the document name
                              const { updateDocumentName } = useDocumentStore.getState();
                              updateDocumentName(documentId, docInfo.name);
                              
                              finalDocumentIds.push(documentId);
                            }
                          }
                          
                          // Process any previously uploaded files (from newDocumentFormUploadedFiles)
                          if (newDocumentFormUploadedFiles.length > 0) {
                            for (const file of newDocumentFormUploadedFiles) {
                              // Extract contract ID from the contract field (format: "ID - Title")
                              const contractId = documentModalForm.contract.includes(' - ') ? documentModalForm.contract.split(' - ')[0] : documentModalForm.contract;
                              const contractTitle = documentModalForm.contract.includes(' - ') ? documentModalForm.contract.split(' - ')[1] : documentModalForm.contract;
                              
                              // Create document with proper ID and contract association
                              const documentId = await addDocument(file, contractId, contractTitle, currentUserName, documentModalForm.assignee, documentModalForm.type);
                            

                              finalDocumentIds.push(documentId);
                            }
                          }
                          
                          // Check if any documents were actually created
                          if (finalDocumentIds.length === 0) {
                            toast({
                              title: "No documents to create",
                              description: "Please add documents or upload files before creating.",
                              duration: 5000,
                            });
                            return;
                          }
                          
                          // Show success feedback
                          toast({
                            title: "Document created successfully",
                            description: `${finalDocumentIds.length > 1 ? 'Documents' : 'Document'} created with ID${finalDocumentIds.length > 1 ? 's' : ''} ${finalDocumentIds.join(', ')}`,
                            duration: 5000,
                          });
                          
                        } catch (error) {
                          console.error('Error creating documents:', error);
                          toast({
                            title: "Error creating document",
                            description: "Failed to create document. Please try again.",
                            duration: 5000,
                          });
                        }
                        
                        // Close modal and reset form
                        setShowNewDocumentModal(false);
                        setDocumentModalStep(1);
                        setDocumentModalForm({ name: '', type: '', description: '', assignee: '', contract: '' });
                        setDocumentFormErrors({});
                        setDocumentUploadErrors({
                          files: false
                        });
                        setNewDocumentFormUploadedFiles([]);
                        setNewDocumentDocuments([]);
                        setSelectedNewDocumentFormFileSource('');
                        setShowNewDocumentUploadDropdown(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      {newDocumentDocuments.length > 1 ? 'Create Documents' : 'Create Document'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 select-none cursor-default" style={{ gridTemplateRows: 'minmax(0, 120px)' }}>
            {/* Total Contracts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800 cursor-default select-none">
                <HiOutlineDocumentText size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div className="flex flex-col items-start h-full cursor-default select-none">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Contracts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{contracts.length}</p>
                <div className="flex-1"></div>
              </div>
            </div>
            {/* Total Contract Value */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800 cursor-default select-none">
                <GrMoney size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div className="flex flex-col items-start h-full cursor-default select-none">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Contract Value</p>
                <p className="text-2xl font-bold text-primary cursor-default select-none">{calculateTotalValue()}</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold cursor-default select-none">↑ 12% from last month</p>
              </div>
            </div>
            {/* Avg. Completion Time */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800 cursor-default select-none">
                <TbClockUp size={20} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex flex-col items-start h-full cursor-default select-none">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Average Completion Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">3.2 days</p>
                <div className="relative">
                  <button
                    ref={completionTimeButtonRef}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setOpenCompletionTimeDropdown(!openCompletionTimeDropdown)}
                  >
                    <span>{selectedCompletionTime}</span>
                    <HiMiniChevronDown className="text-gray-400" size={16} />
                  </button>
                  {openCompletionTimeDropdown && (
                    <div 
                      ref={completionTimeDropdownRef}
                      className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1"
                    >
                      {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last month', 'This quarter', 'Last quarter', 'Last 6 months', 'Last year', 'Last 2 years'].map((option) => (
                        <button
                          key={option}
                          className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedCompletionTime === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                          onClick={() => setSelectedCompletionTime(option)}
                        >
                          <div className="w-3 h-3 border border-gray-300 rounded mr-2 flex items-center justify-center">
                            {selectedCompletionTime === option && (
                              <div className="w-2 h-2 bg-primary rounded-sm flex items-center justify-center">
                                <FaCheck className="text-white" size={6} />
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

            {/* Pending Signatures */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-200 dark:border-purple-800 cursor-default select-none">
                <TbEdit size={20} className="text-purple-500 dark:text-purple-400" />
              </div>
              <div className="flex flex-col items-start h-full cursor-default select-none">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending Signatures</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{contracts.filter(contract => contract.status === 'Signatures').length}</p>
                <div className="flex-1"></div>
              </div>
            </div>

          </div>
        </>
      )}

      <hr className="mb-6 border-gray-300 cursor-default select-none" />
      {/* Search/Filter Bar - Responsive Design */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-6 mt-2">
        {/* Mobile: Stacked layout */}
        <div className="lg:hidden">
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 w-full">
            <FaSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search contracts, parties, documents or IDs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            />
          </div>
          {/* Filter Buttons - Stacked, full width */}
          <div className="flex flex-col gap-2 mt-2">
            {activeContentTab === 'contractList' && (
              <div className="relative">
                <button 
                  ref={mobileStatusButtonRef}
                  className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowStatusDropdown(prev => !prev);
                    setOpenContractDropdown(false);
                    setOpenAssigneeDropdown(false);
                  }}
                >
                                      <span className="flex items-center"><TbHistory className="text-gray-400 text-base mr-2" />Status</span>
                  <HiMiniChevronDown className="text-gray-400" size={16} />
                </button>
                {showStatusDropdown && (
                  <div 
                    ref={mobileStatusDropdownRef}
                    className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 status-filter-dropdown" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    <button
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes('All') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={() => setSelectedStatuses(['All'])}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedStatuses.includes('All') && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      All
                    </button>
                    {availableStatuses.filter(status => status !== 'All').map(status => (
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
              </div>
            )}
            {activeContentTab === 'documents' && (
              <>
                <div className="relative">
                  <button
                    ref={mobileContractButtonRef}
                    className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => { setOpenContractDropdown(v => !v); setOpenAssigneeDropdown(false); setShowStatusDropdown(false); }}
                  >
                    <span className="flex items-center"><HiOutlineDocumentSearch className="text-gray-400 text-base mr-2" />Contract</span>
                    <HiMiniChevronDown className="text-gray-400" size={16} />
                  </button>
                  {openContractDropdown && (
                    <div 
                      ref={mobileContractDropdownRef}
                      className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 contract-dropdown" 
                      style={{ 
                        fontFamily: 'Avenir, sans-serif'
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
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${selectedContracts.includes(String(contract.id)) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => {
                              setSelectedContracts(prev => {
                                if (prev.includes(String(contract.id))) {
                                  return prev.filter(c => c !== String(contract.id));
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
                <div className="relative">
                  <button
                    ref={mobileAssigneeButtonRef}
                    className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => { setOpenAssigneeDropdown(v => !v); setOpenContractDropdown(false); setShowStatusDropdown(false); }}
                  >
                    <span className="flex items-center"><RiUserSearchLine className="text-gray-400 text-base mr-2" />Assignee</span>
                    <HiMiniChevronDown className="text-gray-400" size={16} />
                  </button>
                  {openAssigneeDropdown && (
                    <div 
                      ref={mobileAssigneeDropdownRef}
                      className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 assignee-dropdown" 
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
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
                        onClick={() => {
                          setSelectedAssignees(prev => {
                            if (prev.includes('__ME__')) {
                              return prev.filter(a => a !== '__ME__');
                            } else {
                              return [...prev, '__ME__'];
                            }
                          });
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
                      {Array.from(new Set(sampleDocuments.map(doc => doc.assignee).filter((assignee): assignee is string => assignee !== undefined))).sort().map(assignee => (
                        <button
                          key={assignee}
                          className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes(assignee) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                          onClick={(e) => {
                            e.preventDefault();
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
              </>
            )}
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
                    setOpenContractDropdown(false);
                    setOpenAssigneeDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><TbClockPin className="text-gray-400 text-base mr-2" />{selectedRecentlyUpdated}</span>
                <HiMiniChevronDown className="text-gray-400" size={16} />
              </button>
              {openRecentlyUpdatedDropdown && (
                <div 
                  ref={mobileRecentlyUpdatedDropdownRef}
                  className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
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
        <div className="hidden lg:flex items-center gap-1">
          {/* Search Bar */}
          <div className={`flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 min-w-0 ${activeContentTab === 'documents' ? 'flex-[1.5]' : 'flex-1'}`}>
            <FaSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search contracts, parties, documents or IDs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium min-w-0"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            />
          </div>
          {/* Filter Buttons - fixed width based on max content */}
          <div className="flex items-center flex-shrink-0">
            {activeContentTab === 'contractList' && (
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
                      setOpenContractDropdown(false);
                      setOpenAssigneeDropdown(false);
                    }
                  }}
                >
                                      <TbHistory className="text-gray-400 w-4 h-4" />
                    <span>Status</span>
                  <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
                </button>
                {showStatusDropdown && (
                  <div 
                    ref={statusDropdownRef}
                    className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 status-filter-dropdown w-40" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    <button
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes('All') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={() => setSelectedStatuses(['All'])}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedStatuses.includes('All') && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      All
                    </button>
                    {availableStatuses.filter(status => status !== 'All').map(status => (
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
              </div>
            )}
            {activeContentTab === 'documents' && (
              <>
                <div className="relative flex-shrink-0">
                  <button
                    ref={contractButtonRef}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => { setOpenContractDropdown(v => !v); setOpenAssigneeDropdown(false); setShowStatusDropdown(false); }}
                  >
                    <HiOutlineDocumentSearch className="text-gray-400 w-4 h-4" />
                    <span>Contract</span>
                    <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
                  </button>
                  {openContractDropdown && (
                    <div 
                      ref={contractDropdownRef}
                      className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 min-w-[320px] w-72 contract-dropdown" 
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Search Bar */}
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search contracts..."
                            value={contractSearch}
                            onChange={(e) => setContractSearch(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      <button
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedContracts.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
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
                      {contracts
                        .filter(contract => 
                          contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                          contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                        )
                        .sort((a, b) => Number(a.id) - Number(b.id))
                        .map(contract => (
                          <button
                            key={contract.id}
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${selectedContracts.includes(String(contract.id)) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => {
                              setSelectedContracts(prev => {
                                if (prev.includes(String(contract.id))) {
                                  return prev.filter(c => c !== String(contract.id));
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
                <div className="relative flex-shrink-0 ml-1">
                  <button
                    ref={assigneeButtonRef}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => { setOpenAssigneeDropdown(v => !v); setOpenContractDropdown(false); setShowStatusDropdown(false); }}
                  >
                    <RiUserSearchLine className="text-gray-400 w-4 h-4" />
                    <span>Assignee</span>
                    <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
                  </button>
                  {openAssigneeDropdown && (
                    <div 
                      ref={assigneeDropdownRef}
                      className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 assignee-dropdown w-44" 
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
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
                        onClick={() => {
                          setSelectedAssignees(prev => {
                            if (prev.includes('__ME__')) {
                              return prev.filter(a => a !== '__ME__');
                            } else {
                              return [...prev, '__ME__'];
                            }
                          });
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
                      {Array.from(new Set(sampleDocuments.map(doc => doc.assignee).filter((assignee): assignee is string => assignee !== undefined))).sort().map(assignee => (
                        <button
                          key={assignee}
                          className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes(assignee) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                          onClick={(e) => {
                            e.preventDefault();
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
              </>
            )}
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
                    setOpenAssigneeDropdown(false);
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
                  className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 w-[160px]" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
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

      {/* Table Section with Tabs in Outlined Box */}
      <div 
        ref={tableContainerRef}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 select-none relative"
      >
        {/* Tabs Row with Divider */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 w-full">
            {/* Contracts/Documents Tabs */}
                          <div className="flex space-x-4 overflow-x-auto w-full md:w-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
              {CONTENT_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                    activeContentTab === tab.key
                      ? 'text-primary border-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-transparent'
                  }`}
                  onClick={() => setActiveContentTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Created by Me/Assigned to Me Tabs (styled like main tabs) */}
            <div className="flex flex-col items-end w-full md:w-auto">
              <div className="flex space-x-8 overflow-x-auto w-full md:w-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                {TABS.filter(tab => tab.key !== 'allContracts').map(tab => (
                  <button
                    key={tab.key}
                    className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                      activeTab === tab.key
                        ? 'text-primary border-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-transparent'
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
        </div>
        {/* Table */}
        {activeContentTab === 'contractList' && (
          <>
            <div style={{ height: `calc(${visibleRows} * 3.5rem + 3rem)`, minHeight: '300px' }} className="relative overflow-x-auto overflow-y-auto mt-4 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleIdSort}
                  >
                    ID
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleContractSort}
                  >
                    Contract
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handlePartiesSort}
                  >
                    Parties
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                    onClick={handleContractTypeSort}
                  >
                    Contract Type
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleStatusSort}
                  >
                    Status
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleCreatedDateSort}
                  >
                    Created Date
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleLastUpdatedSort}
                  >
                    Last Updated
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleValueSort}
                  >
                    Value
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer select-none"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-primary underline font-semibold cursor-pointer" onClick={e => { e.stopPropagation(); setSelectedContract(contract); }}>{contract.id}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{contract.title}</div>
                    </td>
                    <td className="px-6 py-2.5 text-xs">
                      {(() => {
                        const parties = parseParties(contract.parties);
                        const isExpanded = expandedPartiesRows.has(contract.id);
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
                                  togglePartiesExpansion(contract.id);
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
                    <td className="px-6 py-2.5 whitespace-nowrap text-left text-xs">
                      <div className="text-gray-900 dark:text-white">{contract.type || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getStatusBadgeStyle(contract.status)}`}
                        style={{ minWidth: '7rem', display: 'inline-flex', borderWidth: '1px' }}>{contract.status}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-500 dark:text-gray-400">2024-05-01</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-500 dark:text-gray-400">{contract.updated}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-primary">{formatCurrency(contract.value || '0')}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group">
                          <TbEdit className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Edit
                          </span>
                        </button>
                        <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" onClick={e => { e.stopPropagation(); setShowUploadModal(true); setUploadContractId(contract.id); }}>
                          <HiOutlineUpload className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Upload
                          </span>
                        </button>
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group" 
                          onClick={e => { 
                            e.stopPropagation(); 
                            deleteContract(contract.id, contract.title);
                          }}
                        >
                          <MdCancelPresentation className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Void
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Bar for Contracts Table */}
          <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700 dark:text-gray-300">
                Showing {Math.min(visibleRows, sortedContracts.length)} of {sortedContracts.length} results.
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
                      <option value={50}>50</option>
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
          </>
        )}
        {/* Documents tab/table */}
        {activeContentTab === 'documents' && (
          <>
            <div style={{ height: `calc(${visibleRows} * 3.5rem + 3rem)`, minHeight: '300px' }} className="relative overflow-x-auto overflow-y-auto mt-4 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocIdSort}
                  >
                    ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocNameSort}
                  >
                    Document
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocAssigneeSort}
                  >
                    Assignee
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocUploadedBySort}
                  >
                    Uploaded By
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocDateUploadedSort}
                  >
                    Upload Date
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocContractIdSort}
                  >
                    Contract ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocContractSort}
                  >
                    Contract
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedDocuments.map((doc) => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer select-none"
                    onClick={() => {
                      setSelectedDocument(doc);
                      setShowDocumentModal(true);
                    }}
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs text-gray-900 dark:text-white text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">{doc.id}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                      <div className="font-bold text-xs text-gray-900 dark:text-white">{doc.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span>{doc.type}</span>
                        <span>&bull;</span>
                        <span>{doc.size}</span>
                    </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{doc.assignee}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs dark:text-white">{doc.uploadedBy}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 text-center">{doc.dateUploaded}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <a href={`#${doc.contractId}`} className="text-primary underline font-semibold cursor-pointer">{doc.contractId}</a>
                    </td>
                                          <td className="px-6 py-2.5 whitespace-nowrap text-xs font-bold text-gray-900 dark:text-white">{doc.contractName}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPdf({ name: doc.name, url: `/documents/${doc.name}`, id: doc.id });
                            setShowPdfViewer(true);
                          }}
                        >
                          <HiOutlineEye className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            View
                          </span>
                        </button>
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocument(doc);
                            setShowDocumentModal(true);
                          }}
                        >
                          <TbEdit className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Edit
                          </span>
                        </button>
                        <button 
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
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(doc.id, doc.name);
                          }}
                        >
                          <HiOutlineTrash className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Delete
                          </span>
                        </button>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Bar for Documents Table */}
          <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700 dark:text-gray-300">
                Showing {Math.min(visibleRows, sortedDocuments.length)} of {sortedDocuments.length} results.
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
                      <option value={50}>50</option>
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
          </>
        )}
        
        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity z-10"
          onMouseDown={handleResizeStart}
          style={{ cursor: isResizing ? 'nw-resize' : 'nw-resize' }}
        />
      </div>
    </div>
    {/* Modal for contract details */}
    {selectedContract && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden cursor-default select-none">
          {/* Sticky Header with Download Summary and Close buttons */}
          <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4 cursor-default select-none">
            <div className="flex items-start justify-between cursor-default select-none">
              {/* Left: Contract ID and Status */}
              <div className="flex-1 min-w-0 cursor-default select-none">
                <div className="flex items-center gap-4 mb-4 cursor-default select-none">
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary cursor-default select-none">
                    # {selectedContract.id}
                  </span>
                </div>
              </div>
              {/* Right: Close Button (original, now sticky) */}
              <button
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1 cursor-pointer"
                onClick={() => setSelectedContract(null)}
                aria-label="Close"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Centered Status Bar */}
            <div className="w-full overflow-x-auto cursor-default select-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
              <div className="flex flex-col items-center w-full max-w-full cursor-default select-none">
                {/* Progress Bar */}
                <div className="relative w-full max-w-[1100px] h-2 mb-6 bg-gray-200 rounded-full cursor-default select-none">
                  {(() => {
                    const steps = [
                      { key: 'initiation', label: 'Initiation', number: 1 },
                      { key: 'preparation', label: 'Preparation', number: 2 },
                      { key: 'wire details', label: 'Wire Details', number: 3 },
                      { key: 'in review', label: 'In Review', number: 4 },
                      { key: 'signatures', label: 'Signatures', number: 5 },
                      { key: 'funds disbursed', label: 'Funds Disbursed', number: 6 },
                      { key: 'completed', label: 'Completed', number: 7 }
                    ];
                    const currentIdx = steps.findIndex(s => s.label.toLowerCase() === selectedContract.status.toLowerCase());
                    const percent = currentIdx === -1 ? 0 : (currentIdx + 1) / steps.length * 100;
                    return (
                      <div className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-500 cursor-default select-none" style={{ width: `${percent}%` }} />
                    );
                  })()}
                </div>
                {/* Steps */}
                <div className="flex items-center justify-center gap-x-0 w-full max-w-[1100px] cursor-default select-none">
                  {(() => {
                    const steps = [
                      { key: 'initiation', label: 'Initiation', number: 1 },
                      { key: 'preparation', label: 'Preparation', number: 2 },
                      { key: 'wire details', label: 'Wire Details', number: 3 },
                      { key: 'in review', label: 'In Review', number: 4 },
                      { key: 'signatures', label: 'Signatures', number: 5 },
                      { key: 'funds disbursed', label: 'Funds Disbursed', number: 6 },
                      { key: 'completed', label: 'Completed', number: 7 }
                    ];
                    const currentIdx = steps.findIndex(s => s.label.toLowerCase() === selectedContract.status.toLowerCase());
                    // Calculate dynamic spacing for connectors
                    const connectorWidth = `calc((100% - ${steps.length * 48}px) / ${steps.length - 1})`;
                    return steps.map((step, idx) => {
                      const isCompleted = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center cursor-default select-none" style={{ minWidth: 80, flex: 1 }}>
                          <div className="relative flex items-center justify-center" style={{ width: 48 }}>
                            <div className={`flex items-center justify-center rounded-full border-2 transition-all duration-300 w-8 h-8 text-sm font-bold
                              ${isCompleted ? 'bg-primary border-primary text-white' : isCurrent ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'} cursor-default select-none`}
                            >
                              {isCompleted ? (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                step.number
                              )}
                            </div>
                            {/* Connector line */}
                            {idx < steps.length - 1 && (
                              <div className="absolute top-1/2 left-full ml-0 h-1 -translate-y-1/2 z-0 cursor-default select-none" style={{ width: connectorWidth, background: '#9ca3af' }} />
                            )}
                          </div>
                          <div className={`mt-2 text-xs font-medium text-center ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} cursor-default select-none`}>{step.label}</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
          {/* Modal Content (scrollable) and Sticky Footer as siblings */}
          <div className="flex flex-col flex-1 min-h-0 cursor-default select-none">
            <div className="overflow-y-auto p-6 flex-1 bg-gray-50 dark:bg-gray-900 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
              {/* Modal Content Grid: 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full min-h-0 -mt-2 items-start cursor-default select-none">
                {/* LEFT COLUMN: Contract Details, Parties Involved, Wire Details */}
                <div className="flex flex-col gap-6 w-full cursor-default select-none">
                  {/* Contract Details Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full cursor-default select-none">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Contract Details</h3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 cursor-default select-none">
                      {/* Row 1: Contract ID and Hash */}
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Contract ID</div>
                        <div className="text-xs text-black dark:text-white select-none cursor-default">{selectedContract.id}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1 cursor-default select-none">Smart Contract Chain ID</div>
                        <div className="flex items-center">
                          <span
                            className="text-xs font-mono text-gray-900 dark:text-white truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-default select-none"
                            style={{ maxWidth: '120px' }}
                            title={getSmartContractChainId(selectedContract.id)}
                          >
                            {getSmartContractChainId(selectedContract.id)}
                          </span>
                          <div className="relative">
                            <button
                              type="button"
                              className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(getSmartContractChainId(selectedContract.id));
                                setCopiedContractId(selectedContract.id);
                                setTimeout(() => setCopiedContractId(null), 1500);
                              }}
                              onMouseEnter={() => setHoveredContractId(selectedContract.id)}
                              onMouseLeave={() => setHoveredContractId(null)}
                              aria-label="Copy smart contract chain ID"
                            >
                              <HiOutlineDuplicate className="w-4 h-4" />
                            </button>
                            {copiedContractId === selectedContract.id && (
                              <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                Copied!
                              </div>
                            )}
                            {hoveredContractId === selectedContract.id && copiedContractId !== selectedContract.id && (
                              <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                Copy
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Row 2: Contract Name and Type */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1 cursor-default select-none">Contract Name</div>
                        {isEditingTitle ? (
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            value={editableTitle}
                            autoFocus
                            onChange={e => setEditableTitle(e.target.value)}
                            onBlur={() => {
                              if (selectedContract && editableTitle !== selectedContract.title) {
                                updateContractField(selectedContract.id, 'title', editableTitle);
                              }
                              setIsEditingTitle(false);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                if (selectedContract && editableTitle !== selectedContract.title) {
                                  updateContractField(selectedContract.id, 'title', editableTitle);
                                }
                                setIsEditingTitle(false);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                            onClick={() => setIsEditingTitle(true)}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setIsEditingTitle(true); }}
                          >
                            {editableTitle || 'Click to edit title'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Contract Type</div>
                        <div className="w-full px-4 py-2 text-xs text-black dark:text-white -ml-4 select-none cursor-default">{selectedType}</div>
                      </div>
                      {/* Status Row */}
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Status</div>
                        <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle(selectedContract.status)} cursor-default select-none`}>{selectedContract.status}</span>
                      </div>
                      <div></div>
                      {/* Row 3: Current Milestone and Next Step */}
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Current Milestone</div>
                        <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle('Wire Details')} cursor-default select-none`}>Wire Details</span>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Next Milestone</div>
                        <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle('In Review')} cursor-default select-none`}>Document Review</span>
                      </div>
                      {/* Row 4: Created Date and Last Updated */}
                      <div className="col-span-2 grid grid-cols-2 gap-x-12 cursor-default select-none">
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Created Date</div>
                          <div className="text-xs text-black dark:text-white select-none cursor-default">2024-05-01</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Last Updated</div>
                          <div className="text-xs text-black dark:text-white select-none cursor-default">2024-05-02</div>
                        </div>
                      </div>
                      {/* Row 5: Total Value */}
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Total Value</div>
                        {isEditingValue ? (
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            value={editableValue}
                            autoFocus
                            onChange={e => setEditableValue(parseAndFormatCurrency(e.target.value))}
                            onBlur={() => {
                              if (selectedContract && editableValue.trim() !== '') {
                                const formattedValue = formatCurrency(editableValue);
                                
                                // Update the contract in the contracts array
                                setContracts(prev => 
                                  prev.map(contract => 
                                    contract.id === selectedContract.id 
                                      ? { ...contract, value: formattedValue }
                                      : contract
                                  )
                                );
                                
                                // Update the selected contract
                                setSelectedContract({ ...selectedContract, value: formattedValue });
                                
                                // Persist the change to the backend
                                updateContractField(selectedContract.id, 'value', formattedValue);
                              }
                              setIsEditingValue(false);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                if (selectedContract && editableValue.trim() !== '') {
                                  const formattedValue = formatCurrency(editableValue);
                                  
                                  // Update the contract in the contracts array
                                  setContracts(prev => 
                                    prev.map(contract => 
                                      contract.id === selectedContract.id 
                                        ? { ...contract, value: formattedValue }
                                        : contract
                                    )
                                  );
                                  
                                  // Update the selected contract
                                  setSelectedContract({ ...selectedContract, value: formattedValue });
                                  
                                  // Persist the change to the backend
                                  updateContractField(selectedContract.id, 'value', formattedValue);
                                }
                                setIsEditingValue(false);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                            onClick={() => setIsEditingValue(true)}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setIsEditingValue(true); }}
                          >
                            {formatCurrency(editableValue || selectedContract?.value || '0')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Expand/Collapse Button for Additional Contract Details */}
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        onClick={() => setShowContractDetailsExpanded(!showContractDetailsExpanded)}
                        className="h-[34px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-2"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <PiCaretUpDownBold 
                          size={16} 
                          className={`transition-transform duration-200 text-white ${showContractDetailsExpanded ? 'rotate-180' : ''}`}
                        />
                        <span className="text-xs font-medium">
                          {showContractDetailsExpanded ? 'Hide' : 'Show'} Additional Details
                        </span>
                      </button>
                    </div>

                    {/* Additional Contract Details */}
                    {showContractDetailsExpanded && (
                      <div className="space-y-4 mt-4 cursor-default select-none">
                        {/* Address Fields */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 cursor-default select-none">
                          {/* Address */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Address</div>
                            {isEditingAddress ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableAddress}
                                autoFocus
                                onChange={e => setEditableAddress(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableAddress !== selectedContract.propertyAddress) {
                                    handleContractDetailsFieldUpdate('propertyAddress', editableAddress);
                                  }
                                  setIsEditingAddress(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableAddress !== selectedContract.propertyAddress) {
                                      handleContractDetailsFieldUpdate('propertyAddress', editableAddress);
                                    }
                                    setIsEditingAddress(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.propertyAddress ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableAddress(selectedContract.propertyAddress || '');
                                  setIsEditingAddress(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableAddress(selectedContract.propertyAddress || '');
                                  setIsEditingAddress(true);
                                }}}
                              >
                                {selectedContract.propertyAddress || 'Click to edit address...'}
                              </div>
                            )}
                          </div>
                          {/* Property Type */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Property Type</div>
                            <div className="relative w-full" ref={contractDetailsPropertyTypeDropdownRef}>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900"
                                placeholder="Select property type"
                                value={PROPERTY_TYPES.find(t => t === selectedContract.propertyType) || ''}
                                readOnly
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace') {
                                    e.preventDefault();
                                    if (selectedContract) {
                                      handleContractDetailsFieldUpdate('propertyType', '');
                                    }
                                  }
                                }}
                                onFocus={(e) => {
                                  // Move cursor to end of text when focused
                                  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                                }}
                                onClick={() => setShowContractDetailsPropertyTypeDropdown(!showContractDetailsPropertyTypeDropdown)}
                              />
                              <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              {showContractDetailsPropertyTypeDropdown && (
                                <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                  {PROPERTY_TYPES.map(type => (
                                    <button
                                      key={type}
                                      className={`w-full text-left px-3 py-0.5 text-xs font-medium ${selectedContract.propertyType === type ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                      onClick={e => {
                                        e.preventDefault();
                                        if (selectedContract) {
                                          handleContractDetailsFieldUpdate('propertyType', type);
                                        }
                                        setShowContractDetailsPropertyTypeDropdown(false);
                                      }}
                                    >
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* City */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">City</div>
                            {isEditingCity ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableCity}
                                autoFocus
                                onChange={e => setEditableCity(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableCity !== selectedContract.city) {
                                    handleContractDetailsFieldUpdate('city', editableCity);
                                  }
                                  setIsEditingCity(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableCity !== selectedContract.city) {
                                      handleContractDetailsFieldUpdate('city', editableCity);
                                    }
                                    setIsEditingCity(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.city ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableCity(selectedContract.city || '');
                                  setIsEditingCity(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableCity(selectedContract.city || '');
                                  setIsEditingCity(true);
                                }}}
                              >
                                {selectedContract.city || 'Click to edit city...'}
                              </div>
                            )}
                          </div>
                          {/* State */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">State</div>
                            <div className="relative w-full" ref={contractDetailsStateDropdownRef}>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900"
                                placeholder="Select state"
                                value={contractDetailsStateSearchTerm || US_STATES.find(s => s.value === selectedContract.state)?.label || ''}
                                onChange={(e) => setContractDetailsStateSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && !contractDetailsStateSearchTerm) {
                                    e.preventDefault();
                                    if (selectedContract) {
                                      handleContractDetailsFieldUpdate('state', '');
                                    }
                                  }
                                }}
                                onFocus={(e) => {
                                  if (!showContractDetailsStateDropdown) {
                                    setShowContractDetailsStateDropdown(true);
                                  }
                                }}
                                onInput={(e) => {
                                  const inputValue = e.currentTarget.value;
                                  if (inputValue && !contractDetailsStateSearchTerm) {
                                    const matchingState = US_STATES.find(s => 
                                      s.label.toLowerCase() === inputValue.toLowerCase()
                                    );
                                    if (matchingState) {
                                      handleContractDetailsFieldUpdate('state', matchingState.value);
                                    }
                                  }
                                }}
                              />
                              <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              {showContractDetailsStateDropdown && (
                                <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                  {US_STATES
                                    .filter(state => 
                                      state.label.toLowerCase().includes(contractDetailsStateSearchTerm.toLowerCase())
                                    )
                                    .map(state => (
                                    <button
                                      key={state.value}
                                      className={`w-full text-left px-3 py-0.5 text-xs font-medium ${selectedContract.state === state.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                      onClick={e => {
                                        e.preventDefault();
                                        handleContractDetailsFieldUpdate('state', state.value);
                                        setShowContractDetailsStateDropdown(false);
                                        setContractDetailsStateSearchTerm('');
                                      }}
                                    >
                                      {state.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Zip Code */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Zip Code</div>
                            {isEditingZipCode ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableZipCode}
                                autoFocus
                                onChange={e => setEditableZipCode(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableZipCode !== selectedContract.zipCode) {
                                    handleContractDetailsFieldUpdate('zipCode', editableZipCode);
                                  }
                                  setIsEditingZipCode(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableZipCode !== selectedContract.zipCode) {
                                      handleContractDetailsFieldUpdate('zipCode', editableZipCode);
                                    }
                                    setIsEditingZipCode(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.zipCode ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableZipCode(selectedContract.zipCode || '');
                                  setIsEditingZipCode(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableZipCode(selectedContract.zipCode || '');
                                  setIsEditingZipCode(true);
                                }}}
                              >
                                {selectedContract.zipCode || 'Click to edit zip code...'}
                              </div>
                            )}
                          </div>
                          {/* Country */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Country</div>
                            <div className="relative w-full" ref={contractDetailsCountryDropdownRef}>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900"
                                placeholder="Select country"
                                value={contractDetailsCountrySearchTerm || COUNTRIES.find(c => c.value === selectedContract.country)?.label || ''}
                                onChange={(e) => setContractDetailsCountrySearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && !contractDetailsCountrySearchTerm) {
                                    e.preventDefault();
                                    if (selectedContract) {
                                      handleContractDetailsFieldUpdate('country', '');
                                    }
                                  }
                                }}
                                onFocus={(e) => {
                                  if (!showContractDetailsCountryDropdown) {
                                    setShowContractDetailsCountryDropdown(true);
                                  }
                                }}
                                onInput={(e) => {
                                  const inputValue = e.currentTarget.value;
                                  if (inputValue && !contractDetailsCountrySearchTerm) {
                                    const matchingCountry = COUNTRIES.find(c => 
                                      c.label.toLowerCase() === inputValue.toLowerCase()
                                    );
                                    if (matchingCountry) {
                                      handleContractDetailsFieldUpdate('country', matchingCountry.value);
                                    }
                                  }
                                }}
                              />
                              <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              {showContractDetailsCountryDropdown && (
                                <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                  {COUNTRIES
                                    .filter(country => 
                                      country.label.toLowerCase().includes(contractDetailsCountrySearchTerm.toLowerCase())
                                    )
                                    .map(country => (
                                    <button
                                      key={country.value}
                                      className={`w-full text-left px-3 py-0.5 text-xs font-medium ${selectedContract.country === country.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                      onClick={e => {
                                        e.preventDefault();
                                        handleContractDetailsFieldUpdate('country', country.value);
                                        setShowContractDetailsCountryDropdown(false);
                                        setContractDetailsCountrySearchTerm('');
                                      }}
                                    >
                                      {country.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>
                        
                        {/* Contract Details Fields */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 cursor-default select-none">
                          {/* Escrow Number */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Escrow Number</div>
                            {isEditingEscrowNumber ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableEscrowNumber}
                                autoFocus
                                onChange={e => setEditableEscrowNumber(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableEscrowNumber !== selectedContract.escrowNumber) {
                                    handleContractDetailsFieldUpdate('escrowNumber', editableEscrowNumber);
                                  }
                                  setIsEditingEscrowNumber(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableEscrowNumber !== selectedContract.escrowNumber) {
                                      handleContractDetailsFieldUpdate('escrowNumber', editableEscrowNumber);
                                    }
                                    setIsEditingEscrowNumber(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.escrowNumber ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableEscrowNumber(selectedContract.escrowNumber || '');
                                  setIsEditingEscrowNumber(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableEscrowNumber(selectedContract.escrowNumber || '');
                                  setIsEditingEscrowNumber(true);
                                }}}
                              >
                                {selectedContract.escrowNumber || 'Click to edit escrow number...'}
                              </div>
                            )}
                          </div>
                          <div></div>
                          
                          {/* Loan Amount */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Loan Amount</div>
                            {isEditingLoanAmount ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableLoanAmount}
                                autoFocus
                                onChange={e => setEditableLoanAmount(parseAndFormatCurrency(e.target.value))}
                                onBlur={() => {
                                  if (selectedContract && editableLoanAmount.trim() !== '') {
                                    const formattedValue = formatCurrency(editableLoanAmount);
                                    handleContractDetailsFieldUpdate('loanAmount', formattedValue);
                                  }
                                  setIsEditingLoanAmount(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableLoanAmount.trim() !== '') {
                                      const formattedValue = formatCurrency(editableLoanAmount);
                                      handleContractDetailsFieldUpdate('loanAmount', formattedValue);
                                    }
                                    setIsEditingLoanAmount(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.loanAmount ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableLoanAmount(selectedContract.loanAmount || '');
                                  setIsEditingLoanAmount(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableLoanAmount(selectedContract.loanAmount || '');
                                  setIsEditingLoanAmount(true);
                                }}}
                              >
                                {selectedContract.loanAmount ? formatCurrency(selectedContract.loanAmount) : 'Click to edit loan amount...'}
                              </div>
                            )}
                          </div>
                          {/* Loan Term */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Loan Term (Years)</div>
                            {isEditingLoanTerm ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableLoanTerm}
                                autoFocus
                                onChange={e => setEditableLoanTerm(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableLoanTerm !== selectedContract.loanTerm) {
                                    handleContractDetailsFieldUpdate('loanTerm', editableLoanTerm);
                                  }
                                  setIsEditingLoanTerm(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableLoanTerm !== selectedContract.loanTerm) {
                                      handleContractDetailsFieldUpdate('loanTerm', editableLoanTerm);
                                    }
                                    setIsEditingLoanTerm(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.loanTerm ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableLoanTerm(selectedContract.loanTerm || '');
                                  setIsEditingLoanTerm(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableLoanTerm(selectedContract.loanTerm || '');
                                  setIsEditingLoanTerm(true);
                                }}}
                              >
                                {selectedContract.loanTerm || 'Click to edit loan term...'}
                              </div>
                            )}
                          </div>
                          
                          {/* Interest Rate */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Interest Rate (%)</div>
                            {isEditingInterestRate ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableInterestRate}
                                autoFocus
                                onChange={e => setEditableInterestRate(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableInterestRate !== selectedContract.interestRate) {
                                    handleContractDetailsFieldUpdate('interestRate', editableInterestRate);
                                  }
                                  setIsEditingInterestRate(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableInterestRate !== selectedContract.interestRate) {
                                      handleContractDetailsFieldUpdate('interestRate', editableInterestRate);
                                    }
                                    setIsEditingInterestRate(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.interestRate ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableInterestRate(selectedContract.interestRate || '');
                                  setIsEditingInterestRate(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableInterestRate(selectedContract.interestRate || '');
                                  setIsEditingInterestRate(true);
                                }}}
                              >
                                {selectedContract.interestRate || 'Click to edit interest rate...'}
                              </div>
                            )}
                          </div>
                          {/* Down Payment */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Down Payment</div>
                            {isEditingDownPayment ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableDownPayment}
                                autoFocus
                                onChange={e => setEditableDownPayment(parseAndFormatCurrency(e.target.value))}
                                onBlur={() => {
                                  if (selectedContract && editableDownPayment.trim() !== '') {
                                    const formattedValue = formatCurrency(editableDownPayment);
                                    handleContractDetailsFieldUpdate('downPayment', formattedValue);
                                  }
                                  setIsEditingDownPayment(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableDownPayment.trim() !== '') {
                                      const formattedValue = formatCurrency(editableDownPayment);
                                      handleContractDetailsFieldUpdate('downPayment', formattedValue);
                                    }
                                    setIsEditingDownPayment(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.downPayment ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableDownPayment(selectedContract.downPayment || '');
                                  setIsEditingDownPayment(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableDownPayment(selectedContract.downPayment || '');
                                  setIsEditingDownPayment(true);
                                }}}
                              >
                                {selectedContract.downPayment ? formatCurrency(selectedContract.downPayment) : 'Click to edit down payment...'}
                              </div>
                            )}
                          </div>
                          
                          {/* Earnest Money */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Earnest Money</div>
                            {isEditingEarnestMoney ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableEarnestMoney}
                                autoFocus
                                onChange={e => setEditableEarnestMoney(parseAndFormatCurrency(e.target.value))}
                                onBlur={() => {
                                  if (selectedContract && editableEarnestMoney.trim() !== '') {
                                    const formattedValue = formatCurrency(editableEarnestMoney);
                                    handleContractDetailsFieldUpdate('earnestMoney', formattedValue);
                                  }
                                  setIsEditingEarnestMoney(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableEarnestMoney.trim() !== '') {
                                      const formattedValue = formatCurrency(editableEarnestMoney);
                                      handleContractDetailsFieldUpdate('earnestMoney', formattedValue);
                                    }
                                    setIsEditingEarnestMoney(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.earnestMoney ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableEarnestMoney(selectedContract.earnestMoney || '');
                                  setIsEditingEarnestMoney(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableEarnestMoney(selectedContract.earnestMoney || '');
                                  setIsEditingEarnestMoney(true);
                                }}}
                              >
                                {selectedContract.earnestMoney ? formatCurrency(selectedContract.earnestMoney) : 'Click to edit earnest money...'}
                              </div>
                            )}
                          </div>
                          {/* Inspection Period */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Inspection Period (Days)</div>
                            {isEditingInspectionPeriod ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableInspectionPeriod}
                                autoFocus
                                onChange={e => setEditableInspectionPeriod(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableInspectionPeriod !== selectedContract.inspectionPeriod) {
                                    handleContractDetailsFieldUpdate('inspectionPeriod', editableInspectionPeriod);
                                  }
                                  setIsEditingInspectionPeriod(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableInspectionPeriod !== selectedContract.inspectionPeriod) {
                                      handleContractDetailsFieldUpdate('inspectionPeriod', editableInspectionPeriod);
                                    }
                                    setIsEditingInspectionPeriod(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.inspectionPeriod ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableInspectionPeriod(selectedContract.inspectionPeriod || '');
                                  setIsEditingInspectionPeriod(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableInspectionPeriod(selectedContract.inspectionPeriod || '');
                                  setIsEditingInspectionPeriod(true);
                                }}}
                              >
                                {selectedContract.inspectionPeriod || 'Click to edit inspection period...'}
                              </div>
                            )}
                          </div>
                          
                          {/* Title Company */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Title Company</div>
                            {isEditingTitleCompany ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableTitleCompany}
                                autoFocus
                                onChange={e => setEditableTitleCompany(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableTitleCompany !== selectedContract.titleCompany) {
                                    handleContractDetailsFieldUpdate('titleCompany', editableTitleCompany);
                                  }
                                  setIsEditingTitleCompany(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableTitleCompany !== selectedContract.titleCompany) {
                                      handleContractDetailsFieldUpdate('titleCompany', editableTitleCompany);
                                    }
                                    setIsEditingTitleCompany(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.titleCompany ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableTitleCompany(selectedContract.titleCompany || '');
                                  setIsEditingTitleCompany(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableTitleCompany(selectedContract.titleCompany || '');
                                  setIsEditingTitleCompany(true);
                                }}}
                              >
                                {selectedContract.titleCompany || 'Click to edit title company...'}
                              </div>
                            )}
                          </div>
                          {/* Insurance Company */}
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Insurance Company</div>
                            {isEditingInsuranceCompany ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                value={editableInsuranceCompany}
                                autoFocus
                                onChange={e => setEditableInsuranceCompany(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableInsuranceCompany !== selectedContract.insuranceCompany) {
                                    handleContractDetailsFieldUpdate('insuranceCompany', editableInsuranceCompany);
                                  }
                                  setIsEditingInsuranceCompany(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (selectedContract && editableInsuranceCompany !== selectedContract.insuranceCompany) {
                                      handleContractDetailsFieldUpdate('insuranceCompany', editableInsuranceCompany);
                                    }
                                    setIsEditingInsuranceCompany(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${selectedContract.insuranceCompany ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableInsuranceCompany(selectedContract.insuranceCompany || '');
                                  setIsEditingInsuranceCompany(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableInsuranceCompany(selectedContract.insuranceCompany || '');
                                  setIsEditingInsuranceCompany(true);
                                }}}
                              >
                                {selectedContract.insuranceCompany || 'Click to edit insurance company...'}
                              </div>
                            )}
                          </div>
                          
                          {/* Contingencies */}
                          <div className="col-span-2">
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Contingencies</div>
                            {isEditingContingencies ? (
                              <textarea
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-[60px] resize-none"
                                value={editableContingencies}
                                autoFocus
                                onChange={e => setEditableContingencies(e.target.value)}
                                onBlur={() => {
                                  if (selectedContract && editableContingencies !== selectedContract.contingencies) {
                                    handleContractDetailsFieldUpdate('contingencies', editableContingencies);
                                  }
                                  setIsEditingContingencies(false);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && e.ctrlKey) {
                                    if (selectedContract && editableContingencies !== selectedContract.contingencies) {
                                      handleContractDetailsFieldUpdate('contingencies', editableContingencies);
                                    }
                                    setIsEditingContingencies(false);
                                  }
                                }}
                              />
                            ) : (
                              <div
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer min-h-[60px] ${selectedContract.contingencies ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => {
                                  setEditableContingencies(selectedContract.contingencies || '');
                                  setIsEditingContingencies(true);
                                }}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') {
                                  setEditableContingencies(selectedContract.contingencies || '');
                                  setIsEditingContingencies(true);
                                }}}
                              >
                                {selectedContract.contingencies || 'Click to edit contingencies...'}
                            </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Parties Involved Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full cursor-default select-none">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Parties Involved</h3>
                    <div className="space-y-4 cursor-default select-none">
                      {/* Party 1 */}
                      <div className="space-y-4">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Party 1 (Buyer)</div>
                        {/* Name and Role on same line */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Name */}
                          <div>
                            {isEditingBuyer ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${(editableBuyer || selectedContract?.buyer || selectedContract?.parties?.split('&')[0]?.trim()) ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setIsEditingBuyer(true)}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') setIsEditingBuyer(true); }}
                              >
                                {editableBuyer || selectedContract?.buyer || selectedContract?.parties?.split('&')[0]?.trim() || 'Click to edit buyer...'}
                              </div>
                            )}
                          </div>
                          {/* Role Dropdown */}
                          <div className="relative">
                            <button
                              type="button"
                              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer flex items-center justify-between"
                              onClick={() => setShowParty1RoleDropdown(!showParty1RoleDropdown)}
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                            >
                              <span>{party1Role}</span>
                              <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px]" />
                            </button>
                            {showParty1RoleDropdown && (
                              <div
                                ref={party1RoleDropdownRef}
                                className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                {['Standard', 'Buyer', 'Seller', 'Buyer Agent', 'Seller Agent', 'Closing Agent', 'Inspector', 'Appraiser'].map((role) => (
                                  <button
                                    key={role}
                                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${party1Role === role ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                    style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                    onClick={() => {
                                      setParty1Role(role);
                                      setShowParty1RoleDropdown(false);
                                    }}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Email */}
                        <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.buyerEmail ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {selectedContract.buyerEmail || 'Not specified'}
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="border-t border-gray-200"></div>
                      
                      {/* Party 2 */}
                      <div className="space-y-4">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Party 2 (Seller)</div>
                        {/* Name and Role on same line */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Name */}
                          <div>
                            {isEditingSeller ? (
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
                                className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer ${(editableSeller || selectedContract?.seller || selectedContract?.parties?.split('&')[1]?.trim()) ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setIsEditingSeller(true)}
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') setIsEditingSeller(true); }}
                              >
                                {editableSeller || selectedContract?.seller || selectedContract?.parties?.split('&')[1]?.trim() || 'Click to edit seller...'}
                              </div>
                            )}
                          </div>
                          {/* Role Dropdown */}
                          <div className="relative">
                            <button
                              type="button"
                              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer flex items-center justify-between"
                              onClick={() => setShowParty2RoleDropdown(!showParty2RoleDropdown)}
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                            >
                              <span>{party2Role}</span>
                              <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px]" />
                            </button>
                            {showParty2RoleDropdown && (
                              <div
                                ref={party2RoleDropdownRef}
                                className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                {['Standard', 'Buyer', 'Seller', 'Buyer Agent', 'Seller Agent', 'Closing Agent', 'Inspector', 'Appraiser'].map((role) => (
                                  <button
                                    key={role}
                                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${party2Role === role ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                    style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                    onClick={() => {
                                      setParty2Role(role);
                                      setShowParty2RoleDropdown(false);
                                    }}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Email */}
                        <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.sellerEmail ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {selectedContract.sellerEmail || 'Not specified'}
                        </div>
                      </div>
                      
                      {/* Expand/Collapse Button for Additional Parties */}
                      {additionalParties.length > 0 && (
                        <div className="flex justify-center mt-4">
                          <button
                            type="button"
                            onClick={() => setShowAdditionalParties(!showAdditionalParties)}
                            className="h-[34px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-2"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            <PiCaretUpDownBold 
                              size={16} 
                              className={`transition-transform duration-200 text-white ${showAdditionalParties ? 'rotate-180' : ''}`}
                            />
                            <span className="text-xs font-medium">
                              {showAdditionalParties ? 'Hide' : 'Show'} Additional Parties ({additionalParties.length})
                            </span>
                          </button>
                        </div>
                      )}
                                            {/* Additional Parties */}
                      {showAdditionalParties && (
                        <>
                          {additionalParties.map((party, index) => (
                            <div key={party.id}>
                              {/* Divider between additional parties */}
                              {index > 0 && (
                                <div className="border-t border-gray-200 my-4"></div>
                              )}
                              
                              {/* Party */}
                              <div className="space-y-4">
                                <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Party {index + 3}</div>
                            {/* Name and Role on same line */}
                            <div className="grid grid-cols-2 gap-3">
                              {/* Name */}
                              <div>
                                {party.isEditing ? (
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    value={party.name}
                                    autoFocus
                                    onChange={e => handleAdditionalPartyNameChange(party.id, e.target.value)}
                                    onBlur={() => toggleAdditionalPartyEditing(party.id)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') {
                                        toggleAdditionalPartyEditing(party.id);
                                      }
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                                    onClick={() => toggleAdditionalPartyEditing(party.id)}
                                    tabIndex={0}
                                    onKeyDown={e => { if (e.key === 'Enter') toggleAdditionalPartyEditing(party.id); }}
                                  >
                                    {party.name}
                                  </div>
                                )}
                              </div>
                              {/* Role Dropdown */}
                              <div className="relative">
                                <button
                                  type="button"
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer flex items-center justify-between"
                                  onClick={() => toggleAdditionalPartyRoleDropdown(party.id)}
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                >
                                  <span>{party.role}</span>
                                  <HiMiniChevronDown size={14} className="inline-block align-middle -mt-[1px]" />
                                </button>
                                {party.showRoleDropdown && (
                                  <div
                                    ref={(el) => { additionalPartyRoleDropdownRefs.current[party.id] = el; }}
                                    className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    {['Standard', 'Buyer', 'Seller', 'Buyer Agent', 'Seller Agent', 'Closing Agent', 'Inspector', 'Appraiser'].map((role) => (
                                      <button
                                        key={role}
                                        className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${party.role === role ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                        style={{ background: 'none', border: 'none', boxShadow: 'none' }}
                                        onClick={() => handleAdditionalPartyRoleChange(party.id, role)}
                                      >
                                        {role}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Email */}
                            <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${party.email ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {party.email || 'Not specified'}
                              </div>
                            </div>
                          </div>
                        ))}
                        </>
                      )}

                    </div>
                  </div>
                  {/* Wire Details Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full cursor-default select-none">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Wire Details</h3>
                    <div className="space-y-6 cursor-default select-none">
                      {/* Buyer Information */}
                      <div className="space-y-4">
                        {/* Buyer Financial Institution */}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Buyer Financial Institution</div>
                          <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.buyerFinancialInstitution ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {selectedContract.buyerFinancialInstitution || 'Not specified'}
                          </div>
                        </div>
                        {/* Buyer Routing Number */}
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                            Buyer Routing Number
                            <button
                              type="button"
                              onClick={() => setContractDetailsBuyerRoutingVisible(!contractDetailsBuyerRoutingVisible)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                            >
                              {contractDetailsBuyerRoutingVisible ? (
                                <HiOutlineEyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <HiOutlineEye className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.buyerFinancialInstitutionRoutingNumber ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} style={{ fontFamily: contractDetailsBuyerRoutingVisible ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif' }}>
                            {contractDetailsBuyerRoutingVisible 
                              ? (selectedContract.buyerFinancialInstitutionRoutingNumber || 'Not specified')
                              : (selectedContract.buyerFinancialInstitutionRoutingNumber 
                                  ? selectedContract.buyerFinancialInstitutionRoutingNumber.replace(/./g, '*') 
                                  : 'Not specified')
                            }
                          </div>
                        </div>
                        {/* Buyer Account Number */}
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                            Buyer Account Number
                            <button
                              type="button"
                              onClick={() => setContractDetailsBuyerAccountVisible(!contractDetailsBuyerAccountVisible)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                            >
                              {contractDetailsBuyerAccountVisible ? (
                                <HiOutlineEyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <HiOutlineEye className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.buyerAccountNumber ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} style={{ fontFamily: contractDetailsBuyerAccountVisible ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif' }}>
                            {contractDetailsBuyerAccountVisible 
                              ? (selectedContract.buyerAccountNumber || 'Not specified')
                              : (selectedContract.buyerAccountNumber 
                                  ? selectedContract.buyerAccountNumber.replace(/./g, '*') 
                                  : 'Not specified')
                            }
                          </div>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="border-t border-gray-200"></div>
                      
                      {/* Seller Information */}
                      <div className="space-y-4">
                        {/* Seller Financial Institution */}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Seller Financial Institution</div>
                          <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.sellerFinancialInstitution ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {selectedContract.sellerFinancialInstitution || 'Not specified'}
                          </div>
                        </div>
                        {/* Seller Routing Number */}
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                            Seller Routing Number
                            <button
                              type="button"
                              onClick={() => setContractDetailsSellerRoutingVisible(!contractDetailsSellerRoutingVisible)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                            >
                              {contractDetailsSellerRoutingVisible ? (
                                <HiOutlineEyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <HiOutlineEye className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.sellerFinancialInstitutionRoutingNumber ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} style={{ fontFamily: contractDetailsSellerRoutingVisible ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif' }}>
                            {contractDetailsSellerRoutingVisible 
                              ? (selectedContract.sellerFinancialInstitutionRoutingNumber || 'Not specified')
                              : (selectedContract.sellerFinancialInstitutionRoutingNumber 
                                  ? selectedContract.sellerFinancialInstitutionRoutingNumber.replace(/./g, '*') 
                                  : 'Not specified')
                            }
                          </div>
                        </div>
                        {/* Seller Account Number */}
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                            Seller Account Number
                            <button
                              type="button"
                              onClick={() => setContractDetailsSellerAccountVisible(!contractDetailsSellerAccountVisible)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                            >
                              {contractDetailsSellerAccountVisible ? (
                                <HiOutlineEyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <HiOutlineEye className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <div className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 select-none cursor-default ${selectedContract.sellerAccountNumber ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} style={{ fontFamily: contractDetailsSellerAccountVisible ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'Avenir, sans-serif' }}>
                            {contractDetailsSellerAccountVisible 
                              ? (selectedContract.sellerAccountNumber || 'Not specified')
                              : (selectedContract.sellerAccountNumber 
                                  ? selectedContract.sellerAccountNumber.replace(/./g, '*') 
                                  : 'Not specified')
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* RIGHT COLUMN: Documents, Signature Status, Tasks */}
                <div className="flex flex-col gap-6 w-full cursor-default select-none">
                  {/* Documents Box */}
                  <div ref={documentsBoxRef} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full box-border cursor-default select-none">
                    <div className="flex items-center justify-between cursor-default select-none">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Documents</h3>
                      <button 
                        onClick={() => { setShowUploadModal(true); setUploadContractId(selectedContract?.id || null); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <HiOutlineUpload className="text-base text-primary dark:text-white" /> Upload
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto mt-4 pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ maxHeight: '450px', minHeight: '140px' }}>
                      {filteredDocuments
                        .filter(doc => doc.contractId === selectedContract.id)
                        .map(doc => (
                        <div key={doc.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                          <div className="flex items-center gap-3 cursor-default select-none">
                            <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                            <div className="flex-1 min-w-0">
                              {editingDocumentName === doc.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={getDocumentDisplayName(doc)}
                                    onChange={(e) => {
                                      setCustomDocumentNames(prev => ({ ...prev, [doc.id]: e.target.value }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleSaveDocumentName(doc, getDocumentDisplayName(doc));
                                      } else if (e.key === 'Escape') {
                                        handleCancelEditDocumentName();
                                      }
                                    }}
                                    onBlur={() => handleSaveDocumentName(doc, getDocumentDisplayName(doc))}
                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveDocumentName(doc, getDocumentDisplayName(doc))}
                                    className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCancelEditDocumentName()}
                                    className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate">
                                    {getDocumentDisplayName(doc)}
                                  </div>
                              )}
                              <div className="text-xs text-gray-500 cursor-default select-none">{doc.dateUploaded} &bull; {doc.type} &bull; {doc.size} &bull; {doc.assignee}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 cursor-default select-none">
                                                              <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer" onClick={() => { setSelectedPdf({ name: doc.name, url: `/documents/${doc.name}`, id: doc.id }); setShowPdfViewer(true); }}>
                              <HiOutlineEye className="h-4 w-4 transition-colors" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                View
                              </span>
                            </button>
                            <button 
                              className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditDocumentName(doc);
                              }}
                            >
                              <TbEdit className="h-4 w-4 transition-colors" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Edit
                              </span>
                            </button>
                            <button 
                              className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer"
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
                              className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDocument(doc.id, doc.name);
                              }}
                            >
                              <HiOutlineTrash className="h-4 w-4 transition-colors" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Delete
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Signature Status Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full cursor-default select-none">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Signature Status</h3>
                    <div className="flex flex-col gap-3 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 pr-2" style={{ maxHeight: '200px', minHeight: '200px' }}>
                      {/* Use contract parties for signature status */}
                      {[
                        { name: selectedContract?.buyer || selectedContract?.parties?.split('&')[0]?.trim() || 'Robert Chen', role: 'Client', status: 'Signed', date: 'May 18, 2025' },
                        { name: selectedContract?.seller || selectedContract?.parties?.split('&')[1]?.trim() || 'Eastside Properties', role: 'Seller', status: 'Signed', date: 'May 17, 2025' },
                        { name: selectedContract?.agent || 'N/A', role: 'Escrow Officer', status: 'Pending', date: null },
                      ].map((sig) => (
                        <div key={sig.name} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2.5 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm cursor-default select-none">{sig.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">{sig.role}</div>
                          </div>
                        <div className="flex items-center gap-4 cursor-default select-none">
                            {sig.status === 'Signed' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold cursor-default select-none">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Signed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold cursor-default select-none">
                                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                                Pending
                              </span>
                            )}
                            <span className="text-xs text-gray-400 font-medium min-w-[90px] text-right cursor-default select-none">{sig.date || ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Tasks Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full cursor-default select-none">
                    <div className="flex items-center justify-between mb-4 cursor-default select-none">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white cursor-default select-none">Tasks</h3>
                      <button className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <span className="text-base font-bold text-primary dark:text-white">+</span> New Task
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto cursor-default select-none flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ minHeight: '830px' }}>
                      {selectedContract ? (
                        getTasksByContract(selectedContract.id).length > 0 ? (
                          getTasksByContract(selectedContract.id).map(task => (
                            <div key={task.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm relative cursor-default select-none">
                              {/* Task Number and Open Button - Top Row */}
                              <div className="flex items-center justify-between mb-3 cursor-default select-none">
                                <div className="cursor-default select-none">
                                  <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 cursor-default select-none">
                                    Task #{task.taskNumber}
                                  </span>
                                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1 cursor-default select-none">
                                    # {task.contractId}
                                  </span>
                                </div>
                                {/* Open Task Button - Top Right */}
                                <button 
                                  className="border border-gray-300 dark:border-gray-500 rounded-md px-1 py-0.5 text-white hover:border-primary hover:text-primary transition-colors cursor-pointer relative group"
                                >
                                  <FaArrowUpRightFromSquare className="h-3 w-3" />
                                  <span className="absolute -bottom-8 -right-1 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Open Task
                                  </span>
                                </button>
                              </div>
                              {/* Task Title */}
                              <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2 cursor-default select-none">{task.title}</h3>
                              {/* Due Date and Status */}
                              <div className="flex items-center justify-between mb-3 cursor-default select-none">
                    <div className="flex items-center gap-1 cursor-default select-none">
                                  <LuCalendarFold className="text-gray-400 text-sm" />
                                  <span className="text-xs text-gray-500 cursor-default select-none">{formatDatePretty(task.due)}</span>
                    </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTaskStatusBadgeStyle(task.status)} cursor-default select-none`}>
                                  {getTaskStatusLabel(task.status)}
                                </span>
                              </div>
                              {/* Progress Section */}
                              <div className="space-y-2 mb-3 cursor-default select-none">
                                <div className="h-2 bg-gray-300 dark:bg-gray-900 rounded-full overflow-hidden cursor-default select-none">
                                  <div
                                    className="h-full bg-primary rounded-full cursor-default select-none"
                                    style={{
                                      width: `${(() => {
                                        const taskSubtasks = task.subtasks || [];
                                        const completed = taskSubtasks.filter(st => st.completed).length;
                                        return taskSubtasks.length === 0 ? 0 : (completed / taskSubtasks.length) * 100;
                                      })()}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              {/* Assignee and Progress */}
                              <div className="flex items-center justify-between cursor-default select-none">
                                <span className="text-xs text-gray-900 dark:text-white cursor-default select-none">{task.assignee}</span>
                                <span className="text-xs text-gray-900 dark:text-white cursor-default select-none">{(() => {
                                  const taskSubtasks = task.subtasks || [];
                                  const completed = taskSubtasks.filter(st => st.completed).length;
                                  return `${completed} of ${taskSubtasks.length}`;
                                })()}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500 text-sm cursor-default select-none">
                            <span className="text-sm text-gray-500 cursor-default select-none">No tasks for this contract. Click "New Task" to add one.</span>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm cursor-default select-none">
                          <span className="text-xs text-gray-500 cursor-default select-none">Select a contract to view its tasks.</span>
                        </div>
                      )}
                    </div>
                                      </div>
                  </div>
                </div>

              {/* Comments Box - Full Width */}
              <div className="mt-6 cursor-default select-none">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-default select-none">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Comments</h3>
                  {/* Comment History */}
                  <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                    {(selectedContract ? (contractComments[selectedContract.id] || []) : []).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 cursor-default select-none">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${comment.avatarColor} cursor-default select-none`}>
                          <BsPerson className={`${comment.textColor} text-lg`} />
                        </span>
                        <div className="flex-1 cursor-default select-none">
                          <div className="flex items-center gap-2 mb-1 cursor-default select-none">
                            <span className="text-xs font-semibold text-gray-900 cursor-default select-none">{comment.author}</span>
                            <span className="text-xs text-gray-500 cursor-default select-none">{comment.timestamp}</span>
                          </div>
                          <div 
                            className="text-xs text-gray-900 font-medium mb-2 select-none cursor-default"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                          />
                          <div className="flex items-center gap-3 cursor-default select-none">
                            <button
                              onClick={() => handleEditContractComment(comment.id)}
                              className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteContractComment(comment.id)}
                              className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Section */}
                  <div className="mt-4 pt-4 border-t border-gray-200 cursor-default select-none">
                    <div className="flex items-start gap-3 cursor-default select-none">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 cursor-default select-none">
                        <BsPerson className="text-primary text-lg" />
                      </span>
                      <div className="flex-1 cursor-default select-none">
                        {/* Toolbar */}
                        {commentEditor && (
                          <>
                            <div className="flex gap-2 mb-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 items-center cursor-default select-none">
                              <button onClick={() => commentEditor.chain().focus().toggleBold().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Bold"><b>B</b></button>
                              <button onClick={() => commentEditor.chain().focus().toggleItalic().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Italic"><i>I</i></button>
                              <button onClick={() => commentEditor.chain().focus().toggleUnderline().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Underline"><u>U</u></button>
                                                              <button onClick={() => commentEditor.chain().focus().toggleStrike().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('strike') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Strikethrough"> S</button>
                              <button onClick={() => commentEditor.chain().focus().toggleBulletList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Bullet List">• List</button>
                              <button onClick={() => commentEditor.chain().focus().toggleOrderedList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Numbered List">1. List</button>
                              <button onClick={handlePostContractComment} className="ml-auto -mr-4 text-xs px-2 py-1 rounded transition-colors flex items-center group relative cursor-pointer" title="Send">
                                <BiCommentAdd className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-primary transition-colors" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 cursor-default select-none">
                                  Send
                                </span>
                              </button>
                              {editingContractCommentId && (
                                <button 
                                  onClick={() => {
                                    setEditingContractCommentId(null);
                                    commentEditor.commands.clearContent();
                                  }} 
                                  className="text-xs px-2 py-1 rounded text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus-within:border-primary transition-colors cursor-default select-none">
                              <EditorContent
                                editor={commentEditor}
                                className="tiptap min-h-[48px] px-4 py-2 text-xs font-medium text-black dark:text-white font-sans outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostContractComment();
                                  }
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 z-30 px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 cursor-default select-none">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <HiOutlineClipboardList className="w-5 h-5 text-primary dark:text-white" />
                Download Summary
              </button>
              <button
                className="flex items-center justify-center px-5 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors cursor-pointer"
                onClick={() => setSelectedContract(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    {showUploadModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 upload-modal cursor-default select-none">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
          <div className="flex justify-between items-center mb-4 cursor-default select-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Upload Documents</h2>
              <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              onClick={() => { 
                setShowUploadModal(false); 
                setUploadModalFiles([]); 
                setUploadModalDocumentName('');
                setUploadModalAssignee('');
                setSelectedUploadSource(null);
                setUploadContractId(null);
                setUploadModalErrors({
                  fileSource: false,
                  documentName: false,
                  assignee: false,
                  files: false
                });
              }}
              >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          <div className="mb-4 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
            {uploadContractId && (
              <span>
                For Contract: <span className="font-semibold text-primary cursor-default select-none">#{uploadContractId}</span>
              </span>
            )}
          </div>
          <form
            className="p-0 cursor-default select-none"
            onSubmit={handleUploadModalSubmit}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name</label>
                <input
                  type="text"
                  placeholder="Enter document name..."
                  value={uploadModalDocumentName}
                  onChange={(e) => setUploadModalDocumentName(e.target.value)}
                  className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                />
                {uploadModalErrors.documentName && (
                  <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Document name is required</p>
                )}
                
                {/* Assignee - Moved to left column */}
                <div className="mt-6">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</label>
                  <div className="relative" ref={uploadModalAssigneeDropdownRef}>
                    <input
                      ref={uploadModalAssigneeInputRef}
                      type="text"
                      className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                      placeholder="Choose an assignee..."
                      value={uploadModalAssignee}
                      onChange={(e) => setUploadModalAssignee(e.target.value)}
                      onFocus={() => setShowUploadModalAssigneeDropdown(true)}
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                      autoComplete="off"
                    />
                    <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showUploadModalAssigneeDropdown && (
                      <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        {allAssignees.length > 0 ? (
                          <>
                            {allAssignees.map((assignee: string) => (
                              <div
                                key={assignee}
                                className={`px-4 py-2 text-xs cursor-pointer ${uploadModalAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                onClick={() => {
                                  setUploadModalAssignee(assignee);
                                  setShowUploadModalAssigneeDropdown(false);
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
                                setShowUploadModalAssigneeDropdown(false);
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
                                setShowUploadModalAssigneeDropdown(false);
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
                  {uploadModalErrors.assignee && (
                    <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Assignee selection is required</p>
                  )}
                </div>
              </div>
              <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Type</label>
                  <input
                    type="text"
                    placeholder="Enter document type..."
                    value={uploadModalDocumentType}
                    onChange={(e) => setUploadModalDocumentType(e.target.value)}
                    className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  />
              </div>
            </div>
            <div>
              <div className="relative" ref={clickToUploadDropdownRef}>
              <div 
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 py-8 px-4 text-center transition hover:border-primary cursor-pointer select-none"
                onClick={() => {
                  setShowClickToUploadDropdown(!showClickToUploadDropdown);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const files = Array.from(e.dataTransfer.files);
                  console.log('Files dropped:', files);
                  
                  if (files.length > 0) {
                    // Log file details for debugging
                    files.forEach((file, index) => {
                      console.log(`File ${index}:`, {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        sizeMB: (file.size / 1024 / 1024).toFixed(2)
                      });
                    });
                    
                    // More permissive file validation
                    const validFiles = files.filter(file => {
                      const isValidType = file.type.startsWith('application/') || 
                                        file.type.startsWith('image/') ||
                                        file.name.toLowerCase().endsWith('.pdf') ||
                                        file.name.toLowerCase().endsWith('.doc') ||
                                        file.name.toLowerCase().endsWith('.docx') ||
                                        file.name.toLowerCase().endsWith('.jpg') ||
                                        file.name.toLowerCase().endsWith('.jpeg');
                      const isValidSize = file.size <= 10 * 1024 * 1024;
                      
                      console.log(`File ${file.name} validation:`, { isValidType, isValidSize });
                      
                      return isValidType && isValidSize;
                    });
                    
                    console.log('Valid files:', validFiles.length);
                    
                    if (validFiles.length > 0) {
                      // Set file source to Desktop
                      setSelectedUploadSource('Desktop');
                      
                      // Add valid files to upload modal files
                      setUploadModalFiles(prev => [...prev, ...validFiles]);
                      
                      // Pre-populate document name with first file name (without extension) only if field is empty
                      if (!uploadModalDocumentName.trim()) {
                        const fileName = validFiles[0].name;
                        const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                        setUploadModalDocumentName(nameWithoutExtension);
                      }
                      
                      console.log('Drag and drop success:');
                      console.log('Files added:', validFiles.length);
                      console.log('Document name:', uploadModalDocumentName.trim() || 'will be set from file');
                      console.log('File source set: Desktop');
                    } else {
                      console.log('No valid files found');
                    }
                  }
                }}
              >
                                  <TbDragDrop className="h-5 w-5 text-gray-400 mb-2 select-none" />
                <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold select-none">Click to upload or drag and drop</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 select-none">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
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
              
              {/* Click to Upload Dropdown */}
              {showClickToUploadDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 cursor-default select-none">
                  <div className="py-2">
                    <label htmlFor="upload-modal-file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                      <div className="flex items-center gap-2">
                        <TbDeviceDesktopPlus className="text-base text-primary" />
                        <span className="text-xs cursor-default select-none">Desktop</span>
                      </div>
                    </label>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Box'); setShowClickToUploadDropdown(false); }}>
                      <SiBox className="text-base text-primary" />
                      <span className="text-xs cursor-default select-none">Box</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Dropbox'); setShowClickToUploadDropdown(false); }}>
                      <SlSocialDropbox className="text-base text-primary" />
                      <span className="text-xs cursor-default select-none">Dropbox</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Google Drive'); setShowClickToUploadDropdown(false); }}>
                      <TbBrandGoogleDrive className="text-base text-primary" />
                      <span className="text-xs cursor-default select-none">Google Drive</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('OneDrive'); setShowClickToUploadDropdown(false); }}>
                      <TbBrandOnedrive className="text-base text-primary" />
                      <span className="text-xs cursor-default select-none">OneDrive</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Show added documents */}
            {uploadModalAddedDocuments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Added Documents</h4>
                <div className="flex flex-col gap-2">
                  {uploadModalAddedDocuments.map((doc, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
                      {editingUploadModalDocumentIndex === idx ? (
                        // Inline editing mode
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                placeholder="Enter document name..."
                                className="w-full h-[34px] px-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                                value={inlineEditingUploadModalDocumentName}
                                onChange={(e) => setInlineEditingUploadModalDocumentName(e.target.value)}
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Type</label>
                              <input
                                type="text"
                                placeholder="Enter document type..."
                                className="w-full h-[34px] px-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                                value={inlineEditingUploadModalDocumentType}
                                onChange={(e) => setInlineEditingUploadModalDocumentType(e.target.value)}
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee <span className="text-red-500">*</span></label>
                            <div className="relative" ref={inlineEditingUploadModalAssigneeDropdownRef}>
                              <input
                                type="text"
                                className="w-full h-[34px] px-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                                placeholder="Choose an assignee..."
                                value={inlineEditingUploadModalDocumentAssignee}
                                onChange={(e) => setInlineEditingUploadModalDocumentAssignee(e.target.value)}
                                onFocus={() => setShowInlineEditingUploadModalAssigneeDropdown(true)}
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                autoComplete="off"
                              />
                              <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              
                              {showInlineEditingUploadModalAssigneeDropdown && (
                                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                  {allAssignees.length > 0 ? (
                                    <>
                                      {allAssignees.map((assignee: string) => (
                                        <div
                                          key={assignee}
                                          className={`px-4 py-2 text-xs cursor-pointer ${inlineEditingUploadModalDocumentAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                          onClick={() => {
                                            setInlineEditingUploadModalDocumentAssignee(assignee);
                                            setShowInlineEditingUploadModalAssigneeDropdown(false);
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
                                          setShowInlineEditingUploadModalAssigneeDropdown(false);
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
                                          setShowInlineEditingUploadModalAssigneeDropdown(false);
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
                                                     <div className="flex justify-end">
                             <button
                               type="button"
                               onClick={() => handleSaveInlineEditUploadModalDocument(idx)}
                               disabled={!inlineEditingUploadModalDocumentName.trim() || !inlineEditingUploadModalDocumentAssignee.trim()}
                               className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                               style={{ fontFamily: 'Avenir, sans-serif' }}
                             >
                               Save
                             </button>
                             <button
                               type="button"
                               onClick={handleCancelInlineEditUploadModalDocument}
                               className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-1"
                               style={{ fontFamily: 'Avenir, sans-serif' }}
                             >
                               Cancel
                             </button>
                           </div>
                        </div>
                      ) : (
                        // Display mode
                        <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-black dark:text-white truncate">
                          {doc.documentName}
                        </div>
                        <div className="text-xs text-gray-500 cursor-default select-none">
                          {doc.files.length} file(s) &bull; {doc.documentType} &bull; {doc.assignee}
                        </div>
                      </div>
                          <div className="flex items-center gap-1">
                            <button 
                              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1"
                              onClick={() => handleStartInlineEditUploadModalDocument(idx)}
                            >
                              <HiOutlinePencil className="h-4 w-4" />
                            </button>
                      <button 
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1"
                        onClick={() => handleRemoveUploadModalAddedDocument(idx)}
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {uploadModalErrors.files && (
              <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Please select one file</p>
            )}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => { 
                  setShowUploadModal(false); 
                  setUploadModalFiles([]); 
                  setUploadModalDocumentName('');
                  setUploadModalDocumentType('');
                  setUploadModalAssignee('');
                  setSelectedUploadSource(null);
                  setUploadContractId(null);
                  setUploadModalAddedDocuments([]);
                  setUploadModalErrors({
                    fileSource: false,
                    documentName: false,
                    assignee: false,
                    files: false
                  });
                }}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Close
              </button>
              <div className="flex">
                <button
                  type="button"
                  onClick={handleAddUploadModalDocument}
                  disabled={!uploadModalDocumentName.trim() || !uploadModalAssignee.trim() || uploadModalFiles.length === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Add Document
                </button>
                <button
                  type="submit"
                  disabled={uploadModalAddedDocuments.length === 0}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed ml-1"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Upload
                </button>
              </div>
            </div>
            </div>
          </form>
        </div>
      </div>
    )}

    {showPdfViewer && selectedPdf && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col cursor-default select-none">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 cursor-default select-none">
            <div className="flex justify-between items-center cursor-default select-none">
              <div className="flex flex-col gap-2 items-start cursor-default select-none">
                <span className="inline-block max-w-max text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 cursor-default select-none">
                  # {selectedPdf.id || '1234'}
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

    {/* Document Details Modal */}
    {showDocumentModal && selectedDocument && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden cursor-default select-none">
          {/* Sticky Header with Document ID and Close buttons */}
          <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4 cursor-default select-none">
            <div className="flex items-start justify-between cursor-default select-none">
              {/* Left: Document ID and Status */}
              <div className="flex-1 min-w-0 cursor-default select-none">
                <div className="flex items-center gap-4 mb-4 cursor-default select-none">
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary cursor-default select-none">
                    # {selectedDocument.id}
                  </span>
                </div>
              </div>
              {/* Right: Close Button */}
              <button
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1 cursor-pointer"
                onClick={() => setShowDocumentModal(false)}
                aria-label="Close"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0 cursor-default select-none">
            <div className="overflow-y-auto p-6 flex-1 bg-gray-50 dark:bg-gray-900 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
              {/* Document Details and File Information Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6 cursor-default select-none">
                {/* Document Details Box */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-default select-none">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Document Details</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 cursor-default select-none">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Document ID</div>
                      <div className="text-xs text-black dark:text-white cursor-default select-none">{selectedDocument.id}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Contract ID</div>
                      <div className="text-xs text-black dark:text-white cursor-default select-none">{selectedDocument.contractId}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Document Name</div>
                      <input
                        type="text"
                        value={selectedDocument.name}
                        onChange={(e) => {
                          const updatedDoc = { ...selectedDocument, name: e.target.value };
                          setSelectedDocument(updatedDoc);
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Document Type</div>
                      <input
                        type="text"
                        value={selectedDocument.documentType || ''}
                        onChange={(e) => {
                          const updatedDoc = { ...selectedDocument, documentType: e.target.value };
                          setSelectedDocument(updatedDoc);
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        placeholder="Enter document type..."
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Contract Name</div>
                      <div className="text-xs text-black dark:text-white mb-4 pt-2 cursor-default select-none">{selectedDocument.contractName}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Document Chain ID</div>
                      <div className="flex items-center cursor-default select-none">
                        <span
                          className="text-xs font-mono text-gray-900 dark:text-white truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-default select-none"
                          style={{ maxWidth: '120px' }}
                                                      title={getDocumentChainId(selectedDocument.id)}
                        >
                          {getDocumentChainId(selectedDocument.id)}
                        </span>
                        <div className="relative">
                          <button 
                            type="button"
                            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                            onClick={() => {
                                                                navigator.clipboard.writeText(getDocumentChainId(selectedDocument.id));
                              setCopiedContractId(selectedDocument.id);
                              setTimeout(() => setCopiedContractId(null), 1500);
                            }}
                            onMouseEnter={() => setHoveredContractId(selectedDocument.id)}
                            onMouseLeave={() => setHoveredContractId(null)}
                            aria-label="Copy document chain ID"
                          >
                            <HiOutlineDuplicate className="w-4 h-4" />
                          </button>
                          {copiedContractId === selectedDocument.id && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                              Copied!
                            </div>
                          )}
                          {hoveredContractId === selectedDocument.id && copiedContractId !== selectedDocument.id && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                              Copy
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Assignee</div>
                      <div className="relative w-full cursor-default select-none" ref={documentDetailsAssigneeDropdownRef}>
                        <input
                          ref={documentDetailsAssigneeInputRef}
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          placeholder={selectedDocument?.assignee || 'Select assignee...'}
                          value={selectedDocument?.assignee || ''}
                          onChange={(e) => {
                            if (selectedDocument) {
                              setSelectedDocument({ ...selectedDocument, assignee: e.target.value });
                            }
                          }}
                          onFocus={() => setShowAssigneeDropdown(true)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                          autoComplete="off"
                        />
                        {showAssigneeDropdown && (
                          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            {allAssignees.length > 0 ? (
                              allAssignees.map((assignee: string) => (
                                <div
                                  key={assignee}
                                  className={`px-4 py-2 text-xs cursor-pointer ${selectedDocument?.assignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                  onClick={() => {
                                    const updatedDoc = { ...selectedDocument, assignee };
                                    setSelectedDocument(updatedDoc);
                                    setShowAssigneeDropdown(false);
                                  }}
                                >
                                  {assignee}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500">No assignees found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Information Box */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-default select-none">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">File Information</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 cursor-default select-none">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Type</div>
                      <div className="text-xs text-black dark:text-white mb-4 cursor-default select-none">{selectedDocument.type}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Size</div>
                      <div className="text-xs text-black dark:text-white mb-4 cursor-default select-none">{selectedDocument.size}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Uploaded By</div>
                      <div className="text-xs text-black dark:text-white mb-4 cursor-default select-none">{selectedDocument.uploadedBy}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none">Date Uploaded</div>
                      <div className="text-xs text-black dark:text-white mb-4 cursor-default select-none">{selectedDocument.dateUploaded}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Preview Box - Full Width */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full cursor-default select-none">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Document Preview</h3>
                <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-default select-none">
                  <span className="text-gray-400 text-lg cursor-default select-none">PDF Viewer will be implemented here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* Document Upload Modal */}
    {showDocumentUploadModal && selectedFile && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[500px] mx-4 my-8 flex flex-col overflow-hidden cursor-default select-none">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4 cursor-default select-none">
            <div className="flex items-center justify-between cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Upload Document</h2>
              <button
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full cursor-pointer"
                onClick={handleCloseDocumentUploadModal}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto p-6 flex-1 bg-gray-50 dark:bg-gray-900 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
            <div className="space-y-6 cursor-default select-none">
              {/* File Info */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-default select-none">
                <div className="flex items-center gap-3 cursor-default select-none">
                  <HiOutlineDocumentText className="w-8 h-8 text-primary" />
                  <div className="flex-1 min-w-0 cursor-default select-none">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white truncate cursor-default select-none">{selectedFile.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Name Field */}
              <div className="cursor-default select-none">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-default select-none">Document Name</label>
                <input
                  type="text"
                  value={documentUploadName}
                  onChange={(e) => setDocumentUploadName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter document name"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                />
              </div>

              {/* Assignee Field */}
              <div className="cursor-default select-none">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-default select-none">Assignee</label>
                <div className="relative cursor-default select-none">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer"
                    placeholder="Select assignee"
                    value={documentUploadAssignee}
                    onChange={(e) => setDocumentUploadAssignee(e.target.value)}
                    onFocus={() => setShowDocumentUploadAssigneeDropdown(true)}
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    autoComplete="off"
                  />
                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  
                  {showDocumentUploadAssigneeDropdown && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-40 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                      <div className="py-2">
                        {allAssignees.map((assignee) => (
                          <button
                            key={assignee}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer select-none text-sm"
                            onClick={() => {
                              setDocumentUploadAssignee(assignee);
                              setShowDocumentUploadAssigneeDropdown(false);
                            }}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            {assignee}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 cursor-default select-none">
            <div className="flex justify-end gap-3 cursor-default select-none">
              <button
                type="button"
                onClick={handleCloseDocumentUploadModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDocumentUpload}
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Save Document
              </button>
            </div>
          </div>
        </div>
      </div>
    )}



      </div>
    <Toaster />
    </>
  );
}

export default ContractsPage;