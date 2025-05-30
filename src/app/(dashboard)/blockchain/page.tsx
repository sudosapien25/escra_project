'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { FaPlus, FaCopy, FaWallet, FaNetworkWired, FaBook, FaExternalLinkAlt, FaCogs, FaFaucet, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { HiOutlineExternalLink, HiOutlineBookOpen } from 'react-icons/hi';
import { FaRegCalendarAlt, FaRegCheckCircle, FaRegFileAlt, FaCodeBranch, FaHashtag, FaCoins } from 'react-icons/fa';
import { Logo } from '@/components/common/Logo';
import NewContractModal from '@/components/common/NewContractModal';

const contracts = [
  {
    title: 'Document Hash Registry',
    version: 'v1.2.0',
    badges: [
      { label: 'TestNet', color: 'bg-blue-100 text-blue-700' },
      { label: 'Active', color: 'bg-green-100 text-green-700' },
    ],
    id: '0x8f3e1...',
    description: 'Stores and verifies document hash fingerprints for immutable proof of existence',
    deployed: 'May 18, 2025',
    transactions: 235,
  },
  {
    title: 'Signature Verification',
    version: 'v1.0.1',
    badges: [
      { label: 'MainNet', color: 'bg-green-100 text-green-700' },
      { label: 'Active', color: 'bg-green-100 text-green-700' },
    ],
    id: '0x7a6b2...',
    description: 'Multi-signature contract validation and cryptographic identity verification',
    deployed: 'May 12, 2025',
    transactions: 124,
  },
  {
    title: 'Escrow & Payment',
    version: 'v0.9.5',
    badges: [
      { label: 'TestNet', color: 'bg-blue-100 text-blue-700' },
      { label: 'Testing', color: 'bg-yellow-100 text-yellow-700' },
    ],
    id: '0x3d2c9...',
    description: 'Secure escrow and milestone-based payment distribution for contracts',
    deployed: 'May 15, 2025',
    transactions: 57,
  },
  {
    title: 'Milestone Tracker',
    version: 'v1.1.0',
    badges: [
      { label: 'MainNet', color: 'bg-green-100 text-green-700' },
      { label: 'Active', color: 'bg-green-100 text-green-700' },
    ],
    id: '0x5e8f1...',
    description: 'Tracks contract milestone completion with on-chain verification',
    deployed: 'May 10, 2025',
    transactions: 189,
  },
  {
    title: 'Token Issuance',
    version: 'v1.0.0',
    badges: [
      { label: 'MainNet', color: 'bg-green-100 text-green-700' },
      { label: 'Deprecated', color: 'bg-red-100 text-red-700' },
    ],
    id: '0x2a9c7...',
    description: 'Legacy token issuance contract for property title tokens',
    deployed: 'Apr 30, 2025',
    transactions: 45,
  },
  {
    title: 'Oracle Integration',
    version: 'v0.8.2',
    badges: [
      { label: 'TestNet', color: 'bg-blue-100 text-blue-700' },
      { label: 'Testing', color: 'bg-yellow-100 text-yellow-700' },
    ],
    id: '0x1b4d8...',
    description: 'Connects to external price oracles for real-time property valuation',
    deployed: 'May 20, 2025',
    transactions: 23,
  },
];

const activityData = [
  {
    type: 'Milestone Completed',
    icon: <FaRegCheckCircle className="text-green-500 text-xl" />,
    description: 'Document Review milestone completed for Contract #8423',
    txHash: '0x7ad9e3b...',
    block: '#15283674',
    contractId: 'CTR–8423',
    timestamp: '20,',
    date: 'May',
  },
  {
    type: 'Document Signed',
    icon: <FaRegFileAlt className="text-blue-500 text-xl" />,
    description: 'Purchase Agreement signed by John Smith for Contract #7612',
    txHash: '0x4fc8d2a...',
    block: '#15283545',
    contractId: 'CTR–7612',
    timestamp: '20,',
    date: 'May',
  },
  {
    type: 'Smart Contract Deployed',
    icon: <FaCodeBranch className="text-purple-500 text-xl" />,
    description: 'Oracle Integration contract deployed to TestNet',
    txHash: '0x9be31c5...',
    block: '#15283213',
    contractId: '0x1b4d8...',
    timestamp: '20,',
    date: 'May',
  },
  {
    type: 'Document Hash Registered',
    icon: <FaHashtag className="text-blue-400 text-xl" />,
    description: 'Lease Agreement hash registered for Contract #9145',
    txHash: '0x2ea9f1b...',
    block: '#15282789',
    contractId: 'CTR–9145',
    timestamp: '19,',
    date: 'May',
  },
  {
    type: 'Escrow Payment Released',
    icon: <FaCoins className="text-orange-400 text-xl" />,
    description: 'Final payment released for Contract #3219',
    txHash: '0x8d4f2e3...',
    block: '#15281952',
    contractId: 'CTR–3219',
    timestamp: '19,',
    date: 'May',
  },
];

