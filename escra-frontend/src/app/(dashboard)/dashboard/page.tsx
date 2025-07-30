"use client";
import React from 'react';
import { Card } from '@/components/common/Card';
import { FaFileContract, FaMoneyBillAlt, FaClock, FaPlus, FaArrowUp, FaDollarSign, FaCheckCircle, FaBox, FaChartLine, FaCheck } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import { LuPen } from 'react-icons/lu';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import { TbClockPin } from 'react-icons/tb';
import { HiMiniChevronDown } from 'react-icons/hi2';
import { GrMoney } from 'react-icons/gr';
import NewContractModal from '@/components/common/NewContractModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts';
import { mockContracts } from '@/data/mockContracts';

// Define Contract interface to match contracts page
interface Contract {
  id: string;
  title: string;
  parties: string;
  status: string;
  updated: string;
  value?: string;
  documents?: number;
  type: string;
  buyer?: string;
  seller?: string;
  agent?: string;
  milestone?: string;
  notes?: string;
  closingDate?: string;
  dueDate?: string;
  propertyAddress?: string;
  propertyType?: string;
  escrowNumber?: string;
  buyerEmail?: string;
  sellerEmail?: string;
  agentEmail?: string;
  earnestMoney?: string;
  downPayment?: string;
  loanAmount?: string;
  interestRate?: string;
  loanTerm?: string;
  lenderName?: string;
  sellerFinancialInstitution?: string;
  buyerFinancialInstitution?: string;
  buyerAccountNumber?: string;
  sellerAccountNumber?: string;
  buyerFinancialInstitutionRoutingNumber?: string;
  sellerFinancialInstitutionRoutingNumber?: string;
  titleCompany?: string;
  insuranceCompany?: string;
  inspectionPeriod?: string;
  contingencies?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  additionalParties?: { name: string; email: string; role: string }[];
  party1Role?: string;
  party2Role?: string;
  documentIds?: string[];
}

// Utility function to calculate total contract value (same as contracts page)
const calculateTotalContractValue = (contracts: Contract[]) => {
  return contracts.reduce((total, contract) => {
    // Remove '$' and ',' from value string and convert to number
    const value = parseFloat(contract.value?.replace(/[$,]/g, '') || '0');
    return total + value;
  }, 0);
};

// Utility function to process contract data for the chart
const processContractDataForChart = (contracts: Contract[]) => {
  // Create sample data for the last 30 days with contract values
  const today = new Date();
  const data = [];
  
  // Get the actual total contract value
  const totalValue = calculateTotalContractValue(contracts);
  
  // Generate 30 days of data showing the actual total contract value
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Calculate cumulative value based on contract creation dates
    let cumulativeValue = 0;
    contracts.forEach(contract => {
      // Simulate contract creation dates based on their "updated" field
      const daysAgo = contract.updated.includes('hour') ? 0 : 
                     contract.updated.includes('day') ? parseInt(contract.updated.split(' ')[0]) :
                     contract.updated.includes('week') ? parseInt(contract.updated.split(' ')[0]) * 7 : 14;
      
      if (i >= daysAgo) {
        // Extract numeric value from contract value string
        const value = parseFloat(contract.value?.replace(/[$,]/g, '') || '0');
        cumulativeValue += value;
      }
    });
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(cumulativeValue),
      fullDate: date.toISOString().split('T')[0]
    });
  }
  
  return data;
};

// Utility function to process contract data for bar charts
const processContractDataForBarChart = (contracts: Contract[], view: 'types' | 'statuses') => {
  if (view === 'types') {
    const typeCounts: { [key: string]: number } = {};
    contracts.forEach(contract => {
      typeCounts[contract.type] = (typeCounts[contract.type] || 0) + 1;
    });
    
    const result = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      count: count
    }));
    console.log('Types data:', result);
    return result;
  } else {
    const statusCounts: { [key: string]: number } = {};
    contracts.forEach(contract => {
      statusCounts[contract.status] = (statusCounts[contract.status] || 0) + 1;
    });
    
    const result = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count: count
    }));
    console.log('Statuses data:', result);
    return result;
  }
};

