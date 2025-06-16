"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { FaSearch, FaCheckCircle, FaCheck } from "react-icons/fa";
import { HiMiniChevronDown } from "react-icons/hi2";
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards } from "react-icons/hi";
import { LuBellRing } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { PiWarningDiamondBold } from "react-icons/pi";
import { FaRegSquareCheck } from "react-icons/fa6";
import { BsPerson } from 'react-icons/bs';
import { RiUserSharedLine, RiUserSearchLine } from 'react-icons/ri';
import { TbClockPin } from 'react-icons/tb';
import { TbPencilShare, TbPencilX } from 'react-icons/tb';
import { Modal } from '@/components/common/Modal';
import { FaDochub } from 'react-icons/fa6';
import { SiAdobe } from 'react-icons/si';
import { Logo } from '@/components/common/Logo';

const inboxRows = [
  // Example data, should match the inbox filter from the main signatures page
  {
    id: "1234",
    document: "Purchase Agreement",
    parties: ["Robert Chen", "Eastside Properties"],
    status: "Pending",
    signatures: "1 of 2",
    contractId: "9548",
    contract: "New Property Acquisition",
    assignee: "John Smith",
    dateSent: "2024-03-15",
    dueDate: "2024-03-30",
    filter: "received",
  },
  {
    id: "5678",
    document: "Title Insurance",
    parties: ["John Smith", "Emma Johnson"],
    status: "Pending",
    signatures: "1 of 2",
    contractId: "8423",
    contract: "Property Sale Contract",
    assignee: "Robert Chen",
    dateSent: "2024-03-11",
    dueDate: "2024-03-26",
    filter: "action-required",
  },
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [showSenderDropdown, setShowSenderDropdown] = useState(false);
  const [selectedSender, setSelectedSender] = useState('Sent by anyone');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [showToolSelectorModal, setShowToolSelectorModal] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const senderButtonRef = useRef<HTMLButtonElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);

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

  // Function to check if a row should be shown based on selected assignees
  const shouldShowAssignee = (assignee: string) => {
    if (selectedAssignees.length === 0) return true;
    if (selectedAssignees.includes('__ME__')) {
      return assignee === currentUserName;
    }
    return selectedAssignees.includes(assignee);
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

  const filteredRows = inboxRows.filter((row) => {
    if (activeTab === "all") return true;
    if (activeTab === "received") return row.filter === "received";
    if (activeTab === "action-required") return row.filter === "action-required";
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
        <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-1" style={{ fontFamily: "Avenir, sans-serif" }}>Inbox</h1>
        <p className="text-gray-500 text-[15px] md:text-[16px] mt-0" style={{ fontFamily: "Avenir, sans-serif" }}>View & manage your received signature requests</p>
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
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
            activeTab === "received" 
              ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className={`inline-block transition-all duration-300 ${activeTab === "received" ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === "received" ? 16 : 0}}>
            {activeTab === "received" && <Logo width={16} height={16} className="pointer-events-none" />}
          </span>
          Received
        </button>
        <button
          onClick={() => setActiveTab("action-required")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
            activeTab === "action-required" 
              ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className={`inline-block transition-all duration-300 ${activeTab === "action-required" ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === "action-required" ? 16 : 0}}>
            {activeTab === "action-required" && <Logo width={16} height={16} className="pointer-events-none" />}
          </span>
          Action Required
        </button>
      </div>
      {/* Search Bar and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 min-w-0" style={{ width: 'calc(100% - 520px)' }}>
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
        {/* Status Filter */}
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowStatusDropdown(prev => !prev);
            if (!showStatusDropdown) {
              setShowSenderDropdown(false);
              setShowAssigneeDropdown(false);
            }
          }}
          ref={statusDropdownRef as any}
        >
          <HiOutlineViewBoards className="text-gray-400 text-lg" />
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
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
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
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center text-gray-400 py-8">No results found.</td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-primary underline font-semibold cursor-pointer">{row.id}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                      <div className="text-xs font-bold text-gray-900">{row.document}</div>
                    </td>
                    <td className="px-6 py-2.5 text-xs">
                      <div className="flex flex-col space-y-1">
                        {row.parties.map((party, idx) => (
                          <div key={idx} className="text-gray-900">{party}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500">{row.status}</span>
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
                          title="Sign"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowToolSelectorModal(true);
                          }}
                        >
                          <TbPencilShare className="h-4 w-4" />
                        </button>
                        <button
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-red-500 hover:text-red-500 transition-colors"
                          title="Reject"
                        >
                          <TbPencilX className="h-4 w-4" />
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
                // TODO: Add Escra signing logic here
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
    </div>
  );
} 