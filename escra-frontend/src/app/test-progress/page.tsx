'use client';

import React, { useState, useEffect } from 'react';
import { ProgressBar } from '@/components/common/ProgressBar';

export default function TestProgressPage() {
  const [progress, setProgress] = useState(0);

  // Simulate progress for demo
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Progress Bar Component Test Page</h1>

      {/* Basic Progress Bars */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Basic Progress Bars</h2>
        <div className="space-y-4">
          <ProgressBar value={progress} />
          <ProgressBar value={progress} showValue />
          <ProgressBar value={progress} label="Loading..." showValue />
          <ProgressBar value={progress} label="Upload Progress" helperText="Uploading files..." showValue />
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Size Variants</h2>
        <div className="space-y-4">
          <ProgressBar value={75} size="sm" showValue />
          <ProgressBar value={75} size="md" showValue />
          <ProgressBar value={75} size="lg" showValue />
        </div>
      </div>

      {/* Color Variants */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Color Variants</h2>
        <div className="space-y-4">
          <ProgressBar value={75} variant="primary" showValue />
          <ProgressBar value={75} variant="success" showValue />
          <ProgressBar value={75} variant="warning" showValue />
          <ProgressBar value={75} variant="error" showValue />
        </div>
      </div>

      {/* Kanban Task Card Progress Bars */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Kanban Task Card Progress Bars</h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Task Progress</span>
              <span className="text-sm text-gray-500">3 of 5 completed</span>
            </div>
            <ProgressBar value={60} variant="kanban" size="sm" />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Document Review</span>
              <span className="text-sm text-gray-500">2 of 3 completed</span>
            </div>
            <ProgressBar value={66} variant="kanban" size="sm" />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Contract Signing</span>
              <span className="text-sm text-gray-500">1 of 4 completed</span>
            </div>
            <ProgressBar value={25} variant="kanban" size="sm" />
          </div>
        </div>
      </div>

      {/* Indeterminate State */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Indeterminate State</h2>
        <div className="space-y-4">
          <ProgressBar value={0} indeterminate label="Processing..." />
          <ProgressBar value={0} indeterminate variant="success" label="Loading..." />
          <ProgressBar value={0} indeterminate variant="warning" label="Preparing..." />
          <ProgressBar value={0} indeterminate variant="error" label="Error..." />
        </div>
      </div>

      {/* Different Progress Values */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Different Progress Values</h2>
        <div className="space-y-4">
          <ProgressBar value={0} showValue />
          <ProgressBar value={25} showValue />
          <ProgressBar value={50} showValue />
          <ProgressBar value={75} showValue />
          <ProgressBar value={100} showValue />
        </div>
      </div>
    </div>
  );
} 