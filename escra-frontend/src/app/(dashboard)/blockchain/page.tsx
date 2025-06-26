'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { FaPlus, FaCopy, FaWallet, FaNetworkWired, FaBook, FaExternalLinkAlt, FaCogs, FaArrowRight, FaSearch, FaCheck } from 'react-icons/fa';
import { FaTimeline, FaFaucetDrip, FaRegSquareCheck } from 'react-icons/fa6';
import { HiOutlineExternalLink, HiOutlineBookOpen, HiOutlineDuplicate, HiOutlineViewBoards, HiOutlineDocumentSearch, HiOutlineDocumentText } from 'react-icons/hi';
import { HiMiniChevronDown } from 'react-icons/hi2';
import { FaRegCalendarAlt, FaRegCheckCircle, FaRegFileAlt, FaCodeBranch, FaHashtag, FaCoins } from 'react-icons/fa';
import { GrMoney } from 'react-icons/gr';
import { Logo } from '@/components/common/Logo';
import NewContractModal from '@/components/common/NewContractModal';
import { MdOutlineAddToPhotos, MdOutlineUpdate } from 'react-icons/md';
import { mockContracts } from '@/data/mockContracts';
import Image from 'next/image';
import { LuSquareArrowOutUpRight, LuFileTerminal } from 'react-icons/lu';
import { TbClockPin, TbShieldLock, TbDropletFilled } from 'react-icons/tb';
import { CgTerminal } from 'react-icons/cg';

const BLOCK_HASH = "0x7ad9e3b8f2c1a4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9";
const PROPOSER_HASH = "0xabc1234def5678fedcba9876543210abcdef1234567890fedcba0987654321ab";

// Helper function to generate contract hash
const getContractHash = (id: string) => `0x${id}${'0'.repeat(66 - 2 - id.length)}`;

// Helper function for status badge styling (from contract details modal)
const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'Initiation': return 'bg-blue-100 text-blue-700 border border-blue-500';
    case 'Preparation': return 'bg-gray-100 text-gray-700 border border-gray-400';
    case 'In Review': return 'bg-yellow-100 text-yellow-700 border border-yellow-500';
    case 'Wire Details': return 'bg-orange-100 text-orange-700 border border-orange-400';
    case 'Signatures': return 'bg-purple-100 text-purple-700 border border-purple-500';
    case 'Funds Disbursed': return 'bg-teal-100 text-teal-700 border border-teal-500';
    case 'Complete': return 'bg-green-100 text-green-700 border border-green-500';
    case 'Verified': return 'bg-green-100 text-green-700 border border-green-500';
    case 'Pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-500';
    case 'Rejected': return 'bg-red-100 text-red-700 border border-red-500';
    default: return 'bg-gray-100 text-gray-700 border border-gray-400';
  }
};

const contracts = mockContracts.map(contract => ({
  title: contract.title,
  version: 'v1.0.0',
  badges: [
    { label: contract.status === 'Complete' ? 'MainNet' : 'TestNet', color: contract.status === 'Complete' ? 'bg-green-100 text-green-700 border border-green-500' : 'bg-gray-100 text-gray-700 border border-gray-400' },
    { 
      label: contract.status, 
      color: (() => {
        switch (contract.status) {
          case 'Initiation': return 'bg-blue-100 text-blue-700 border border-blue-500';
          case 'Preparation': return 'bg-gray-100 text-gray-700 border border-gray-400';
          case 'In Review': return 'bg-yellow-100 text-yellow-700 border border-yellow-500';
          case 'Wire Details': return 'bg-orange-100 text-orange-700 border border-orange-400';
          case 'Signatures': return 'bg-purple-100 text-purple-700 border border-purple-500';
          case 'Funds Disbursed': return 'bg-teal-100 text-teal-700 border border-teal-500';
          case 'Complete': return 'bg-green-100 text-green-700 border border-green-500';
          case 'Verified': return 'bg-green-100 text-green-700 border border-green-500';
          case 'Pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-500';
          case 'Rejected': return 'bg-red-100 text-red-700 border border-red-500';
          default: return 'bg-gray-100 text-gray-700 border border-gray-400';
        }
      })()
    },
  ],
  id: contract.id,
  description: `${contract.type} contract between ${contract.parties}`,
  deployed: contract.updated,
  transactions: Math.floor(Math.random() * 200) + 20, // Random number between 20 and 220 for demo
  status: contract.status,
}));

