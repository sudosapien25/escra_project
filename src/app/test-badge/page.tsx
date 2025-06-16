'use client';

import React from 'react';
import { Badge } from '@/components/common/Badge';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export default function TestBadgePage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Badge Component Test Page</h1>

      {/* Basic Badges */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Basic Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="gray">Gray</Badge>
        </div>
      </div>

      {/* Outlined Badges */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Outlined Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge outlined>Default</Badge>
          <Badge variant="primary" outlined>Primary</Badge>
          <Badge variant="success" outlined>Success</Badge>
          <Badge variant="warning" outlined>Warning</Badge>
          <Badge variant="error" outlined>Error</Badge>
          <Badge variant="info" outlined>Info</Badge>
          <Badge variant="gray" outlined>Gray</Badge>
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Size Variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      {/* Badges with Icons */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Badges with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Badge icon={<CheckCircleIcon className="w-4 h-4" />}>Completed</Badge>
          <Badge variant="error" icon={<XCircleIcon className="w-4 h-4" />}>Failed</Badge>
          <Badge variant="warning" icon={<ExclamationCircleIcon className="w-4 h-4" />}>Warning</Badge>
          <Badge variant="info" icon={<InformationCircleIcon className="w-4 h-4" />}>Info</Badge>
          <Badge icon={<CheckCircleIcon className="w-4 h-4" />} iconEnd={<XCircleIcon className="w-4 h-4" />}>
            With Both Icons
          </Badge>
        </div>
      </div>

      {/* Interactive Badges */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Interactive Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge interactive onClick={() => alert('Clicked!')}>Clickable</Badge>
          <Badge variant="success" interactive outlined onClick={() => alert('Clicked!')}>
            Interactive Outlined
          </Badge>
        </div>
      </div>

      {/* Rounded vs Square */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Rounded vs Square</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default Rounded</Badge>
          <Badge rounded={false}>Square</Badge>
          <Badge variant="primary" rounded={false}>Square Primary</Badge>
          <Badge variant="success" outlined rounded={false}>Square Outlined</Badge>
        </div>
      </div>

      {/* Status Badges */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Status Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="success" icon={<CheckCircleIcon className="w-4 h-4" />}>Active</Badge>
          <Badge variant="error" icon={<XCircleIcon className="w-4 h-4" />}>Inactive</Badge>
          <Badge variant="warning" icon={<ExclamationCircleIcon className="w-4 h-4" />}>Pending</Badge>
          <Badge variant="info" icon={<InformationCircleIcon className="w-4 h-4" />}>Processing</Badge>
        </div>
      </div>

      {/* Count Badges */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Count Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="primary">5</Badge>
          <Badge variant="success">12</Badge>
          <Badge variant="warning">3</Badge>
          <Badge variant="error">8</Badge>
          <Badge variant="info">99+</Badge>
        </div>
      </div>
    </div>
  );
} 