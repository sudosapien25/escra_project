'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaUser, FaCheckCircle, FaFilter, FaSort } from 'react-icons/fa';
import { HiOutlineEye, HiOutlineDownload, HiOutlineViewBoards, HiOutlineTrash } from 'react-icons/hi';
import { HiMiniChevronUpDown, HiMiniChevronDown } from 'react-icons/hi2';
import { LuPen, LuCalendarClock, LuBellRing } from 'react-icons/lu';
import { MdOutlineEditCalendar, MdCancelPresentation } from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';
import clsx from 'clsx';
import { IconBaseProps } from 'react-icons';

export default function SignaturesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['All']);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    document: string;
    parties: string[];
    status: string;
    signatures: string;
    contractId: string;
    contract: string;
    assignee: string;
    dateSent: string;
    dueDate: string;
  } | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
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

  // Available assignees
  const availableAssignees = [
    'Michael Brown',
    'Robert Green',
    'Emily Davis'
  ];

  // Function to check if a row should be shown based on selected statuses
  const shouldShowRow = (status: string) => {
    if (selectedStatuses.includes('All')) return true;
    return selectedStatuses.includes(status);
  };

  // Function to check if a row should be shown based on selected assignees
  const shouldShowAssignee = (assignee: string) => {
    if (selectedAssignees.length === 0) return true;
    return selectedAssignees.includes(assignee);
  };

  // Function to check if a row matches the search term
  const matchesSearch = (row: {
    document: string;
    parties: string[];
    contract: string;
    id: string;
    contractId: string;
  }) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.document.toLowerCase().includes(searchLower) ||
      row.parties.some(party => party.toLowerCase().includes(searchLower)) ||
      row.contract.toLowerCase().includes(searchLower) ||
      row.id.toLowerCase().includes(searchLower) ||
      row.contractId.toLowerCase().includes(searchLower)
    );
  };

  // Handle click outside for status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(event.target as Node)) {
        setShowAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
      {/* Signatures Title and Subtitle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1">
          <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Signatures</h1>
          <p className="text-gray-500 text-[15px] md:text-[16px] mt-0" style={{ fontFamily: 'Avenir, sans-serif' }}>Manage electronic signatures for all your contracts</p>
        </div>
        {/* Placeholder for potential button/actions */}
        <div className="flex items-center space-x-0 md:space-x-4 w-full md:w-auto">
          {/* Request Signature Button */}
          <button className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <LuPen className="mr-2 text-base" />
            Request Signature
          </button>
        </div>
      </div>

      {/* Horizontal line below subtitle */}
      <hr className="my-6 border-gray-300" />

      {/* Search/Filter Bar - outlined box (identical to contracts page) */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0">
          <FaSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search documents, parties, contracts or IDs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          />
        </div>
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          ref={statusDropdownRef as any}
        >
          <HiOutlineViewBoards className="text-gray-400 text-lg" />
          <span>Status</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }} ref={statusDropdownRef}>
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                    selectedStatuses.includes(status) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                  }`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (status === 'All') {
                      setSelectedStatuses(['All']);
                    } else {
                      setSelectedStatuses(prev => {
                        const newStatuses = prev.filter(s => s !== 'All');
                        if (prev.includes(status)) {
                          const filtered = newStatuses.filter(s => s !== status);
                          return filtered.length === 0 ? ['All'] : filtered;
                        } else {
                          return [...newStatuses, status];
                        }
                      });
                    }
                  }}
                >
                  <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedStatuses.includes(status) ? 'bg-primary' : 'border border-gray-300'}`}>
                    {selectedStatuses.includes(status) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {status}
                </button>
              ))}
            </div>
          )}
        </button>
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1 relative" 
          style={{ fontFamily: 'Avenir, sans-serif' }}
          onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
          ref={assigneeDropdownRef as any}
        >
          <BsPerson className="text-gray-400 text-lg" />
          <span>Assignee</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
          
          {showAssigneeDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }} ref={assigneeDropdownRef}>
              <button
                className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                  selectedAssignees.length === 0 ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                }`}
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssignees([]);
                }}
              >
                <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedAssignees.length === 0 ? 'bg-primary' : 'border border-gray-300'}`}>
                  {selectedAssignees.length === 0 && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                All Assignees
              </button>
              {availableAssignees.map((assignee) => (
                <button
                  key={assignee}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                    selectedAssignees.includes(assignee) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                  }`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => {
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
                  <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedAssignees.includes(assignee) ? 'bg-primary' : 'border border-gray-300'}`}>
                    {selectedAssignees.includes(assignee) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {assignee}
                </button>
              ))}
            </div>
          )}
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
          <LuCalendarClock className="text-gray-400" size={18} />
          <span>Last 30 days</span>
          <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[150px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
          <MdOutlineEditCalendar className="text-gray-400" size={18} />
          <span>Recently Updated</span>
          <HiMiniChevronUpDown className="ml-1 text-gray-400" size={16} />
        </button>
      </div>

      {/* Page content - Tabs and Signature List */}
      <div className="space-y-4">
        {/* White Box Container */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 border-b border-gray-200">
            <button
              className={clsx(
                "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                activeTab === 'pending' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={clsx(
                "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                activeTab === 'completed' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button
              className={clsx(
                "pb-2 border-b-2 text-sm w-full sm:w-auto font-bold",
                activeTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
          </div>

          {/* Signature List Content based on Active Tab */}
          <div className="mt-4">
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
              <div className="min-w-full divide-y divide-gray-200">
                <div className="sticky top-0 z-10 bg-gray-50">
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">ID</div>
                    <div className="text-left">Document</div>
                    <div className="text-left">Parties</div>
                    <div className="text-center">Signing Status</div>
                    <div className="text-center">Signatures</div>
                    <div className="text-center whitespace-nowrap">ID</div>
                    <div className="text-left">Contract</div>
                    <div className="text-left">Assignee</div>
                    <div className="text-center">Date Sent</div>
                    <div className="text-center">Due Date</div>
                    <div className="text-center">Actions</div>
                  </div>
                </div>

                {/* Document Row 1 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('John Smith') && matchesSearch({
                  document: 'Purchase Agreement',
                  parties: ['Robert Chen', 'Eastside Properties'],
                  contract: 'New Property Acquisition',
                  id: '1234',
                  contractId: '9548'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '1234',
                      document: 'Purchase Agreement',
                      parties: ['Robert Chen', 'Eastside Properties'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '9548',
                      contract: 'New Property Acquisition',
                      assignee: 'John Smith',
                      dateSent: '2024-03-15',
                      dueDate: '2024-03-30'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">1234</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Purchase Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Robert Chen</div>
                      <div>Eastside Properties</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9548</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>New Property Acquisition</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>John Smith</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-15</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-30</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 2 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Sarah Johnson') && matchesSearch({
                  document: 'Property Survey',
                  parties: ['GreenSpace Developers'],
                  contract: 'Land Development Contract',
                  id: '2345',
                  contractId: '9550'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '2345',
                      document: 'Property Survey',
                      parties: ['GreenSpace Developers'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '9550',
                      contract: 'Land Development Contract',
                      assignee: 'Sarah Johnson',
                      dateSent: '2024-03-14',
                      dueDate: '2024-03-29'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">2345</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Property Survey</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>GreenSpace Developers</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9550</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Land Development Contract</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Sarah Johnson</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-14</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-29</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 3 */}
                {(activeTab === 'all' || activeTab === 'rejected') && shouldShowRow('Rejected') && shouldShowAssignee('Michael Brown') && matchesSearch({
                  document: 'Inspection Report',
                  parties: ['BuildRight', 'Horizon Developers'],
                  contract: 'Construction Escrow',
                  id: '3456',
                  contractId: '9145'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '3456',
                      document: 'Inspection Report',
                      parties: ['BuildRight', 'Horizon Developers'],
                      status: 'Rejected',
                      signatures: '0 of 2',
                      contractId: '9145',
                      contract: 'Construction Escrow',
                      assignee: 'Michael Brown',
                      dateSent: '2024-03-13',
                      dueDate: '2024-03-28'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">3456</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Inspection Report</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>BuildRight</div>
                      <div>Horizon Developers</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Rejected</span>
                    </div>
                    <div className="text-center text-gray-600">0 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9145</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Construction Escrow</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Michael Brown</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-13</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-28</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 4 */}
                {(activeTab === 'all' || activeTab === 'expired') && shouldShowRow('Expired') && shouldShowAssignee('Emma Johnson') && matchesSearch({
                  document: 'Lease Agreement',
                  parties: ['Pacific Properties'],
                  contract: 'Commercial Lease Amendment',
                  id: '4567',
                  contractId: '8784'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '4567',
                      document: 'Lease Agreement',
                      parties: ['Pacific Properties'],
                      status: 'Expired',
                      signatures: '0 of 1',
                      contractId: '8784',
                      contract: 'Commercial Lease Amendment',
                      assignee: 'Emma Johnson',
                      dateSent: '2024-03-12',
                      dueDate: '2024-03-27'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">4567</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Lease Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Pacific Properties</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Expired</span>
                    </div>
                    <div className="text-center text-gray-600">0 of 1</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">8784</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Commercial Lease Amendment</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emma Johnson</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-12</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-27</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 5 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Robert Chen') && matchesSearch({
                  document: 'Title Insurance',
                  parties: ['John Smith', 'Emma Johnson'],
                  contract: 'Property Sale Contract',
                  id: '5678',
                  contractId: '8423'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '5678',
                      document: 'Title Insurance',
                      parties: ['John Smith', 'Emma Johnson'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '8423',
                      contract: 'Property Sale Contract',
                      assignee: 'Robert Chen',
                      dateSent: '2024-03-11',
                      dueDate: '2024-03-26'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">5678</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Title Insurance</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>John Smith</div>
                      <div>Emma Johnson</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">8423</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Property Sale Contract</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Robert Chen</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-11</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-26</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 6 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Sarah Miller') && matchesSearch({
                  document: 'Wire Authorization',
                  parties: ['Global Investors Group'],
                  contract: 'Investment Property Escrow',
                  id: '6789',
                  contractId: '7804'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '6789',
                      document: 'Wire Authorization',
                      parties: ['Global Investors Group'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '7804',
                      contract: 'Investment Property Escrow',
                      assignee: 'Sarah Miller',
                      dateSent: '2024-03-10',
                      dueDate: '2024-03-25'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">6789</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Wire Authorization</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Global Investors Group</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">7804</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Investment Property Escrow</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Sarah Miller</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-10</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-25</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 7 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('David Miller') && matchesSearch({
                  document: 'Appraisal Report',
                  parties: ['David Miller', 'Sarah Thompson'],
                  contract: 'Residential Sale Agreement',
                  id: '7890',
                  contractId: '7234'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '7890',
                      document: 'Appraisal Report',
                      parties: ['David Miller', 'Sarah Thompson'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '7234',
                      contract: 'Residential Sale Agreement',
                      assignee: 'David Miller',
                      dateSent: '2024-03-09',
                      dueDate: '2024-03-24'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">7890</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Appraisal Report</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>David Miller</div>
                      <div>Sarah Thompson</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">7234</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Residential Sale Agreement</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>David Miller</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-09</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-24</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 8 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Emily Davis') && matchesSearch({
                  document: 'Closing Disclosure',
                  parties: ['Riverfront Ventures'],
                  contract: 'Office Building Purchase',
                  id: '8901',
                  contractId: '6891'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '8901',
                      document: 'Closing Disclosure',
                      parties: ['Riverfront Ventures'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '6891',
                      contract: 'Office Building Purchase',
                      assignee: 'Emily Davis',
                      dateSent: '2024-03-08',
                      dueDate: '2024-03-23'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">8901</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Closing Disclosure</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Riverfront Ventures</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">6891</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Office Building Purchase</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emily Davis</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-08</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-23</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 9 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Alex Johnson') && matchesSearch({
                  document: 'Loan Estimate',
                  parties: ['Urban Outfitters Co.'],
                  contract: 'Retail Space Lease',
                  id: '9012',
                  contractId: '6453'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '9012',
                      document: 'Loan Estimate',
                      parties: ['Urban Outfitters Co.'],
                      status: 'Completed',
                      signatures: '1 of 1',
                      contractId: '6453',
                      contract: 'Retail Space Lease',
                      assignee: 'Alex Johnson',
                      dateSent: '2024-03-07',
                      dueDate: '2024-03-22'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9012</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Loan Estimate</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Urban Outfitters Co.</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 1</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">6453</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Retail Space Lease</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Alex Johnson</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-07</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-22</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Row 10 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Samantha Fox') && matchesSearch({
                  document: 'Deed Transfer',
                  parties: ['Samantha Fox', 'Elite Estates'],
                  contract: 'Luxury Villa Purchase',
                  id: '0123',
                  contractId: '10003'
                }) && (
                  <div 
                    className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50 cursor-pointer" 
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                    onClick={() => setSelectedDocument({
                      id: '0123',
                      document: 'Deed Transfer',
                      parties: ['Samantha Fox', 'Elite Estates'],
                      status: 'Pending',
                      signatures: '1 of 2',
                      contractId: '10003',
                      contract: 'Luxury Villa Purchase',
                      assignee: 'Samantha Fox',
                      dateSent: '2024-03-06',
                      dueDate: '2024-03-21'
                    })}
                  >
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">0123</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Deed Transfer</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Samantha Fox</div>
                      <div>Elite Estates</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">10003</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Luxury Villa Purchase</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Samantha Fox</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-06</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-03-21</div>
                    <div className="flex space-x-1 justify-center">
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add view action here
                        }}
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Send Reminder"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add send reminder action here
                        }}
                      >
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add download action here
                        }}
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button 
                        className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" 
                        title="Void"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add void action here
                        }}
                      >
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header with Document ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-white px-6 py-4">
              <div className="flex items-start justify-between">
                {/* Left: Document ID and Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-bold bg-gray-700 text-white px-2 py-0.5 rounded border border-gray-600">
                      #{selectedDocument.id}
                    </span>
                  </div>
                </div>
                {/* Right: Close Button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                  onClick={() => setSelectedDocument(null)}
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
                {/* Modal Content Grid: 2 columns */}
                <div className="grid grid-cols-2 gap-6 w-full h-full min-h-0 -mt-2">
                  {/* LEFT COLUMN: Document Details */}
                  <div className="flex flex-col gap-6 w-full h-full min-h-0">
                    {/* Document Details Box */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Details</h3>
                      <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                        {/* Row 1: Document ID, Document Hash, and Contract ID */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document ID</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document Hash</div>
                          <div className="text-xs text-black mb-4"></div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.contractId}</div>
                        </div>
                        {/* Row 2: Document Name and Contract Name */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Document Name</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.document}</div>
                        </div>
                        <div></div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Contract Name</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.contract}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Signature Details */}
                  <div className="flex flex-col gap-6 w-full h-full min-h-0">
                    {/* Signature Details Box */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Signature Details</h3>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        {/* Row 1: Parties and Signatures */}
                        <div className="col-span-2">
                          <div className="grid grid-cols-3 gap-x-12">
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Parties</div>
                              <div className="text-xs text-black mb-4">
                                {selectedDocument.parties.map((party, index) => (
                                  <div key={index}>{party}</div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Signatures</div>
                              <div className="text-xs text-black mb-4 flex flex-col gap-2">
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full" 
                                    style={{ 
                                      width: `${(parseInt(selectedDocument.signatures.split(' of ')[0]) / parseInt(selectedDocument.signatures.split(' of ')[1])) * 100}%` 
                                    }}
                                  />
                                </div>
                                {selectedDocument.signatures}
                              </div>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        {/* Row 2: Status */}
                        <div className="col-span-2">
                          <div className="text-gray-500 text-xs mb-1">Status</div>
                          <span className={`inline-flex items-center justify-center min-w-[130px] h-7 px-4 font-semibold rounded-full text-xs ${
                            selectedDocument.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-500' :
                            selectedDocument.status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-500' :
                            selectedDocument.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-500' :
                            'bg-gray-100 text-gray-800 border border-gray-500'
                          }`}>{selectedDocument.status}</span>
                        </div>
                        {/* Row 3: Due Date, Last Reminder Date, and Date Sent */}
                        <div className="col-span-2">
                          <div className="grid grid-cols-3 gap-x-12">
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Due Date</div>
                              <div className="text-xs text-black mb-4">{selectedDocument.dueDate}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Last Reminder Date</div>
                              <div className="text-xs text-black mb-4"></div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">Date Sent</div>
                              <div className="text-xs text-black mb-4">{selectedDocument.dateSent}</div>
                            </div>
                          </div>
                        </div>
                        {/* Row 4: Assignee */}
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Assignee</div>
                          <div className="text-xs text-black mb-4">{selectedDocument.assignee}</div>
                        </div>
                        <div></div>
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