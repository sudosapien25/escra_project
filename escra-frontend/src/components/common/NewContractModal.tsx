"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineDocumentText, HiChevronDown, HiOutlineUpload, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { Logo } from '@/components/common/Logo';
import { FaCheck, FaPlus, FaSearch } from 'react-icons/fa';
import { LuPen, LuCalendarFold } from 'react-icons/lu';
import { TbMailPlus, TbEdit } from 'react-icons/tb';
import { TiUserAddOutline } from 'react-icons/ti';

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

// Utility functions from contracts page
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
  const [modalStep, setModalStep] = useState(1);
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
      signerRole: 'Buyer',
      contractRole: 'Buyer',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: React.createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: React.createRef<HTMLDivElement>(),
      contractRoleButtonRef: React.createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
    },
    {
      name: '',
      email: '',
      signerRole: 'Seller',
      contractRole: 'Seller',
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
  const [step4Documents, setStep4Documents] = useState<Array<{ name: string; file: File; assignee: string }>>([]);
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  
  // Routing number and account number display states
  const [buyerRoutingDisplay, setBuyerRoutingDisplay] = useState('');
  const [sellerRoutingDisplay, setSellerRoutingDisplay] = useState('');
  const [buyerAccountDisplay, setBuyerAccountDisplay] = useState('');
  const [sellerAccountDisplay, setSellerAccountDisplay] = useState('');
  const [buyerAccountVisible, setBuyerAccountVisible] = useState(false);
  const [sellerAccountVisible, setSellerAccountVisible] = useState(false);
  
  // Timeout refs for masking
  const buyerRoutingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellerRoutingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buyerAccountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellerAccountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleAddRecipient = () => {
    const newRecipient: Recipient = {
      name: '',
      email: '',
      signerRole: 'Signer',
      contractRole: 'Party',
      showSignerRoleDropdown: false,
      showContractRoleDropdown: false,
      signerRoleButtonRef: React.createRef<HTMLButtonElement>(),
      signerRoleDropdownRef: React.createRef<HTMLDivElement>(),
      contractRoleButtonRef: React.createRef<HTMLButtonElement>(),
      contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
    };
    setRecipients(prev => [...prev, newRecipient]);
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

      // Create new contract logic would go here
      console.log('Creating contract:', modalForm, recipients, uploadedFiles);
        onClose();
        setModalStep(1);
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
      setRecipients([
        {
          name: '',
          email: '',
          signerRole: 'Buyer',
          contractRole: 'Buyer',
          showSignerRoleDropdown: false,
          showContractRoleDropdown: false,
          signerRoleButtonRef: React.createRef<HTMLButtonElement>(),
          signerRoleDropdownRef: React.createRef<HTMLDivElement>(),
          contractRoleButtonRef: React.createRef<HTMLButtonElement>(),
          contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
        },
        {
          name: '',
          email: '',
          signerRole: 'Seller',
          contractRole: 'Seller',
          showSignerRoleDropdown: false,
          showContractRoleDropdown: false,
          signerRoleButtonRef: React.createRef<HTMLButtonElement>(),
          signerRoleDropdownRef: React.createRef<HTMLDivElement>(),
          contractRoleButtonRef: React.createRef<HTMLButtonElement>(),
          contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
        },
      ]);
      setFormErrors({});
      setRecipientErrors({});
      setUploadedFiles([]);
      setStep4Documents([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto px-4 sm:px-8 pb-8 font-sans max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 sm:px-8 sm:pt-8 sm:pb-2 border-b border-gray-100 dark:border-gray-700 gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <HiOutlineDocumentText className="text-primary text-2xl" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white leading-tight">Create New Contract</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-tight">Fill in the details to quickly get started</p>
            </div>
          </div>
          <button onClick={() => { onClose(); setModalStep(1); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center w-full px-0 sm:px-2 py-3 sm:pt-4 sm:pb-2 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-nowrap justify-center w-full px-2">
            {[1, 2, 3, 4].map((step, idx) => (
              <React.Fragment key={step}>
                <button
                  type="button"
                  onClick={() => setModalStep(step)}
                  className={`flex items-center gap-2 font-semibold transition-all duration-300 text-sm px-2 py-1 sm:text-base sm:px-4 sm:py-1.5 rounded-lg whitespace-nowrap
                    ${modalStep === step
                      ? 'text-primary border-2 border-gray-200 dark:border-gray-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
                  `}
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
                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                      }}
                      onClick={(e) => handleDropdownClick(e, showContractTypeDropdown, setShowContractTypeDropdown, [setShowPropertyTypeDropdown, setShowMilestoneDropdown])}
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
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900 caret-transparent"
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
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 cursor-pointer bg-white dark:bg-gray-900 caret-transparent"
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
                    placeholder="Enter zip code..."
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Country</label>
                  <div className="relative w-full" ref={countryDropdownRef}>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 bg-white dark:bg-gray-900"
                      placeholder="Select Country..."
                      value={countrySearchTerm || modalForm.country || ''}
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
                    />
                    <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showCountryDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {['United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'China', 'India', 'Brazil', 'Argentina', 'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'Ethiopia', 'Somalia', 'Djibouti', 'Eritrea', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Central African Republic', 'Chad', 'Cameroon', 'Gabon', 'Equatorial Guinea', 'São Tomé and Príncipe', 'Angola', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho', 'Eswatini', 'Madagascar', 'Comoros', 'Mauritius', 'Seychelles', 'Cape Verde', 'Guinea-Bissau', 'Senegal', 'The Gambia', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Ghana', 'Togo', 'Benin', 'Burkina Faso', 'Mali', 'Niger', 'Mauritania', 'Western Sahara', 'Spain', 'Portugal', 'Italy', 'Switzerland', 'Austria', 'Slovenia', 'Croatia', 'Bosnia and Herzegovina', 'Serbia', 'Montenegro', 'Kosovo', 'North Macedonia', 'Albania', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland', 'Ireland', 'Netherlands', 'Belgium', 'Luxembourg', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Russia', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Afghanistan', 'Pakistan', 'India', 'Nepal', 'Bhutan', 'Bangladesh', 'Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Brunei', 'East Timor', 'Papua New Guinea', 'Fiji', 'Vanuatu', 'New Caledonia', 'Solomon Islands', 'Tuvalu', 'Kiribati', 'Nauru', 'Palau', 'Micronesia', 'Marshall Islands', 'Samoa', 'Tonga', 'Cook Islands', 'Niue', 'Tokelau', 'American Samoa', 'French Polynesia', 'Wallis and Futuna', 'Pitcairn Islands', 'Easter Island', 'Galápagos Islands', 'Falkland Islands', 'South Georgia and the South Sandwich Islands', 'Bouvet Island', 'Heard Island and McDonald Islands', 'French Southern and Antarctic Lands', 'Antarctica']
                          .filter(country => 
                            country.toLowerCase().includes(countrySearchTerm.toLowerCase())
                          )
                          .map(country => (
                          <button
                            key={country}
                            className={`w-full text-left px-3 py-0.5 text-xs font-medium ${modalForm.country === country ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            onClick={e => {
                              e.preventDefault();
                              setModalForm(prev => ({ ...prev, country }));
                              setShowCountryDropdown(false);
                              setCountrySearchTerm('');
                            }}
                          >
                            {country}
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
                            <HiChevronDown className="w-3 h-3" />
                          </button>
                          {recipient.showSignerRoleDropdown && (
                            <div 
                              ref={recipient.signerRoleDropdownRef}
                              className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1"
                            >
                              {['Buyer', 'Seller', 'Agent', 'Escrow Officer', 'Attorney', 'Other'].map((role) => (
                                <button
                                  key={role}
                                  className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${recipient.signerRole === role ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                  onClick={() => {
                                    setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, signerRole: role, showSignerRoleDropdown: false } : r));
                                    setRecipientErrors(prev => ({ ...prev, [`signerRole-${idx}`]: false }));
                                  }}
                                >
                                  <div className="w-3 h-3 border border-gray-300 rounded mr-2 flex items-center justify-center">
                                    {recipient.signerRole === role && (
                                      <div className="w-2 h-2 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={6} />
                                      </div>
                                    )}
                                  </div>
                                  {role}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Contract Role selection button */}
                        <div className="relative">
                          <button
                            ref={recipient.contractRoleButtonRef}
                            type="button"
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 dark:text-white border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary rounded-md hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors"
                            onClick={() => setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, showContractRoleDropdown: !r.showContractRoleDropdown } : r))}
                            tabIndex={0}
                          >
                            <TbEdit className="w-3 h-3 text-primary dark:text-white" />
                            <span>{recipient.contractRole || 'Contract Role'}</span>
                            <HiChevronDown className="w-3 h-3" />
                          </button>
                          {recipient.showContractRoleDropdown && (
                            <div 
                              ref={recipient.contractRoleDropdownRef}
                              className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1"
                            >
                              {['Buyer', 'Seller', 'Agent', 'Escrow Officer', 'Attorney', 'Other'].map((role) => (
                                <button
                                  key={role}
                                  className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${recipient.contractRole === role ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                  onClick={() => {
                                    setRecipients(prev => prev.map((r, i) => i === idx ? { ...r, contractRole: role, showContractRoleDropdown: false } : r));
                                    setRecipientErrors(prev => ({ ...prev, [`contractRole-${idx}`]: false }));
                                  }}
                                >
                                  <div className="w-3 h-3 border border-gray-300 rounded mr-2 flex items-center justify-center">
                                    {recipient.contractRole === role && (
                                      <div className="w-2 h-2 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={6} />
                                      </div>
                                    )}
                                  </div>
                                  {role}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Delete button for additional recipients */}
                      {idx >= 2 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRecipient(idx)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
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
              <div className="space-y-4">
                <div>
                  {/* Uploaded Documents Display - Above the upload box */}
                  {step4Documents.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Uploaded Documents</h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                        {step4Documents.map((doc, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between rounded-lg px-4 py-3 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600 cursor-pointer transition-colors"
                          >
                            <div className="flex-1 min-w-0 pl-3">
                              <div className="font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate">
                                {doc.name}
                              </div>
                              <div className="text-xs text-gray-500 cursor-default select-none">
                                {new Date().toISOString().split('T')[0]} &bull; {doc.file.name.split('.').pop()?.toUpperCase() || 'Unknown'} &bull; {(doc.file.size / 1024 / 1024).toFixed(2)} MB &bull; {doc.assignee}
                              </div>
                            </div>
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
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-default select-none">Upload Documents (Optional)</label>
              <label htmlFor="file-upload" className="block cursor-pointer">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 py-8 px-4 text-center transition hover:border-primary">
                  <HiOutlineUpload className="text-3xl text-gray-400 mb-2" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Click to upload or drag and drop</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
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
                    <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {uploadedFiles.map((file, idx) => (
                    <li key={idx} className="truncate">{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setModalStep(3)} className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Previous</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm" style={{ fontFamily: 'Avenir, sans-serif' }}>Create Contract</button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default NewContractModal; 