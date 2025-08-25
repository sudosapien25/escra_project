"use client";
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { FaFileContract, FaMoneyBillAlt, FaClock, FaPlus, FaArrowUp, FaDollarSign, FaCheckCircle, FaBox, FaChartLine, FaCheck } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import { LuPen } from 'react-icons/lu';
import { PiMoneyWavyBold } from 'react-icons/pi';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import { TbClockPin, TbClockUp, TbCoins, TbTransactionDollar, TbPencilExclamation, TbTransfer, TbFileText, TbClockShare, TbClockDown, TbArrowsExchange, TbClockEdit, TbFilePlus, TbBusinessplan } from 'react-icons/tb';
import { TbChevronDown } from 'react-icons/tb';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { GrMoney } from 'react-icons/gr';
import NewContractModal from '@/components/common/NewContractModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts';
import { mockContracts } from '@/data/mockContracts';
import { SignatureDocument, mockSignatures } from '@/data/mockSignatures';
import { useTaskStore } from '@/data/taskStore';
import { Task } from '@/types/task';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

// Define Contract interface to match contracts page
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

// Utility function to calculate total contract value (same as contracts page)
const calculateTotalContractValue = (contracts: Contract[]) => {
  return contracts.reduce((total, contract) => {
    // Remove '$' and ',' from value string and convert to number
    const value = parseFloat(contract.value?.replace(/[$,]/g, '') || '0');
    return total + value;
  }, 0);
};

// Utility function to process contract data for the chart
const processContractDataForChart = (contracts: Contract[], timeFilter: string) => {
  const today = new Date();
  const data: Array<{date: string; value: number; fullDate: string}> = [];
  
  // Calculate the start date based on the time filter
  let startDate: Date;
  let endDate: Date = today;
  
  switch (timeFilter) {
    case 'Last 24 hours':
      startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'Last 7 days':
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 30 days':
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'Last month':
      // Last month from the 1st to the last day
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case 'This quarter':
      // Current quarter from the 1st of the first month to current month
      const currentQuarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of current month
      break;
    case 'Last quarter':
      // Previous quarter from the 1st to the last day
      const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
      const lastQuarterYear = lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
      const lastQuarterMonth = lastQuarter < 0 ? 9 : lastQuarter * 3;
      startDate = new Date(lastQuarterYear, lastQuarterMonth, 1);
      endDate = new Date(lastQuarterYear, lastQuarterMonth + 3, 0);
      break;
    case 'Last 6 months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
      break;
    case 'Last year':
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      break;
    case 'Last 2 years':
      startDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
      break;
    default:
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
  }
  
  // Generate data points based on the time filter
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  // For shorter periods, show more granular data
  let dataPoints: Date[] = [];
  if (daysDiff <= 1) {
    // Last 24 hours - show hourly data
    for (let i = 0; i <= 24; i += 4) {
      const date = new Date(startDate.getTime() + i * 60 * 60 * 1000);
      dataPoints.push(date);
    }
  } else if (daysDiff <= 7) {
    // Last 7 days - show daily data
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      dataPoints.push(date);
    }
  } else if (daysDiff <= 30) {
    // Last 30 days - show every 5 days
    for (let i = 0; i <= daysDiff; i += 5) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      dataPoints.push(date);
    }
  } else if (timeFilter === 'Last month') {
    // Last month - show weekly data
    for (let i = 0; i <= 4; i++) {
      const date = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      if (date <= endDate) {
        dataPoints.push(date);
      }
    }
  } else if (timeFilter === 'This quarter') {
    // This quarter - show months from start of quarter to current month
    const currentQuarter = Math.floor(today.getMonth() / 3);
    const quarterStartMonth = currentQuarter * 3;
    const currentMonth = today.getMonth();
    
    for (let i = 0; i <= (currentMonth - quarterStartMonth); i++) {
      const date = new Date(today.getFullYear(), quarterStartMonth + i, 1);
      dataPoints.push(date);
    }
  } else if (timeFilter === 'Last quarter') {
    // Last quarter - show all 3 months
    for (let i = 0; i < 3; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      dataPoints.push(date);
    }
  } else if (daysDiff <= 365) {
    // Last year - show quarterly data (every 3 months)
    const months = Math.ceil(daysDiff / 30);
    for (let i = 0; i <= months; i += 3) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      dataPoints.push(date);
    }
  } else {
    // Longer periods (2+ years) - show yearly data
    const years = Math.ceil(daysDiff / 365);
    for (let i = 0; i <= years; i++) {
      const date = new Date(startDate.getFullYear() + i, startDate.getMonth(), 1);
      dataPoints.push(date);
    }
  }
  
  dataPoints.forEach((date) => {
    // Calculate cumulative value of contracts created on or before this date
    let cumulativeValue = 0;
    contracts.forEach(contract => {
      // Parse the contract's creation/updated date
      let contractDate: Date;
      
      if (contract.updated.includes('hour')) {
        // If updated within hours, assume it's from today
        contractDate = new Date();
      } else if (contract.updated.includes('day')) {
        // If updated X days ago
        const daysAgo = parseInt(contract.updated.split(' ')[0]);
        contractDate = new Date();
        contractDate.setDate(contractDate.getDate() - daysAgo);
      } else if (contract.updated.includes('week')) {
        // If updated X weeks ago
        const weeksAgo = parseInt(contract.updated.split(' ')[0]);
        contractDate = new Date();
        contractDate.setDate(contractDate.getDate() - (weeksAgo * 7));
      } else {
        // Default to 14 days ago if format is unknown
        contractDate = new Date();
        contractDate.setDate(contractDate.getDate() - 14);
      }
      
      // If the contract was created on or before this chart date, include its value
      if (contractDate <= date) {
        const value = parseFloat(contract.value?.replace(/[$,]/g, '') || '0');
        cumulativeValue += value;
      }
    });
    
    // Debug logging for last quarter
    if (timeFilter === 'Last quarter') {
      console.log(`Last quarter data point: ${date.toLocaleDateString()}, value: ${cumulativeValue}`);
    }
    
    // For testing: Add some sample data for last quarter if no real data exists
    if (timeFilter === 'Last quarter' && cumulativeValue === 0) {
      // Add some sample historical data for demonstration
      const sampleValues = [5000000, 7500000, 12000000]; // Sample values for the 3 months
      const monthIndex = dataPoints.indexOf(date);
      if (monthIndex < sampleValues.length) {
        cumulativeValue = sampleValues[monthIndex];
        console.log(`Using sample data for last quarter: ${date.toLocaleDateString()}, value: ${cumulativeValue}`);
      }
    }
    
    // Format date based on time filter
    let dateLabel: string;
    if (daysDiff <= 1) {
      // Hourly format
      dateLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    } else if (daysDiff <= 7) {
      // Daily format
      dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (daysDiff <= 30) {
      // Weekly format
      dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (daysDiff <= 365) {
      // Quarterly format - wrap year on new line
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear().toString();
      dateLabel = `${month}\n${year}`;
    } else {
      // Yearly format - just show year
      dateLabel = date.getFullYear().toString();
    }
    
    data.push({
      date: dateLabel,
      value: Math.round(cumulativeValue),
      fullDate: date.toISOString().split('T')[0]
    });
  });
  
  return data;
};

// Utility function to process contract data for bar charts
const processContractDataForBarChart = (contracts: Contract[], signatures: SignatureDocument[], view: 'types' | 'statuses' | 'signatureStates') => {
  if (view === 'types') {
    const typeCounts: { [key: string]: number } = {};
    contracts.forEach(contract => {
      typeCounts[contract.type] = (typeCounts[contract.type] || 0) + 1;
    });
    
    const result = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      count: count
    }));
    console.log('Types data:', result);
    return result;
  } else if (view === 'statuses') {
    const statusCounts: { [key: string]: number } = {};
    contracts.forEach(contract => {
      statusCounts[contract.status] = (statusCounts[contract.status] || 0) + 1;
    });
    
    const result = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count: count
    }));
    console.log('Statuses data:', result);
    return result;
  } else {
    const signatureStatusCounts: { [key: string]: number } = {};
    signatures.forEach(signature => {
      signatureStatusCounts[signature.status] = (signatureStatusCounts[signature.status] || 0) + 1;
    });
    
    const result = Object.entries(signatureStatusCounts).map(([status, count]) => ({
      name: status,
      count: count
    }));
    console.log('Signature States data:', result);
    return result;
  }
};

