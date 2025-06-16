import React from 'react';
import clsx from 'clsx';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

export interface TimelineStep {
  /**
   * Unique identifier for the step
   */
  id: string;
  /**
   * Title of the step
   */
  title: string;
  /**
   * Optional description for the step
   */
  description?: string;
  /**
   * Current state of the step
   */
  status: 'completed' | 'current' | 'upcoming' | 'error';
  /**
   * Optional date for the step
   */
  date?: string;
  /**
   * Optional icon to display for the step
   */
  icon?: React.ReactNode;
}

export interface TimelineProps {
  /**
   * Array of steps to display in the timeline
   */
  steps: TimelineStep[];
  /**
   * Whether to show connecting lines between steps
   */
  showConnectors?: boolean;
  /**
   * Whether to show dates for each step
   */
  showDates?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  steps,
  showConnectors = true,
  showDates = true,
  className,
}) => {
  const getStatusIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-primary" />;
      case 'current':
        return <ClockIcon className="w-6 h-6 text-primary" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusClasses = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-primary';
      case 'current':
        return 'text-primary';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={clsx('relative', className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          {/* Connector Line */}
          {showConnectors && index < steps.length - 1 && (
            <div
              className={clsx(
                'absolute left-3 top-6 w-0.5 h-full',
                step.status === 'completed' ? 'bg-primary' : 'bg-gray-200'
              )}
            />
          )}

          <div className="relative flex items-start">
            {/* Icon */}
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white">
              {step.icon || getStatusIcon(step.status)}
            </div>

            {/* Content */}
            <div className="ml-4 min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className={clsx('text-sm font-medium', getStatusClasses(step.status))}>
                  {step.title}
                </h3>
                {showDates && step.date && (
                  <span className="text-sm text-gray-500">{step.date}</span>
                )}
              </div>
              {step.description && (
                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Timeline.displayName = 'Timeline'; 