const activityData = [
  {
    type: 'Milestone Completed',
    icon: <FaRegSquareCheck size={18} color="#22c55e" />,
    description: 'Document Review milestone completed for Contract #8423',
    txHash: '0x7ad9e3b...',
    block: '#15283674',
    contractId: 'CTR–8423',
    timestamp: '20,',
    date: 'May',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
  },
  {
    type: 'Document Signed',
    icon: <HiOutlineDocumentText size={18} color="#3b82f6" />,
    description: 'Purchase Agreement signed by John Smith for Contract #7612',
    txHash: '0x4fc8d2a...',
    block: '#15283545',
    contractId: 'CTR–7612',
    timestamp: '20,',
    date: 'May',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
  {
    type: 'Smart Contract Deployed',
    icon: <FaCodeBranch size={18} color="#8b5cf6" />,
    description: 'Oracle Integration contract deployed to TestNet',
    txHash: '0x9be31c5...',
    block: '#15283213',
    contractId: '0x1b4d8...',
    timestamp: '20,',
    date: 'May',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
  },
  {
    type: 'Document Hash Registered',
    icon: <FaHashtag size={18} color="#06b6d4" />,
    description: 'Lease Agreement hash registered for Contract #9145',
    txHash: '0x2ea9f1b...',
    block: '#15282789',
    contractId: 'CTR–9145',
    timestamp: '19,',
    date: 'May',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-200',
  },
  {
    type: 'Escrow Payment Released',
    icon: <GrMoney size={18} color="#f97316" />,
    description: 'Final payment released for Contract #3219',
    txHash: '0x8d4f2e3...',
    block: '#15281952',
    contractId: 'CTR–3219',
    timestamp: '19,',
    date: 'May',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
  },
];

// Available statuses for filtering
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

// Available activity types for filtering
const availableActivityTypes = [
  'All',
  'Milestone Completed',
  'Document Signed',
  'Smart Contract Deployed',
  'Document Hash Registered',
  'Escrow Payment Released'
];

export default function BlockchainPage() {
  const [activeTab, setActiveTab] = useState('smart-contracts');
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [copiedContractId, setCopiedContractId] = useState<string | null>(null);
  const [hoveredContractId, setHoveredContractId] = useState<string | null>(null);
  const [selectedSmartContract, setSelectedSmartContract] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [transactionsTab, setTransactionsTab] = useState('table');
  const [actionsTab, setActionsTab] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionsCurrentPage, setActionsCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [actionsRowsPerPage, setActionsRowsPerPage] = useState(5);
  
  // Mock transaction data
  const transactionData = [
    {
      id: 'DLH04MH...',
      groupId: '1nlgJou...',
      from: 'WARN_SCAM',
      to: '1284326447',
      type: 'Application Call',
      amount: '0.000013',
      fee: '0'
    },
    {
      id: '4U0HG7Q...',
      groupId: '1nlgJou...',
      from: 'WARN_SCAM',
      to: 'KKGU_UZBI',
      type: 'Payment',
      amount: '0.000013',
      fee: '0'
    },
    {
      id: '7AD9E3B...',
      groupId: '2mkgKpv...',
      from: 'ESCRA_WALLET',
      to: 'CONTRACT_123',
      type: 'Application Call',
      amount: '0.000001',
      fee: '0.001'
    },
    {
      id: '9BE31C5...',
      groupId: '3plhLqw...',
      from: 'USER_456',
      to: 'ESCRA_WALLET',
      type: 'Payment',
      amount: '1.500000',
      fee: '0.001'
    },
    {
      id: '2EA9F1B...',
      groupId: '4qlmMrx...',
      from: 'CONTRACT_789',
      to: 'USER_123',
      type: 'Application Call',
      amount: '0.000005',
      fee: '0'
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(transactionData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTransactions = transactionData.slice(startIndex, endIndex);

  // Calculate Actions pagination
  const actionsTotalPages = Math.ceil(transactionData.length / actionsRowsPerPage);
  const actionsStartIndex = (actionsCurrentPage - 1) * actionsRowsPerPage;
  const actionsEndIndex = actionsStartIndex + actionsRowsPerPage;
  const currentActions = transactionData.slice(actionsStartIndex, actionsEndIndex);

  // Get type badge style
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Application Call': return 'bg-blue-100 text-blue-700 border border-blue-500';
      case 'Payment': return 'bg-orange-100 text-orange-700 border border-orange-500';
      default: return 'bg-gray-100 text-gray-700 border border-gray-400';
    }
  };
  
  // Search and filter state for Smart Contracts tab
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['All']);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [openContractDropdown, setOpenContractDropdown] = useState(false);
  const [contractSearch, setContractSearch] = useState('');
  const statusDropdownRef = useRef<HTMLButtonElement>(null);
  const contractButtonRef = useRef<HTMLButtonElement>(null);

  // Search and filter state for On-chain Activity tab
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>(['All']);
  const [showActivityTypeDropdown, setShowActivityTypeDropdown] = useState(false);
  const [selectedActivityContracts, setSelectedActivityContracts] = useState<string[]>([]);
  const [openActivityContractDropdown, setOpenActivityContractDropdown] = useState(false);
  const [activityContractSearch, setActivityContractSearch] = useState('');
  const activityTypeDropdownRef = useRef<HTMLButtonElement>(null);
  const activityContractButtonRef = useRef<HTMLButtonElement>(null);

  // Filter contracts based on search term and selected statuses
  const filteredContracts = contracts.filter(contract => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      contract.title.toLowerCase().includes(search) ||
      contract.description.toLowerCase().includes(search) ||
      contract.id.toLowerCase().includes(search)
    );
    const matchesStatus = selectedStatuses.includes('All') || selectedStatuses.includes(contract.status);
    const matchesContract = selectedContracts.length === 0 || selectedContracts.includes(contract.id);
    return matchesSearch && matchesStatus && matchesContract;
  });

  // Filter activity data based on search term and selected types
  const filteredActivityData = activityData.filter(activity => {
    const search = activitySearchTerm.toLowerCase();
    const matchesSearch = (
      activity.type.toLowerCase().includes(search) ||
      activity.description.toLowerCase().includes(search) ||
      activity.txHash.toLowerCase().includes(search) ||
      activity.contractId.toLowerCase().includes(search)
    );
    const matchesType = selectedActivityTypes.includes('All') || selectedActivityTypes.includes(activity.type);
    const matchesContract = selectedActivityContracts.length === 0 || selectedActivityContracts.includes(activity.contractId);
    return matchesSearch && matchesType && matchesContract;
  });

  // Handle click outside for Smart Contracts tab dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.status-filter-dropdown');
      const button = statusDropdownRef.current;

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

  // Handle click outside for On-chain Activity tab dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.activity-type-dropdown');
      const button = activityTypeDropdownRef.current;

      if (showActivityTypeDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setShowActivityTypeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActivityTypeDropdown]);

  // Add click-outside handler for Smart Contracts tab contract dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.contract-dropdown');
      const button = contractButtonRef.current;

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

  // Add click-outside handler for On-chain Activity tab contract dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.activity-contract-dropdown');
      const button = activityContractButtonRef.current;

      if (openActivityContractDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setOpenActivityContractDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActivityContractDropdown]);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <div className="pb-1">
          <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-0">Blockchain</h1>
          <p className="text-gray-500 text-[15px] md:text-[16px] mt-0">Review your smart contracts, on-chain activity & explorer integrations</p>
        </div>
        <button
          className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
          onClick={() => setShowNewContractModal(true)}
        >
          <MdOutlineAddToPhotos className="mr-2 text-lg" />
          New Contract
        </button>
        <NewContractModal isOpen={showNewContractModal} onClose={() => setShowNewContractModal(false)} />
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Toggle Bar */}
      <div className="flex gap-1">
        {[
          { key: 'smart-contracts', label: 'Smart Contracts' },
          { key: 'on-chain-activity', label: 'On-Chain Activity' },
          { key: 'explorers', label: 'Explorers' },
          { key: 'tokens', label: 'Tokens' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
              activeTab === tab.key 
                ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[130px] border-2 border-gray-200 dark:border-gray-700' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className={`inline-block transition-all duration-300 ${activeTab === tab.key ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === tab.key ? 16 : 0}}>
              {activeTab === tab.key && <Logo width={16} height={16} className="pointer-events-none" />}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'smart-contracts' && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full">
            <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 min-w-0">
              <FaSearch className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search contracts, parties, or IDs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              />
            </div>
            <div className="relative ml-1">
              <button
                ref={statusDropdownRef}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowStatusDropdown(prev => !prev);
                  if (!showStatusDropdown) {
                    setOpenContractDropdown(false);
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
                        setSelectedStatuses(prev => {
                          const newStatuses = prev.filter(s => s !== 'All');
                          if (prev.includes(status)) {
                            return newStatuses.filter(s => s !== status);
                          } else {
                            return [...newStatuses, status];
                          }
                        });
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
            <div className="relative ml-1">
              <button
                ref={contractButtonRef}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenContractDropdown(prev => !prev);
                  if (!openContractDropdown) {
                    setShowStatusDropdown(false);
                  }
                }}
              >
                <HiOutlineDocumentSearch className="text-gray-400 w-4 h-4" />
                <span>Contract</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
              {openContractDropdown && (
                <div 
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 min-w-[400px] w-96 contract-dropdown" 
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[calc(4*(240px+1rem))] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredContracts.map((contract, idx) => (
              <Card 
                key={idx} 
                className="rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedSmartContract(contract)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-black truncate" style={{ fontFamily: 'Avenir, sans-serif' }}>{contract.title}</h3>
                      <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0" style={{ fontFamily: 'Avenir, sans-serif' }}>{contract.version}</span>
                    </div>
                    <div className="flex flex-wrap mt-2">
                      {contract.badges.map((badge, i) => (
                        <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded border ${i > 0 ? 'ml-1' : ''} ${badge.color}`} style={{ fontFamily: 'Avenir, sans-serif' }}>{badge.label}</span>
                      ))}
                    </div>
                  </div>
                  <Image
                    src="/assets/algorand_logo_mark_black.png"
                    alt="Algorand"
                    width={40}
                    height={40}
                    className="opacity-75 -mt-1 flex-shrink-0"
                  />
                </div>
                <div className="flex items-center">
                  <span
                    className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                    style={{ maxWidth: '100px' }}
                    title={getContractHash(contract.id)}
                  >
                    0x{contract.id}...{contract.id.slice(-4)}
                  </span>
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(getContractHash(contract.id));
                        setCopiedContractId(contract.id);
                        setTimeout(() => setCopiedContractId(null), 1500);
                      }}
                      onMouseEnter={() => setHoveredContractId(contract.id)}
                      onMouseLeave={() => setHoveredContractId(null)}
                      aria-label="Copy contract hash"
                    >
                      <HiOutlineDuplicate className="w-4 h-4" />
                    </button>
                    {copiedContractId === contract.id && (
                      <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        Copied!
                      </div>
                    )}
                    {hoveredContractId === contract.id && copiedContractId !== contract.id && (
                      <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        Copy
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[12px] text-gray-600 mb-3 truncate italic" style={{ fontFamily: 'Avenir, sans-serif' }} title={contract.description}>{contract.description}</p>
                <div className="flex items-center text-[11px] text-gray-500 mb-2" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  <span className="mr-4 flex items-center truncate"><MdOutlineUpdate className="mr-1 text-gray-400 flex-shrink-0 text-base" />Last Updated: {contract.deployed}</span>
                  <span className="flex items-center truncate"><FaTimeline className="mr-1 text-gray-400 flex-shrink-0 text-base" />{contract.transactions} Transactions</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                  <button className="text-gray-700 hover:text-teal-600 flex items-center text-[10px] font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}><span className="mr-1">&gt;_</span>Functions</button>
                  <a href="#" className="text-teal-600 hover:underline flex items-center text-[10px] font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>View Details <LuSquareArrowOutUpRight className="ml-1 text-sm" /></a>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
      {activeTab === 'on-chain-activity' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full">
            <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 min-w-0">
              <FaSearch className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search transactions, descriptions, or IDs"
                value={activitySearchTerm}
                onChange={(e) => setActivitySearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              />
            </div>
            <div className="relative ml-1">
              <button
                ref={activityTypeDropdownRef}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowActivityTypeDropdown(prev => !prev);
                  if (!showActivityTypeDropdown) {
                    setOpenActivityContractDropdown(false);
                  }
                }}
              >
                <HiOutlineViewBoards className="text-gray-400 w-4 h-4" />
                <span>Type</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
              {showActivityTypeDropdown && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 activity-type-dropdown" 
                  style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
                >
                  <button
                    className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                    onClick={() => setSelectedActivityTypes(['All'])}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedActivityTypes.includes('All') && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  {availableActivityTypes.filter(type => type !== 'All').map(type => (
                    <button
                      key={type}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedActivityTypes(prev => {
                          const newTypes = prev.filter(t => t !== 'All');
                          if (prev.includes(type)) {
                            return newTypes.filter(t => t !== type);
                          } else {
                            return [...newTypes, type];
                          }
                        });
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedActivityTypes.includes(type) && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative ml-1">
              <button
                ref={activityContractButtonRef}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenActivityContractDropdown(prev => !prev);
                  if (!openActivityContractDropdown) {
                    setShowActivityTypeDropdown(false);
                  }
                }}
              >
                <HiOutlineDocumentSearch className="text-gray-400 w-4 h-4" />
                <span>Contract</span>
                <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
              </button>
              {openActivityContractDropdown && (
                <div 
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 min-w-[400px] w-96 activity-contract-dropdown" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search Bar */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search contracts..."
                        value={activityContractSearch}
                        onChange={(e) => setActivityContractSearch(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                      <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center"
                    onClick={() => setSelectedActivityContracts([])}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedActivityContracts.length === 0 && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  {mockContracts
                    .filter(contract => 
                      contract.id.toLowerCase().includes(activityContractSearch.toLowerCase()) ||
                      contract.title.toLowerCase().includes(activityContractSearch.toLowerCase())
                    )
                    .map(contract => (
                      <button
                        key={contract.id}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center whitespace-nowrap truncate"
                        onClick={() => {
                          setSelectedActivityContracts(prev => {
                            if (prev.includes(String(contract.id))) {
                              return prev.filter(c => c !== String(contract.id));
                            } else {
                              return [...prev, String(contract.id)];
                            }
                          });
                        }}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                          {selectedActivityContracts.includes(String(contract.id)) && (
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
          </div>
          <div className="space-y-4">
            {filteredActivityData.map((activity, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm flex p-4 items-start relative cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedActivity(activity)}>
                {/* Timeline Icon */}
                <div className="flex flex-col items-center mr-4">
                  <div className={`h-10 w-10 rounded-lg ${activity.bgColor} flex items-center justify-center border-2 ${activity.borderColor}`} style={{marginTop: 2}}>
                    {activity.icon}
                  </div>
                </div>
                {/* Card Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-black mb-0.5" style={{ fontFamily: 'Avenir, sans-serif' }}>{activity.type}</h3>
                      <p className="text-[12px] text-gray-600 mb-1 italic" style={{ fontFamily: 'Avenir, sans-serif' }}>{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end text-[11px] text-gray-500 font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <span>{activity.date}</span>
                      <span><svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg></span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium mb-0.5" style={{ fontFamily: 'Avenir, sans-serif' }}>Action ID</div>
                      <div className="flex items-center">
                        <span
                          className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                          style={{ maxWidth: '100px' }}
                          title={activity.txHash}
                        >
                          {activity.txHash}
                        </span>
                        <div className="relative flex-shrink-0">
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(activity.txHash);
                              setCopiedContractId(activity.txHash);
                              setTimeout(() => setCopiedContractId(null), 1500);
                            }}
                            onMouseEnter={() => setHoveredContractId(activity.txHash)}
                            onMouseLeave={() => setHoveredContractId(null)}
                            aria-label="Copy action ID"
                          >
                            <HiOutlineDuplicate className="w-4 h-4" />
                          </button>
                          {copiedContractId === activity.txHash && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              Copied!
                            </div>
                          )}
                          {hoveredContractId === activity.txHash && copiedContractId !== activity.txHash && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              Copy
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Timestamp</div>
                      <div className="text-xs text-black" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-20 14:32:15</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium mb-0.5" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract ID</div>
                      <div className="bg-gray-100 rounded px-2 py-0.5 font-mono text-xs w-fit">{activity.contractId}</div>
                      <div className="text-[11px] text-gray-500 font-medium mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract Title</div>
                      <div className="font-semibold text-gray-900 text-xs" style={{ fontFamily: 'Avenir, sans-serif' }}>{activity.type}</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <a href="#" className="flex items-center px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-100 text-[10px] font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <HiOutlineExternalLink className="mr-1 text-base" />
                      View in Explorer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium shadow-sm hover:bg-gray-50 text-sm">Load More Activity</button>
          </div>
        </div>
      )}
      {activeTab === 'explorers' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Blockchain Explorers</h2>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium">
              <FaBook className="mr-2 text-base" />
              Explorer Guides
            </button>
          </div>
          {/* Explorer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Allo Explorer (moved to first) */}
            <Card className="rounded-xl border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center border-2 border-purple-200 mr-3">
                  <Image
                    src="/assets/Allo.info_idEm-oc6nE_0.png"
                    alt="Allo.info"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </span>
                <span className="text-lg font-semibold text-black">Allo Explorer</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Cross-chain interoperability and transaction monitoring</p>
              <div className="flex flex-col gap-2 mb-4">
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Monitor Bridges <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Cross-Chain Analytics <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Network Status <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
              </div>
              <button className="mt-auto w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm">Connect to Allo Explorer</button>
            </Card>
            {/* Pera Explorer (was AlgoExplorer) */}
            <Card className="rounded-xl border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center border-2 border-yellow-200 mr-3">
                  <Image
                    src="/assets/newperalogo.png"
                    alt="Pera"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </span>
                <span className="text-lg font-semibold text-black">Pera Explorer</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Track transactions and contract activity on the Algorand blockchain</p>
              <div className="flex flex-col gap-2 mb-4">
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  View Smart Contracts <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Track Escra Wallet <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Browse Assets <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
              </div>
              <button className="mt-auto w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm">Connect to Pera Explorer</button>
            </Card>
            {/* Pera Wallet (unchanged) */}
            <Card className="rounded-xl border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center border-2 border-yellow-200 mr-3">
                  <Image
                    src="/assets/newperalogo.png"
                    alt="Pera"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </span>
                <span className="text-lg font-semibold text-black">Pera Wallet</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Mobile and web wallet for Algorand blockchain interactions</p>
              <div className="flex flex-col gap-2 mb-4">
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Manage Assets <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  View Transaction History <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Connect dApps <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
              </div>
              <button className="mt-auto w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm">Connect Pera Wallet</button>
            </Card>
          </div>
          {/* Developer Resources */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Developer Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Smart Contract SDK */}
              <Card className="rounded-xl border border-gray-200 p-5 flex flex-col h-full">
                <div className="flex items-center mb-2">
                  <span className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center border-2 border-teal-200 mr-3">
                    <LuFileTerminal className="w-10 h-6 text-black" />
                  </span>
                  <span className="text-base font-semibold text-black">Smart Contract SDK</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">Developer toolkit for building on Escra's smart contract platform</p>
                <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 mt-auto">
                  <HiOutlineBookOpen className="mr-2 text-base" />
                  View Documentation
                </button>
              </Card>
              {/* Faucet */}
              <Card className="rounded-xl border border-gray-200 p-6 flex flex-col h-full">
                <div className="flex items-center mb-2">
                  <span className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border-2 border-blue-200 mr-3">
                    <FaFaucetDrip className="w-5 h-5 text-black" />
                  </span>
                  <span className="text-lg font-semibold text-black">Faucet</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">Get test tokens to interact with Escra's TestNet environment</p>
                <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 mt-auto">
                  <FaArrowRight className="mr-2 text-base" />
                  Request Test Tokens
                </button>
              </Card>
              {/* Security Audits */}
              <Card className="rounded-xl border border-gray-200 p-5 flex flex-col h-full">
                <div className="flex items-center mb-2">
                  <span className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border-2 border-gray-200 mr-3">
                    <TbShieldLock className="w-6 h-6 text-black" />
                  </span>
                  <span className="text-lg font-semibold text-black">Security Audits</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">View security audit reports for Escra's smart contracts</p>
                <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 mt-auto">
                  <FaExternalLinkAlt className="mr-2 text-base" />
                  View Audit Reports
                </button>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Smart Contract Details Modal */}
      {selectedSmartContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header with Contract ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-white px-6 py-4">
              <div className="flex items-start justify-between">
                {/* Left: Contract ID */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary">
                      # {selectedSmartContract.id}
                    </span>
                  </div>
                </div>
                {/* Right: Close Button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                  onClick={() => setSelectedSmartContract(null)}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-6 flex-1">
                {/* Modal Content Grid: 2x1 layout */}
                <div className="flex flex-col gap-6 w-full h-full min-h-0 -mt-2">
                  {/* Top Row: Block Details and Contract Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Block Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Block Details</h3>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Block ID</div>
                          <div className="text-xs text-black">15283674</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Block Hash</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={BLOCK_HASH}
                            >
                              {`${BLOCK_HASH.substring(0, 9)}...${BLOCK_HASH.slice(-4)}`}
                            </span>
                            <div className="relative flex-shrink-0">
                              <button
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  navigator.clipboard.writeText(BLOCK_HASH);
                                  setCopiedContractId('block-hash');
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}
                                onMouseEnter={() => setHoveredContractId('block-hash')}
                                onMouseLeave={() => setHoveredContractId(null)}
                                aria-label="Copy block hash"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedContractId === 'block-hash' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredContractId === 'block-hash' && copiedContractId !== 'block-hash' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Previous Round</div>
                          <div className="text-xs text-black">15283673</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Next Round</div>
                          <div className="text-xs text-black">15283675</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Timestamp</div>
                          <div className="text-xs text-black">2024-05-20 14:32:15</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Proposer</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={PROPOSER_HASH}
                            >
                              {`${PROPOSER_HASH.substring(0, 9)}...${PROPOSER_HASH.slice(-4)}`}
                            </span>
                            <div className="relative flex-shrink-0">
                              <button
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  navigator.clipboard.writeText(PROPOSER_HASH);
                                  setCopiedContractId('proposer');
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}
                                onMouseEnter={() => setHoveredContractId('proposer')}
                                onMouseLeave={() => setHoveredContractId(null)}
                                aria-label="Copy proposer address"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedContractId === 'proposer' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredContractId === 'proposer' && copiedContractId !== 'proposer' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Base Fee</div>
                          <div className="flex items-center">
                            <span className="text-xs text-black">0.001</span>
                            <Image
                              src="/assets/algorand_logo_mark_black.png"
                              alt="ALGO"
                              width={22}
                              height={22}
                              className="-ml-0.5 opacity-75"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Contract Details</h3>
                      <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                          <div className="text-xs text-black">{selectedSmartContract.id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Name</div>
                          <div className="text-xs text-black">{selectedSmartContract.title}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Hash</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={getContractHash(selectedSmartContract.id)}
                            >
                              {`${getContractHash(selectedSmartContract.id).substring(0, 9)}...${getContractHash(selectedSmartContract.id).slice(-4)}`}
                            </span>
                            <div className="relative">
                              <button
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  navigator.clipboard.writeText(getContractHash(selectedSmartContract.id));
                                  setCopiedContractId(selectedSmartContract.id);
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}
                                onMouseEnter={() => setHoveredContractId(selectedSmartContract.id)}
                                onMouseLeave={() => setHoveredContractId(null)}
                                aria-label="Copy contract hash"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedContractId === selectedSmartContract.id && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredContractId === selectedSmartContract.id && copiedContractId !== selectedSmartContract.id && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Version</div>
                          <div className="text-xs text-black">{selectedSmartContract.version}</div>
                        </div>
                        <div></div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">On-Chain ID</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={getContractHash(selectedSmartContract.id)}
                            >
                              {`${getContractHash(selectedSmartContract.id).substring(0, 9)}...${getContractHash(selectedSmartContract.id).slice(-4)}`}
                            </span>
                            <button className="ml-2 text-gray-400 hover:text-gray-600" onClick={() => {
                                  navigator.clipboard.writeText(getContractHash(selectedSmartContract.id));
                                  setCopiedContractId('on-chain-id');
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}>
                              <HiOutlineDuplicate className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Status</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${selectedSmartContract.badges[1]?.color || 'bg-gray-100 text-gray-700 border border-gray-400'}`}>
                            {selectedSmartContract.status}
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Current Milestone</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle('Wire Details')}`}>Wire Details</span>
                        </div>
                        {/* 4th row: Network left, Deployed middle */}
                        <div style={{gridColumn: '1 / 2'}}>
                          <div className="text-gray-500 text-xs mb-1">Network</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${
                            selectedSmartContract.badges[0]?.label === 'MainNet' 
                              ? 'bg-green-100 text-green-700 border border-green-500' 
                              : 'bg-gray-100 text-gray-700 border border-gray-400'
                          }`}>
                            {selectedSmartContract.badges[0]?.label || 'TestNet'}
                          </span>
                        </div>
                        <div style={{gridColumn: '2 / 3'}}>
                          <div className="text-gray-500 text-xs mb-1">Deployed</div>
                          <div className="text-xs text-black">{selectedSmartContract.deployed}</div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Full-width Transactions - REMOVED */}

                  {/* Actions Box - Full-width */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Actions</h3>
                    
                    {/* Actions Summary Elements */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Total Actions</div>
                        <div className="text-base font-bold text-gray-900">{selectedSmartContract.transactions}</div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Standard Actions</div>
                        <div className="text-base font-bold text-gray-900">{transactionData.length}</div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Inner Actions</div>
                        <div className="text-base font-bold text-gray-900">{Math.floor(selectedSmartContract.transactions * 0.3)}</div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Total Fees</div>
                        <div className="text-base font-bold text-gray-900">
                          {transactionData.reduce((sum, tx) => sum + parseFloat(tx.fee), 0).toFixed(3)}
                        </div>
                      </div>
                    </div>

                    {/* Tabs Row with Divider */}
                    <div className="border-b border-gray-200 mb-4">
                      <div className="flex space-x-4 overflow-x-auto w-full">
                        <button
                          className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                            actionsTab === 'table'
                              ? 'text-primary border-primary'
                              : 'text-gray-500 hover:text-gray-700 border-transparent'
                          }`}
                          onClick={() => setActionsTab('table')}
                        >
                          Table
                        </button>
                        <button
                          className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                            actionsTab === 'visual'
                              ? 'text-primary border-primary'
                              : 'text-gray-500 hover:text-gray-700 border-transparent'
                          }`}
                          onClick={() => setActionsTab('visual')}
                        >
                          Visual
                        </button>
                      </div>
                    </div>

                    {/* Tab Content */}
                    {actionsTab === 'table' && (
                      <div className="space-y-4">
                        {/* Table */}
                        <div className="relative overflow-x-auto overflow-y-auto" style={{ maxHeight: '200px' }}>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Action ID
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Block ID
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Type
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Hash
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Timestamp
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentActions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                                    <span className="text-primary underline font-semibold cursor-pointer">
                                      {transaction.id}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                    {transaction.groupId}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-center text-xs">
                                    <span className={`inline-flex items-center justify-center min-w-[120px] px-2 py-1 font-semibold rounded-full text-xs ${getTypeBadgeStyle(transaction.type)}`}>
                                      {transaction.type}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                                    <span className="text-primary underline font-semibold cursor-pointer">
                                      {transaction.from}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                    2024-05-20 14:32:15
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Rows per page:</span>
                            <select
                              value={actionsRowsPerPage}
                              onChange={(e) => {
                                setActionsRowsPerPage(Number(e.target.value));
                                setActionsCurrentPage(1);
                              }}
                              className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={25}>25</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500">
                              Page {actionsCurrentPage} of {actionsTotalPages}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setActionsCurrentPage(Math.max(1, actionsCurrentPage - 1))}
                                disabled={actionsCurrentPage === 1}
                                className="px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => setActionsCurrentPage(Math.min(actionsTotalPages, actionsCurrentPage + 1))}
                                disabled={actionsCurrentPage === actionsTotalPages}
                                className="px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {actionsTab === 'visual' && (
                      <div className="space-y-4">
                        <div className="relative bg-white rounded-xl border border-gray-200 p-6 min-h-[400px]">
                          {/* Address Nodes Row */}
                          <div className="flex justify-between items-center mb-16 px-8">
                            {[
                              'WARN_SCAM',
                              '1284326447',
                              'KKGU_UZBI',
                              'KFA2_T374',
                              'D31M_B51E',
                              'BUCT_B01A',
                              'BL5Y_LE4E'
                            ].map((address, index) => (
                              <div key={address} className="flex flex-col items-center group relative">
                                <div className="text-xs font-mono text-gray-700 mb-2 flex items-center">
                                  {address}
                                  <div className="ml-1 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-600">
                                    {index + 1}
                                  </div>
                                </div>
                                <div className="w-3 h-3 rounded-full border-2 border-primary bg-white" />
                              </div>
                            ))}
                          </div>

                          {/* Action Flow Lines */}
                          <div className="space-y-6 px-8">
                            {[
                              { id: 'DLH04MH', type: 'App Call', amount: null },
                              { id: '4U0HG7Q', type: 'Payment', amount: '0.000013' },
                              { id: 'HNBJXTY', type: 'Payment', amount: '0.000013' },
                              { id: 'UHDR4KP', type: 'Payment', amount: '0.000013' },
                              { id: 'PAS06BJ', type: 'Payment', amount: '0.000013' },
                              { id: 'ZXFRSCG', type: 'Payment', amount: '0.000013' }
                            ].map((tx, index) => (
                              <div key={tx.id} className="relative flex items-center">
                                {/* Action ID */}
                                <div className="w-24 text-xs font-mono text-gray-700 flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                  {tx.id}
                                </div>

                                {/* Action Line */}
                                <div className="flex-grow relative" style={{ maxWidth: `${40 + (index * 10)}%` }}>
                                  <div className={`h-[2px] w-full ${
                                    tx.type === 'App Call' ? 'bg-primary' : 'bg-orange-400'
                                  }`} />
                                  
                                  {/* Action Type & Amount */}
                                  <div className="absolute left-4 -top-3 flex items-center">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                      tx.type === 'App Call' 
                                        ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                        : 'bg-orange-100 text-orange-700 border border-orange-500'
                                    }`}>
                                      {tx.type}
                                    </span>
                                    {tx.amount && (
                                      <span className="ml-2 flex items-center bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                        {tx.amount}
                                        <Image
                                          src="/assets/algorand_logo_mark_black.png"
                                          alt="ALGO"
                                          width={12}
                                          height={12}
                                          className="ml-0.5 opacity-75"
                                        />
                                      </span>
                                    )}
                                  </div>

                                  {/* Right Connection Point */}
                                  <div className="absolute right-0 -top-[4px] w-3 h-3 rounded-full bg-white border-2 border-primary" />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Total Actions Counter */}
                          <div className="absolute bottom-4 right-4 flex items-center text-xs text-gray-500">
                            <span className="mr-2">Total Actions:</span>
                            <span className="font-semibold text-gray-900">58</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Total Actions</span>
                        <span className="font-semibold text-gray-900">{selectedSmartContract.transactions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header with Activity ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-white px-6 py-4">
              <div className="flex items-start justify-between">
                {/* Left: Activity ID */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary">
                      # {selectedActivity.txHash}
                    </span>
                  </div>
                </div>
                {/* Right: Close Button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                  onClick={() => setSelectedActivity(null)}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto p-6 flex-1">
                {/* Modal Content Grid: 2x1 layout */}
                <div className="flex flex-col gap-6 w-full h-full min-h-0 -mt-2">
                  {/* Top Row: Block Details and Contract Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Block Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Action Details</h3>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Action ID</div>
                          <div className="text-xs text-black">{selectedActivity.txHash}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Action Hash</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={`0x${selectedActivity.txHash}${'0'.repeat(66 - 2 - selectedActivity.txHash.length)}`}
                            >
                              {`0x${selectedActivity.txHash.substring(0, 9)}...${selectedActivity.txHash.slice(-4)}`}
                            </span>
                            <div className="relative flex-shrink-0">
                              <button
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  navigator.clipboard.writeText(`0x${selectedActivity.txHash}${'0'.repeat(66 - 2 - selectedActivity.txHash.length)}`);
                                  setCopiedContractId('action-hash');
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}
                                onMouseEnter={() => setHoveredContractId('action-hash')}
                                onMouseLeave={() => setHoveredContractId(null)}
                                aria-label="Copy action hash"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedContractId === 'action-hash' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredContractId === 'action-hash' && copiedContractId !== 'action-hash' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Type row, full width */}
                        <div className="col-span-2">
                          <div className="text-gray-500 text-xs mb-1">Type</div>
                          <span className={`inline-flex items-center justify-center min-w-[120px] px-2 py-1 font-semibold rounded-full text-xs ${getTypeBadgeStyle(selectedActivity.type)}`}>
                            {selectedActivity.type}
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Block ID</div>
                          <div className="text-xs text-black">15283674</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Block Hash</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={BLOCK_HASH}
                            >
                              {`${BLOCK_HASH.substring(0, 9)}...${BLOCK_HASH.slice(-4)}`}
                            </span>
                            <div className="relative flex-shrink-0">
                              <button
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  navigator.clipboard.writeText(BLOCK_HASH);
                                  setCopiedContractId('block-hash');
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}
                                onMouseEnter={() => setHoveredContractId('block-hash')}
                                onMouseLeave={() => setHoveredContractId(null)}
                                aria-label="Copy block hash"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedContractId === 'block-hash' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredContractId === 'block-hash' && copiedContractId !== 'block-hash' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Next Round</div>
                          <div className="text-xs text-black">15283675</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Last Round</div>
                          <div className="text-xs text-black">15283673</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Timestamp</div>
                          <div className="text-xs text-black">2024-05-20 14:32:15</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Proposer</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={PROPOSER_HASH}
                            >
                              {`${PROPOSER_HASH.substring(0, 9)}...${PROPOSER_HASH.slice(-4)}`}
                            </span>
                            <div className="relative flex-shrink-0">
                              <button
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  navigator.clipboard.writeText(PROPOSER_HASH);
                                  setCopiedContractId('proposer');
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}
                                onMouseEnter={() => setHoveredContractId('proposer')}
                                onMouseLeave={() => setHoveredContractId(null)}
                                aria-label="Copy proposer address"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedContractId === 'proposer' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredContractId === 'proposer' && copiedContractId !== 'proposer' && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Base Fee row, full width */}
                        <div className="col-span-2">
                          <div className="text-gray-500 text-xs mb-1">Base Fee</div>
                          <div className="flex items-center">
                            <span className="text-xs text-black">0.001</span>
                            <Image
                              src="/assets/algorand_logo_mark_black.png"
                              alt="ALGO"
                              width={22}
                              height={22}
                              className="-ml-0.5 opacity-75"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Contract Details</h3>
                      <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                          <div className="text-xs text-black">{selectedActivity.contractId}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Name</div>
                          <div className="text-xs text-black">{selectedActivity.type}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Hash</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={selectedActivity.txHash}
                            >
                              {`${selectedActivity.txHash.substring(0, 9)}...${selectedActivity.txHash.slice(-4)}`}
                            </span>
                            <div className="relative">
                              <button
                                type="button"
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedActivity.txHash);
                                  setCopiedContractId(selectedActivity.txHash);
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}
                                onMouseEnter={() => setHoveredContractId(selectedActivity.txHash)}
                                onMouseLeave={() => setHoveredContractId(null)}
                                aria-label="Copy contract hash"
                              >
                                <HiOutlineDuplicate className="w-4 h-4" />
                              </button>
                              {copiedContractId === selectedActivity.txHash && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                              {hoveredContractId === selectedActivity.txHash && copiedContractId !== selectedActivity.txHash && (
                                <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                  Copy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Version</div>
                          <div className="text-xs text-black">v1.0.0</div>
                        </div>
                        <div></div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">On-Chain ID</div>
                          <div className="flex items-center">
                            <span
                              className="text-xs font-mono text-gray-900 truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-pointer"
                              style={{ maxWidth: '120px' }}
                              title={selectedActivity.txHash}
                            >
                              {`${selectedActivity.txHash.substring(0, 9)}...${selectedActivity.txHash.slice(-4)}`}
                            </span>
                            <button className="ml-2 text-gray-400 hover:text-gray-600" onClick={() => {
                                  navigator.clipboard.writeText(selectedActivity.txHash);
                                  setCopiedContractId('on-chain-id');
                                  setTimeout(() => setCopiedContractId(null), 1500);
                                }}>
                              <HiOutlineDuplicate className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Status</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs bg-green-100 text-green-700 border border-green-500`}>
                            Complete
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Current Milestone</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${getStatusBadgeStyle('Wire Details')}`}>Wire Details</span>
                        </div>
                        {/* 4th row: Network left, Deployed middle */}
                        <div style={{gridColumn: '1 / 2'}}>
                          <div className="text-gray-500 text-xs mb-1">Network</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs bg-green-100 text-green-700 border border-green-500`}>
                            MainNet
                          </span>
                        </div>
                        <div style={{gridColumn: '2 / 3'}}>
                          <div className="text-gray-500 text-xs mb-1">Deployed</div>
                          <div className="text-xs text-black">2024-05-20 14:32:15</div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Full-width Transactions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Transactions</h3>
                    
                    {/* Transaction Summary Elements */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Total Transactions</div>
                        <div className="text-base font-bold text-gray-900">58</div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Standard Transactions</div>
                        <div className="text-base font-bold text-gray-900">{transactionData.length}</div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Inner Transactions</div>
                        <div className="text-base font-bold text-gray-900">{Math.floor(58 * 0.3)}</div>
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-gray-500 font-medium mb-1">Total Fees</div>
                        <div className="text-base font-bold text-gray-900">
                          {transactionData.reduce((sum, tx) => sum + parseFloat(tx.fee), 0).toFixed(3)}
                        </div>
                      </div>
                    </div>

                    {/* Transaction Types Pie Chart */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Transaction Types</h4>
                      <div className="flex items-center gap-6">
                        {/* Pie Chart */}
                        <div className="relative w-24 h-24">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            {/* Calculate percentages */}
                            {(() => {
                              const appCallCount = transactionData.filter(tx => tx.type === 'Application Call').length;
                              const paymentCount = transactionData.filter(tx => tx.type === 'Payment').length;
                              const total = transactionData.length;
                              const appCallPercent = (appCallCount / total) * 100;
                              const paymentPercent = (paymentCount / total) * 100;
                              
                              return (
                                <>
                                  {/* Application Call slice */}
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#0EA5E9"
                                    strokeWidth="20"
                                    strokeDasharray={`${appCallPercent * 2.51} ${100 * 2.51}`}
                                    strokeDashoffset="0"
                                  />
                                  {/* Payment slice */}
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#F97316"
                                    strokeWidth="20"
                                    strokeDasharray={`${paymentPercent * 2.51} ${100 * 2.51}`}
                                    strokeDashoffset={`-${appCallPercent * 2.51}`}
                                  />
                                </>
                              );
                            })()}
                          </svg>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-xs text-gray-700">Application Call</span>
                            <span className="text-xs font-semibold text-gray-900">
                              ({transactionData.filter(tx => tx.type === 'Application Call').length})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-xs text-gray-700">Payment</span>
                            <span className="text-xs font-semibold text-gray-900">
                              ({transactionData.filter(tx => tx.type === 'Payment').length})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabs Row with Divider */}
                    <div className="border-b border-gray-200 mb-4">
                      <div className="flex space-x-4 overflow-x-auto w-full">
                        <button
                          className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                            transactionsTab === 'table'
                              ? 'text-primary border-primary'
                              : 'text-gray-500 hover:text-gray-700 border-transparent'
                          }`}
                          onClick={() => setTransactionsTab('table')}
                        >
                          Table
                        </button>
                        <button
                          className={`pb-2 text-sm font-semibold whitespace-nowrap border-b-2 ${
                            transactionsTab === 'visual'
                              ? 'text-primary border-primary'
                              : 'text-gray-500 hover:text-gray-700 border-transparent'
                          }`}
                          onClick={() => setTransactionsTab('visual')}
                        >
                          Visual
                        </button>
                      </div>
                    </div>

                    {/* Tab Content */}
                    {transactionsTab === 'table' && (
                      <div className="space-y-4">
                        {/* Table */}
                        <div className="relative overflow-x-auto overflow-y-auto" style={{ maxHeight: '200px' }}>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Position
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Transaction ID
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Group ID
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Sender
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Receiver
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Type
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Amount
                                </th>
                                <th className="sticky top-0 z-10 bg-gray-50 text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                                  Fee
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentTransactions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                    {startIndex + index + 1}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                                    <span className="text-primary underline font-semibold cursor-pointer">
                                      {transaction.id}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                    {transaction.groupId}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                                    <span className="text-primary underline font-semibold cursor-pointer">
                                      {transaction.from}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                                    <span className="text-primary underline font-semibold cursor-pointer">
                                      {transaction.to}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-center text-xs">
                                    <span className={`inline-flex items-center justify-center min-w-[120px] px-2 py-1 font-semibold rounded-full text-xs ${getTypeBadgeStyle(transaction.type)}`}>
                                      {transaction.type}
                                    </span>
                                  </td>
                                  <td className="pl-6 pr-0 py-2 whitespace-nowrap text-right text-xs text-gray-900">
                                    <div className="flex items-center justify-end">
                                      <span>{transaction.amount}</span>
                                      <Image
                                        src="/assets/algorand_logo_mark_black.png"
                                        alt="ALGO"
                                        width={22}
                                        height={22}
                                        className="-ml-0.5 opacity-75"
                                      />
                                    </div>
                                  </td>
                                  <td className="pl-4 pr-2 py-2 whitespace-nowrap text-right text-xs text-gray-900">
                                    <div className="flex items-center justify-end">
                                      <span>{transaction.fee}</span>
                                      <Image
                                        src="/assets/algorand_logo_mark_black.png"
                                        alt="ALGO"
                                        width={22}
                                        height={22}
                                        className="-ml-0.5 opacity-75"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Rows per page:</span>
                            <select
                              value={rowsPerPage}
                              onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={25}>25</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500">
                              Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {transactionsTab === 'visual' && (
                      <div className="space-y-4">
                        <div className="relative bg-white rounded-xl border border-gray-200 p-6 min-h-[400px]">
                          {/* Address Nodes Row */}
                          <div className="flex justify-between items-center mb-16 px-8">
                            {[
                              'WARN_SCAM',
                              '1284326447',
                              'KKGU_UZBI',
                              'KFA2_T374',
                              'D31M_B51E',
                              'BUCT_B01A',
                              'BL5Y_LE4E'
                            ].map((address, index) => (
                              <div key={address} className="flex flex-col items-center group relative">
                                <div className="text-xs font-mono text-gray-700 mb-2 flex items-center">
                                  {address}
                                  <div className="ml-1 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-600">
                                    {index + 1}
                                  </div>
                                </div>
                                <div className="w-3 h-3 rounded-full border-2 border-primary bg-white" />
                              </div>
                            ))}
                          </div>

                          {/* Transaction Flow Lines */}
                          <div className="space-y-6 px-8">
                            {[
                              { id: 'DLH04MH', type: 'App Call', amount: null },
                              { id: '4U0HG7Q', type: 'Payment', amount: '0.000013' },
                              { id: 'HNBJXTY', type: 'Payment', amount: '0.000013' },
                              { id: 'UHDR4KP', type: 'Payment', amount: '0.000013' },
                              { id: 'PAS06BJ', type: 'Payment', amount: '0.000013' },
                              { id: 'ZXFRSCG', type: 'Payment', amount: '0.000013' }
                            ].map((tx, index) => (
                              <div key={tx.id} className="relative flex items-center">
                                {/* Transaction ID */}
                                <div className="w-24 text-xs font-mono text-gray-700 flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                  {tx.id}
                                </div>

                                {/* Transaction Line */}
                                <div className="flex-grow relative" style={{ maxWidth: `${40 + (index * 10)}%` }}>
                                  <div className={`h-[2px] w-full ${
                                    tx.type === 'App Call' ? 'bg-primary' : 'bg-orange-400'
                                  }`} />
                                  
                                  {/* Transaction Type & Amount */}
                                  <div className="absolute left-4 -top-3 flex items-center">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                      tx.type === 'App Call' 
                                        ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                        : 'bg-orange-100 text-orange-700 border border-orange-500'
                                    }`}>
                                      {tx.type}
                                    </span>
                                    {tx.amount && (
                                      <span className="ml-2 flex items-center bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                        {tx.amount}
                                        <Image
                                          src="/assets/algorand_logo_mark_black.png"
                                          alt="ALGO"
                                          width={12}
                                          height={12}
                                          className="ml-0.5 opacity-75"
                                        />
                                      </span>
                                    )}
                                  </div>

                                  {/* Right Connection Point */}
                                  <div className="absolute right-0 -top-[4px] w-3 h-3 rounded-full bg-white border-2 border-primary" />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Total Transactions Counter */}
                          <div className="absolute bottom-4 right-4 flex items-center text-xs text-gray-500">
                            <span className="mr-2">Total Transactions:</span>
                            <span className="font-semibold text-gray-900">58</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Total Transactions</span>
                        <span className="font-semibold text-gray-900">58</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 