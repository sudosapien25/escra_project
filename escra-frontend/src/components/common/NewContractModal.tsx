"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineDocumentText, HiOutlineUpload, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff, HiOutlinePencil } from 'react-icons/hi';
import { Logo } from '@/components/common/Logo';
import { FaCheck, FaPlus, FaSearch } from 'react-icons/fa';
import { LuPen, LuCalendarFold } from 'react-icons/lu';
import { TbMailPlus, TbEdit, TbFilePlus, TbDragDrop, TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive, TbSquareCheck, TbChevronDown, TbEraser } from 'react-icons/tb';
import { SiBox } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { TiUserAddOutline } from 'react-icons/ti';
import { useAssigneeStore } from '@/data/assigneeStore';
import { useDocumentStore } from '@/data/documentNameStore';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/context/NotificationContext';

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
  documentIds?: string[];
}

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

const PROPERTY_TYPES = [
  'Single Family Home',
  'Multi-Family',
  'Commercial',
  'Land',
  'Industrial',
  'Mixed Use',
];

const MILESTONE_TEMPLATES = [
  'Standard (6 milestones)',
  'Simple (4 milestones)',
  'Construction (8 milestones)',
  'Custom',
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
  { value: 'WY', label: 'Wyoming' },
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
  { value: 'GN', label: 'Guinea' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'HT', label: 'Haiti' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IR', label: 'Iran' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IL', label: 'Israel' },
  { value: 'CI', label: 'Ivory Coast' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'JO', label: 'Jordan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'LA', label: 'Laos' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'LR', label: 'Liberia' },
  { value: 'LY', label: 'Libya' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MW', label: 'Malawi' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'ML', label: 'Mali' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'MA', label: 'Morocco' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'NA', label: 'Namibia' },
  { value: 'NP', label: 'Nepal' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'OM', label: 'Oman' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PA', label: 'Panama' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'PH', label: 'Philippines' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RU', label: 'Russia' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SN', label: 'Senegal' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'SG', label: 'Singapore' },
  { value: 'SO', label: 'Somalia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SY', label: 'Syria' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TG', label: 'Togo' },
  { value: 'TO', label: 'Tonga' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'UG', label: 'Uganda' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yemen' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' },
];

// Utility functions from contracts page
function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

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

const NewContractModal: React.FC<NewContractModalProps> = ({ isOpen, onClose }) => {
  const { allAssignees } = useAssigneeStore();
  const [modalStep, setModalStep] = useState(1);
  const [confirmationData, setConfirmationData] = useState<{
    contractName: string;
    contractId: string;
    documents: Array<{id: string, name: string}>;
  } | null>(null);
  const [contractCarouselPage, setContractCarouselPage] = useState(0);
  const [showContractTypeDropdown, setShowContractTypeDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showMilestoneDropdown, setShowMilestoneDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  const contractTypeDropdownRef = useRef<HTMLDivElement>(null);
  const propertyTypeDropdownRef = useRef<HTMLDivElement>(null);
  const milestoneDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  const [modalForm, setModalForm] = useState({
    title: '',
    escrowNumber: '',
    type: '',
    propertyType: '',
    milestone: '',
    value: '',
    dueDate: '',
    propertyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    closingDate: '',
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
    notes: '',
    buyerFinancialInstitution: '',
    buyerFinancialInstitutionRoutingNumber: '',
    buyerAccountNumber: '',
    sellerFinancialInstitution: '',
    sellerFinancialInstitutionRoutingNumber: '',
    sellerAccountNumber: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
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

  const [recipientErrors, setRecipientErrors] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [step4Documents, setStep4Documents] = useState<Array<{ name: string; file: File; type: string; assignee: string }>>([]);
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  
  // Routing number and account number display states
  const [buyerRoutingDisplay, setBuyerRoutingDisplay] = useState('');
  const [sellerRoutingDisplay, setSellerRoutingDisplay] = useState('');
  const [buyerAccountDisplay, setBuyerAccountDisplay] = useState('');
  const [sellerAccountDisplay, setSellerAccountDisplay] = useState('');
  const [buyerAccountVisible, setBuyerAccountVisible] = useState(false);
  const [sellerAccountVisible, setSellerAccountVisible] = useState(false);

  // Step 4 Document state variables
  const [step4DocumentName, setStep4DocumentName] = useState('');
  const [step4DocumentType, setStep4DocumentType] = useState('');
  const [step4DocumentAssignee, setStep4DocumentAssignee] = useState('');
  const [step4SelectedFiles, setStep4SelectedFiles] = useState<File[]>([]);
  const [step4FileSource, setStep4FileSource] = useState('');
  const [showStep4UploadDropdown, setShowStep4UploadDropdown] = useState(false);
  const [showStep4AssigneeDropdown, setShowStep4AssigneeDropdown] = useState(false);
  const [editingStep4DocumentIndex, setEditingStep4DocumentIndex] = useState<number | null>(null);
  const [inlineEditingStep4DocumentName, setInlineEditingStep4DocumentName] = useState('');
  const [inlineEditingStep4DocumentType, setInlineEditingStep4DocumentType] = useState('');
  const [inlineEditingStep4DocumentAssignee, setInlineEditingStep4DocumentAssignee] = useState('');
  const [showStep4DocumentAssigneeDropdown, setShowStep4DocumentAssigneeDropdown] = useState(false);
  const step4UploadDropdownRef = useRef<HTMLDivElement>(null);
  const step4AssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const step4DocumentAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  
  // Hooks for contract creation
  const { addDocument } = useDocumentStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addContractCreatedNotification, addDocumentCreatedNotification } = useNotifications();
  
  // Timeout refs for masking
  const buyerRoutingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellerRoutingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buyerAccountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellerAccountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debug useEffect to monitor propertyType changes
  useEffect(() => {
    console.log('PropertyType changed to:', modalForm.propertyType);
    console.log('Modal opened from page:', window.location.pathname);
  }, [modalForm.propertyType]);

  // Debug useEffect to monitor modal open
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened on page:', window.location.pathname);
      console.log('Initial propertyType value:', modalForm.propertyType);
    }
  }, [isOpen, modalForm.propertyType]);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModalForm({ ...modalForm, [name]: value });
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setUploadedFiles(validFiles);
  };

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

  const handleStateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateSearchTerm(e.target.value);
  };

  const handleCountrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountrySearchTerm(e.target.value);
  };

  const getRecipientCardBorderColor = (index: number) => {
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
    return colors[index % colors.length];
  };

  // Generate unique contract ID with Algorand Smart Contract Chain ID format
  const generateContractId = (): string => {
    const random = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return random.toString();
  };

  // Create parties string from form data
  const createPartiesString = (): string => {
    const parties = recipients
      .filter(recipient => recipient.name && recipient.name.trim() !== '')
      .map(recipient => recipient.name.trim());
    return parties.join(' & ');
  };

  // Reset form to initial state
  const handleCloseConfirmationStep = () => {
    onClose();
    setModalStep(1);
    setConfirmationData(null);
    setContractCarouselPage(0);
    resetForm();
  };

  const handleTestConfirmationStep = () => {
    setConfirmationData({
      contractName: "Test Contract - Residential Property Sale",
      contractId: "CON-2024-001",
      documents: [
        { id: "doc_CON-2024-001_purchase_agreement", name: "Purchase Agreement" },
        { id: "doc_CON-2024-001_property_disclosure", name: "Property Disclosure Statement" },
        { id: "doc_CON-2024-001_inspection_report", name: "Home Inspection Report" },
        { id: "doc_CON-2024-001_appraisal", name: "Property Appraisal" },
        { id: "doc_CON-2024-001_title_report", name: "Title Report" },
        { id: "doc_CON-2024-001_insurance_policy", name: "Homeowners Insurance Policy" },
        { id: "doc_CON-2024-001_loan_documents", name: "Loan Application Documents" },
        { id: "doc_CON-2024-001_earnest_money", name: "Earnest Money Receipt" },
        { id: "doc_CON-2024-001_closing_statement", name: "Closing Statement" },
        { id: "doc_CON-2024-001_warranty", name: "Home Warranty Certificate" },
        { id: "doc_CON-2024-001_utility_transfer", name: "Utility Transfer Form" },
        { id: "doc_CON-2024-001_final_walkthrough", name: "Final Walkthrough Checklist" },
        { id: "doc_CON-2024-001_commission_agreement", name: "Real Estate Commission Agreement" },
        { id: "doc_CON-2024-001_escrow_instructions", name: "Escrow Instructions" },
        { id: "doc_CON-2024-001_survey", name: "Property Survey" },
        { id: "doc_CON-2024-001_environmental_assessment", name: "Environmental Assessment" },
        { id: "doc_CON-2024-001_lead_paint", name: "Lead Paint Disclosure" },
        { id: "doc_CON-2024-001_radon_test", name: "Radon Test Results" },
        { id: "doc_CON-2024-001_pest_inspection", name: "Pest Inspection Report" },
        { id: "doc_CON-2024-001_hoa_documents", name: "HOA Governing Documents" },
        { id: "doc_CON-2024-001_tax_assessment", name: "Property Tax Assessment" }
      ]
    });
    setModalStep(5);
  };

  const resetForm = () => {
    setModalForm({
      title: '',
      escrowNumber: '',
      type: '',
      propertyType: '',
      milestone: '',
      value: '',
      dueDate: '',
      propertyAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      closingDate: '',
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
      notes: '',
      buyerFinancialInstitution: '',
      buyerFinancialInstitutionRoutingNumber: '',
      buyerAccountNumber: '',
      sellerFinancialInstitution: '',
      sellerFinancialInstitutionRoutingNumber: '',
      sellerAccountNumber: '',
    });
    setModalStep(1);
    setFormErrors({});
    setRecipientErrors({});
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
    setUploadedFiles([]);
    setStep4Documents([]);
    setStep4DocumentName('');
    setStep4DocumentType('');
    setStep4DocumentAssignee('');
    setStateSearchTerm('');
    setCountrySearchTerm('');
  };

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

  const handleDeleteRecipient = (idx: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== idx));
  };

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
    
    // If we have new digits and haven't reached the limit
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

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const contractTypeDropdown = contractTypeDropdownRef.current;
      const propertyTypeDropdown = propertyTypeDropdownRef.current;
      const milestoneDropdown = milestoneDropdownRef.current;
      const stateDropdown = stateDropdownRef.current;
      const countryDropdown = countryDropdownRef.current;
      
      if (!contractTypeDropdown?.contains(target) && !propertyTypeDropdown?.contains(target) && 
          !milestoneDropdown?.contains(target) && !stateDropdown?.contains(target) && 
          !countryDropdown?.contains(target)) {
        setShowContractTypeDropdown(false);
        setShowPropertyTypeDropdown(false);
        setShowMilestoneDropdown(false);
        setShowStateDropdown(false);
        setShowCountryDropdown(false);
      }
    }

    if (showContractTypeDropdown || showPropertyTypeDropdown || showMilestoneDropdown || 
        showStateDropdown || showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContractTypeDropdown, showPropertyTypeDropdown, showMilestoneDropdown, showStateDropdown, showCountryDropdown]);

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

  // Step 4 dropdown click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStep4AssigneeDropdown && !step4AssigneeDropdownRef.current?.contains(event.target as Node)) {
        setShowStep4AssigneeDropdown(false);
      }
      if (showStep4DocumentAssigneeDropdown && !step4DocumentAssigneeDropdownRef.current?.contains(event.target as Node)) {
        setShowStep4DocumentAssigneeDropdown(false);
      }
      if (showStep4UploadDropdown && !step4UploadDropdownRef.current?.contains(event.target as Node)) {
        setShowStep4UploadDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStep4AssigneeDropdown, showStep4DocumentAssigneeDropdown, showStep4UploadDropdown]);

  // Step 4 Document functions
  const handleAddStep4Document = () => {
    if (step4DocumentName.trim() && step4DocumentType.trim() && step4DocumentAssignee.trim() && step4SelectedFiles.length > 0) {
      const newDocument = {
        file: step4SelectedFiles[0],
        name: step4DocumentName.trim(),
        type: step4DocumentType.trim(),
        assignee: step4DocumentAssignee.trim()
      };
      setStep4Documents(prev => [...prev, newDocument]);
      
      // Clear form fields
      setStep4DocumentName('');
      setStep4DocumentType('');
      setStep4DocumentAssignee('');
      setStep4SelectedFiles([]);
    }
  };

  const handleStartInlineEditStep4Document = (index: number) => {
    const doc = step4Documents[index];
    setEditingStep4DocumentIndex(index);
    setInlineEditingStep4DocumentName(doc.name);
    setInlineEditingStep4DocumentType(doc.type || '');
    setInlineEditingStep4DocumentAssignee(doc.assignee);
    setShowStep4DocumentAssigneeDropdown(false);
  };

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

  const handleCancelInlineEditStep4Document = () => {
    setEditingStep4DocumentIndex(null);
    setInlineEditingStep4DocumentName('');
    setInlineEditingStep4DocumentType('');
    setInlineEditingStep4DocumentAssignee('');
    setShowStep4DocumentAssigneeDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      const currentUserName = user?.name || 'Unknown User';
      
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

      // Debug logging to check form values
      console.log('Modal Form Values:', {
        value: modalForm.value,
        propertyType: modalForm.propertyType,
        state: modalForm.state,
        country: modalForm.country,
        earnestMoney: modalForm.earnestMoney,
        downPayment: modalForm.downPayment,
        loanAmount: modalForm.loanAmount
      });
      
      // Debug: Check if propertyType is actually in modalForm
      console.log('Full modalForm object:', modalForm);
      console.log('PropertyType at submission time:', modalForm.propertyType);
      console.log('PropertyType type at submission time:', typeof modalForm.propertyType);
      
      // Additional debugging for property type specifically
      console.log('Property Type Debug:', {
        propertyType: modalForm.propertyType,
        propertyTypeType: typeof modalForm.propertyType,
        propertyTypeLength: modalForm.propertyType?.length,
        propertyTypeTruthy: !!modalForm.propertyType
      });

      // Debug: Check if propertyType is actually in modalForm
      console.log('Full modalForm object:', modalForm);

      const newContract = {
        id: newContractId,
        title: modalForm.title,
        parties: partiesString,
        status: 'Initiation',
        updated: 'Just now',
        value: modalForm.value,
        documents: step4Documents.length + uploadedFiles.length, // Count all uploaded files
        type: modalForm.type,
        buyer: buyerRecipient?.name || '',
        seller: sellerRecipient?.name || '',
        milestone: modalForm.milestone,
        notes: modalForm.notes,
        closingDate: modalForm.closingDate,
        dueDate: modalForm.dueDate,
        propertyAddress: modalForm.propertyAddress,
        propertyType: modalForm.propertyType,
        escrowNumber: modalForm.escrowNumber,
        buyerEmail: buyerRecipient?.email || '',
        sellerEmail: sellerRecipient?.email || '',
        earnestMoney: modalForm.earnestMoney,
        downPayment: modalForm.downPayment,
        loanAmount: modalForm.loanAmount,
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
        documentIds: [] as string[],
      };

      // Debug logging to check final contract object
      console.log('Final Contract Object:', {
        id: newContract.id,
        value: newContract.value,
        propertyType: newContract.propertyType,
        state: newContract.state,
        country: newContract.country,
        earnestMoney: newContract.earnestMoney,
        downPayment: newContract.downPayment,
        loanAmount: newContract.loanAmount
      });

      // Debug: Log the contract being sent to API
      console.log('Contract being sent to API:', newContract);
      console.log('API request body:', JSON.stringify(newContract));

      // Save the new contract to the API
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
                // Create document with proper ID and contract association, including assignee and document type
                const documentId = await addDocument(docInfo.file, newContractId, newContract.title, currentUserName, docInfo.assignee, docInfo.type);
                
                // Update the document name
                const { updateDocumentName } = useDocumentStore.getState();
                updateDocumentName(documentId, docInfo.name);
                
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
                // Create document with proper ID and contract association, including assignee (current user as default)
                const documentId = await addDocument(file, newContractId, newContract.title, currentUserName, currentUserName, undefined);
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

      // Debug: Log what's being saved to localStorage
      console.log('Saving to localStorage:', newContract);
      console.log('localStorage JSON:', JSON.stringify(newContract));

      // Save new contract to localStorage for other pages to pick up
      try {
        localStorage.setItem('newContract', JSON.stringify(newContract));
        // Trigger storage event for other tabs/pages
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'newContract',
          newValue: JSON.stringify(newContract)
        }));
        console.log('Successfully saved to localStorage and dispatched storage event');
      } catch (error) {
        console.error('Error saving new contract to localStorage:', error);
      }
      
      // Set confirmation data and navigate to confirmation step
      setConfirmationData({
        contractName: newContract.title,
        contractId: newContract.id,
        documents: [
          ...step4Documents.map(docInfo => ({ id: "doc_" + newContract.id + "_" + docInfo.name, name: docInfo.name })),
          ...uploadedFiles.map(file => ({ id: "doc_" + newContract.id + "_" + file.name, name: file.name }))
        ]
      });
      setModalStep(5);
      
      // Add notification for contract creation
      addContractCreatedNotification(newContract.id, newContract.title);
      
      // Add notifications for each document created
      if (step4Documents.length > 0) {
        step4Documents.forEach((docInfo) => {
          addDocumentCreatedNotification("doc_" + newContract.id + "_" + docInfo.name, docInfo.name, newContract.id, newContract.title);
        });
      }
      
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          addDocumentCreatedNotification("doc_" + newContract.id + "_" + file.name, file.name, newContract.id, newContract.title);
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[1400px] mx-auto px-4 sm:px-8 pb-6 font-sans max-h-[98vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
        {/* Modal Header */}
        {modalStep !== 5 && (
          <div className="relative flex items-center justify-between py-4 sm:pt-8 sm:pb-2 mb-4 gap-2">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                <TbFilePlus size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white leading-tight">Create New Contract</h2>
                <p className="text-gray-500 text-xs leading-tight cursor-default select-none">Fill in the contract details to get started</p>
              </div>
            </div>
            <button onClick={() => { 
              if (modalStep === 5) {
                handleCloseConfirmationStep();
              } else {
                onClose(); 
                setModalStep(1); 
              }
            }} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none -mt-3 flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stepper */}
        {modalStep !== 5 && (
          <div className="w-full overflow-x-auto py-3 sm:pt-4 sm:pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
            <div className="flex items-center justify-between mb-6 min-w-0">
              <div className="flex items-center space-x-2 w-full flex-nowrap px-0">
              {[1, 2, 3, 4].map((step, idx) => (
                <React.Fragment key={step}>
                  <button
                    type="button"
                    onClick={() => setModalStep(step)}
                    className={`flex items-center gap-2 rounded-xl font-semibold border transition-all duration-300 text-sm px-3 sm:px-4 py-2 whitespace-nowrap flex-shrink-0
                      ${modalStep === step
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ring-1 ring-inset ring-gray-200 dark:ring-gray-600 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <span className={`inline-block transition-all duration-300 ${modalStep === step ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: modalStep === step ? 18 : 0}}>
                      {step === modalStep && <Logo width={18} height={18} className="pointer-events-none" />}
                    </span>
                    {step === 1 && 'Step 1: General'}
                    {step === 2 && 'Step 2: Parties'}
                    {step === 3 && 'Step 3: Details'}
                    {step === 4 && 'Step 4: Documents'}
                  </button>
                  {idx < 3 && <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-600 mx-1 sm:mx-2" />}
                </React.Fragment>
              ))}
            </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="space-y-6 pt-4">
        {modalStep === 5 && confirmationData && (
          <>
            {/* Close button for step 5 - positioned like header */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-end py-3 pt-2 mb-4 gap-2">
              <button onClick={handleCloseConfirmationStep} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </>
        )}
        
        {modalStep === 5 && confirmationData && (
          <div className="space-y-4">
            <div className="text-center space-y-4 max-w-lg mx-auto px-6">
              {/* Success Icon */}
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/20 mx-auto">
                <TbSquareCheck className="h-6 w-6 text-primary" />
              </div>
              
                                {/* Main Title */}
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      Contract Created Successfully
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap mb-6 text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      "{confirmationData.contractName}" has been created with Contract ID {confirmationData.contractId}
                    </p>
                  </div>
              
              {/* Documents List */}
              {confirmationData.documents.length > 0 && (
                <div className="text-left">
                  <div className="flex justify-center mb-6">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      The below supporting documents have also been created:
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div 
                      className="grid gap-x-12 gap-y-2 mx-auto" 
                      style={{ 
                        gridTemplateColumns: `repeat(2, minmax(600px, 1fr))`,
                        gridAutoFlow: 'column',
                        gridTemplateRows: `repeat(7, auto)`
                      }}
                      onWheel={(e) => {
                        e.preventDefault();
                        if (confirmationData.documents.length > 14) {
                          if (e.deltaY > 0 && contractCarouselPage < Math.ceil(confirmationData.documents.length / 14) - 1) {
                            setContractCarouselPage(prev => prev + 1);
                          } else if (e.deltaY < 0 && contractCarouselPage > 0) {
                            setContractCarouselPage(prev => prev - 1);
                          }
                        }
                      }}
                    >
                    {confirmationData.documents
                      .slice(contractCarouselPage * 14, (contractCarouselPage + 1) * 14)
                      .map((doc, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <span className="text-primary mr-2 mt-0.5 flex-shrink-0">•</span>
                        <span>"{doc.name}" with Document ID {doc.id}</span>
                      </div>
                    ))}
                    </div>
                  </div>
                  
                  {/* Carousel Indicators */}
                  {confirmationData.documents.length > 14 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      {Array.from({ length: Math.ceil(confirmationData.documents.length / 14) }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setContractCarouselPage(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === contractCarouselPage 
                              ? 'bg-primary' 
                              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Close Button - positioned like Create Contract button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseConfirmationStep}
                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        
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
                                        placeholder="Select contract type..."
                  value={CONTRACT_TYPES.find(t => t === modalForm.type) || ''}
                  readOnly
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          e.preventDefault();
                          setModalForm(prev => ({ ...prev, type: '' }));
                        }
                      }}
                      onFocus={(e) => {
                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                      }}
                      onClick={(e) => handleDropdownClick(e, showContractTypeDropdown, setShowContractTypeDropdown, [setShowPropertyTypeDropdown, setShowMilestoneDropdown])}
                />
                <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
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
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900 caret-transparent"
                      placeholder="Select property type..."
                      value={PROPERTY_TYPES.find(t => t === modalForm.propertyType) || ''}
                      readOnly
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          e.preventDefault();
                          setModalForm(prev => ({ ...prev, propertyType: '' }));
                        }
                      }}
                      onFocus={(e) => {
                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                      }}
                      onClick={(e) => handleDropdownClick(e, showPropertyTypeDropdown, setShowPropertyTypeDropdown, [setShowContractTypeDropdown, setShowMilestoneDropdown])}
                    />
                    <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {showPropertyTypeDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {PROPERTY_TYPES.map(type => (
                          <button
                            key={type}
                            className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.propertyType === type ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            onClick={e => {
                              e.preventDefault();
                              console.log('Setting propertyType to:', type);
                              console.log('Previous modalForm.propertyType:', modalForm.propertyType);
                              setModalForm(prev => {
                                const newForm = { ...prev, propertyType: type };
                                console.log('New modalForm.propertyType will be:', newForm.propertyType);
                                return newForm;
                              });
                              setShowPropertyTypeDropdown(false);
                              setFormErrors(prev => ({ ...prev, propertyType: false }));
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
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900 caret-transparent"
                  placeholder="Select milestone template..."
                  value={MILESTONE_TEMPLATES.find(t => t === modalForm.milestone) || ''}
                  readOnly
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          e.preventDefault();
                          setModalForm(prev => ({ ...prev, milestone: '' }));
                        }
                      }}
                      onFocus={(e) => {
                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                      }}
                      onClick={(e) => handleDropdownClick(e, showMilestoneDropdown, setShowMilestoneDropdown, [setShowContractTypeDropdown, setShowPropertyTypeDropdown])}
                />
                <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
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
                        console.log('Setting value to:', formattedValue);
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
                    placeholder="Enter city..."
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
                    <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {showStateDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
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
                    <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {showCountryDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {COUNTRIES
                          .filter(country => 
                            country.label.toLowerCase().includes(countrySearchTerm.toLowerCase())
                          )
                          .map(country => (
                          <button
                            key={country.value}
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
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[120px] dark:bg-gray-900 dark:text-white"
                  placeholder="Enter any additional notes for this contract..."
              />
            </div>
              <div className="flex justify-end mt-6">
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Continue
                </button>
            </div>
          </form>
        )}

        {modalStep === 2 && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                {/* Render all recipient cards */}
                {recipients.map((recipient, idx) => (
                  <div key={idx} className="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm" style={{ borderLeft: `3px solid ${getRecipientCardBorderColor(idx)}` }}>
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
                            <TbChevronDown size={14} className="inline-block align-middle -mt-[1px] text-gray-400 dark:text-gray-500" />
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
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 dark:text-white border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary rounded-md hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors whitespace-nowrap"
                            onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: !r.showContractRoleDropdown } : r))}
                            tabIndex={0}
                          >
                            <span>{recipient.contractRole || 'Contract Role'}</span>
                            <TbChevronDown size={14} className="inline-block align-middle -mt-[1px] text-gray-400 dark:text-gray-500" />
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
                      
                      {/* Clear and Delete buttons */}
                      <div className="flex items-center gap-1">
                        <button 
                          className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 relative group" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, name: '', email: '' } : r));
                          }}
                        >
                          <TbEraser className="w-4 h-4" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Erase
                          </span>
                        </button>
                        <button 
                          className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 relative group" 
                          onClick={() => handleDeleteRecipient(idx)} 
                          disabled={recipients.length === 1}
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Delete
                          </span>
                        </button>
                      </div>
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
                <button type="button" onClick={() => setModalStep(1)} className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Previous</button>
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
                      console.log('Setting loanAmount to:', formattedValue);
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
                      console.log('Setting downPayment to:', formattedValue);
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
                      console.log('Setting earnestMoney to:', formattedValue);
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
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[120px] dark:bg-gray-900 dark:text-white"
                  placeholder="Enter any contingencies for this contract..."
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
                          <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          
                          {showStep4AssigneeDropdown && (
                            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
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
                         <div className="fixed inset-0 z-[60] pointer-events-none">
                           <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 cursor-default select-none pointer-events-auto"
                                style={{
                                  left: step4UploadDropdownRef.current?.getBoundingClientRect().left || 0,
                                  top: (step4UploadDropdownRef.current?.getBoundingClientRect().bottom || 0) + 4,
                                  width: step4UploadDropdownRef.current?.getBoundingClientRect().width || 'auto',
                                  minWidth: '200px'
                                }}>
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
                                       <TbChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                       
                                       {showStep4DocumentAssigneeDropdown && (
                                         <div className="fixed inset-0 z-[9999] pointer-events-none">
                                           <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto pointer-events-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" 
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
                    <button
                      type="button"
                      onClick={handleTestConfirmationStep}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold ml-1"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      🧪 Test Confirmation
                    </button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm ml-1">Create Contract</button>
              </div>
                </div>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default NewContractModal; 