'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/common/Card';
import { ContractServiceAPI } from '@/services/contractServiceAPI';
import { FaArrowLeft, FaUser, FaHome, FaMoneyBillAlt, FaCalendar, FaFileContract } from 'react-icons/fa';

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      if (!params.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await ContractServiceAPI.getContract(params.id as string);
        setContract(response);
      } catch (err: any) {
        console.error('Failed to load contract:', err);
        setError(err.response?.data?.detail || 'Failed to load contract');
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="p-6 border-red-500 dark:border-red-400">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Contract</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => router.push('/contracts')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Contracts
          </button>
        </Card>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <p className="text-gray-700 dark:text-gray-300">Contract not found</p>
          <button
            onClick={() => router.push('/contracts')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Contracts
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/contracts')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Contracts</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            contract.status === 'Initiation' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
            contract.status === 'Preparation' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
            contract.status === 'Complete' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
            'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
          }`}>
            {contract.status}
          </span>
        </div>
      </div>

      {/* Contract Title and ID */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {contract.title || 'Untitled Contract'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Contract ID: <span className="text-teal-600 dark:text-teal-400 font-mono">{contract.id}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Contract Type</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{contract.type}</p>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parties Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaUser className="text-teal-600 dark:text-teal-400" />
            Parties Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Buyer</p>
              <p className="font-medium text-gray-900 dark:text-white">{contract.buyer || 'Not specified'}</p>
              {contract.buyerEmail && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{contract.buyerEmail}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Seller</p>
              <p className="font-medium text-gray-900 dark:text-white">{contract.seller || 'Not specified'}</p>
              {contract.sellerEmail && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{contract.sellerEmail}</p>
              )}
            </div>
            {contract.agent && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Agent</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.agent}</p>
                {contract.agentEmail && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{contract.agentEmail}</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Property Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaHome className="text-teal-600 dark:text-teal-400" />
            Property Details
          </h2>
          <div className="space-y-4">
            {contract.propertyAddress && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Property Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.propertyAddress}</p>
              </div>
            )}
            {contract.propertyType && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Property Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.propertyType}</p>
              </div>
            )}
            {contract.escrowNumber && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Escrow Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.escrowNumber}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Financial Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaMoneyBillAlt className="text-teal-600 dark:text-teal-400" />
            Financial Details
          </h2>
          <div className="space-y-4">
            {contract.value && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contract Value</p>
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  ${contract.value.toLocaleString()}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {contract.earnestMoney && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Earnest Money</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${contract.earnestMoney.toLocaleString()}
                  </p>
                </div>
              )}
              {contract.downPayment && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Down Payment</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${contract.downPayment.toLocaleString()}
                  </p>
                </div>
              )}
              {contract.loanAmount && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${contract.loanAmount.toLocaleString()}
                  </p>
                </div>
              )}
              {contract.interestRate && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Interest Rate</p>
                  <p className="font-medium text-gray-900 dark:text-white">{contract.interestRate}%</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Important Dates */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaCalendar className="text-teal-600 dark:text-teal-400" />
            Important Dates
          </h2>
          <div className="space-y-4">
            {contract.closingDate && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Closing Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(contract.closingDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {contract.dueDate && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(contract.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {contract.createdAt && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(contract.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
            {contract.updatedAt && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(contract.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Information */}
      {(contract.notes || contract.contingencies || contract.specialProvisions) && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaFileContract className="text-teal-600 dark:text-teal-400" />
            Additional Information
          </h2>
          <div className="space-y-4">
            {contract.notes && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Notes</p>
                <p className="text-gray-700 dark:text-gray-300">{contract.notes}</p>
              </div>
            )}
            {contract.contingencies && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Contingencies</p>
                <p className="text-gray-700 dark:text-gray-300">{contract.contingencies}</p>
              </div>
            )}
            {contract.specialProvisions && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Special Provisions</p>
                <p className="text-gray-700 dark:text-gray-300">{contract.specialProvisions}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="p-6">
        <div className="flex gap-4">
          <button 
            onClick={() => router.push(`/contracts?edit=${params.id}`)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Edit Contract
          </button>
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            View Documents
          </button>
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            View Activity
          </button>
        </div>
      </Card>
    </div>
  );
}