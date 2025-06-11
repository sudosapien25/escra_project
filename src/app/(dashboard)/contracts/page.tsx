// RENDER-TEST-789
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaClock, FaSort, FaPlus, FaDollarSign, FaTimes, FaChevronDown, FaChevronUp, FaRegClock, FaCheck } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { HiOutlineDocumentText, HiOutlineDuplicate, HiOutlineDownload, HiOutlineTrash, HiOutlinePencilAlt, HiOutlineUpload, HiOutlineEye, HiOutlineClipboardList, HiOutlineExclamation, HiChevronDown, HiOutlineDocumentSearch } from 'react-icons/hi';
import { HiOutlineViewBoards } from 'react-icons/hi';
import { LuCalendarClock } from 'react-icons/lu';
import { BiDotsHorizontal } from 'react-icons/bi';
import { TbWorldDollar } from 'react-icons/tb';
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
import { MdOutlineEditCalendar, MdOutlineUpdate } from 'react-icons/md';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { HiMiniChevronUpDown, HiMiniChevronDown } from 'react-icons/hi2';
import { useTaskStore } from '@/data/taskStore';
import { X } from 'lucide-react';
import { useAssigneeStore } from '@/data/assigneeStore';
import { useAuth } from '@/context/AuthContext';
import { PiMoneyWavyBold, PiBankBold } from 'react-icons/pi';
import { TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive } from 'react-icons/tb';
import { SiBox } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { FaCheckCircle } from 'react-icons/fa';
import { RiUserSearchLine } from 'react-icons/ri';

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
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  uploadedBy?: string;
  dateUploaded?: string;
  contractTitle?: string;
  contractId?: string;
  assignee?: string;
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

const ContractsPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserName = user?.name || '';

  const [activeTab, setActiveTab] = useState('allContracts');
  const [activeContentTab, setActiveContentTab] = useState('contractList');
  const [activeRole, setActiveRole] = useState('creator');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['All']);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [openContractDropdown, setOpenContractDropdown] = useState(false);
  const [contractSearch, setContractSearch] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [openAssigneeDropdown, setOpenAssigneeDropdown] = useState(false);
  const assigneeButtonRef = useRef<HTMLButtonElement>(null);
  const contractButtonRef = useRef<HTMLButtonElement>(null);
  const [showNewContractForm, setShowNewContractForm] = useState(false);
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
    titleCompany: '',
    insuranceCompany: '',
    inspectionPeriod: '',
    contingencies: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);

  const [emailErrors, setEmailErrors] = useState({
    buyerEmail: false,
    sellerEmail: false,
    agentEmail: false,
  });

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const isValid = form.checkValidity();
    
    if (!isValid) {
      const newErrors: Record<string, boolean> = {};
      Array.from(form.elements).forEach((element) => {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
          if (element.required && !element.value) {
            newErrors[element.name] = true;
          }
        }
      });
      setFormErrors(newErrors);
      return;
    }

    if (modalStep === 1) {
      setModalStep(2);
    } else if (modalStep === 2) {
      setModalStep(3);
    } else {
      setShowNewContractForm(false);
      setModalStep(1);
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

  // Filter contracts based on search term and selected statuses
  const filteredContracts = mockContracts.filter(contract => {
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

  // Filter documents based on search term
  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.contractTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getTaskStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do': return 'bg-gray-100 text-gray-800 border border-gray-400';
      case 'in progress': return 'bg-blue-100 text-blue-800 border border-blue-500';
      case 'in review': return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'done': return 'bg-green-100 text-green-800 border border-green-500';
      case 'blocked': return 'bg-red-100 text-red-800 border border-red-500';
      case 'on hold': return 'bg-orange-100 text-orange-800 border border-orange-400';
      case 'canceled': return 'bg-gray-100 text-gray-800 border border-gray-400';
      default: return 'bg-gray-100 text-gray-800 border border-gray-400';
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
  const [showUploadModalAssigneeDropdown, setShowUploadModalAssigneeDropdown] = useState(false);
  const uploadModalAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const uploadModalAssigneeInputRef = useRef<HTMLInputElement>(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);

  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ name: string; url: string; id?: string } | null>(null);

  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);

  // Add state for editing value at the top with other edit states
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editableValue, setEditableValue] = useState('');

  // Ref for status dropdown
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const [showContractTypeDropdown, setShowContractTypeDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showMilestoneDropdown, setShowMilestoneDropdown] = useState(false);
  const contractTypeDropdownRef = useRef<HTMLDivElement>(null);
  const propertyTypeDropdownRef = useRef<HTMLDivElement>(null);
  const milestoneDropdownRef = useRef<HTMLDivElement>(null);

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
      
      // If clicking inside the dropdown list, don't close
      if (dropdown?.querySelector('.dropdown-list')?.contains(target)) {
        return;
      }
      
      // If clicking the select button, don't handle here (let the button's onClick handle it)
      if (dropdown?.querySelector('button')?.contains(target)) {
        return;
      }
      
      // If clicking anywhere else, close the dropdown
      setShowUploadDropdown(false);
    }

    if (showUploadDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
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
      setEditableBuyer(selectedContract.buyer || '');
      setEditableSeller(selectedContract.seller || '');
      setEditableAgent(selectedContract.agent || '');
      setEditableValue(selectedContract.value || '');
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

  // Calculate total contract value
  const calculateTotalValue = () => {
    return mockContracts.reduce((total, contract) => {
      // Remove '$' and ',' from value string and convert to number
      const value = parseFloat(contract.value?.replace(/[$,]/g, '') || '0');
      return total + value;
    }, 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
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
  const [statusSortDirection, setStatusSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [createdDateSortDirection, setCreatedDateSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [lastUpdatedSortDirection, setLastUpdatedSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [valueSortDirection, setValueSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Sorting handlers
  const handleIdSort = () => {
    setIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleContractSort = () => {
    setContractSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPartiesSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handlePartiesSort = () => {
    setPartiesSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleStatusSort = () => {
    setStatusSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setCreatedDateSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleCreatedDateSort = () => {
    setCreatedDateSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setStatusSortDirection(null);
    setLastUpdatedSortDirection(null);
    setValueSortDirection(null);
  };
  const handleLastUpdatedSort = () => {
    setLastUpdatedSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setStatusSortDirection(null);
    setCreatedDateSortDirection(null);
    setValueSortDirection(null);
  };
  const handleValueSort = () => {
    setValueSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
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

  // Sort filteredContracts by id, contract title, parties, status, created date, last updated, or value
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
      const aTitle = (a.contractTitle || '').toLowerCase();
      const bTitle = (b.contractTitle || '').toLowerCase();
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
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.status-filter-dropdown');
      const button = statusDropdownRef.current;

      // Only close if clicking outside both the dropdown and button
      if (showStatusDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setShowStatusDropdown(false);
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
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.contract-dropdown');
      const button = contractButtonRef.current;

      // Only close if clicking outside both the dropdown and button
      if (openContractDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setOpenContractDropdown(false);
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
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.assignee-dropdown');
      const button = assigneeButtonRef.current;

      // Only close if clicking outside both the dropdown and button
      if (openAssigneeDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setOpenAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openAssigneeDropdown]);

  return (
    <>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
          <div className="pb-1">
            <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-0">Contracts</h1>
            <p className="text-gray-500 text-[15px] md:text-[16px] mt-0">
              Manage & monitor all your contracts
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
                      className={`flex items-center gap-2 rounded-xl font-semibold border transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap
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
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-xs font-medium text-gray-500 mb-1">Contract Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={modalForm.title}
                      onChange={handleModalChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs ${
                        formErrors.title ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter contract title"
                      required
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-xs text-red-600 font-medium">Please fill out this field</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="escrowNumber" className="block text-xs font-medium text-gray-500 mb-1">Escrow Number</label>
                    <input
                      type="text"
                      id="escrowNumber"
                      name="escrowNumber"
                      value={modalForm.escrowNumber}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter escrow number"
                    />
                  </div>
                  <div>
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
                        onClick={() => setShowContractTypeDropdown(true)}
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
                      <p className="mt-1 text-xs text-red-600 font-medium">Please select a contract type</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-xs font-medium text-gray-500 mb-1">Property Type</label>
                    <div className="relative w-full" ref={propertyTypeDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white"
                        placeholder="Select property type"
                        value={PROPERTY_TYPES.find(t => t === modalForm.propertyType) || ''}
                        readOnly
                        onClick={() => setShowPropertyTypeDropdown(true)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showPropertyTypeDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {PROPERTY_TYPES.map(type => (
                            <button
                              key={type}
                              className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.propertyType === type ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
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
                    <label htmlFor="milestone" className="block text-xs font-medium text-gray-500 mb-1">Milestone Template</label>
                    <div className="relative w-full" ref={milestoneDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white"
                        placeholder="Select milestone template"
                        value={MILESTONE_TEMPLATES.find(t => t === modalForm.milestone) || ''}
                        readOnly
                        onClick={() => setShowMilestoneDropdown(true)}
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
                    <label htmlFor="value" className="block text-xs font-medium text-gray-500 mb-1">Contract Value</label>
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
                    <label htmlFor="dueDate" className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={modalForm.dueDate}
                      onChange={handleModalChange}
                      className={`w-full px-4 py-2 pr-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-black bg-white ${
                        formErrors.dueDate ? 'border-red-300' : 'border-gray-200'
                      }`}
                      required
                    />
                    {formErrors.dueDate && (
                      <p className="mt-1 text-xs text-red-600 font-medium">Please select a due date</p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="propertyAddress" className="block text-xs font-medium text-gray-500 mb-1">Property Address</label>
                  <input
                    type="text"
                    id="propertyAddress"
                    name="propertyAddress"
                    value={modalForm.propertyAddress}
                    onChange={handleModalChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                    placeholder="Enter property address"
                  />
                </div>
                <div className="mt-6">
                  <label htmlFor="notes" className="block text-xs font-medium text-gray-500 mb-1">Notes (Optional)</label>
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
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="buyer" className="block text-xs font-medium text-gray-500 mb-1">Buyer / Client</label>
                    <input
                      type="text"
                      id="buyer"
                      name="buyer"
                      value={modalForm.buyer}
                      onChange={handleModalChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs ${
                        formErrors.buyer ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter buyer or client name"
                      required
                    />
                    {formErrors.buyer && (
                      <p className="mt-1 text-xs text-red-600 font-medium">Please fill out this field</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="buyerEmail" className="block text-xs font-medium text-gray-500 mb-1">Buyer Email</label>
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
                    <label htmlFor="seller" className="block text-xs font-medium text-gray-500 mb-1">Seller / Provider</label>
                    <input
                      type="text"
                      id="seller"
                      name="seller"
                      value={modalForm.seller}
                      onChange={handleModalChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs ${
                        formErrors.seller ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter seller or provider name"
                      required
                    />
                    {formErrors.seller && (
                      <p className="mt-1 text-xs text-red-600 font-medium">Please fill out this field</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="sellerEmail" className="block text-xs font-medium text-gray-500 mb-1">Seller Email</label>
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
                    <label htmlFor="agent" className="block text-xs font-medium text-gray-500 mb-1">Agent / Escrow Officer (Optional)</label>
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
                    <label htmlFor="agentEmail" className="block text-xs font-medium text-gray-500 mb-1">Agent Email (Optional)</label>
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
                    <label htmlFor="lenderName" className="block text-xs font-medium text-gray-500 mb-1">Lender Name</label>
                    <input
                      type="text"
                      id="lenderName"
                      name="lenderName"
                      value={modalForm.lenderName}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter lender name"
                    />
                  </div>
                  <div>
                    <label htmlFor="titleCompany" className="block text-xs font-medium text-gray-500 mb-1">Title Company</label>
                    <input
                      type="text"
                      id="titleCompany"
                      name="titleCompany"
                      value={modalForm.titleCompany}
                      onChange={handleModalChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs ${
                        formErrors.titleCompany ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter title company name"
                      required
                    />
                    {formErrors.titleCompany && (
                      <p className="mt-1 text-xs text-red-600 font-medium">Please fill out this field</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="insuranceCompany" className="block text-xs font-medium text-gray-500 mb-1">Insurance Company</label>
                    <input
                      type="text"
                      id="insuranceCompany"
                      name="insuranceCompany"
                      value={modalForm.insuranceCompany}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter insurance company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="closingDate" className="block text-xs font-medium text-gray-500 mb-1">Expected Closing Date</label>
                    <input
                      type="date"
                      id="closingDate"
                      name="closingDate"
                      value={modalForm.closingDate}
                      onChange={handleModalChange}
                      className={`w-full px-4 py-2 pr-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-black bg-white ${
                        formErrors.closingDate ? 'border-red-300' : 'border-gray-200'
                      }`}
                      required
                    />
                    {formErrors.closingDate && (
                      <p className="mt-1 text-xs text-red-600 font-medium">Please select a closing date</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="earnestMoney" className="block text-xs font-medium text-gray-500 mb-1">Earnest Money</label>
                    <input
                      type="text"
                      id="earnestMoney"
                      name="earnestMoney"
                      value={modalForm.earnestMoney}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter earnest money amount"
                    />
                  </div>
                  <div>
                    <label htmlFor="downPayment" className="block text-xs font-medium text-gray-500 mb-1">Down Payment</label>
                    <input
                      type="text"
                      id="downPayment"
                      name="downPayment"
                      value={modalForm.downPayment}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter down payment amount"
                    />
                  </div>
                  <div>
                    <label htmlFor="loanAmount" className="block text-xs font-medium text-gray-500 mb-1">Loan Amount</label>
                    <input
                      type="text"
                      id="loanAmount"
                      name="loanAmount"
                      value={modalForm.loanAmount}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter loan amount"
                    />
                  </div>
                  <div>
                    <label htmlFor="interestRate" className="block text-xs font-medium text-gray-500 mb-1">Interest Rate (%)</label>
                    <input
                      type="text"
                      id="interestRate"
                      name="interestRate"
                      value={modalForm.interestRate}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter interest rate"
                    />
                  </div>
                  <div>
                    <label htmlFor="loanTerm" className="block text-xs font-medium text-gray-500 mb-1">Loan Term (Years)</label>
                    <input
                      type="text"
                      id="loanTerm"
                      name="loanTerm"
                      value={modalForm.loanTerm}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter loan term"
                    />
                  </div>
                  <div>
                    <label htmlFor="inspectionPeriod" className="block text-xs font-medium text-gray-500 mb-1">Inspection Period (Days)</label>
                    <input
                      type="text"
                      id="inspectionPeriod"
                      name="inspectionPeriod"
                      value={modalForm.inspectionPeriod}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                      placeholder="Enter inspection period"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="contingencies" className="block text-xs font-medium text-gray-500 mb-1">Contingencies</label>
                  <textarea
                    id="contingencies"
                    name="contingencies"
                    value={modalForm.contingencies}
                    onChange={handleModalChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[80px]"
                    placeholder="Enter any contingencies for this contract"
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setModalStep(1)} className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold hover:bg-gray-50 transition-colors text-base">Previous</button>
                  <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base">Next</button>
                </div>
              </form>
            )}

            {modalStep === 3 && (
              <form onSubmit={handleSubmit} noValidate>
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
              <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center border-2 border-teal-200">
                <HiOutlineDocumentText size={18} color="#06b6d4" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{mockContracts.length}</p>
                <p className="text-xs invisible">placeholder</p>
              </div>
            </div>
            {/* Pending Signatures */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                <HiOutlinePencilAlt size={18} color="#7c3aed" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending Signatures</p>
                <p className="text-2xl font-bold text-gray-900">{mockContracts.filter(contract => contract.status === 'Signatures').length}</p>
                <p className="text-xs text-gray-400">Requires action</p>
              </div>
            </div>
            {/* Awaiting Wire Instructions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center border-2 border-yellow-200">
                <PiBankBold size={19} color="#f59e42" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Awaiting Wire Details</p>
                <p className="text-2xl font-bold text-gray-900">{mockContracts.filter(contract => contract.status === 'Wire Details').length}</p>
                <p className="text-xs text-gray-400">Needs attention</p>
              </div>
            </div>
            {/* Avg. Completion Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border-2 border-blue-200">
                <FaRegClock size={18} color="#3b82f6" />
              </div>
              <div className="flex flex-col items-start h-full">
                <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Avg. Completion Time</p>
                <p className="text-2xl font-bold text-gray-900">9.2 days</p>
                <p className="text-xs text-green-600 font-semibold">↓ 1.3 days faster</p>
              </div>
            </div>

          </div>
          {/* Total Contract Value Box */}
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full">
            <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center border-2 border-teal-200">
              <TbWorldDollar size={18} color="#06b6d4" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 mb-1 font-sans" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Contract Value</p>
              <p className="text-2xl font-bold text-primary">{calculateTotalValue()}</p>
              <p className="text-xs text-green-600 font-semibold">↑ 12% from last month</p>
            </div>
          </div>
        </>
      )}

      <hr className="mb-6 border-gray-300" />

      {/* Search/Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0">
          <FaSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search contracts, parties, documents or IDs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          />
        </div>
        {activeContentTab === 'contractList' && (
          <div className="relative ml-1">
            <button
              ref={statusDropdownRef as any}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
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
              <HiOutlineViewBoards className="text-gray-400 w-4 h-4" />
              <span>Status</span>
              <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
            </button>
            {showStatusDropdown && (
              <div 
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 status-filter-dropdown" 
                style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
              >
                <button
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
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
          </div>
        )}
        {activeContentTab === 'documents' && (
          <>
            <div className="relative ml-1">
              <button
                ref={contractButtonRef}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={() => { setOpenContractDropdown(v => !v); setOpenAssigneeDropdown(false); setShowStatusDropdown(false); }}
              >
                <HiOutlineDocumentSearch className="text-gray-400 w-4 h-4" />
                <span>Contract</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
              {openContractDropdown && (
                <div 
                  className="absolute left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 min-w-[400px] w-96 contract-dropdown" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => e.stopPropagation()}
                >
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
            <div className="relative ml-1">
              <button
                ref={assigneeButtonRef}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={() => { setOpenAssigneeDropdown(v => !v); setOpenContractDropdown(false); setShowStatusDropdown(false); }}
              >
                <RiUserSearchLine className="text-gray-400 w-4 h-4" />
                <span>Assignee</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
              {openAssigneeDropdown && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 assignee-dropdown" 
                  style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
                >
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
                      className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
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
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[150px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={() => setLastUpdatedSort(prev => prev === 'desc' ? 'asc' : 'desc')}
        >
          <MdOutlineUpdate className="text-gray-400 w-4 h-4" />
          <span>Recently Updated</span>
          <HiMiniChevronUpDown className="ml-1 inline-block align-middle text-gray-400 transition-transform duration-200" style={{ transform: lastUpdatedSort === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)' }} size={16} />
        </button>
      </div>

      {/* Table Section with Tabs in Outlined Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* Tabs Row with Divider */}
        <div className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 w-full">
            {/* Contracts/Documents Tabs */}
            <div className="flex space-x-4 overflow-x-auto w-full md:w-auto">
              {CONTENT_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                    activeContentTab === tab.key
                      ? 'text-primary border-primary'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                  onClick={() => setActiveContentTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Created by Me/Assigned to Me Tabs (styled like main tabs) */}
            <div className="flex flex-col items-end w-full md:w-auto">
              <div className="flex space-x-8 overflow-x-auto w-full md:w-auto">
                {TABS.filter(tab => tab.key !== 'allContracts').map(tab => (
                  <button
                    key={tab.key}
                    className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                      activeTab === tab.key
                        ? 'text-primary border-primary'
                        : 'text-gray-500 hover:text-gray-700 border-transparent'
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
          <div style={{ height: 'calc(10 * 3.5rem)', minHeight: '350px' }} className="relative overflow-x-auto overflow-y-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleIdSort}
                  >
                    ID
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleContractSort}
                  >
                    Contract
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handlePartiesSort}
                  >
                    Parties
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleStatusSort}
                  >
                    Status
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleCreatedDateSort}
                  >
                    Created Date
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleLastUpdatedSort}
                  >
                    Last Updated
                  </th>
                  <th
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleValueSort}
                  >
                    Value
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-primary underline font-semibold cursor-pointer" onClick={e => { e.stopPropagation(); setSelectedContract(contract); }}>{contract.id}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                      <div className="text-xs font-bold text-gray-900">{contract.title}</div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs">
                      <div className="text-gray-900">{contract.parties}</div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getStatusBadgeStyle(contract.status)}`}
                        style={{ minWidth: '7rem', display: 'inline-flex', borderWidth: '1px' }}>{contract.status}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-500">2024-05-01</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-gray-500">{contract.updated}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs text-primary">{contract.value}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs font-medium">
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
        {/* Documents tab/table */}
        {activeContentTab === 'documents' && (
          <div style={{ height: 'calc(10 * 3.5rem)', minHeight: '350px' }} className="relative overflow-x-auto overflow-y-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocIdSort}
                  >
                    ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocNameSort}
                  >
                    Document
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocAssigneeSort}
                  >
                    Assignee
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocUploadedBySort}
                  >
                    Uploaded By
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocDateUploadedSort}
                  >
                    Upload Date
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocContractIdSort}
                  >
                    Contract ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleDocContractSort}
                  >
                    Contract
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDocuments.map((doc) => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedDocument(doc);
                      setShowDocumentModal(true);
                    }}
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs text-gray-900 text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">{doc.id}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                      <div className="font-bold text-xs text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{doc.type}</span>
                        <span>&bull;</span>
                        <span>{doc.size}</span>
                    </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs text-gray-500">{doc.assignee}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs">{doc.uploadedBy}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs text-gray-500 text-center">{doc.dateUploaded}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <a href={`#${doc.contractId}`} className="text-primary underline font-semibold cursor-pointer">{doc.contractId}</a>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-xs font-bold text-gray-900">{doc.contractTitle}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                          title="View" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPdf({ name: doc.name, url: `/documents/${doc.name}`, id: doc.id });
                            setShowPdfViewer(true);
                          }}
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocument(doc);
                            setShowDocumentModal(true);
                          }}
                        >
                          <HiOutlinePencilAlt className="h-4 w-4" />
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
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                    # {selectedContract.id}
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
              <div className="flex flex-col items-center w-full max-w-full">
                {/* Progress Bar */}
                <div className="relative w-full max-w-[1100px] h-2 mb-6 bg-gray-200 rounded-full">
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
                      <div className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    );
                  })()}
                </div>
                {/* Steps */}
                <div className="flex items-center justify-center gap-x-0 w-full max-w-[1100px]">
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
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center" style={{ minWidth: 80, flex: 1 }}>
                          <div className="relative flex items-center justify-center" style={{ width: 48 }}>
                            <div className={`flex items-center justify-center rounded-full border-2 transition-all duration-300 w-8 h-8 text-sm font-bold
                              ${isCompleted ? 'bg-primary border-primary text-white' : isCurrent ? 'bg-white border-primary text-primary' : 'bg-white border-gray-300 text-gray-400'}`}
                            >
                              {isCompleted ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                step.number
                              )}
                            </div>
                            {/* Connector line */}
                            {idx < steps.length - 1 && (
                              <div className="absolute top-1/2 left-full ml-0 h-1 -translate-y-1/2 z-0" style={{ width: connectorWidth, background: '#9ca3af' }} />
                            )}
                          </div>
                          <div className={`mt-2 text-xs font-medium text-center ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
          {/* Modal Content (scrollable) and Sticky Footer as siblings */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="overflow-y-auto p-6 flex-1">
              {/* Modal Content Grid: 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full min-h-0 -mt-2">
                {/* LEFT COLUMN: Contract Details, Parties Involved, Wire Details */}
                <div className="flex flex-col gap-6 w-full h-full min-h-0">
                  {/* Contract Details Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Contract Details</h3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                      {/* Row 1: Contract ID and Hash */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                        <div className="text-xs text-black">{selectedContract.id}</div>
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
                            {copiedContractId === selectedContract.id && (
                              <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                Copied!
                              </div>
                            )}
                            {hoveredContractId === selectedContract.id && copiedContractId !== selectedContract.id && (
                              <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                Copy
                              </div>
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
                        <div className="w-full px-4 py-2 text-xs text-black -ml-4">
                          {selectedType}
                        </div>
                      </div>
                      {/* Status Row */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Status</div>
                        <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle(selectedContract.status)}`}>{selectedContract.status}</span>
                      </div>
                      <div></div>
                      {/* Row 3: Current Milestone and Next Step */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Current Milestone</div>
                        <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle('Wire Details')}`}>Wire Details</span>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Next Milestone</div>
                        <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle('In Review')}`}>Document Review</span>
                      </div>
                      {/* Row 4: Created Date and Last Updated */}
                      <div className="col-span-2 grid grid-cols-2 gap-x-12">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Created Date</div>
                          <div className="text-xs text-black">2024-05-01</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Last Updated</div>
                          <div className="text-xs text-black">2024-05-02</div>
                        </div>
                      </div>
                      {/* Row 5: Total Value */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Total Value</div>
                        {isEditingValue ? (
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                            value={editableValue}
                            autoFocus
                            onChange={e => setEditableValue(e.target.value)}
                            onBlur={() => {
                              if (selectedContract) {
                                selectedContract.value = editableValue;
                              }
                              setIsEditingValue(false);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                if (selectedContract) {
                                  selectedContract.value = editableValue;
                                }
                                setIsEditingValue(false);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 cursor-text hover:border-gray-300 transition-colors"
                            onClick={() => setIsEditingValue(true)}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') setIsEditingValue(true); }}
                          >
                            {editableValue || selectedContract?.value || ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
                </div>
                {/* RIGHT COLUMN: Documents, Signature Status, Tasks */}
                <div className="flex flex-col gap-6 w-full h-full min-h-0">
                  {/* Documents Box */}
                  <div ref={documentsBoxRef} className="bg-white border border-gray-200 rounded-lg p-6 w-full box-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Documents</h3>
                      <button 
                        onClick={() => { setShowUploadModal(true); setUploadContractId(selectedContract?.id || null); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <HiOutlineUpload className="text-base text-primary" /> Upload
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto mt-4" style={{ maxHeight: '352px' }}>
                      {filteredDocuments
                        .filter(doc => doc.contractId === selectedContract.id)
                        .map(doc => (
                        <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-semibold text-xs text-black cursor-pointer hover:underline">{doc.name}</div>
                              <div className="text-xs text-gray-500">{doc.dateUploaded} &bull; {doc.type} &bull; {doc.size}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View" onClick={() => { setSelectedPdf({ name: doc.name, url: `/documents/${doc.name}`, id: doc.id }); setShowPdfViewer(true); }}>
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
                        <div key={sig.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-100">
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
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Tasks</h3>
                      <button className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <span className="text-base font-bold text-primary">+</span> New Task
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '352px' }}>
                      {selectedContract ? (
                        getTasksByContract(selectedContract.id).length > 0 ? (
                          getTasksByContract(selectedContract.id).map(task => (
                            <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
                              {/* Task Number - Top Left */}
                              <div className="mb-3">
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                  Task #{task.taskNumber}
                                </span>
                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1">
                                  # {task.contractId}
                                </span>
                              </div>

                              {/* Open Task Button - Top Right */}
                              <button 
                                className="absolute top-3 right-3 border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                                title="Open Task"
                              >
                                <FaArrowUpRightFromSquare className="h-3 w-3" />
                              </button>

                              {/* Task Title */}
                              <h3 className="text-xs font-bold text-gray-900 mb-2">{task.title}</h3>

                              {/* Due Date and Status */}
                              <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                                  <LuCalendarClock className="text-gray-400 text-sm" />
                                  <span className="text-xs text-gray-500">{formatDatePretty(task.due)}</span>
                    </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTaskStatusBadgeStyle(task.status)}`}>
                                  {getTaskStatusLabel(task.status)}
                                </span>
                              </div>

                              {/* Progress Section */}
                              <div className="space-y-2 mb-3">
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full"
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
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-900">{task.assignee}</span>
                                <span className="text-xs text-gray-900">{(() => {
                                  const taskSubtasks = task.subtasks || [];
                                  const completed = taskSubtasks.filter(st => st.completed).length;
                                  return `${completed} of ${taskSubtasks.length}`;
                                })()}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            No tasks for this contract. Click "New Task" to add one.
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          Select a contract to view its tasks.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Box - Full Width */}
              <div className="mt-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Comments</h3>
                  
                  {/* Comment History */}
                  <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
                    {(selectedContract ? (contractComments[selectedContract.id] || []) : []).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${comment.avatarColor}`}>
                          <BsPerson className={`${comment.textColor} text-lg`} />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <div 
                            className="text-xs text-gray-900 font-medium mb-2"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                          />
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditContractComment(comment.id)}
                              className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteContractComment(comment.id)}
                              className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <BsPerson className="text-primary text-lg" />
                      </span>
                      <div className="flex-1">
                        {/* Toolbar */}
                        {commentEditor && (
                          <>
                            <div className="flex gap-2 mb-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 items-center">
                              <button onClick={() => commentEditor.chain().focus().toggleBold().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Bold"><b>B</b></button>
                              <button onClick={() => commentEditor.chain().focus().toggleItalic().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Italic"><i>I</i></button>
                              <button onClick={() => commentEditor.chain().focus().toggleUnderline().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Underline"><u>U</u></button>
                              <button onClick={() => commentEditor.chain().focus().toggleStrike().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('strike') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Strikethrough"><s>S</s></button>
                              <button onClick={() => commentEditor.chain().focus().toggleBulletList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Bullet List">• List</button>
                              <button onClick={() => commentEditor.chain().focus().toggleOrderedList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Numbered List">1. List</button>
                              <button onClick={handlePostContractComment} className="ml-auto text-xs px-2 py-1 rounded transition-colors flex items-center group" title={editingContractCommentId ? "Update Comment" : "Post Comment"}>
                                <LuSendHorizontal className="w-4 h-4 text-black group-hover:text-primary transition-colors" />
                              </button>
                              {editingContractCommentId && (
                                <button 
                                  onClick={() => {
                                    setEditingContractCommentId(null);
                                    commentEditor.commands.clearContent();
                                  }} 
                                  className="text-xs px-2 py-1 rounded text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                            <div className="border-2 border-gray-200 rounded-lg bg-white focus-within:border-primary transition-colors">
                              <EditorContent
                                editor={commentEditor}
                                className="tiptap min-h-[48px] px-4 py-2 text-xs font-medium text-black font-sans outline-none"
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
            <div className="bg-white z-30 px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
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
      </div>
    )}
    
    {showUploadModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 upload-modal">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
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
          <div className="mb-4 text-xs text-gray-500">
            {uploadContractId && (
              <span>
                For Contract: <span className="font-semibold text-primary">#{uploadContractId}</span>
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
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4">
                <div className="flex-1 w-0">
                  <div className="text-gray-500 text-xs mb-1">File Source</div>
                  <div className="relative" ref={uploadDropdownRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUploadDropdown(!showUploadDropdown);
                      }}
                      className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 bg-white text-gray-900 text-xs focus:ring-0 focus:ring-primary focus:border-primary transition-colors flex items-center justify-end relative"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      {selectedUploadSource ? (
                        <span className="flex items-center gap-2 absolute left-4">
                          {selectedUploadSource === 'Desktop' && <TbDeviceDesktopPlus className="text-base text-primary" />}
                          {selectedUploadSource === 'Box' && <SiBox className="text-base text-primary" />}
                          {selectedUploadSource === 'Dropbox' && <SlSocialDropbox className="text-base text-primary" />}
                          {selectedUploadSource === 'Google Drive' && <TbBrandGoogleDrive className="text-base text-primary" />}
                          {selectedUploadSource === 'OneDrive' && <TbBrandOnedrive className="text-base text-primary" />}
                          <span className="text-xs text-gray-900">{selectedUploadSource}</span>
                        </span>
                      ) : (
                        <span className="absolute left-4 text-xs text-gray-400">Choose a source...</span>
                      )}
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </button>
                    {showUploadDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                        <div className="py-1">
                          <label htmlFor="file-upload" className="block px-4 py-2 text-left hover:bg-primary/10 hover:text-primary cursor-pointer" onClick={() => { setSelectedUploadSource('Desktop'); setShowUploadDropdown(false); }}>
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
                          <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2" onClick={() => { setSelectedUploadSource('Box'); setShowUploadDropdown(false); }}>
                            <SiBox className="text-base text-primary" />
                            <span className="text-xs">Box</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2" onClick={() => { setSelectedUploadSource('Dropbox'); setShowUploadDropdown(false); }}>
                            <SlSocialDropbox className="text-base text-primary" />
                            <span className="text-xs">Dropbox</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2" onClick={() => { setSelectedUploadSource('Google Drive'); setShowUploadDropdown(false); }}>
                            <TbBrandGoogleDrive className="text-base text-primary" />
                            <span className="text-xs">Google Drive</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-primary/10 hover:text-primary flex items-center gap-2" onClick={() => { setSelectedUploadSource('OneDrive'); setShowUploadDropdown(false); }}>
                            <TbBrandOnedrive className="text-base text-primary" />
                            <span className="text-xs">OneDrive</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 w-0" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 w-0">
                  <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name</label>
                  <input
                    type="text"
                    placeholder="Enter document name..."
                    className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  />
                </div>
                <div className="flex-1 w-0">
                  <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</label>
                  <div className="relative" ref={uploadModalAssigneeDropdownRef}>
                    <input
                      ref={uploadModalAssigneeInputRef}
                      type="text"
                      className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Choose an assignee..."
                      value={uploadModalAssignee}
                      onChange={(e) => setUploadModalAssignee(e.target.value)}
                      onFocus={() => setShowUploadModalAssigneeDropdown(true)}
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                      autoComplete="off"
                    />
                    {showUploadModalAssigneeDropdown && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        {allAssignees.length > 0 ? (
                          allAssignees.map((assignee: string) => (
                            <div
                              key={assignee}
                              className="px-4 py-2 text-xs cursor-pointer hover:bg-primary/10 hover:text-primary"
                              onClick={() => {
                                setUploadModalAssignee(assignee);
                                setShowUploadModalAssigneeDropdown(false);
                              }}
                            >
                              {assignee}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-xs text-gray-400">No assignees found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <label htmlFor="upload-modal-file-upload" className="block cursor-pointer">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-8 px-4 text-center transition hover:border-primary">
                <HiOutlineUpload className="h-4 w-4 text-gray-400 mb-2" />
                <div className="text-xs text-gray-700 font-semibold">Click to upload or drag and drop</div>
                <div className="text-[10px] text-gray-400 mt-1">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
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
              <div className="flex flex-col gap-2 items-start">
                <span className="inline-block max-w-max text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                  # {selectedPdf.id || '1234'}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">{selectedPdf.name}</h2>
              </div>
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

    {/* Document Details Modal */}
    {showDocumentModal && selectedDocument && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
          {/* Sticky Header with Document ID and Close buttons */}
          <div className="sticky top-0 z-40 bg-white px-6 py-4">
            <div className="flex items-start justify-between">
              {/* Left: Document ID and Status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                    # {selectedDocument.id}
                  </span>
                </div>
              </div>
              {/* Right: Close Button */}
              <button
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                onClick={() => setShowDocumentModal(false)}
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
              {/* Document Details and File Information Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Document Details Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Details</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            <div>
                      <div className="text-gray-500 text-xs mb-1">Document ID</div>
                      <div className="text-xs text-black mb-4">{selectedDocument.id}</div>
                            </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                      <div className="text-xs text-black mb-4">{selectedDocument.contractId}</div>
                          </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Document Name</div>
                      <input
                        type="text"
                        value={selectedDocument.name}
                        onChange={(e) => {
                          const updatedDoc = { ...selectedDocument, name: e.target.value };
                          setSelectedDocument(updatedDoc);
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Contract Name</div>
                      <div className="text-xs text-black mb-4 pt-2">{selectedDocument.contractTitle}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Document Hash</div>
                      <div className="flex items-center">
                        <span
                          className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                          style={{ maxWidth: '120px' }}
                          title={getContractHash(selectedDocument.id)}
                        >
                          0x{selectedDocument.id}...{selectedDocument.id.slice(-4)}
                        </span>
                        <div className="relative">
                          <button 
                            type="button"
                            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={() => {
                              navigator.clipboard.writeText(getContractHash(selectedDocument.id));
                              setCopiedContractId(selectedDocument.id);
                              setTimeout(() => setCopiedContractId(null), 1500);
                            }}
                            onMouseEnter={() => setHoveredContractId(selectedDocument.id)}
                            onMouseLeave={() => setHoveredContractId(null)}
                            aria-label="Copy document hash"
                          >
                            <HiOutlineDuplicate className="w-4 h-4" />
                          </button>
                          {copiedContractId === selectedDocument.id && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </div>
                          )}
                          {hoveredContractId === selectedDocument.id && copiedContractId !== selectedDocument.id && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                              Copy
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Assignee</div>
                      <div className="relative w-full" ref={documentDetailsAssigneeDropdownRef}>
                        <input
                          ref={documentDetailsAssigneeInputRef}
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            {allAssignees.length > 0 ? (
                              allAssignees.map((assignee: string) => (
                                <div
                                  key={assignee}
                                  className="px-4 py-2 text-xs cursor-pointer hover:bg-primary/10 hover:text-primary"
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
                              <div className="px-4 py-2 text-xs text-gray-400">No assignees found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Information Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">File Information</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Type</div>
                      <div className="text-xs text-black mb-4">{selectedDocument.type}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Size</div>
                      <div className="text-xs text-black mb-4">{selectedDocument.size}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Uploaded By</div>
                      <div className="text-xs text-black mb-4">{selectedDocument.uploadedBy}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Date Uploaded</div>
                      <div className="text-xs text-black mb-4">{selectedDocument.dateUploaded}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Preview Box - Full Width */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Preview</h3>
                <div className="w-full h-[600px] bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">PDF Viewer will be implemented here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
export default ContractsPage;