// Helper function to parse parties string into array (same as contracts page)
const parseParties = (partiesString: string): string[] => {
  return partiesString.split(' & ').map(party => party.trim());
};

  // Helper function for status badge styling (same as contracts page)
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

  // Helper function for signature status badge styling (same as signatures page)
  const getSignatureStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-800 dark:border-yellow-800';
      case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-800 dark:border-red-800';
      case 'Expired': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      case 'Voided': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
    }
  };

  // Helper function for task status badge styling (same as workflows page)
  const getTaskStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      case 'In Progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-800 dark:border-blue-800';
      case 'In Review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-800 dark:border-yellow-800';
      case 'Done': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
      case 'Blocked': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-800 dark:border-red-800';
      case 'On Hold': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-800 dark:border-orange-800';
      case 'Canceled': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
    }
  };

export default function DashboardPage() {
  const [showNewContractModal, setShowNewContractModal] = React.useState(false);
  const [activeRole, setActiveRole] = React.useState('creator');
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = React.useState<string | null>(null);
  const [contracts, setContracts] = React.useState<Contract[]>(mockContracts);
  const [openRecentlyUpdatedDropdown, setOpenRecentlyUpdatedDropdown] = React.useState(false);
  const [selectedRecentlyUpdated, setSelectedRecentlyUpdated] = React.useState('Last 30 days');
  const recentlyUpdatedDropdownRef = React.useRef<HTMLDivElement>(null);
  const recentlyUpdatedButtonRef = React.useRef<HTMLButtonElement>(null);
  const [chartView, setChartView] = React.useState<'types' | 'statuses' | 'signatureStates'>('statuses');
  const [openBarChartDropdown, setOpenBarChartDropdown] = React.useState(false);
  const [selectedBarChartPeriod, setSelectedBarChartPeriod] = React.useState('Last 30 days');
  const barChartDropdownRef = React.useRef<HTMLDivElement>(null);
  const barChartButtonRef = React.useRef<HTMLButtonElement>(null);
  
  // Completion time dropdown state
  const [selectedCompletionTime, setSelectedCompletionTime] = React.useState('Last 30 days');
  const [openCompletionTimeDropdown, setOpenCompletionTimeDropdown] = React.useState(false);
  const completionTimeButtonRef = React.useRef<HTMLButtonElement>(null);
  const completionTimeDropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Mock completion time trend data - in real app this would come from API
  const [completionTimeTrend, setCompletionTimeTrend] = React.useState<'up' | 'down'>('up');
  
  // Function to update completion time trend based on selected time period
  const updateCompletionTimeTrend = (timePeriod: string) => {
    // Mock logic - in real app this would fetch data and calculate trend
    // For demo purposes, we'll alternate between up/down based on time period
    const isUp = timePeriod.includes('Last') || timePeriod.includes('This');
    setCompletionTimeTrend(isUp ? 'up' : 'down');
  };
  
  // Sorting state variables
  const [idSortDirection, setIdSortDirection] = React.useState<'asc' | 'desc' | null>('asc');
  const [contractSortDirection, setContractSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [partiesSortDirection, setPartiesSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [statusSortDirection, setStatusSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  
  // Signature sorting state variables
  const [signatureIdSortDirection, setSignatureIdSortDirection] = React.useState<'asc' | 'desc' | null>('asc');
  const [signatureDocumentSortDirection, setSignatureDocumentSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [signatureContractIdSortDirection, setSignatureContractIdSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [signatureContractSortDirection, setSignatureContractSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [signatureRecipientsSortDirection, setSignatureRecipientsSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [signatureStatusSortDirection, setSignatureStatusSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [signatureSignaturesSortDirection, setSignatureSignaturesSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [signatureAssigneeSortDirection, setSignatureAssigneeSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  
  // Task sorting state variables
  const [taskIdSortDirection, setTaskIdSortDirection] = React.useState<'asc' | 'desc' | null>('asc');
  const [taskTitleSortDirection, setTaskTitleSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [taskContractIdSortDirection, setTaskContractIdSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [taskContractSortDirection, setTaskContractSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [taskStatusSortDirection, setTaskStatusSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [taskDueDateSortDirection, setTaskDueDateSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [taskSubtasksSortDirection, setTaskSubtasksSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  
  // Expanded parties state
  const [expandedParties, setExpandedParties] = React.useState<Set<string>>(new Set());
  const [expandedRecipients, setExpandedRecipients] = React.useState<Set<string>>(new Set());
  
  // Signatures data state
  const [signaturesData, setSignaturesData] = React.useState<SignatureDocument[]>(mockSignatures);
  
  // Tasks data state
  const { tasks, initializeTasks } = useTaskStore();
  
  // Toast notification system
  const { toast } = useToast();
  
  // Tab state
  const [activeTab, setActiveTab] = React.useState('contracts');
  
  // Tab configuration
  const DASHBOARD_TABS = [
    { key: 'contracts', label: 'Contracts' },
    { key: 'signatureRequests', label: 'Signatures' },
    { key: 'tasks', label: 'Tasks' },
  ];
  
  // Sorting functions (same as contracts page)
  const handleIdSort = () => {
    setIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setContractSortDirection(null);
    setPartiesSortDirection(null);
    setStatusSortDirection(null);
  };

  const handleContractSort = () => {
    setContractSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setIdSortDirection(null);
    setPartiesSortDirection(null);
    setStatusSortDirection(null);
  };

  const handlePartiesSort = () => {
    setPartiesSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setIdSortDirection(null);
    setContractSortDirection(null);
    setStatusSortDirection(null);
  };

  const handleStatusSort = () => {
    setStatusSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setIdSortDirection(null);
    setContractSortDirection(null);
    setPartiesSortDirection(null);
  };

  // Signature sorting functions (same as signatures page)
  const handleSignatureIdSort = () => {
    setSignatureIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureDocumentSortDirection(null);
    setSignatureContractIdSortDirection(null);
    setSignatureContractSortDirection(null);
    setSignatureRecipientsSortDirection(null);
    setSignatureStatusSortDirection(null);
    setSignatureSignaturesSortDirection(null);
    setSignatureAssigneeSortDirection(null);
  };

  const handleSignatureDocumentSort = () => {
    setSignatureDocumentSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureIdSortDirection(null);
    setSignatureContractIdSortDirection(null);
    setSignatureContractSortDirection(null);
    setSignatureRecipientsSortDirection(null);
    setSignatureStatusSortDirection(null);
    setSignatureSignaturesSortDirection(null);
    setSignatureAssigneeSortDirection(null);
  };

  const handleSignatureContractIdSort = () => {
    setSignatureContractIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureIdSortDirection(null);
    setSignatureDocumentSortDirection(null);
    setSignatureContractSortDirection(null);
    setSignatureRecipientsSortDirection(null);
    setSignatureStatusSortDirection(null);
    setSignatureSignaturesSortDirection(null);
    setSignatureAssigneeSortDirection(null);
  };

  const handleSignatureContractSort = () => {
    setSignatureContractSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureIdSortDirection(null);
    setSignatureDocumentSortDirection(null);
    setSignatureContractIdSortDirection(null);
    setSignatureRecipientsSortDirection(null);
    setSignatureStatusSortDirection(null);
    setSignatureSignaturesSortDirection(null);
    setSignatureAssigneeSortDirection(null);
  };

  const handleSignatureRecipientsSort = () => {
    setSignatureRecipientsSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureIdSortDirection(null);
    setSignatureDocumentSortDirection(null);
    setSignatureContractIdSortDirection(null);
    setSignatureContractSortDirection(null);
    setSignatureStatusSortDirection(null);
    setSignatureSignaturesSortDirection(null);
    setSignatureAssigneeSortDirection(null);
  };

  const handleSignatureStatusSort = () => {
    setSignatureStatusSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureIdSortDirection(null);
    setSignatureDocumentSortDirection(null);
    setSignatureContractIdSortDirection(null);
    setSignatureContractSortDirection(null);
    setSignatureRecipientsSortDirection(null);
    setSignatureSignaturesSortDirection(null);
    setSignatureAssigneeSortDirection(null);
  };

  const handleSignatureSignaturesSort = () => {
    setSignatureSignaturesSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureIdSortDirection(null);
    setSignatureDocumentSortDirection(null);
    setSignatureContractIdSortDirection(null);
    setSignatureContractSortDirection(null);
    setSignatureRecipientsSortDirection(null);
    setSignatureStatusSortDirection(null);
    setSignatureAssigneeSortDirection(null);
  };

  const handleSignatureAssigneeSort = () => {
    setSignatureAssigneeSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSignatureIdSortDirection(null);
    setSignatureDocumentSortDirection(null);
    setSignatureContractIdSortDirection(null);
    setSignatureContractSortDirection(null);
    setSignatureRecipientsSortDirection(null);
    setSignatureStatusSortDirection(null);
    setSignatureSignaturesSortDirection(null);
  };

  // Task sorting functions
  const handleTaskIdSort = () => {
    setTaskIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setTaskTitleSortDirection(null);
    setTaskContractIdSortDirection(null);
    setTaskContractSortDirection(null);
    setTaskStatusSortDirection(null);
    setTaskDueDateSortDirection(null);
    setTaskSubtasksSortDirection(null);
  };

  const handleTaskTitleSort = () => {
    setTaskTitleSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setTaskIdSortDirection(null);
    setTaskContractIdSortDirection(null);
    setTaskContractSortDirection(null);
    setTaskStatusSortDirection(null);
    setTaskDueDateSortDirection(null);
    setTaskSubtasksSortDirection(null);
  };

  const handleTaskContractIdSort = () => {
    setTaskContractIdSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setTaskIdSortDirection(null);
    setTaskTitleSortDirection(null);
    setTaskContractSortDirection(null);
    setTaskStatusSortDirection(null);
    setTaskDueDateSortDirection(null);
    setTaskSubtasksSortDirection(null);
  };

  const handleTaskContractSort = () => {
    setTaskContractSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setTaskIdSortDirection(null);
    setTaskTitleSortDirection(null);
    setTaskContractIdSortDirection(null);
    setTaskStatusSortDirection(null);
    setTaskDueDateSortDirection(null);
    setTaskSubtasksSortDirection(null);
  };

  const handleTaskStatusSort = () => {
    setTaskStatusSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setTaskIdSortDirection(null);
    setTaskTitleSortDirection(null);
    setTaskContractIdSortDirection(null);
    setTaskContractSortDirection(null);
    setTaskDueDateSortDirection(null);
    setTaskSubtasksSortDirection(null);
  };

  const handleTaskDueDateSort = () => {
    setTaskDueDateSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setTaskIdSortDirection(null);
    setTaskTitleSortDirection(null);
    setTaskContractIdSortDirection(null);
    setTaskContractSortDirection(null);
    setTaskStatusSortDirection(null);
    setTaskSubtasksSortDirection(null);
  };

  const handleTaskSubtasksSort = () => {
    setTaskSubtasksSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setTaskIdSortDirection(null);
    setTaskTitleSortDirection(null);
    setTaskContractIdSortDirection(null);
    setTaskContractSortDirection(null);
    setTaskStatusSortDirection(null);
    setTaskDueDateSortDirection(null);
  };

  // Handle expanding/collapsing parties
  const handleToggleParties = (contractId: string) => {
    setExpandedParties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contractId)) {
        newSet.delete(contractId);
      } else {
        newSet.add(contractId);
      }
      return newSet;
    });
  };

  // Handle expanding/collapsing recipients
  const handleToggleRecipients = (signatureId: string) => {
    setExpandedRecipients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(signatureId)) {
        newSet.delete(signatureId);
      } else {
        newSet.add(signatureId);
      }
      return newSet;
    });
  };

  // Sort contracts based on current sort direction
  const sortedContracts = [...contracts].sort((a, b) => {
    if (statusSortDirection) {
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

  // Sort signatures based on current sort direction
  const sortedSignatures = [...signaturesData].sort((a, b) => {
    if (signatureAssigneeSortDirection) {
      const aAssignee = a.assignee.toLowerCase();
      const bAssignee = b.assignee.toLowerCase();
      if (signatureAssigneeSortDirection === 'asc') {
        return aAssignee.localeCompare(bAssignee);
      } else {
        return bAssignee.localeCompare(aAssignee);
      }
    } else if (signatureSignaturesSortDirection) {
      const aSignatures = a.signatures.toLowerCase();
      const bSignatures = b.signatures.toLowerCase();
      if (signatureSignaturesSortDirection === 'asc') {
        return aSignatures.localeCompare(bSignatures);
      } else {
        return bSignatures.localeCompare(aSignatures);
      }
    } else if (signatureStatusSortDirection) {
      const aStatus = a.status.toLowerCase();
      const bStatus = b.status.toLowerCase();
      if (signatureStatusSortDirection === 'asc') {
        return aStatus.localeCompare(bStatus);
      } else {
        return bStatus.localeCompare(aStatus);
      }
    } else if (signatureRecipientsSortDirection) {
      const aRecipients = a.parties.join(', ').toLowerCase();
      const bRecipients = b.parties.join(', ').toLowerCase();
      if (signatureRecipientsSortDirection === 'asc') {
        return aRecipients.localeCompare(bRecipients);
      } else {
        return bRecipients.localeCompare(aRecipients);
      }
    } else if (signatureContractSortDirection) {
      const aContract = a.contract.toLowerCase();
      const bContract = b.contract.toLowerCase();
      if (signatureContractSortDirection === 'asc') {
        return aContract.localeCompare(bContract);
      } else {
        return bContract.localeCompare(aContract);
      }
    } else if (signatureContractIdSortDirection) {
      const aContractId = Number(a.contractId);
      const bContractId = Number(b.contractId);
      if (signatureContractIdSortDirection === 'asc') {
        return aContractId - bContractId;
      } else {
        return bContractId - aContractId;
      }
    } else if (signatureDocumentSortDirection) {
      const aDocument = a.document.toLowerCase();
      const bDocument = b.document.toLowerCase();
      if (signatureDocumentSortDirection === 'asc') {
        return aDocument.localeCompare(bDocument);
      } else {
        return bDocument.localeCompare(aDocument);
      }
    } else {
      const aId = Number(a.id);
      const bId = Number(b.id);
      if (signatureIdSortDirection === 'asc') {
        return aId - bId;
      } else {
        return bId - aId;
      }
    }
  });

  // Sort tasks based on current sort direction
  const sortedTasks = [...tasks].sort((a, b) => {
    if (taskSubtasksSortDirection) {
      const aSubtasks = a.subtasks.length;
      const bSubtasks = b.subtasks.length;
      if (taskSubtasksSortDirection === 'asc') {
        return aSubtasks - bSubtasks;
      } else {
        return bSubtasks - aSubtasks;
      }
    } else if (taskDueDateSortDirection) {
      const aDate = new Date(a.due);
      const bDate = new Date(b.due);
      if (taskDueDateSortDirection === 'asc') {
        return aDate.getTime() - bDate.getTime();
      } else {
        return bDate.getTime() - aDate.getTime();
      }
    } else if (taskStatusSortDirection) {
      const aStatus = a.status.toLowerCase();
      const bStatus = b.status.toLowerCase();
      if (taskStatusSortDirection === 'asc') {
        return aStatus.localeCompare(bStatus);
      } else {
        return bStatus.localeCompare(aStatus);
      }
    } else if (taskContractSortDirection) {
      const aContract = mockContracts.find(c => c.id === a.contractId)?.title || '';
      const bContract = mockContracts.find(c => c.id === b.contractId)?.title || '';
      if (taskContractSortDirection === 'asc') {
        return aContract.localeCompare(bContract);
      } else {
        return bContract.localeCompare(aContract);
      }
    } else if (taskContractIdSortDirection) {
      const aContractId = Number(a.contractId);
      const bContractId = Number(b.contractId);
      if (taskContractIdSortDirection === 'asc') {
        return aContractId - bContractId;
      } else {
        return bContractId - aContractId;
      }
    } else if (taskTitleSortDirection) {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      if (taskTitleSortDirection === 'asc') {
        return aTitle.localeCompare(bTitle);
      } else {
        return bTitle.localeCompare(aTitle);
      }
    } else {
      const aId = a.taskNumber;
      const bId = b.taskNumber;
      if (taskIdSortDirection === 'asc') {
        return aId - bId;
      } else {
        return bId - aId;
      }
    }
  });
  
  // Click outside functionality for dropdown
  React.useEffect(() => {
    if (openRecentlyUpdatedDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          recentlyUpdatedDropdownRef.current &&
          !recentlyUpdatedDropdownRef.current.contains(event.target as Node) &&
          recentlyUpdatedButtonRef.current &&
          !recentlyUpdatedButtonRef.current.contains(event.target as Node)
        ) {
          setOpenRecentlyUpdatedDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openRecentlyUpdatedDropdown]);
  
  // Click outside functionality for bar chart dropdown
  React.useEffect(() => {
    if (openBarChartDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          barChartDropdownRef.current &&
          !barChartDropdownRef.current.contains(event.target as Node) &&
          barChartButtonRef.current &&
          !barChartButtonRef.current.contains(event.target as Node)
        ) {
          setOpenBarChartDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openBarChartDropdown]);
  
  // Click outside functionality for completion time dropdown
  React.useEffect(() => {
    if (openCompletionTimeDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          completionTimeDropdownRef.current &&
          !completionTimeDropdownRef.current.contains(event.target as Node) &&
          completionTimeButtonRef.current &&
          !completionTimeButtonRef.current.contains(event.target as Node)
        ) {
          setOpenCompletionTimeDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openCompletionTimeDropdown]);
  
  // Load enhanced contracts (same as contracts page)
  React.useEffect(() => {
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

  // Load enhanced signatures (same as signatures page)
  React.useEffect(() => {
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

  // Initialize tasks (same as workflows page)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTasks();
      console.log('Initialized tasks:', tasks);
    }
  }, []); // Remove initializeTasks from dependencies to prevent infinite loop

  // Listen for new contract creation from modal
  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'newContract' && event.newValue) {
        try {
          const newContract = JSON.parse(event.newValue);
          // Show toast notification
          toast({
            title: "Contract created successfully",
            description: `"${newContract.title}" has been created with ID ${newContract.id}`,
            duration: Infinity, // Make toast persistent - user must close it manually
          });
          // Update contracts list
          setContracts(prev => [newContract, ...prev]);
        } catch (error) {
          console.error('Error parsing new contract from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [toast]);
  
  const chartData = processContractDataForChart(contracts, selectedRecentlyUpdated);
  const currentValue = calculateTotalContractValue(contracts);
  const previousValue = chartData[chartData.length - 8]?.value || 0; // 7 days ago
  const percentageChange = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

  // Debug: Log contract count and total value to verify all contracts are included
  console.log('Dashboard - Total Contracts:', contracts.length);
  console.log('Dashboard - Total Value:', currentValue);
  console.log('Dashboard - Contract Values:', contracts.map(c => ({ id: c.id, title: c.title, value: c.value })));

  // Custom tooltip component for line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-sm font-bold text-primary dark:text-primary">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip component for bar chart
  const BarChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-sm font-bold text-primary dark:text-primary">
            {payload[0].value} {payload[0].value === 1 ? 'contract' : 'contracts'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="space-y-4 cursor-default select-none">
      {/* Dashboard Title and Subtitle Group */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-3 sm:mb-6 cursor-default select-none">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1 cursor-default select-none">
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-0 cursor-default select-none">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0 cursor-default select-none">Overview of your contract closing activities & metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto cursor-default select-none">
          <div className="inline-block rounded-full bg-primary/10 dark:bg-primary/20 px-2 py-0.5 text-primary dark:text-primary font-semibold text-xs border border-primary/20 dark:border-primary/30 self-start sm:self-center cursor-default select-none">
            Logged in as: Creator
          </div>
          <div className="inline-flex self-start sm:self-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-default select-none">
            {['admin', 'creator', 'editor', 'viewer'].map((role, idx, arr) => (
              <button
                key={role}
                className={`px-3 py-1.5 text-xs font-medium transition-colors border-0 ${
                  idx !== 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
                } ${
                  idx === 0 ? 'rounded-l-lg' : ''
                } ${
                  idx === arr.length - 1 ? 'rounded-r-lg' : ''
                } ${
                  activeRole === role
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } cursor-pointer`}
                onClick={() => setActiveRole(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
            onClick={() => setShowNewContractModal(true)}
          >
            <TbFilePlus className="mr-2 text-[22px]" />
            New Contract
          </button>
        </div>
        <NewContractModal isOpen={showNewContractModal} onClose={() => setShowNewContractModal(false)} />
      </div>

      {/* Horizontal line below subtitle */}
      <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:hidden cursor-default select-none">
        {/* Key Metrics Section */}
      <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-300 pt-3 mb-4 cursor-default select-none">KEY METRICS</h2>

      {/* Flex container for the first two metric cards */}
      <div className="flex flex-col md:flex-row gap-4 cursor-default select-none">
        {/* Interactive Total Contract Value Chart - Replacing Total Contracts Box */}
        <Card className="flex flex-col rounded-xl border border-gray-300 dark:border-gray-700 min-h-[375px] w-[600px] bg-white dark:bg-gray-800 p-4 cursor-default select-none">
          <div className="flex items-center justify-between mb-3 cursor-default select-none">
            <div className="flex items-center gap-2 cursor-default select-none">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800 cursor-default select-none">
                <TbBusinessplan size={21} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div className="cursor-default select-none">
                <p className="text-sm text-tertiary dark:text-gray-400 cursor-default select-none font-bold">Total Contract Value</p>
                <p className="text-lg font-bold text-primary dark:text-primary cursor-default select-none">
                  ${hoveredValue ? hoveredValue.toLocaleString() : currentValue.toLocaleString()}
                </p>
                {hoveredDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">{hoveredDate}</p>
                )}
              </div>
            </div>
            <div className="text-right cursor-default select-none">
              <p className={`text-sm flex items-center ${percentageChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} cursor-default select-none`}>
                <FaArrowUp className={`mr-1 ${percentageChange < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(percentageChange).toFixed(1)}% from last week
              </p>
            </div>
          </div>
          
          {/* Time Filter Dropdown */}
          <div className="relative mb-3 cursor-default select-none">
            <button
              ref={recentlyUpdatedButtonRef}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => setOpenRecentlyUpdatedDropdown(!openRecentlyUpdatedDropdown)}
            >
              <span>{selectedRecentlyUpdated}</span>
                              <TbChevronDown className="text-gray-400 dark:text-gray-500" size={18} />
            </button>
            {openRecentlyUpdatedDropdown && (
              <div 
                ref={recentlyUpdatedDropdownRef}
                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 cursor-default select-none"
              >
                {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'This quarter', 'Last quarter', 'Last 6 months', 'Last year', 'Last 2 years'].map((option) => (
                  <button
                    key={option}
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer ${selectedRecentlyUpdated === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={() => setSelectedRecentlyUpdated(option)}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-default select-none">
                      {selectedRecentlyUpdated === option && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center cursor-default select-none">
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
          
          {/* Interactive Line Chart */}
          <div className="flex-1 min-h-[200px] -mx-6 -mb-6 cursor-default select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                onMouseMove={(data: any) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    setHoveredValue(data.activePayload[0].value);
                    setHoveredDate(data.activePayload[0].payload.fullDate);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredValue(null);
                  setHoveredDate(null);
                }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23B5B5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#23B5B5" stopOpacity={0.25}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#6B7280', fontWeight: '900' }}
                  interval={0}
                  dy={6}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  hide={true}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#23B5B5"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={false}
                  activeDot={{ r: 4, stroke: '#23B5B5', strokeWidth: 2, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Contract Analytics Bar Chart */}
        <Card className="flex flex-1 flex-col rounded-xl border border-gray-300 dark:border-gray-700 min-h-[400px] min-w-0 bg-white dark:bg-gray-800 p-4 pb-2 cursor-default select-none">
          <div className="flex items-center justify-between mb-4 cursor-default select-none">
            {/* Time Filter Dropdown */}
            <div className="relative cursor-default select-none">
              <button
                ref={barChartButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setOpenBarChartDropdown(!openBarChartDropdown)}
              >
                <span>{selectedBarChartPeriod}</span>
                <TbChevronDown className="text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {openBarChartDropdown && (
                <div 
                  ref={barChartDropdownRef}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 cursor-default select-none"
                >
                  {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last month', 'This quarter', 'Last quarter', 'Last 6 months', 'Last year', 'Last 2 years'].map((option) => (
                    <button
                      key={option}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer ${selectedBarChartPeriod === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={() => setSelectedBarChartPeriod(option)}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-default select-none">
                        {selectedBarChartPeriod === option && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center cursor-default select-none">
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
            
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border-2 border-gray-200 dark:border-gray-600 cursor-default select-none">
              <button
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  chartView === 'types' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setChartView('types')}
              >
                Contract Types
              </button>
              <button
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  chartView === 'statuses' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setChartView('statuses')}
              >
                Contract Status
              </button>
              <button
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  chartView === 'signatureStates' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setChartView('signatureStates')}
              >
                Signature Status
              </button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[370px] pb-2.5 cursor-default select-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processContractDataForBarChart(contracts, signaturesData, chartView)}
                margin={{ top: 20, right: 30, left: -20, bottom: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                  dy={3}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                />
                <Tooltip content={<BarChartTooltip />} cursor={false} />
                <Bar dataKey="count" fill="#23B5B5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Metric Cards Grid - Remaining Cards */}
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-4 cursor-default select-none" style={{ gridTemplateRows: 'minmax(0, 120px)' }}>
        {/* Metric Card 2: Total Contracts */}
        <Card className="flex items-center gap-4 rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800 p-6 cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800 cursor-default select-none">
            <TbFileText size={21} className="text-teal-500 dark:text-teal-400" />
          </div>
          <div className="flex flex-col items-start cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Total Contracts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{contracts.length}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">Active contracts</p>
          </div>
        </Card>

        {/* Metric Card 4: Average Completion Time */}
        <Card className="flex items-center gap-4 rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800 p-6 cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800 cursor-default select-none">
            {completionTimeTrend === 'up' ? (
              <TbClockUp size={21} className="text-blue-500 dark:text-blue-400" />
            ) : (
                              <TbClockDown size={21} className="text-blue-500 dark:text-blue-400" />
            )}
          </div>
          <div className="flex flex-col items-start cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Average Completion Time</p>
            <div className="flex items-center gap-2 cursor-default select-none">
              <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">3.2 days</p>
              <span className={`text-xs font-semibold ${completionTimeTrend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} cursor-default select-none`}>
                {completionTimeTrend === 'up' ? '↑' : '↓'}
              </span>
            </div>
            <div className="relative cursor-default select-none">
              <button
                ref={completionTimeButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setOpenCompletionTimeDropdown(!openCompletionTimeDropdown)}
              >
                <span>{selectedCompletionTime}</span>
                <TbChevronDown className="text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {openCompletionTimeDropdown && (
                <div 
                  ref={completionTimeDropdownRef}
                  className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1 cursor-default select-none"
                >
                  {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last month', 'This quarter', 'Last quarter', 'Last 6 months', 'Last year', 'Last 2 years'].map((option) => (
                    <button
                      key={option}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer ${selectedCompletionTime === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={() => {
                      setSelectedCompletionTime(option);
                      updateCompletionTimeTrend(option);
                    }}
                    >
                      <div className="w-3 h-3 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-default select-none">
                        {selectedCompletionTime === option && (
                          <div className="w-2 h-2 bg-primary rounded-sm flex items-center justify-center cursor-default select-none">
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
        </Card>

        {/* Metric Card 5: Pending Signatures */}
        <Card className="flex items-center gap-4 rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800 p-6 cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-200 dark:border-purple-800 cursor-default select-none">
            <TbClockEdit size={21} className="text-purple-500 dark:text-purple-400" />
          </div>
          <div className="flex flex-col items-start cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending Signatures</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">2</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">Requires action</p>
          </div>
        </Card>

        {/* Metric Card 6: Wire Transfers Pending */}
        <Card className="flex items-center gap-4 rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800 p-6 cursor-default select-none">
          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-200 dark:border-green-800 cursor-default select-none">
            <TbArrowsExchange size={21} className="text-green-500 dark:text-green-400" />
          </div>
          <div className="flex flex-col items-start cursor-default select-none">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Wire Transfers Pending</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">3</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">Awaiting transfer</p>
          </div>
        </Card>
      </div>

      <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

      {/* Recent Activity Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 md:gap-0 cursor-default select-none">
        <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-300 cursor-default select-none">RECENT ACTIVITY</h2>
        <Link href="/contracts" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}>
          View All
        </Link>
      </div>

      <Card className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-800 cursor-default select-none">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 md:gap-0 min-w-0 cursor-default select-none">
                          <h3 className="text-sm font-semibold text-tertiary dark:text-gray-400 cursor-default select-none">Activity Timeline</h3>
        </div>
        {/* Activity Timeline Entries */}
        <div className="relative pl-6 min-w-0 cursor-default select-none">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600 z-0 cursor-default select-none"></div>
          <div className="space-y-4 cursor-default select-none">
            {/* Timeline entries will go here */}
            <div className="flex items-center cursor-default select-none">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6 cursor-default select-none">
                {React.createElement(FaCheckCircle, { className: "text-green-500 dark:text-green-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1 cursor-default select-none">
                <p className="text-sm text-gray-700 dark:text-gray-300 cursor-default select-none"><span className="font-semibold">Contract #8423</span> moved to 'Wire Details'</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">May 18, 2025 · 14:32</p>
              </div>
            </div>

            <div className="flex items-center cursor-default select-none">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6 cursor-default select-none">
                {React.createElement(LuPen, { className: "text-blue-500 dark:text-blue-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1 cursor-default select-none">
                <p className="text-sm text-gray-700 dark:text-gray-300 cursor-default select-none"><span className="font-semibold">Sarah Johnson</span> signed Contract #9102</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">May 18, 2025 · 10:15</p>
              </div>
            </div>

            <div className="flex items-center cursor-default select-none">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6 cursor-default select-none">
                {React.createElement(FaBox, { className: "text-purple-500 dark:text-purple-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1 cursor-default select-none">
                <p className="text-sm text-gray-700 dark:text-gray-300 cursor-default select-none">Wire transfer of <span className="font-semibold">$42,500</span> received for <span className="text-teal-600 dark:text-teal-400 font-semibold">#7650</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">May 17, 2025 · 16:48</p>
              </div>
            </div>

            <div className="flex items-center cursor-default select-none">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6 cursor-default select-none">
                {React.createElement(FaFileContract, { className: "text-orange-500 dark:text-orange-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1 cursor-default select-none">
                <p className="text-sm text-gray-700 dark:text-gray-300 cursor-default select-none"><span className="font-semibold">Contract #8901</span> created</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">May 17, 2025 · 11:20</p>
              </div>
            </div>

            <div className="flex items-center cursor-default select-none">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6 cursor-default select-none">
                {React.createElement(FaChartLine, { className: "text-red-500 dark:text-red-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1 cursor-default select-none">
                <p className="text-sm text-gray-700 dark:text-gray-300 cursor-default select-none">Inspection completed for <span className="font-semibold">Contract #8423</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">May 16, 2025 · 15:05</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contracts/Signatures in Progress Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-6 mb-4 gap-4 md:gap-0 cursor-default select-none">
        <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-300 cursor-default select-none">
          {activeTab === 'contracts' ? 'CONTRACTS IN PROGRESS' : activeTab === 'signatureRequests' ? 'SIGNATURES IN PROGRESS' : 'TASKS IN PROGRESS'}
        </h2>
        {/* View All Button */}
        {activeTab === 'contracts' && (
          <Link href="/contracts" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}>
            View All Contracts
          </Link>
        )}
        {activeTab === 'signatureRequests' && (
          <Link href="/signatures" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}>
            View All Signatures
          </Link>
        )}
        {activeTab === 'tasks' && (
          <Link href="/workflows" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}>
            View All Tasks
          </Link>
        )}
      </div>

      {/* Active Contracts Table */}
      <Card className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden cursor-default select-none">
        {/* Tabs Row with Divider */}
        <div className="border-b border-gray-200 dark:border-gray-700 cursor-default select-none">
          <div className="flex space-x-4 overflow-x-auto w-full cursor-default select-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 cursor-pointer ${
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
        </div>
        
        {/* Tab Content */}
        {activeTab === 'contracts' && (
          <div style={{ height: '300px' }} className="relative overflow-x-auto overflow-y-auto mt-4 pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 cursor-default select-none">
              <thead className="cursor-default select-none">
                <tr className="cursor-default select-none">
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleIdSort}
                  >
                    Contract ID
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
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleStatusSort}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 cursor-default select-none">
                {sortedContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-primary underline font-semibold cursor-pointer">{contract.id}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm cursor-default select-none">
                      <div className="text-xs font-bold text-gray-900 dark:text-white cursor-default select-none">{contract.title}</div>
                    </td>
                    <td className="px-6 py-2.5 text-xs cursor-default select-none">
                      {(() => {
                        const parties = parseParties(contract.parties);
                        const isExpanded = expandedParties.has(contract.id);
                        
                        return (
                          <div className="flex flex-col space-y-1 cursor-default select-none">
                            {/* Show parties based on expanded state */}
                            {parties.slice(0, isExpanded ? parties.length : 2).map((party, index) => (
                              <div key={index} className="text-gray-900 dark:text-white cursor-default select-none">{party}</div>
                            ))}
                            
                            {/* Show expand/collapse button if more than 2 parties */}
                            {parties.length > 2 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleParties(contract.id);
                                }}
                                className="text-primary hover:text-primary-dark text-xs font-medium cursor-pointer transition-colors text-left"
                              >
                                {isExpanded ? 'Show less' : `+${parties.length - 2} more`}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getStatusBadgeStyle(contract.status)} cursor-default select-none`}
                        style={{ minWidth: '7rem', display: 'inline-flex', borderWidth: '1px' }}>{contract.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'signatureRequests' && (
          <div style={{ height: '300px' }} className="relative overflow-x-auto overflow-y-auto mt-4 pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 cursor-default select-none">
              <thead className="cursor-default select-none">
                <tr className="cursor-default select-none">
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureIdSort}
                  >
                    Document ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureDocumentSort}
                  >
                    Document
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureContractIdSort}
                  >
                    Contract ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureContractSort}
                  >
                    Contract
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureRecipientsSort}
                  >
                    Recipients
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureStatusSort}
                  >
                    Status
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureSignaturesSort}
                  >
                    Signatures
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleSignatureAssigneeSort}
                  >
                    Assignee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 cursor-default select-none">
                {sortedSignatures.map((signature) => (
                  <tr
                    key={signature.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-primary underline font-semibold cursor-pointer">{signature.id}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm cursor-default select-none">
                      <div className="text-xs font-bold text-gray-900 dark:text-white cursor-default select-none">{signature.document}</div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-primary underline font-semibold cursor-pointer">{signature.contractId}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm cursor-default select-none">
                      <div className="text-xs font-bold text-gray-900 dark:text-white cursor-default select-none">{signature.contract}</div>
                    </td>
                    <td className="px-6 py-2.5 text-xs cursor-default select-none">
                      <div className="flex flex-col space-y-1 cursor-default select-none">
                        {/* Show recipients based on expanded state */}
                        {(() => {
                          const isExpanded = expandedRecipients.has(signature.id);
                          return signature.parties.slice(0, isExpanded ? signature.parties.length : 2).map((party, index) => (
                            <div key={index} className="text-gray-900 dark:text-white cursor-default select-none">{party}</div>
                          ));
                        })()}
                        
                        {/* Show expand/collapse button if more than 2 recipients */}
                        {signature.parties.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRecipients(signature.id);
                            }}
                            className="text-primary hover:text-primary-dark text-xs font-medium cursor-pointer transition-colors text-left"
                          >
                            {expandedRecipients.has(signature.id) ? 'Show less' : `+${signature.parties.length - 2} more`}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getSignatureStatusBadgeStyle(signature.status)} cursor-default select-none`}
                        style={{ minWidth: '7rem', display: 'inline-flex', borderWidth: '1px' }}>{signature.status}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-gray-900 dark:text-white font-semibold cursor-default select-none">{signature.signatures}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm cursor-default select-none">
                      <div className="text-xs text-gray-900 dark:text-white cursor-default select-none">{signature.assignee}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div style={{ height: '300px' }} className="relative overflow-x-auto overflow-y-auto mt-4 pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 cursor-default select-none">
              <thead className="cursor-default select-none">
                <tr className="cursor-default select-none">
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleTaskIdSort}
                  >
                    Task ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleTaskTitleSort}
                  >
                    Task
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleTaskContractIdSort}
                  >
                    Contract ID
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleTaskContractSort}
                  >
                    Contract
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleTaskStatusSort}
                  >
                    Status
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleTaskDueDateSort}
                  >
                    Due Date
                  </th>
                  <th 
                    className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={handleTaskSubtasksSort}
                  >
                    Subtasks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 cursor-default select-none">
                {sortedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-primary underline font-semibold cursor-pointer">{task.taskNumber}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm cursor-default select-none">
                      <div className="text-xs font-bold text-gray-900 dark:text-white cursor-default select-none">{task.title}</div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-primary underline font-semibold cursor-pointer">{task.contractId}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm cursor-default select-none">
                      <div className="text-xs font-bold text-gray-900 dark:text-white cursor-default select-none">
                        {mockContracts.find(c => c.id === task.contractId)?.title || 'Unknown Contract'}
                      </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getTaskStatusBadgeStyle(task.status)} cursor-default select-none`}
                        style={{ minWidth: '7rem', display: 'inline-flex', borderWidth: '1px' }}>{task.status}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-gray-900 dark:text-white font-semibold cursor-default select-none">{(() => {
                        if (!task.due) return '';
                        const d = new Date(task.due);
                        if (isNaN(d.getTime())) return task.due;
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      })()}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs cursor-default select-none">
                      <span className="text-gray-900 dark:text-white font-semibold cursor-default select-none">{task.subtasks.length}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Placeholder for other dashboard sections */}

      </div>
    </div>
    <Toaster />
    </>
  );
} 