export default function DashboardPage() {
  const [showNewContractModal, setShowNewContractModal] = React.useState(false);
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = React.useState<string | null>(null);
  const [contracts, setContracts] = React.useState<Contract[]>(mockContracts);
  const [openRecentlyUpdatedDropdown, setOpenRecentlyUpdatedDropdown] = React.useState(false);
  const [selectedRecentlyUpdated, setSelectedRecentlyUpdated] = React.useState('Last 30 days');
  const recentlyUpdatedDropdownRef = React.useRef<HTMLDivElement>(null);
  const recentlyUpdatedButtonRef = React.useRef<HTMLButtonElement>(null);
  const [chartView, setChartView] = React.useState<'types' | 'statuses'>('statuses');
  const [openBarChartDropdown, setOpenBarChartDropdown] = React.useState(false);
  const [selectedBarChartPeriod, setSelectedBarChartPeriod] = React.useState('Last 30 days');
  const barChartDropdownRef = React.useRef<HTMLDivElement>(null);
  const barChartButtonRef = React.useRef<HTMLButtonElement>(null);
  
  // Click outside functionality for dropdown
  React.useEffect(() => {
    if (openRecentlyUpdatedDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          recentlyUpdatedDropdownRef.current &&
          !recentlyUpdatedDropdownRef.current.contains(event.target as Node) &&
          recentlyUpdatedButtonRef.current &&
          !recentlyUpdatedButtonRef.current.contains(event.target as Node)
        ) {
          setOpenRecentlyUpdatedDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openRecentlyUpdatedDropdown]);
  
  // Click outside functionality for bar chart dropdown
  React.useEffect(() => {
    if (openBarChartDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          barChartDropdownRef.current &&
          !barChartDropdownRef.current.contains(event.target as Node) &&
          barChartButtonRef.current &&
          !barChartButtonRef.current.contains(event.target as Node)
        ) {
          setOpenBarChartDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openBarChartDropdown]);
  
  // Load enhanced contracts (same as contracts page)
  React.useEffect(() => {
    const loadEnhancedContracts = async () => {
      try {
        const response = await fetch('/api/contracts');
        if (response.ok) {
          const data = await response.json();
          // Only update if we got valid data that's different from initial mockContracts
          if (data.contracts && data.contracts.length > 0) {
            setContracts(data.contracts);
          }
        } else {
          console.error('Failed to load enhanced contracts');
          // Keep the initial mockContracts that are already loaded
        }
      } catch (error) {
        console.error('Error loading enhanced contracts:', error);
        // Keep the initial mockContracts that are already loaded
      }
    };

    // Small delay to let the initial render complete, then enhance with API data
    const timeoutId = setTimeout(loadEnhancedContracts, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const chartData = processContractDataForChart(contracts);
  const currentValue = calculateTotalContractValue(contracts);
  const previousValue = chartData[chartData.length - 8]?.value || 0; // 7 days ago
  const percentageChange = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

  // Debug: Log contract count and total value to verify all contracts are included
  console.log('Dashboard - Total Contracts:', contracts.length);
  console.log('Dashboard - Total Value:', currentValue);
  console.log('Dashboard - Contract Values:', contracts.map(c => ({ id: c.id, title: c.title, value: c.value })));

  // Custom tooltip component for line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-sm font-bold text-primary dark:text-primary">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip component for bar chart
  const BarChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-sm font-bold text-primary dark:text-primary">
            {payload[0].value} {payload[0].value === 1 ? 'contract' : 'contracts'}
          </p>
        </div>
      );
    }
    return null;
  };

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
        {/* Interactive Total Contract Value Chart - Replacing Total Contracts Box */}
        <Card className="flex flex-col rounded-xl border border-gray-300 dark:border-gray-700 min-h-[375px] w-[600px] bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                <GrMoney size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-tertiary dark:text-gray-400">Total Contract Value</p>
                <p className="text-lg font-bold text-primary dark:text-primary">
                  ${hoveredValue ? hoveredValue.toLocaleString() : currentValue.toLocaleString()}
                </p>
                {hoveredDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{hoveredDate}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm flex items-center ${percentageChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <FaArrowUp className={`mr-1 ${percentageChange < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(percentageChange).toFixed(1)}% from last week
              </p>
            </div>
          </div>
          
          {/* Time Filter Dropdown */}
          <div className="relative mb-3">
            <button
              ref={recentlyUpdatedButtonRef}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setOpenRecentlyUpdatedDropdown(!openRecentlyUpdatedDropdown)}
            >
              <span>{selectedRecentlyUpdated}</span>
              <HiMiniChevronDown className="text-gray-400" size={16} />
            </button>
            {openRecentlyUpdatedDropdown && (
              <div 
                ref={recentlyUpdatedDropdownRef}
                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2"
              >
                {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last month', 'This quarter', 'Last quarter', 'Last 6 months', 'Last year', 'Last 2 years'].map((option) => (
                  <button
                    key={option}
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedRecentlyUpdated === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={() => setSelectedRecentlyUpdated(option)}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedRecentlyUpdated === option && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Interactive Line Chart */}
          <div className="flex-1 min-h-[220px] -mx-6 -mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: -40, left: -40, bottom: 0 }}
                onMouseMove={(data: any) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    setHoveredValue(data.activePayload[0].value);
                    setHoveredDate(data.activePayload[0].payload.fullDate);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredValue(null);
                  setHoveredDate(null);
                }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23B5B5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#23B5B5" stopOpacity={0.25}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                  interval={0}
                  dy={6}
                  padding={{ left: 0, right: 0 }}
                  ticks={['Jul 5', 'Jul 10', 'Jul 15', 'Jul 20', 'Jul 25']}
                />
                <YAxis 
                  hide={true}
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#23B5B5"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={false}
                  activeDot={{ r: 4, stroke: '#23B5B5', strokeWidth: 2, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Contract Analytics Bar Chart */}
        <Card className="flex flex-1 flex-col rounded-xl border border-gray-300 dark:border-gray-700 min-h-[400px] min-w-0 bg-white dark:bg-gray-800 p-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            {/* Time Filter Dropdown */}
            <div className="relative">
              <button
                ref={barChartButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setOpenBarChartDropdown(!openBarChartDropdown)}
              >
                <span>{selectedBarChartPeriod}</span>
                <HiMiniChevronDown className="text-gray-400" size={16} />
              </button>
              {openBarChartDropdown && (
                <div 
                  ref={barChartDropdownRef}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2"
                >
                  {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last month', 'This quarter', 'Last quarter', 'Last 6 months', 'Last year', 'Last 2 years'].map((option) => (
                    <button
                      key={option}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedBarChartPeriod === option ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={() => setSelectedBarChartPeriod(option)}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedBarChartPeriod === option && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  chartView === 'types' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setChartView('types')}
              >
                Contract Types
              </button>
              <button
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  chartView === 'statuses' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setChartView('statuses')}
              >
                Contract States
              </button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[370px] pb-2.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processContractDataForBarChart(contracts, chartView)}
                margin={{ top: 20, right: 30, left: 5, bottom: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                  dy={3}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                />
                <Tooltip content={<BarChartTooltip />} cursor={false} />
                <Bar dataKey="count" fill="#23B5B5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
          <p className="text-xl font-bold text-primary dark:text-primary">2</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Requires action</p>
        </Card>

        {/* Metric Card 4: Wire Transfers Pending */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800">
          <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {React.createElement(FaMoneyBillAlt, { className: "text-2xl text-teal-600 dark:text-teal-400" } as IconBaseProps)}
          </div>
          <p className="text-sm text-tertiary dark:text-gray-400">Wire Transfers Pending</p>
          <p className="text-xl font-bold text-primary dark:text-primary">3</p>
        </Card>

        {/* Metric Card 5: Avg. Completion Time */}
        <Card className="flex flex-col items-center text-center rounded-xl border border-gray-300 dark:border-gray-700 min-h-[120px] min-w-0 bg-white dark:bg-gray-800">
          <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
            {React.createElement(FaClock, { className: "text-2xl text-teal-600 dark:text-teal-400" } as IconBaseProps)}
          </div>
            <p className="text-sm text-tertiary dark:text-gray-400">Avg. Completion Time</p>
            <p className="text-xl font-bold text-primary dark:text-primary">14 days</p>
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
        {/* Contract cards will go here */}
        {/* Property Sale Contract Card */}
        <Card className="p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-md font-semibold text-black dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">Property Sale Contract</h4>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Contract ID:</span> <span className="text-teal-600 dark:text-teal-400">#8423</span></p>
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Milestone:</span> Wire Transfer</p>
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Next Step:</span> Awaiting Funds</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="">
              <button className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md">
                View
                {/* Placeholder for arrow icon */}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 whitespace-nowrap overflow-hidden text-ellipsis">In Progress</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 of 5 tasks completed</div>
            </div>
          </div>
        </Card>

        {/* Commercial Lease Escrow Card */}
        <Card className="p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-md font-semibold text-black dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">Commercial Lease Escrow</h4>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Contract ID:</span> <span className="text-teal-600 dark:text-teal-400">#9102</span></p>
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Milestone:</span> Signatures</p>
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Next Step:</span> Tenant Signature</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="">
              <button className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md">
                View
                {/* Placeholder for arrow icon */}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 whitespace-nowrap overflow-hidden text-ellipsis">Document Review</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 of 4 tasks completed</div>
            </div>
          </div>
        </Card>

        {/* Construction Escrow Card */}
        <Card className="p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-md font-semibold text-black dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">Construction Escrow</h4>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Contract ID:</span> <span className="text-teal-600 dark:text-teal-400">#7650</span></p>
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Milestone:</span> Document Collection</p>
            <p><span className="font-semibold text-gray-500 dark:text-gray-400">Next Step:</span> Upload Permits</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="">
              <button className="text-teal-600 dark:text-teal-400 hover:underline flex items-center text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md">
                View
                {/* Placeholder for arrow icon */}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 whitespace-nowrap overflow-hidden text-ellipsis">Initial Setup</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 of 6 tasks completed</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Placeholder for other dashboard sections */}
      {/* Add more sections like Recent Activity, Charts, etc. here */}

    </div>
  );
} 