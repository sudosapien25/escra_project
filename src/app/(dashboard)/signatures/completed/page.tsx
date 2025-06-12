"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { FaSearch, FaCheckCircle, FaCheck } from "react-icons/fa";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards } from "react-icons/hi";
import { LuBellRing } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";
import { TbClockPin } from "react-icons/tb";
import { RiUserSearchLine } from 'react-icons/ri';

const completedRows = [
  // Example data, should match the 'Completed' filter from the main signatures page
  {
    id: "9012",
    document: "Loan Estimate",
    parties: ["Urban Outfitters Co."],
    status: "Completed",
    signatures: "1 of 1",
    contractId: "6453",
    contract: "Retail Space Lease",
    assignee: "Alex Johnson",
    dateSent: "2024-03-07",
    dueDate: "2024-03-22"
  },
  {
    id: "8901",
    document: "Closing Disclosure",
    parties: ["David Taylor"],
    status: "Completed",
    signatures: "1 of 1",
    contractId: "6891",
    contract: "Office Building Purchase",
    assignee: "Emily Davis",
    dateSent: "2024-03-09",
    dueDate: "2024-03-24"
  },
  {
    id: "0123",
    document: "Property Survey",
    parties: ["James Thompson"],
    status: "Completed",
    signatures: "1 of 1",
    contractId: "10003",
    contract: "Luxury Villa Purchase",
    assignee: "Samantha Fox",
    dateSent: "2024-03-07",
    dueDate: "2024-03-22"
  }
];

export default function CompletedPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSenderDropdown, setShowSenderDropdown] = useState(false);
  const [selectedSender, setSelectedSender] = useState('Sent by anyone');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showLast30DaysDropdown, setShowLast30DaysDropdown] = useState(false);
  const senderDropdownRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const last30DaysDropdownRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'dateSent', direction: 'desc' });

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

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedData = () => {
    return [...completedRows].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b] ? 1 : -1;
      }
      return a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b] ? 1 : -1;
    });
  };

  const filteredRows = getSortedData().filter((row) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.document.toLowerCase().includes(searchLower) ||
      row.parties.some((party) => party.toLowerCase().includes(searchLower)) ||
      row.contract.toLowerCase().includes(searchLower) ||
      row.id.toLowerCase().includes(searchLower) ||
      row.contractId.toLowerCase().includes(searchLower)
    );
  }).filter(row => shouldShowSender(row.assignee, row.parties) && shouldShowAssignee(row.assignee));

  return (
    <div className="space-y-4" style={{ fontFamily: "Avenir, sans-serif" }}>
      <div className="pb-1">
        <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-1" style={{ fontFamily: "Avenir, sans-serif" }}>Completed</h1>
        <p className="text-gray-500 text-[15px] md:text-[16px] mt-0" style={{ fontFamily: "Avenir, sans-serif" }}>View your completed signature requests</p>
      </div>
      <hr className="my-6 border-gray-300" />
      {/* Search Bar and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0 flex-1 mr-1">
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
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSenderDropdown(prev => !prev);
            if (!showSenderDropdown) {
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
        </button>

        {/* Assignee Filter */}
        <button
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
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
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative whitespace-nowrap" 
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
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '200px' }}>Parties</th>
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
                      <span className="inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full border bg-green-100 text-green-800 border-green-500">
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