'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineEye } from 'react-icons/hi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { TbEdit, TbPencilShare, TbTrash } from 'react-icons/tb';

export default function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "Avenir, sans-serif" }}>
      <div className="pb-1">
        <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-1" style={{ fontFamily: "Avenir, sans-serif" }}>
          Drafts
        </h1>
        <p className="text-gray-500 text-[15px] md:text-[16px] mt-0" style={{ fontFamily: "Avenir, sans-serif" }}>
          Manage your draft documents
        </p>
      </div>
      <hr className="my-6 border-gray-300" />

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 min-w-0" style={{ width: 'calc(100% - 520px)' }}>
          <FaSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search documents, parties, contracts or IDs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
            style={{ fontFamily: "Avenir, sans-serif" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '80px' }}>Document ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '180px' }}>Document</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '200px' }}>Recipients</th>
                <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style={{ minWidth: '120px' }}>Status</th>
                <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style={{ minWidth: '140px' }}>Contract ID</th>
                <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-left" style={{ minWidth: '180px' }}>Contract</th>
                <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-left" style={{ minWidth: '120px' }}>Assignee</th>
                <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style={{ minWidth: '140px' }}>Due Date</th>
                <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style={{ minWidth: '140px' }}>Last Modified</th>
                <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style={{ minWidth: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-2.5 text-xs text-center whitespace-nowrap">
                  <span className="text-primary underline font-semibold cursor-pointer">1234</span>
                </td>
                <td className="px-6 py-2.5 text-xs font-semibold whitespace-nowrap">Purchase Agreement</td>
                <td className="px-6 py-2.5 text-xs whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span>Robert Chen</span>
                    <span>Eastside Properties</span>
                  </div>
                </td>
                <td className="px-6 py-2.5 text-xs text-center whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-500 font-semibold">Draft</span>
                </td>
                <td className="px-6 py-2.5 text-xs text-center whitespace-nowrap">
                  <span className="text-primary underline font-semibold cursor-pointer">9548</span>
                </td>
                <td className="px-6 py-2.5 text-xs font-semibold whitespace-nowrap">New Property Acquisition</td>
                <td className="px-6 py-2.5 text-xs whitespace-nowrap text-left">John Smith</td>
                <td className="px-6 py-2.5 text-xs text-center whitespace-nowrap">2024-04-15</td>
                <td className="px-6 py-2.5 text-xs text-center whitespace-nowrap">2024-03-15</td>
                <td className="px-6 py-2.5 text-xs text-center whitespace-nowrap">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                      title="View"
                    >
                      <HiOutlineEye className="h-4 w-4" />
                    </button>
                    <button
                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <TbEdit className="h-4 w-4" />
                    </button>
                    <button
                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                      title="Send"
                    >
                      <TbPencilShare className="h-4 w-4" />
                    </button>
                    <button
                      className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                      title="Delete"
                    >
                      <TbTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 