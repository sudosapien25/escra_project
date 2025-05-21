
'use client';

import React, { useState } from 'react';
import { FaSearch, FaPencilAlt, FaUser, FaCheckCircle, FaFilter, FaSort, FaCalendarAlt } from 'react-icons/fa';
import { HiOutlineEye, HiOutlineDownload } from 'react-icons/hi';
import { LuPen } from 'react-icons/lu';
import { FaRegClock } from 'react-icons/fa';
import clsx from 'clsx';
import { IconBaseProps
  
 } from 'react-icons';

export default function SignaturesPage() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="space-y-4">
      {/* Signatures Title and Subtitle */}
      <div className="flex justify-between items-center">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1">
          <h1 className="text-[30px] font-bold text-black mb-1">Signatures</h1>
          <p className="text-gray-500 text-[16px] mt-0">Manage electronic signatures for all your contracts</p>
        </div>
        {/* Placeholder for potential button/actions */}
        <div className="flex items-center space-x-4">
          {/* Request Signature Button */}
          <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
            <LuPen className="mr-2 text-base" />
            Request Signature
          </button>
        </div>
      </div>

      {/* Horizontal line below subtitle */}
      <hr className="my-6 border-gray-300" />

      {/* Search/Filter Bar - outlined box (identical to contracts page) */}
      <div className="bg-white border border-gray-300 rounded-xl px-6 py-4 mb-6 shadow-sm">
        <div className="flex w-full items-center gap-3">
          {/* Search input */}
          <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2">
            <FaSearch className="text-gray-400 mr-2 text-lg" />
            <input
              type="text"
              placeholder="Search contracts or parties"
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-sm text-gray-700 placeholder-gray-400 font-medium"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            />
          </div>
          {/* Status filter */}
          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 font-medium text-sm min-w-[120px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaFilter className="text-gray-400 text-lg" />
            <span>All Statuses</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
          {/* Date filter */}
          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 font-medium text-sm min-w-[120px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaCalendarAlt className="text-gray-400 text-lg" />
            <span>Last 30 days</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
          {/* Sort filter */}
          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 font-medium text-sm min-w-[150px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaSort className="text-gray-400 text-lg" />
            <span>Recently Updated</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
        </div>
      </div>

      {/* Page content - Tabs and Signature List */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={clsx(
              "pb-2 border-b-2 text-sm",
              activeTab === 'pending' ? "border-teal-600 text-teal-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={clsx(
              "pb-2 border-b-2 text-sm",
              activeTab === 'completed' ? "border-teal-600 text-teal-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button
            className={clsx(
              "pb-2 border-b-2 text-sm",
              activeTab === 'all' ? "border-teal-600 text-teal-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('all')}
          >
            All Signatures
          </button>
        </div>

        {/* Signature List Content based on Active Tab */}
        <div>
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {/* Sample Signature Card 1 (Pending) */}
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-start">
                <div className="flex items-start space-x-3 w-64 flex-shrink-0">
                  {/* Clock Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
                    <FaRegClock className="text-lg" />
                  </div>
                  {/* Contract Info */}
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800">Property Sale Contract</h3>
                    <p className="text-sm text-gray-600">Contract ID: #8423</p>
                    <p className="text-sm text-gray-600 flex items-center"><FaUser className="mr-1" /> John Smith (Buyer)</p>
                  </div>
                </div>
                {/* Document Info and Dates */}
                <div className="flex-1 ml-96">
                  <p className="text-md font-semibold text-gray-800">Document: Purchase Agreement</p>
                  <p className="text-sm text-gray-600 flex items-center"><FaCalendarAlt className="mr-1" /> Due by May 22, 2025</p>
                  <p className="text-sm text-gray-600">Sent on May 18, 2025</p>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-8">
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm">Send Reminder</button>
                  <button className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                    {React.createElement(HiOutlineEye, { className: "w-4 h-4" } as IconBaseProps)}
                  </button>
                </div>
              </div>

              {/* Sample Signature Card 2 (Pending) */}
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-start">
                <div className="flex items-start space-x-3 w-64 flex-shrink-0">
                  {/* Clock Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
                    <FaRegClock className="text-lg" />
                  </div>
                  {/* Contract Info */}
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800">Commercial Lease Escrow</h3>
                    <p className="text-sm text-gray-600">Contract ID: #9102</p>
                    <p className="text-sm text-gray-600 flex items-center"><FaUser className="mr-1" /> Sarah Johnson (Tenant)</p>
                  </div>
                </div>
                {/* Document Info and Dates */}
                <div className="flex-1 ml-96">
                  <p className="text-md font-semibold text-gray-800">Document: Lease Agreement</p>
                  <p className="text-sm text-gray-600 flex items-center"><FaCalendarAlt className="mr-1" /> Due by May 25, 2025</p>
                  <p className="text-sm text-gray-600">Sent on May 17, 2025</p>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-8">
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm">Send Reminder</button>
                  <button className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                    {React.createElement(HiOutlineEye, { className: "w-4 h-4" } as IconBaseProps)}
                  </button>
                </div>
              </div>

              {/* Sample Signature Card 3 (Pending) */}
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-start">
                <div className="flex items-start space-x-3 w-64 flex-shrink-0">
                  {/* Clock Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
                    <FaRegClock className="text-lg" />
                  </div>
                  {/* Contract Info */}
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800">Trust Account Transfer</h3>
                    <p className="text-sm text-gray-600">Contract ID: #7845</p>
                    <p className="text-sm text-gray-600 flex items-center"><FaUser className="mr-1" /> Michael Lee (Trustee)</p>
                  </div>
                </div>
                {/* Document Info and Dates */}
                <div className="flex-1 ml-96">
                  <p className="text-md font-semibold text-gray-800">Document: Trust Transfer Deed</p>
                  <p className="text-sm text-gray-600 flex items-center"><FaCalendarAlt className="mr-1" /> Due by May 30, 2025</p>
                  <p className="text-sm text-gray-600">Sent on May 19, 2025</p>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-8">
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm">Send Reminder</button>
                  <button className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm">
                    {React.createElement(HiOutlineEye, { className: "w-4 h-4" } as IconBaseProps)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {/* Sample Signature Card 1 (Completed) */}
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-start">
                <div className="flex items-start space-x-3 w-64 flex-shrink-0">
                  {/* Checkmark Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                    <FaCheckCircle className="text-lg" />
                  </div>
                  {/* Contract Info */}
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800">Residential Sale Escrow</h3>
                    <p className="text-sm text-gray-600">Contract ID: #6592</p>
                    <p className="text-sm text-gray-600 flex items-center"><FaUser className="mr-1" /> Emily Davis (Seller)</p>
                  </div>
                </div>
                {/* Document Info and Dates */}
                <div className="flex-1 ml-96">
                  <p className="text-md font-semibold text-gray-800">Document: Deed Transfer</p>
                  <p className="text-sm text-gray-600 flex items-center"><FaCheckCircle className="mr-1" /> Completed on May 15, 2025</p>
                  <p className="text-sm text-gray-600">Signed by Emily Davis</p>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-8">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm flex items-center justify-center">
                    {React.createElement(HiOutlineDownload, { className: "w-4 h-4" } as IconBaseProps)}
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm flex items-center justify-center">
                    {React.createElement(HiOutlineEye, { className: "w-4 h-4" } as IconBaseProps)}
                  </button>
                </div>
              </div>

              {/* Sample Signature Card 2 (Completed) */}
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-start">
                <div className="flex items-start space-x-3 w-64 flex-shrink-0">
                  {/* Checkmark Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                    <FaCheckCircle className="text-lg" />
                  </div>
                  {/* Contract Info */}
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800">Commercial Property Escrow</h3>
                    <p className="text-sm text-gray-600">Contract ID: #7103</p>
                    <p className="text-sm text-gray-600 flex items-center"><FaUser className="mr-1" /> Robert Johnson (Owner)</p>
                  </div>
                </div>
                {/* Document Info and Dates */}
                <div className="flex-1 ml-96">
                  <p className="text-md font-semibold text-gray-800">Document: Purchase Agreement</p>
                  <p className="text-sm text-gray-600 flex items-center"><FaCheckCircle className="mr-1" /> Completed on May 14, 2025</p>
                  <p className="text-sm text-gray-600">Signed by Robert Johnson</p>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-8">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm flex items-center justify-center">
                    {React.createElement(HiOutlineDownload, { className: "w-4 h-4" } as IconBaseProps)}
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 text-sm flex items-center justify-center">
                    {React.createElement(HiOutlineEye, { className: "w-4 h-4" } as IconBaseProps)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'all' && (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 text-gray-500 font-normal text-sm uppercase">
                <div>Contract</div>
                <div>Document</div>
                <div>Party</div>
                <div>Status</div>
                <div>Date</div>
                <div className="text-center">Actions</div>
              </div>

              {/* Sample Signature Rows */}

              {/* Pending Signature Row 1 */}
              <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-gray-200 text-sm text-gray-800">
                <div>
                  <p className="font-semibold">Property Sale Contract</p>
                  <p className="text-gray-500">#8423</p>
                </div>
                <div>Purchase Agreement</div>
                <div>John Smith (Buyer)</div>
                <div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </div>
                <div>May 18, 2025</div>
                <div className="flex space-x-2 justify-center">
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineEye /></button>
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineDownload /></button>
                </div>
              </div>

              {/* Pending Signature Row 2 */}
              <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-gray-200 text-sm text-gray-800">
                <div>
                  <p className="font-semibold">Commercial Lease Escrow</p>
                  <p className="text-gray-500">#9102</p>
                </div>
                <div>Lease Agreement</div>
                <div>Sarah Johnson (Tenant)</div>
                <div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </div>
                <div>May 17, 2025</div>
                <div className="flex space-x-2 justify-center">
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineEye /></button>
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineDownload /></button>
                </div>
              </div>

              {/* Completed Signature Row 1 */}
              <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-gray-200 text-sm text-gray-800">
                <div>
                  <p className="font-semibold">Residential Sale Escrow</p>
                  <p className="text-gray-500">#6592</p>
                </div>
                <div>Deed Transfer</div>
                <div>Emily Davis (Seller)</div>
                <div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                </div>
                <div>May 15, 2025</div>
                <div className="flex space-x-2 justify-center">
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineEye /></button>
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineDownload /></button>
                </div>
              </div>

              {/* Completed Signature Row 2 */}
              <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-gray-200 text-sm text-gray-800">
                <div>
                  <p className="font-semibold">Commercial Property Escrow</p>
                  <p className="text-gray-500">#7103</p>
                </div>
                <div>Purchase Agreement</div>
                <div>Robert Johnson (Owner)</div>
                <div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                </div>
                <div>May 14, 2025</div>
                <div className="flex space-x-2 justify-center">
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineEye /></button>
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineDownload /></button>
                </div>
              </div>

              {/* Pending Signature Row 3 */}
              <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-gray-200 text-sm text-gray-800">
                <div>
                  <p className="font-semibold">Trust Account Transfer</p>
                  <p className="text-gray-500">#7845</p>
                </div>
                <div>Trust Transfer Deed</div>
                <div>Michael Lee (Trustee)</div>
                <div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </div>
                <div>May 19, 2025</div>
                <div className="flex space-x-2 justify-center">
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineEye /></button>
                  <button className="text-gray-700 hover:text-gray-900 text-sm"><HiOutlineDownload /></button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
} 