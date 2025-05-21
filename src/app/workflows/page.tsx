'use client';

import React from 'react';
import { FaArchive, FaBox, FaCheckCircle, FaRegSquare, FaBan, FaHandPaper, FaHammer, FaCog, FaEye, FaPlus, FaSearch, FaFilter, FaCalendarAlt, FaSort } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import { Card } from '@/components/common/Card';

export default function WorkflowsPage() {
  return (
    <div className="space-y-4">
      {/* Workflow Title and Button */}
      <div className="flex justify-between items-center">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1">
          <h1 className="text-[30px] font-bold text-black mb-1">Workflows</h1>
          <p className="text-gray-500 text-[16px] mt-0">Stay informed about your activities</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
          <FaPlus className="mr-2 text-base" />
          New Workflow
        </button>
      </div>

      {/* Horizontal line below subtitle */}
      {/* <hr className="my-6 border-gray-300" /> */}

      {/* Kanban Board Section */}
      <div className="flex flex-grow overflow-x-auto space-x-6 p-4 bg-gray-100 rounded-lg">
        {/* To Do Column */}
        <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center text-gray-800 bg-gray-100 rounded-t-md py-2 px-4 text-lg font-semibold mb-4">
            {/* Icon for To Do */}
            {React.createElement(FaBox, { className: "text-xl mr-2" } as IconBaseProps)}
            <h3 className="text-lg font-semibold">To Do</h3>
          </div>
          {/* Placeholder for To Do cards */}
          <Card className="p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Property Sale Contract (Sample)</h4>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#8423</span></p>
              <p><span className="font-semibold text-gray-500">Milestone:</span> Initial Setup</p>
              <p><span className="font-semibold text-gray-500">Next Step:</span> Document Collection</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="">
                <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                  View
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800">To Do</span>
                <div className="text-xs text-gray-500 mt-1">0 of 5 tasks completed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Blocked Column */}
        <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center text-red-800 bg-red-100 rounded-t-md py-2 px-4 text-lg font-semibold mb-4">
            <FaBan className="text-xl mr-2" />
            <h3 className="text-lg font-semibold">Blocked</h3>
          </div>
          {/* Placeholder for Blocked cards */}
          <Card className="p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Commercial Lease Escrow (Sample)</h4>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#9102</span></p>
              <p><span className="font-semibold text-gray-500">Milestone:</span> Signatures</p>
              <p><span className="font-semibold text-gray-500">Next Step:</span> Awaiting Response</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="">
                <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                  View
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800">Blocked</span>
                <div className="text-xs text-gray-500 mt-1">2 of 4 tasks completed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* On Hold Column */}
        <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center text-orange-800 bg-orange-100 rounded-t-md py-2 px-4 text-lg font-semibold mb-4">
            <FaHandPaper className="text-xl mr-2" />
            <h3 className="text-lg font-semibold">On Hold</h3>
          </div>
          {/* Placeholder for On Hold cards */}
          <Card className="p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Construction Escrow (Sample)</h4>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#7650</span></p>
              <p><span className="font-semibold text-gray-500">Milestone:</span> Document Collection</p>
              <p><span className="font-semibold text-gray-500">Next Step:</span> Awaiting Permits</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="">
                <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                  View
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-800">On Hold</span>
                <div className="text-xs text-gray-500 mt-1">1 of 6 tasks completed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* In Progress Column */}
        <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center text-blue-800 bg-blue-100 rounded-t-md py-2 px-4 text-lg font-semibold mb-4">
            <FaHammer className="text-xl mr-2" />
            <h3 className="text-lg font-semibold">In Progress</h3>
          </div>
          {/* Placeholder for In Progress cards */}
          <Card className="p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Property Sale Contract (Sample)</h4>
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
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">In Progress</span>
                <div className="text-xs text-gray-500 mt-1">3 of 5 tasks completed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* In Review Column */}
        <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center text-yellow-800 bg-yellow-100 rounded-t-md py-2 px-4 text-lg font-semibold mb-4">
            <FaEye className="text-xl mr-2" />
            <h3 className="text-lg font-semibold">In Review</h3>
          </div>
          {/* Placeholder for In Review cards */}
          <Card className="p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Commercial Lease Escrow (Sample)</h4>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#9102</span></p>
              <p><span className="font-semibold text-gray-500">Milestone:</span> Document Review</p>
              <p><span className="font-semibold text-gray-500">Next Step:</span> Legal Review</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="">
                <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                  View
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">In Review</span>
                <div className="text-xs text-gray-500 mt-1">2 of 4 tasks completed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Complete Column */}
        <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center text-green-800 bg-green-100 rounded-t-md py-2 px-4 text-lg font-semibold mb-4">
            <FaCheckCircle className="text-xl mr-2" />
            <h3 className="text-lg font-semibold">Complete</h3>
          </div>
          {/* Placeholder for Complete cards */}
          <Card className="p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-md font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">Property Sale Contract (Sample)</h4>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold text-gray-500">Contract ID:</span> <span className="text-teal-600">#8423</span></p>
              <p><span className="font-semibold text-gray-500">Milestone:</span> Completed</p>
              <p><span className="font-semibold text-gray-500">Next Step:</span> None</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="">
                <button className="text-teal-600 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 rounded-md">
                  View
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">Complete</span>
                <div className="text-xs text-gray-500 mt-1">5 of 5 tasks completed</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 