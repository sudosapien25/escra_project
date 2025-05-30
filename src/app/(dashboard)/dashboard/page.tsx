"use client";
import React from 'react';
import { Card } from '@/components/common/Card';
import { FaFileContract, FaMoneyBillAlt, FaClock, FaPlus, FaArrowUp, FaDollarSign, FaCheckCircle, FaBox, FaChartLine } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import { LuPen } from 'react-icons/lu';
import NewContractModal from '@/components/common/NewContractModal';

export default function DashboardPage() {
  const [showNewContractModal, setShowNewContractModal] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Dashboard Title and Subtitle Group */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1">
          <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-0">Dashboard</h1>
          <p className="text-gray-500 text-[15px] md:text-[16px] mt-0">Overview of your contract closing activities & metrics</p>
        </div>
        <button
          className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
          onClick={() => setShowNewContractModal(true)}
        >
          <FaPlus className="mr-2 text-base" />
          New Contract
        </button>
        <NewContractModal isOpen={showNewContractModal} onClose={() => setShowNewContractModal(false)} />
      </div>

      {/* Horizontal line below subtitle */}
      <hr className="my-6 border-gray-300" />

      {/* Key Metrics Section */}
      <h2 className="text-[15px] font-bold text-gray-700 pt-6 mb-4">KEY METRICS</h2>

      {/* Flex container for the first two metric cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Metric Card 1: Total Contracts */}
        <Card className="flex flex-1 flex-col items-center text-center rounded-xl border border-gray-300 min-h-[120px] min-w-0">
          <div className="mb-2 p-3 rounded-full bg-purple-100 text-purple-800">
            {React.createElement(FaFileContract, { className: "text-2xl text-teal-600" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary">Total Contracts</p>
          <p className="text-xl font-bold text-primary">18</p>
        </Card>

        {/* Metric Card 3: Total Contract Value */}
        <Card className="flex flex-1 flex-col items-center text-center rounded-xl border border-gray-300 min-h-[120px] min-w-0">
          <div className="mb-2 p-3 rounded-full bg-purple-100 text-purple-800">
            {React.createElement(FaDollarSign, { className: "text-2xl text-teal-600" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary">Total Contract Value</p>
          <p className="text-xl font-bold text-primary">$5.2M</p>
           {/* Assuming you want to add the percentage change */}         
          <p className="text-sm text-green-600 flex items-center"><FaArrowUp className="mr-1" />12% from last month</p>
        </Card>
      </div>

      {/* Metric Cards Grid - Remaining Cards */}
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 2: Pending Signatures */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 min-h-[120px] min-w-0">
          <div className="mb-2 p-3 rounded-full bg-purple-100 text-purple-800">
            {React.createElement(LuPen, { className: "text-2xl text-teal-600" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary">Pending Signatures</p>
          <p className="text-xl font-bold text-primary">2</p>
          <p className="text-xs text-gray-500">Requires action</p>
        </Card>

        {/* Metric Card 4: Wire Transfers Pending */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 min-h-[120px] min-w-0">
          <div className="mb-2 p-3 rounded-full bg-purple-100 text-purple-800">
            {React.createElement(FaMoneyBillAlt, { className: "text-2xl text-teal-600" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary">Wire Transfers Pending</p>
          <p className="text-xl font-bold text-primary">3</p>
        </Card>

        {/* Metric Card 5: Avg. Completion Time */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 min-h-[120px] min-w-0">
          <div className="mb-2 p-3 rounded-full bg-purple-100 text-purple-800">
            {React.createElement(FaClock, { className: "text-2xl text-teal-600" } as IconBaseProps)}
          </div>
            <p className="text-sm text-tertiary">Avg. Completion Time</p>
            <p className="text-xl font-bold text-primary">14 days</p>
          </Card>
      </div>

      {/* Recent Activity Section */}
      <h2 className="text-[15px] font-bold text-gray-700 pt-6 mb-4">RECENT ACTIVITY</h2>

      <Card className="p-6 rounded-xl border border-gray-300 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 md:gap-0 min-w-0">
          <h3 className="text-lg font-semibold text-primary">Activity Timeline</h3>
          <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md whitespace-nowrap">
            View All
            {/* Placeholder for arrow icon */}
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
        {/* Activity Timeline Entries */}
        <div className="relative pl-6 min-w-0">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gray-300 z-0"></div>
          <div className="space-y-4">
            {/* Timeline entries will go here */}
            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaCheckCircle, { className: "text-green-500 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700"><span className="font-semibold">Contract #8423</span> moved to 'Wire Details'</p>
                <p className="text-xs text-gray-500">May 18, 2025 · 14:32</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(LuPen, { className: "text-blue-500 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700"><span className="font-semibold">Sarah Johnson</span> signed Contract #9102</p>
                <p className="text-xs text-gray-500">May 18, 2025 · 10:15</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaBox, { className: "text-purple-500 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Wire transfer of <span className="font-semibold">$42,500</span> received for <span className="text-teal-600 font-semibold">#7650</span></p>
                <p className="text-xs text-gray-500">May 17, 2025 · 16:48</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaFileContract, { className: "text-orange-500 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700"><span className="font-semibold">Contract #8901</span> created</p>
                <p className="text-xs text-gray-500">May 17, 2025 · 11:20</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaChartLine, { className: "text-red-500 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">Inspection completed for <span className="font-semibold">Contract #8423</span></p>
                <p className="text-xs text-gray-500">May 16, 2025 · 15:05</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contracts in Progress Section */}
      <h2 className="text-[15px] font-bold text-gray-700 pt-6">CONTRACTS IN PROGRESS</h2>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 md:gap-0">
        <h3 className="text-lg font-semibold text-primary">Active Contracts</h3>
        {/* View All Contracts Button */}
        <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md whitespace-nowrap">
          View All Contracts
          {/* Placeholder for arrow icon */}
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>

      {/* Active Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Contract cards will go here */}
        {/* Property Sale Contract Card */}
        <Card className="p-4 rounded-xl border border-gray-300">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Property Sale Contract</h4>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#8423</span></p>
            <p><span className="font-semibold text-gray-500">Milestone:</span> Wire Transfer</p>
            <p><span className="font-semibold text-gray-500">Next Step:</span> Awaiting Funds</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="">
              <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                View
                {/* Placeholder for arrow icon */}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 whitespace-nowrap overflow-hidden text-ellipsis">In Progress</span>
              <div className="text-xs text-gray-500 mt-1">3 of 5 tasks completed</div>
            </div>
          </div>
        </Card>

        {/* Commercial Lease Escrow Card */}
        <Card className="p-4 rounded-xl border border-gray-300">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Commercial Lease Escrow</h4>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#9102</span></p>
            <p><span className="font-semibold text-gray-500">Milestone:</span> Signatures</p>
            <p><span className="font-semibold text-gray-500">Next Step:</span> Tenant Signature</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="">
              <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                View
                {/* Placeholder for arrow icon */}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 whitespace-nowrap overflow-hidden text-ellipsis">Document Review</span>
              <div className="text-xs text-gray-500 mt-1">2 of 4 tasks completed</div>
            </div>
          </div>
        </Card>

        {/* Construction Escrow Card */}
        <Card className="p-4 rounded-xl border border-gray-300">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Construction Escrow</h4>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#7650</span></p>
            <p><span className="font-semibold text-gray-500">Milestone:</span> Document Collection</p>
            <p><span className="font-semibold text-gray-500">Next Step:</span> Upload Permits</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="">
              <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                View
                {/* Placeholder for arrow icon */}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-800 whitespace-nowrap overflow-hidden text-ellipsis">Initial Setup</span>
              <div className="text-xs text-gray-500 mt-1">1 of 6 tasks completed</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Placeholder for other dashboard sections */}
      {/* Add more sections like Recent Activity, Charts, etc. here */}

    </div>
  );
} 