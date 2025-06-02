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
                activeTab === 'all' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
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
                    <div className="text-center">Status</div>
                    <div className="text-center">Signatures</div>
                    <div className="text-center whitespace-nowrap">ID</div>
                    <div className="text-left">Contract</div>
                    <div className="text-left">Assignee</div>
                    <div className="text-center">Date Sent</div>
                    <div className="text-center">Due Date</div>
                    <div className="text-center">Actions</div>
                  </div>
                </div>

                {/* Sample Signature Rows */}
                {/* Pending Signature Row 1 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Michael Brown') && matchesSearch({
                  document: 'Purchase Agreement',
                  parties: ['John Smith (Buyer)', 'Sarah Wilson (Seller)'],
                  contract: 'Property Sale Contract',
                  id: '1234',
                  contractId: '8423'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">1234</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Purchase Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>John Smith (Buyer)</div>
                      <div>Sarah Wilson (Seller)</div>
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
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Michael Brown</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-18</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-30</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Send Reminder">
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Void">
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Pending Signature Row 2 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Robert Green') && matchesSearch({
                  document: 'Lease Agreement',
                  parties: ['Sarah Johnson (Tenant)', 'TechStart Inc. (Landlord)'],
                  contract: 'Commercial Lease Escrow',
                  id: '2345',
                  contractId: '9102'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">2345</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Lease Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Sarah Johnson (Tenant)</div>
                      <div>TechStart Inc. (Landlord)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">0 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9102</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Commercial Lease Escrow</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Robert Green</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-17</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-25</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Send Reminder">
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Void">
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Pending Signature Row 3 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Emily Davis') && matchesSearch({
                  document: 'Trust Transfer Deed',
                  parties: ['Michael Lee (Trustee)', 'David Chen (Beneficiary)'],
                  contract: 'New Property Acquisition',
                  id: '5678',
                  contractId: '9548'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">5678</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Trust Transfer Deed</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Michael Lee (Trustee)</div>
                      <div>David Chen (Beneficiary)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500">Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 3</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9548</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>New Property Acquisition</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emily Davis</div>
                    <div className="text-center">2024-05-19</div>
                    <div className="text-center">2024-05-26</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Send Reminder">
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Void">
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Pending Signature Row 4 */}
                {(activeTab === 'all' || activeTab === 'pending') && shouldShowRow('Pending') && shouldShowAssignee('Robert Green') && matchesSearch({
                  document: 'Lease Agreement',
                  parties: ['Sarah Johnson (Tenant)', 'TechStart Inc. (Landlord)'],
                  contract: 'Commercial Lease Escrow',
                  id: '8901',
                  contractId: '9102'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">8901</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Lease Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Sarah Johnson (Tenant)</div>
                      <div>TechStart Inc. (Landlord)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Pending</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9102</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Commercial Lease Escrow</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Robert Green</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-20</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-27</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Send Reminder">
                        <LuBellRing className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Void">
                        <MdCancelPresentation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed Signature Row 1 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Michael Brown') && matchesSearch({
                  document: 'Deed Transfer',
                  parties: ['Michael Brown (Seller)', 'Robert Green (Buyer)'],
                  contract: 'Residential Sale Agreement',
                  id: '3456',
                  contractId: '7234'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">3456</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Deed Transfer</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Michael Brown (Seller)</div>
                      <div>Robert Green (Buyer)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">2 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">7234</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Residential Sale Agreement</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Michael Brown</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-15</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-22</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed Signature Row 2 */}
                {(activeTab === 'all' || activeTab === 'completed') && shouldShowRow('Completed') && shouldShowAssignee('Emily Davis') && matchesSearch({
                  document: 'Purchase Agreement',
                  parties: ['Robert Johnson (Owner)', 'Urban Outfitters Co. (Buyer)'],
                  contract: 'Retail Space Lease',
                  id: '4567',
                  contractId: '6453'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">4567</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Purchase Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Robert Johnson (Owner)</div>
                      <div>Urban Outfitters Co. (Buyer)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Completed</span>
                    </div>
                    <div className="text-center text-gray-600">2 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">6453</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Retail Space Lease</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emily Davis</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-14</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-21</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Rejected Signature Row 1 */}
                {activeTab === 'all' && shouldShowRow('Rejected') && shouldShowAssignee('Michael Brown') && matchesSearch({
                  document: 'Purchase Agreement',
                  parties: ['John Smith (Buyer)', 'Sarah Wilson (Seller)'],
                  contract: 'Property Sale Contract',
                  id: '1234',
                  contractId: '8423'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">1234</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Purchase Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>John Smith (Buyer)</div>
                      <div>Sarah Wilson (Seller)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Rejected</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">8423</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Property Sale Contract</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Michael Brown</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-18</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-30</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Rejected Signature Row 2 */}
                {activeTab === 'all' && shouldShowRow('Rejected') && shouldShowAssignee('Robert Green') && matchesSearch({
                  document: 'Lease Agreement',
                  parties: ['Sarah Johnson (Tenant)', 'TechStart Inc. (Landlord)'],
                  contract: 'Commercial Lease Escrow',
                  id: '2345',
                  contractId: '9102'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">2345</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Lease Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Sarah Johnson (Tenant)</div>
                      <div>TechStart Inc. (Landlord)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Rejected</span>
                    </div>
                    <div className="text-center text-gray-600">0 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9102</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Commercial Lease Escrow</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Robert Green</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-17</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-25</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Expired Signature Row 1 */}
                {activeTab === 'all' && shouldShowRow('Expired') && shouldShowAssignee('Emily Davis') && matchesSearch({
                  document: 'Trust Transfer Deed',
                  parties: ['Michael Lee (Trustee)', 'David Chen (Beneficiary)'],
                  contract: 'New Property Acquisition',
                  id: '5678',
                  contractId: '9548'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">5678</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Trust Transfer Deed</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Michael Lee (Trustee)</div>
                      <div>David Chen (Beneficiary)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Expired</span>
                    </div>
                    <div className="text-center text-gray-600">1 of 3</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">9548</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>New Property Acquisition</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emily Davis</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-19</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-26</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Expired Signature Row 2 */}
                {activeTab === 'all' && shouldShowRow('Expired') && shouldShowAssignee('Emily Davis') && matchesSearch({
                  document: 'Purchase Agreement',
                  parties: ['Robert Johnson (Owner)', 'Urban Outfitters Co. (Buyer)'],
                  contract: 'Retail Space Lease',
                  id: '4567',
                  contractId: '6453'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">4567</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Purchase Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>Robert Johnson (Owner)</div>
                      <div>Urban Outfitters Co. (Buyer)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Expired</span>
                    </div>
                    <div className="text-center text-gray-600">2 of 3</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">6453</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Retail Space Lease</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Emily Davis</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-14</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-21</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Voided Signature Row */}
                {activeTab === 'all' && shouldShowRow('Voided') && shouldShowAssignee('Michael Brown') && matchesSearch({
                  document: 'Purchase Agreement',
                  parties: ['John Smith (Buyer)', 'Sarah Wilson (Seller)'],
                  contract: 'Property Sale Contract',
                  id: '7890',
                  contractId: '8423'
                }) && (
                  <div className="grid grid-cols-[60px_180px_200px_120px_100px_100px_180px_120px_120px_120px_220px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">7890</span>
                    </div>
                    <div className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Purchase Agreement</div>
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <div>John Smith (Buyer)</div>
                      <div>Sarah Wilson (Seller)</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>Voided</span>
                    </div>
                    <div className="text-center text-gray-600">0 of 2</div>
                    <div className="text-center">
                      <span className="text-primary underline font-semibold cursor-pointer">8423</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'Avenir, sans-serif' }}>Property Sale Contract</p>
                    </div>
                    <div className="text-left" style={{ fontFamily: 'Avenir, sans-serif' }}>Michael Brown</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-18</div>
                    <div className="text-center" style={{ fontFamily: 'Avenir, sans-serif' }}>2024-05-30</div>
                    <div className="flex space-x-1 justify-center">
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                      <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                        <HiOutlineDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 