export default function BlockchainPage() {
  const [activeTab, setActiveTab] = useState('smart-contracts');
  const [showNewContractModal, setShowNewContractModal] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <div className="pb-1">
          <h1 className="text-[24px] md:text-[30px] font-bold text-black mb-0">Blockchain</h1>
          <p className="text-gray-500 text-[15px] md:text-[16px] mt-0">View smart contracts, on-chain activity, & explorer integrations</p>
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

      <hr className="my-6 border-gray-300" />

      {/* Toggle Bar */}
      <div className="relative w-full overflow-x-auto mb-6">
        <div className="flex min-w-[340px] sm:min-w-0">
          {[
            { key: 'smart-contracts', label: 'Smart Contracts' },
            { key: 'on-chain-activity', label: 'On-Chain Activity' },
            { key: 'explorers', label: 'Explorers' },
            { key: 'tokens', label: 'Tokens' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`relative flex items-center gap-2 font-semibold transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap
                ${activeTab === tab.key
                  ? 'text-primary border-2 border-gray-200 rounded-lg'
                  : 'text-gray-500 hover:text-gray-700'}
              `}
              style={{ zIndex: 1 }}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={`inline-block transition-all duration-300 ${activeTab === tab.key ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === tab.key ? 18 : 0}}>
                {activeTab === tab.key && <Logo width={18} height={18} className="pointer-events-none" />}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'smart-contracts' && (
        <>
          <h2 className="text-2xl font-bold text-black mb-4">Smart Contract Registry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract, idx) => (
              <Card key={idx} className="rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-1">{contract.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-1">
                      {contract.badges.map((badge, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">ID: {contract.id}</span>
                    <button className="ml-1 text-gray-400 hover:text-gray-700 align-middle"><FaCopy className="inline text-xs" /></button>
                  </div>
                  <span className="text-xs text-gray-400 font-semibold">{contract.version}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{contract.description}</p>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="mr-4 flex items-center"><FaRegCalendarAlt className="mr-1 text-gray-400" />Deployed: {contract.deployed}</span>
                  <span className="flex items-center"><span className="mr-1">🔗</span>{contract.transactions} transactions</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                  <button className="text-gray-700 hover:text-teal-600 flex items-center text-sm font-medium"><span className="mr-1">&gt;_</span>Functions</button>
                  <a href="#" className="text-teal-600 hover:underline flex items-center text-sm font-medium">View Details <HiOutlineExternalLink className="ml-1 text-base" /></a>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
      {activeTab === 'on-chain-activity' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">On-Chain Activity</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search transactions..."
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-gray-50"
              />
              <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-100 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" /></svg>
                Filter
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {activityData.map((activity, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm flex p-4 items-start relative">
                {/* Timeline Icon */}
                <div className="flex flex-col items-center mr-4">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 border-2 border-white shadow" style={{marginTop: 2}}>
                    {activity.icon}
                  </div>
                </div>
                {/* Card Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-black mb-0.5">{activity.type}</h3>
                      <p className="text-gray-500 text-xs mb-1">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-400 font-medium">
                      <span>{activity.date}</span>
                      <span><svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg></span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-0.5">TX Hash</div>
                      <div className="flex items-center bg-gray-100 rounded px-2 py-0.5 font-mono text-xs w-fit">
                        {activity.txHash}
                        <button className="ml-2 text-gray-400 hover:text-gray-700"><FaCopy className="inline text-xs" /></button>
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-1">Block</div>
                      <div className="font-semibold text-gray-900 text-xs">{activity.block}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-0.5">Contract ID</div>
                      <div className="bg-gray-100 rounded px-2 py-0.5 font-mono text-xs w-fit">{activity.contractId}</div>
                      <div className="text-xs text-gray-400 font-medium mt-1">Timestamp</div>
                      <div className="font-semibold text-gray-900 text-xs">{activity.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <a href="#" className="flex items-center px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-100 text-xs font-medium">
                      <HiOutlineExternalLink className="mr-1 text-base" />
                      View in Explorer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium shadow-sm hover:bg-gray-50 text-sm">Load More Activity</button>
          </div>
        </div>
      )}
      {activeTab === 'explorers' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Blockchain Explorers</h2>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium">
              <FaBook className="mr-2 text-base" />
              Explorer Guides
            </button>
          </div>
          {/* Explorer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Allo Explorer (moved to first) */}
            <Card className="rounded-xl border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="w-8 h-8 flex items-center justify-center rounded bg-green-100 mr-3">
                  <FaCogs className="text-green-400 text-xl" />
                </span>
                <span className="text-lg font-semibold text-black">Allo Explorer</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Cross-chain interoperability and transaction monitoring</p>
              <div className="flex flex-col gap-2 mb-4">
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Monitor Bridges <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Cross-Chain Analytics <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Network Status <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
              </div>
              <button className="mt-auto w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm">Connect to Allo Explorer</button>
            </Card>
            {/* Pera Explorer (was AlgoExplorer) */}
            <Card className="rounded-xl border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 mr-3">
                  <FaNetworkWired className="text-blue-400 text-xl" />
                </span>
                <span className="text-lg font-semibold text-black">Pera Explorer</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Track transactions and contract activity on the Algorand blockchain</p>
              <div className="flex flex-col gap-2 mb-4">
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  View Smart Contracts <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Track Escra Wallet <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Browse Assets <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
              </div>
              <button className="mt-auto w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm">Connect to Pera Explorer</button>
            </Card>
            {/* Pera Wallet (unchanged) */}
            <Card className="rounded-xl border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="w-8 h-8 flex items-center justify-center rounded bg-purple-100 mr-3">
                  <FaWallet className="text-purple-400 text-xl" />
                </span>
                <span className="text-lg font-semibold text-black">Pera Wallet</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Mobile and web wallet for Algorand blockchain interactions</p>
              <div className="flex flex-col gap-2 mb-4">
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Manage Assets <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  View Transaction History <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
                <button className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
                  Connect dApps <FaExternalLinkAlt className="ml-2 text-base" />
                </button>
              </div>
              <button className="mt-auto w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm">Connect Pera Wallet</button>
            </Card>
          </div>
          {/* Developer Resources */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Developer Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Smart Contract SDK */}
              <Card className="rounded-xl border border-gray-200 p-5 flex flex-col h-full">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-teal-100 mr-3">
                    <span className="text-teal-500 text-lg">&gt;_</span>
                  </span>
                  <span className="text-base font-semibold text-black">Smart Contract SDK</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">Developer toolkit for building on Escra's smart contract platform</p>
                <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 mt-auto">
                  <HiOutlineBookOpen className="mr-2 text-base" />
                  View Documentation
                </button>
              </Card>
              {/* Escra TestNet Faucet */}
              <Card className="rounded-xl border border-gray-200 p-5 flex flex-col h-full">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-cyan-100 mr-3">
                    <FaFaucet className="text-cyan-500 text-lg" />
                  </span>
                  <span className="text-base font-semibold text-black">Escra TestNet Faucet</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">Get test tokens to interact with Escra's TestNet environment</p>
                <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 mt-auto">
                  <FaArrowRight className="mr-2 text-base" />
                  Request Test Tokens
                </button>
              </Card>
              {/* Security Audits */}
              <Card className="rounded-xl border border-gray-200 p-5 flex flex-col h-full">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-cyan-100 mr-3">
                    <FaShieldAlt className="text-cyan-500 text-lg" />
                  </span>
                  <span className="text-base font-semibold text-black">Security Audits</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">View security audit reports for Escra's smart contracts</p>
                <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 mt-auto">
                  <FaExternalLinkAlt className="mr-2 text-base" />
                  View Audit Reports
                </button>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 