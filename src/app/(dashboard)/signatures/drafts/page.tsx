'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineEye, HiOutlineDownload, HiOutlineTrash } from 'react-icons/hi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
          {/* Table Header */}
          <div className="grid grid-cols-[90px_210px_210px_130px_210px_130px_140px_110px_150px] gap-4 items-center px-2 py-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <div className="text-center">ID</div>
            <div>Document</div>
            <div>Parties</div>
            <div className="text-center">Contract ID</div>
            <div>Contract</div>
            <div className="text-center">Status</div>
            <div>Assignee</div>
            <div className="text-center">Last Modified</div>
            <div className="text-center">Actions</div>
          </div>
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-[90px_210px_210px_130px_210px_130px_140px_110px_150px] gap-4 items-start px-2 py-4 border-b border-gray-200 text-xs text-gray-800 whitespace-nowrap hover:bg-gray-50" style={{ fontFamily: 'Avenir, sans-serif' }}>
              <div className="text-center">
                <span className="text-xs text-primary underline font-semibold cursor-pointer">1234</span>
              </div>
              <div className="text-xs font-semibold">Purchase Agreement</div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs">Robert Chen</span>
                <span className="text-xs">Eastside Properties</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-primary underline font-semibold cursor-pointer">9548</span>
              </div>
              <div className="text-xs font-semibold">New Property Acquisition</div>
              <div className="text-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-500">Draft</span>
              </div>
              <div className="text-left">
                <span className="text-xs">John Smith</span>
              </div>
              <div className="text-center">
                <span className="text-xs">2024-03-15</span>
              </div>
              <div className="flex space-x-1 justify-center">
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
                <button
                  className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  title="Delete"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 