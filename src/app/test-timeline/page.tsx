'use client';

import React from 'react';
import { Timeline } from '@/components/common/Timeline';
import { DocumentTextIcon, UserGroupIcon, DocumentCheckIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function TestTimelinePage() {
  const contractSteps = [
    {
      id: '1',
      title: 'Contract Creation',
      description: 'Initial contract details and terms defined',
      status: 'completed' as const,
      date: 'Jan 15, 2024',
      icon: <DocumentTextIcon className="w-6 h-6 text-primary" />
    },
    {
      id: '2',
      title: 'Participant Review',
      description: 'All parties reviewing contract terms',
      status: 'completed' as const,
      date: 'Jan 20, 2024',
      icon: <UserGroupIcon className="w-6 h-6 text-primary" />
    },
    {
      id: '3',
      title: 'Legal Review',
      description: 'Legal team reviewing contract compliance',
      status: 'current' as const,
      date: 'Jan 25, 2024',
      icon: <DocumentCheckIcon className="w-6 h-6 text-primary" />
    },
    {
      id: '4',
      title: 'Payment Processing',
      description: 'Processing initial payment',
      status: 'upcoming' as const,
      date: 'Feb 1, 2024',
      icon: <BanknotesIcon className="w-6 h-6 text-gray-400" />
    }
  ];

  const errorSteps = [
    {
      id: '1',
      title: 'Document Upload',
      description: 'Uploading required documents',
      status: 'completed' as const,
      date: 'Jan 15, 2024'
    },
    {
      id: '2',
      title: 'Verification',
      description: 'Verifying document authenticity',
      status: 'error' as const,
      date: 'Jan 16, 2024'
    },
    {
      id: '3',
      title: 'Approval',
      description: 'Final approval process',
      status: 'upcoming' as const,
      date: 'Jan 17, 2024'
    }
  ];

  const simpleSteps = [
    {
      id: '1',
      title: 'Step 1',
      status: 'completed' as const
    },
    {
      id: '2',
      title: 'Step 2',
      status: 'current' as const
    },
    {
      id: '3',
      title: 'Step 3',
      status: 'upcoming' as const
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Timeline Component Test Page</h1>

      {/* Contract Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Contract Timeline</h2>
        <div className="p-6 bg-white rounded-lg shadow">
          <Timeline steps={contractSteps} />
        </div>
      </div>

      {/* Error Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Error Timeline</h2>
        <div className="p-6 bg-white rounded-lg shadow">
          <Timeline steps={errorSteps} />
        </div>
      </div>

      {/* Simple Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Simple Timeline</h2>
        <div className="p-6 bg-white rounded-lg shadow">
          <Timeline steps={simpleSteps} showDates={false} />
        </div>
      </div>

      {/* Timeline without Connectors */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Timeline without Connectors</h2>
        <div className="p-6 bg-white rounded-lg shadow">
          <Timeline steps={contractSteps} showConnectors={false} />
        </div>
      </div>

      {/* Timeline without Dates */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Timeline without Dates</h2>
        <div className="p-6 bg-white rounded-lg shadow">
          <Timeline steps={contractSteps} showDates={false} />
        </div>
      </div>
    </div>
  );
} 