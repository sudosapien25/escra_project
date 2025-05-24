import React from 'react';
import { HiOutlineDocumentText, HiOutlineExclamation } from 'react-icons/hi';
import { LuPen } from 'react-icons/lu';
import { FaClock, FaDollarSign } from 'react-icons/fa';

<hr className="my-6 border-gray-300" />

{/* Stat Boxes Row - below divider, above search/filter bar */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
  {/* Total Contracts */}
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
    <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
      <HiOutlineDocumentText size={20} color="#06b6d4" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">Total Contracts</p>
      <p className="text-2xl font-bold text-gray-900">10</p>
    </div>
  </div>
  {/* Pending Signatures */}
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
      <LuPen size={20} color="#7c3aed" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">Pending Signatures</p>
      <p className="text-2xl font-bold text-gray-900">2</p>
      <p className="text-xs text-gray-400">Requires action</p>
    </div>
  </div>
  {/* Awaiting Wire Instructions */}
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
    <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
      <HiOutlineExclamation size={20} color="#f59e42" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">Awaiting Wire Instructions</p>
      <p className="text-2xl font-bold text-gray-900">2</p>
      <p className="text-xs text-gray-400">Needs attention</p>
    </div>
  </div>
  {/* Avg. Completion Time */}
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
      <FaClock size={20} color="#3b82f6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">Avg. Completion Time</p>
      <p className="text-2xl font-bold text-gray-900">9.2 days</p>
      <p className="text-xs text-green-600 font-semibold">↓ 1.3 days faster</p>
    </div>
  </div>
</div>
{/* Total Contract Value Box (full width below) */}
<div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 w-full shadow-sm">
  <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
    <FaDollarSign size={24} color="#22c55e" />
  </div>
  <div>
    <p className="text-sm font-medium text-gray-500 mb-1">Total Contract Value</p>
    <p className="text-2xl font-bold text-green-600">$8,255,000</p>
    <p className="text-xs text-green-600 font-semibold">↑ 12% from last month</p>
  </div>
</div> 