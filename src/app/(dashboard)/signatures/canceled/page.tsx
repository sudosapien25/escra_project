"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { FaSearch, FaCheckCircle, FaCheck } from "react-icons/fa";
import { HiMiniChevronDown } from "react-icons/hi2";
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards } from "react-icons/hi";
import { LuBellRing } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";
import { TbClockPin } from "react-icons/tb";
import { RiUserSearchLine, RiUserSharedLine } from 'react-icons/ri';
import { Logo } from '@/components/common/Logo';

const cancelledRows = [
  // Example data, should match the 'Cancelled' filter from the main signatures page
  {
    id: "3456",
    document: "Inspection Report",
    parties: ["BuildRight", "Horizon Developers"],
    status: "Rejected",
    signatures: "0 of 2",
    contractId: "9145",
    contract: "Construction Escrow",
    assignee: "Michael Brown",
    dateSent: "2024-03-13",
    dueDate: "2024-03-28",
    filter: "rejected"
  },
  {
    id: "4567",
    document: "Lease Agreement",
    parties: ["Pacific Properties"],
    status: "Expired",
    signatures: "0 of 1",
    contractId: "8784",
    contract: "Commercial Lease Amendment",
    assignee: "Emma Johnson",
    dateSent: "2024-03-12",
    dueDate: "2024-03-27",
    filter: "expired"
  },
  {
    id: "5678",
    document: "Title Insurance",
    parties: ["John Smith", "Emma Johnson"],
    status: "Voided",
    signatures: "0 of 2",
    contractId: "8423",
    contract: "Property Sale Contract",
    assignee: "Robert Chen",
    dateSent: "2024-03-11",
    dueDate: "2024-03-26",
    filter: "voided"
  }
];

export default function CancelledPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['Rejected', 'Expired', 'Voided']);
  const [showSenderDropdown, setShowSenderDropdown] = useState(false);
  const [selectedSender, setSelectedSender] = useState('Sent by anyone');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [showLast30DaysDropdown, setShowLast30DaysDropdown] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const senderButtonRef = useRef<HTMLButtonElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const last30DaysDropdownRef = useRef<HTMLDivElement>(null);

  // Available statuses for the dropdown
  const availableStatuses = [
    'All',
    'Pending',
    'Completed',
    'Expired',
    'Rejected',
    'Voided'
  ];

  // Available sender options for the dropdown
  const availableSenders = [
    'Sent by anyone',
    'Sent by me',
    'Sent to me'
  ];

  // Available assignees
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

  // Function to check if a row should be shown based on selected assignees
  const shouldShowAssignee = (assignee: string) => {
    if (selectedAssignees.length === 0) return true;
    if (selectedAssignees.includes('__ME__')) {
      return assignee === currentUserName;
    }
    return selectedAssignees.includes(assignee);
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

  // Handle click outside for sender dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = document.querySelector('.sender-dropdown');
      const button = senderButtonRef.current;
      
      // Only check if dropdown is open
      if (showSenderDropdown) {
        // If clicking outside both dropdown and button, close the dropdown
        if (!dropdown?.contains(target) && !button?.contains(target)) {
          setShowSenderDropdown(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSenderDropdown]);

  const filteredRows = cancelledRows.filter((row) => {
    if (activeTab === "all") return true;
    if (activeTab === "rejected") return row.filter === "rejected";
    if (activeTab === "expired") return row.filter === "expired";
    if (activeTab === "voided") return row.filter === "voided";
    return true;
  }).filter((row) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.document.toLowerCase().includes(searchLower) ||
      row.parties.some((party) => party.toLowerCase().includes(searchLower)) ||
      row.contract.toLowerCase().includes(searchLower) ||
      row.id.toLowerCase().includes(searchLower) ||
      row.contractId.toLowerCase().includes(searchLower)
    );
  }).filter(row => shouldShowRow(row.status) && shouldShowSender(row.assignee, row.parties) && shouldShowAssignee(row.assignee));

  return (
    <div className="space-y-4" style={{ fontFamily: "Avenir, sans-serif" }}>
      <div className="pb-1">
        <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-1" style={{ fontFamily: "Avenir, sans-serif" }}>Canceled</h1>
        <p className="text-gray-500 text-[15px] md:text-[16px] mt-0" style={{ fontFamily: "Avenir, sans-serif" }}>View your canceled signature requests</p>
      </div>
      <hr className="my-6 border-gray-300" />
      {/* Filter Tabs */}
      <div className="flex gap-1">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
            activeTab === "all" 
              ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className={`inline-block transition-all duration-300 ${activeTab === "all" ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === "all" ? 16 : 0}}>
            {activeTab === "all" && <Logo width={16} height={16} className="pointer-events-none" />}
          </span>
          All
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
            activeTab === "rejected" 
              ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className={`inline-block transition-all duration-300 ${activeTab === "rejected" ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === "rejected" ? 16 : 0}}>
            {activeTab === "rejected" && <Logo width={16} height={16} className="pointer-events-none" />}
          </span>
          Rejected
        </button>
        <button
          onClick={() => setActiveTab("voided")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
            activeTab === "voided" 
              ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className={`inline-block transition-all duration-300 ${activeTab === "voided" ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === "voided" ? 16 : 0}}>
            {activeTab === "voided" && <Logo width={16} height={16} className="pointer-events-none" />}
          </span>
          Voided
        </button>
        <button
          onClick={() => setActiveTab("expired")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
            activeTab === "expired" 
              ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className={`inline-block transition-all duration-300 ${activeTab === "expired" ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === "expired" ? 16 : 0}}>
            {activeTab === "expired" && <Logo width={16} height={16} className="pointer-events-none" />}
          </span>
          Expired
        </button>
      </div>
      {/* Search Bar and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 min-w-0" style={{ width: 'calc(100% - 500px)' }}>
          <FaSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search documents, parties, contracts or IDs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
            style={{ fontFamily: "Avenir, sans-serif" }}
          />
        </div>

        {/* Sender Filter */}
        <div className="relative ml-1">
          <button
            ref={senderButtonRef}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
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
          >
            <RiUserSharedLine className="text-gray-400 w-4 h-4" />
            <span>Sender</span>
            <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          </button>
          {showSenderDropdown && (
            <div 
              className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2 min-w-[200px] sender-dropdown" 
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              {availableSenders.map((sender) => (
                <button
                  key={sender}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSender(sender);
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
        </div>

        {/* Assignee Filter */}
        <button
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAssigneeDropdown(prev => !prev);
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
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowLast30DaysDropdown((prev: boolean) => !prev);
          }}
          ref={last30DaysDropdownRef as any}
        >
          <TbClockPin className="text-gray-400 w-4 h-4" />
          <span>Last 30 Days</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <div className="min-w-[1400px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '60px' }}>Document ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '180px' }}>Document</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '200px' }}>Recipients</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '100px' }}>Signatures</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '100px' }}>Contract ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '180px' }}>Contract</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '120px' }}>Assignee</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Date Sent</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Due Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center text-gray-400 py-8">No results found.</td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
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
                        row.status === "Rejected" && "bg-red-100 text-red-800 border-red-500",
                        row.status === "Expired" && "bg-orange-100 text-orange-800 border-orange-500",
                        row.status === "Voided" && "bg-gray-100 text-gray-800 border-gray-500"
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
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        <button
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                          title="Download"
                        >
                          <HiOutlineDownload className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 