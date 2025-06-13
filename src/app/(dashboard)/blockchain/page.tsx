'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { FaPlus, FaCopy, FaWallet, FaNetworkWired, FaBook, FaExternalLinkAlt, FaCogs, FaFaucet, FaShieldAlt, FaArrowRight, FaSearch, FaCheck } from 'react-icons/fa';
import { FaTimeline } from 'react-icons/fa6';
import { HiOutlineExternalLink, HiOutlineBookOpen, HiOutlineDuplicate, HiOutlineViewBoards, HiOutlineDocumentSearch } from 'react-icons/hi';
import { HiMiniChevronDown } from 'react-icons/hi2';
import { FaRegCalendarAlt, FaRegCheckCircle, FaRegFileAlt, FaCodeBranch, FaHashtag, FaCoins } from 'react-icons/fa';
import { Logo } from '@/components/common/Logo';
import NewContractModal from '@/components/common/NewContractModal';
import { MdOutlineAddToPhotos, MdOutlineUpdate } from 'react-icons/md';
import { mockContracts } from '@/data/mockContracts';
import Image from 'next/image';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';
import { TbClockPin } from 'react-icons/tb';

// Helper function to generate contract hash
const getContractHash = (id: string) => `0x${id}${'0'.repeat(66 - 2 - id.length)}`;

const contracts = mockContracts.map(contract => ({
  title: contract.title,
  version: 'v1.0.0',
  badges: [
    { label: contract.status === 'Complete' ? 'MainNet' : 'TestNet', color: contract.status === 'Complete' ? 'bg-green-100 text-green-700 border border-green-500' : 'bg-blue-100 text-blue-700 border border-blue-500' },
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
    icon: <FaRegCheckCircle className="text-green-500 text-xl" />,
    description: 'Document Review milestone completed for Contract #8423',
    txHash: '0x7ad9e3b...',
    block: '#15283674',
    contractId: 'CTR–8423',
    timestamp: '20,',
    date: 'May',
  },
  {
    type: 'Document Signed',
    icon: <FaRegFileAlt className="text-blue-500 text-xl" />,
    description: 'Purchase Agreement signed by John Smith for Contract #7612',
    txHash: '0x4fc8d2a...',
    block: '#15283545',
    contractId: 'CTR–7612',
    timestamp: '20,',
    date: 'May',
  },
  {
    type: 'Smart Contract Deployed',
    icon: <FaCodeBranch className="text-purple-500 text-xl" />,
    description: 'Oracle Integration contract deployed to TestNet',
    txHash: '0x9be31c5...',
    block: '#15283213',
    contractId: '0x1b4d8...',
    timestamp: '20,',
    date: 'May',
  },
  {
    type: 'Document Hash Registered',
    icon: <FaHashtag className="text-blue-400 text-xl" />,
    description: 'Lease Agreement hash registered for Contract #9145',
    txHash: '0x2ea9f1b...',
    block: '#15282789',
    contractId: 'CTR–9145',
    timestamp: '19,',
    date: 'May',
  },
  {
    type: 'Escrow Payment Released',
    icon: <FaCoins className="text-orange-400 text-xl" />,
    description: 'Final payment released for Contract #3219',
    txHash: '0x8d4f2e3...',
    block: '#15281952',
    contractId: 'CTR–3219',
    timestamp: '19,',
    date: 'May',
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
          <p className="text-gray-500 text-[15px] md:text-[16px] mt-0">View smart contracts, on-chain activity, & explorer integrations</p>
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
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 font-sans flex items-center justify-center ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[calc(3*(240px+1rem))] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredContracts.map((contract, idx) => (
              <Card key={idx} className="rounded-xl border border-gray-200 p-4">
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
                      onClick={() => {
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
                <p className="text-[12px] text-gray-600 mb-3 truncate" style={{ fontFamily: 'Avenir, sans-serif' }} title={contract.description}>{contract.description}</p>
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
              <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm flex p-4 items-start relative">
                {/* Timeline Icon */}
                <div className="flex flex-col items-center mr-4">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 border-2 border-white shadow" style={{marginTop: 2}}>
                    {activity.icon}
                  </div>
                </div>
                {/* Card Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-black mb-0.5">{activity.type}</h3>
                      <p className="text-gray-500 text-xs mb-1">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-400 font-medium">
                      <span>{activity.date}</span>
                      <span><svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg></span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-0.5">TX Hash</div>
                      <div className="flex items-center bg-gray-100 rounded px-2 py-0.5 font-mono text-xs w-fit">
                        {activity.txHash}
                        <button className="ml-2 text-gray-400 hover:text-gray-700"><FaCopy className="inline text-xs" /></button>
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-1">Block</div>
                      <div className="font-semibold text-gray-900 text-xs">{activity.block}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-0.5">Contract ID</div>
                      <div className="bg-gray-100 rounded px-2 py-0.5 font-mono text-xs w-fit">{activity.contractId}</div>
                      <div className="text-xs text-gray-400 font-medium mt-1">Timestamp</div>
                      <div className="font-semibold text-gray-900 text-xs">{activity.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <a href="#" className="flex items-center px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-100 text-xs font-medium">
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
                <span className="w-8 h-8 flex items-center justify-center rounded bg-green-100 mr-3">
                  <FaCogs className="text-green-400 text-xl" />
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
                <span className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 mr-3">
                  <FaNetworkWired className="text-blue-400 text-xl" />
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
                <span className="w-8 h-8 flex items-center justify-center rounded bg-purple-100 mr-3">
                  <FaWallet className="text-purple-400 text-xl" />
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
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-teal-100 mr-3">
                    <span className="text-teal-500 text-lg">&gt;_</span>
                  </span>
                  <span className="text-base font-semibold text-black">Smart Contract SDK</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">Developer toolkit for building on Escra's smart contract platform</p>
                <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 mt-auto">
                  <HiOutlineBookOpen className="mr-2 text-base" />
                  View Documentation
                </button>
              </Card>
              {/* Escra TestNet Faucet */}
              <Card className="rounded-xl border border-gray-200 p-5 flex flex-col h-full">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-cyan-100 mr-3">
                    <FaFaucet className="text-cyan-500 text-lg" />
                  </span>
                  <span className="text-base font-semibold text-black">Escra TestNet Faucet</span>
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
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-cyan-100 mr-3">
                    <FaShieldAlt className="text-cyan-500 text-lg" />
                  </span>
                  <span className="text-base font-semibold text-black">Security Audits</span>
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
    </div>
  );
} 