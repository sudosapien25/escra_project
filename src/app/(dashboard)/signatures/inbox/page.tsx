"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import { HiMiniChevronDown } from "react-icons/hi2";
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards } from "react-icons/hi";
import { LuBellRing } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { PiWarningDiamondBold } from "react-icons/pi";
import { FaRegSquareCheck } from "react-icons/fa6";
import { BsPerson } from 'react-icons/bs';

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
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const senderDropdownRef = useRef<HTMLDivElement>(null);
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
      if (senderDropdownRef.current?.contains(target)) {
        return; // Don't close if clicking inside the dropdown
      }
      setShowSenderDropdown(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex gap-1 w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={clsx(
            "px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px]",
            activeTab === "all"
              ? "bg-teal-50 text-teal-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={clsx(
            "px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px]",
            activeTab === "received"
              ? "bg-teal-50 text-teal-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          Received
        </button>
        <button
          onClick={() => setActiveTab("action-required")}
          className={clsx(
            "px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px]",
            activeTab === "action-required"
              ? "bg-teal-50 text-teal-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          Action Required
        </button>
      </div>
      {/* Search Bar and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0" style={{ width: 'calc(100% - 520px)' }}>
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
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
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
                      <FaCheckCircle className="text-primary" size={12} />
                    )}
                  </div>
                  {status}
                </button>
              ))}
            </div>
          )}
        </button>

        {/* Sender Filter */}
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
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
          ref={senderDropdownRef as any}
        >
          <HiOutlineViewBoards className="text-gray-400 text-lg" />
          <span>Sender</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showSenderDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
              {availableSenders.map((sender) => (
                <button
                  key={sender}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSender(sender);
                    setShowSenderDropdown(false);
                  }}
                >
                  <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                    {selectedSender === sender && (
                      <FaCheckCircle className="text-primary" size={12} />
                    )}
                  </div>
                  {sender}
                </button>
              ))}
            </div>
          )}
        </button>

        {/* Assignee Filter */}
        <button
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
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
          <BsPerson className="text-gray-400 text-lg" />
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
                    <FaCheckCircle className="text-primary" size={12} />
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
                    <FaCheckCircle className="text-primary" size={12} />
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
                      <FaCheckCircle className="text-primary" size={12} />
                    )}
                  </div>
                  {assignee}
                </button>
              ))}
            </div>
          )}
        </button>

        {/* Last 30 Days Filter */}
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
          <FaRegClock className="text-gray-400" size={18} />
          <span>Last 30 Days</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
        </button>
      </div>
      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-center px-2 py-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Avenir, sans-serif' }}>
          <div className="text-center">ID</div>
          <div>Document</div>
          <div>Parties</div>
          <div className="text-center">Status</div>
          <div className="text-center">Signatures</div>
          <div className="text-center">Contract ID</div>
          <div>Contract</div>
          <div>Assignee</div>
          <div className="text-center">Date Sent</div>
          <div className="text-center">Due Date</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredRows.length === 0 ? (
            <div className="text-center text-gray-400 py-8 col-span-11">No results found.</div>
          ) : (
            filteredRows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                <div className="text-center">
                  <span className="text-xs text-primary underline font-semibold cursor-pointer">{row.id}</span>
                </div>
                <div className="text-xs font-semibold">{row.document}</div>
                <div className="flex flex-col space-y-1">
                  {row.parties.map((party, idx) => (
                    <div key={idx}>{party}</div>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500">{row.status}</span>
                </div>
                <div className="text-center text-gray-600">{row.signatures}</div>
                <div className="text-center">
                  <span className="text-xs text-primary underline font-semibold cursor-pointer">{row.contractId}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">{row.contract}</p>
                </div>
                <div className="text-left">{row.assignee}</div>
                <div className="text-center">{row.dateSent}</div>
                <div className="text-center">{row.dueDate}</div>
                <div className="flex space-x-1 justify-center">
                  <button
                    className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    title="View"
                  >
                    <HiOutlineEye className="h-4 w-4" />
                  </button>
                  <button
                    className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    title="Send Reminder"
                  >
                    <LuBellRing className="h-4 w-4" />
                  </button>
                  <button
                    className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    title="Download"
                  >
                    <HiOutlineDownload className="h-4 w-4" />
                  </button>
                  <button
                    className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    title="Void"
                  >
                    <MdCancelPresentation className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 