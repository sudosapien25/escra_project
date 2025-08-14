"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { FaFileContract, FaMoneyBillAlt, FaClock, FaPlus, FaArrowUp, FaDollarSign, FaCheckCircle, FaBox, FaChartLine } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import { LuPen } from 'react-icons/lu';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import NewContractModal from '@/components/common/NewContractModal';
import { ContractServiceAPI } from '@/services/contractServiceAPI';

export default function DashboardPage() {
  const [showNewContractModal, setShowNewContractModal] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalContracts: 0,
    totalValue: 0,
    pendingSignatures: 0,
    wireTransfersPending: 0,
    avgCompletionTime: 0,
    recentContracts: [] as any[]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch contracts from backend
        const response = await ContractServiceAPI.getContracts({
          limit: 100 // Get more contracts for statistics
        });
        
        const contracts = response.contracts || [];
        
        // Calculate statistics from real data
        const totalContracts = response.pagination?.total || contracts.length;
        
        // Calculate total value - sum of all contract values
        const totalValue = contracts.reduce((sum: number, contract: any) => {
          const value = parseFloat(contract.value?.replace(/[$,]/g, '') || '0');
          return sum + value;
        }, 0);
        
        // Count pending signatures (contracts in Initiation or Negotiation status)
        const pendingSignatures = contracts.filter((c: any) => 
          c.status === 'Initiation' || c.status === 'Negotiation'
        ).length;
        
        // Count wire transfers pending (contracts in Execution status)
        const wireTransfersPending = contracts.filter((c: any) => 
          c.status === 'Execution'
        ).length;
        
        // Calculate average completion time (mock for now since we don't have completion dates)
        const avgCompletionTime = 14; // Will calculate this when we have more data
        
        // Get the 3 most recent contracts for display
        const recentContracts = contracts.slice(0, 3);
        
        setDashboardData({
          totalContracts,
          totalValue,
          pendingSignatures,
          wireTransfersPending,
          avgCompletionTime,
          recentContracts
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set default values on error
        setDashboardData({
          totalContracts: 0,
          totalValue: 0,
          pendingSignatures: 0,
          wireTransfersPending: 0,
          avgCompletionTime: 0,
          recentContracts: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Dashboard Title and Subtitle Group */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-3 sm:mb-6">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1">
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-0">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Overview of your contract closing activities & metrics</p>
        </div>
        <button
          className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
          onClick={() => setShowNewContractModal(true)}
        >
          <MdOutlineAddToPhotos className="mr-2 text-lg" />
          New Contract
        </button>
        <NewContractModal isOpen={showNewContractModal} onClose={() => setShowNewContractModal(false)} />
      </div>

      {/* Horizontal line below subtitle */}
      <hr className="my-3 md:my-6 border-gray-300 dark:border-gray-700 cursor-default select-none" />

      {/* Key Metrics Section */}
      <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-300 pt-6 mb-4">KEY METRICS</h2>

      {/* Flex container for the first two metric cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Metric Card 1: Total Contracts */}
        <Card className="flex flex-1 flex-col items-center text-center rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800">
          <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {React.createElement(FaFileContract, { className: "text-2xl text-teal-600 dark:text-teal-400" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary dark:text-gray-400">Total Contracts</p>
          <p className="text-xl font-bold text-primary dark:text-primary">{loading ? '...' : dashboardData.totalContracts}</p>
        </Card>

        {/* Metric Card 3: Total Contract Value */}
        <Card className="flex flex-1 flex-col items-center text-center rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800">
          <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {React.createElement(FaDollarSign, { className: "text-2xl text-teal-600 dark:text-teal-400" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary dark:text-gray-400">Total Contract Value</p>
          <p className="text-xl font-bold text-primary dark:text-primary">{loading ? '...' : `$${(dashboardData.totalValue / 1000000).toFixed(1)}M`}</p>
           {/* Assuming you want to add the percentage change */}         
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center"><FaArrowUp className="mr-1" />12% from last month</p>
        </Card>
      </div>

      {/* Metric Cards Grid - Remaining Cards */}
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 2: Pending Signatures */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800">
          <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {React.createElement(LuPen, { className: "text-2xl text-teal-600 dark:text-teal-400" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary dark:text-gray-400">Pending Signatures</p>
          <p className="text-xl font-bold text-primary dark:text-primary">{loading ? '...' : dashboardData.pendingSignatures}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Requires action</p>
        </Card>

        {/* Metric Card 4: Wire Transfers Pending */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800">
          <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {React.createElement(FaMoneyBillAlt, { className: "text-2xl text-teal-600 dark:text-teal-400" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary dark:text-gray-400">Wire Transfers Pending</p>
          <p className="text-xl font-bold text-primary dark:text-primary">{loading ? '...' : dashboardData.wireTransfersPending}</p>
        </Card>

        {/* Metric Card 5: Avg. Completion Time */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800">
          <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {React.createElement(FaClock, { className: "text-2xl text-teal-600 dark:text-teal-400" } as IconBaseProps)}
          </div>
            <p className="text-sm text-tertiary dark:text-gray-400">Avg. Completion Time</p>
            <p className="text-xl font-bold text-primary dark:text-primary">{loading ? '...' : `${dashboardData.avgCompletionTime} days`}</p>
          </Card>
      </div>

      {/* Recent Activity Section */}
      <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-300 pt-6 mb-4">RECENT ACTIVITY</h2>

      <Card className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 md:gap-0 min-w-0">
          <h3 className="text-lg font-semibold text-primary dark:text-primary">Activity Timeline</h3>
          <button className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md whitespace-nowrap">
            View All
            {/* Placeholder for arrow icon */}
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
        {/* Activity Timeline Entries */}
        <div className="relative pl-6 min-w-0">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600 z-0"></div>
          <div className="space-y-4">
            {/* Timeline entries will go here */}
            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaCheckCircle, { className: "text-green-500 dark:text-green-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Contract #8423</span> moved to 'Wire Details'</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">May 18, 2025 · 14:32</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(LuPen, { className: "text-blue-500 dark:text-blue-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Sarah Johnson</span> signed Contract #9102</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">May 18, 2025 · 10:15</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaBox, { className: "text-purple-500 dark:text-purple-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">Wire transfer of <span className="font-semibold">$42,500</span> received for <span className="text-teal-600 dark:text-teal-400 font-semibold">#7650</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">May 17, 2025 · 16:48</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaFileContract, { className: "text-orange-500 dark:text-orange-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Contract #8901</span> created</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">May 17, 2025 · 11:20</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 relative -left-3 z-10 bg-white dark:bg-gray-800 rounded-full p-1 flex items-center justify-center w-6 h-6">
                {React.createElement(FaChartLine, { className: "text-red-500 dark:text-red-400 text-base" } as IconBaseProps)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">Inspection completed for <span className="font-semibold">Contract #8423</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">May 16, 2025 · 15:05</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contracts in Progress Section */}
      <h2 className="text-[15px] font-bold text-gray-700 dark:text-gray-300 pt-6">CONTRACTS IN PROGRESS</h2>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 md:gap-0">
        <h3 className="text-lg font-semibold text-primary dark:text-primary">Active Contracts</h3>
        {/* View All Contracts Button */}
        <button className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md whitespace-nowrap">
          View All Contracts
          {/* Placeholder for arrow icon */}
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>

      {/* Active Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        ) : dashboardData.recentContracts.length > 0 ? (
          dashboardData.recentContracts.map((contract: any) => (
            <Card key={contract.id} className="p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-md font-semibold text-black dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {contract.title || 'Untitled Contract'}
                </h4>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p><span className="font-semibold text-gray-500 dark:text-gray-400">Contract ID:</span> <span className="text-teal-600 dark:text-teal-400">#{contract.id}</span></p>
                <p><span className="font-semibold text-gray-500 dark:text-gray-400">Type:</span> {contract.type || 'Property Sale'}</p>
                <p><span className="font-semibold text-gray-500 dark:text-gray-400">Value:</span> {contract.value || '$0'}</p>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div className="">
                  <button className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md">
                    View
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis ${
                    contract.status === 'Initiation' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                    contract.status === 'Execution' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    contract.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                  }`}>
                    {contract.status || 'Draft'}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {contract.parties || 'No parties assigned'}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No contracts found. Create your first contract to get started.
          </div>
        )}
      </div>

      {/* Placeholder for other dashboard sections */}
      {/* Add more sections like Recent Activity, Charts, etc. here */}

    </div>
  );
} 