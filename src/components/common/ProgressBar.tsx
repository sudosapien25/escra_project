import React from 'react';
import clsx from 'clsx';

export interface ProgressBarProps {
  /**
   * The current progress value (0-100)
   */
  value: number;
  /**
   * Optional label to display above the progress bar
   */
  label?: string;
  /**
   * Optional helper text to display below the progress bar
   */
  helperText?: string;
  /**
   * The size of the progress bar
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The color variant of the progress bar
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'kanban';
  /**
   * Whether to show the percentage value
   */
  showValue?: boolean;
  /**
   * Whether the progress bar is in an indeterminate state
   */
  indeterminate?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  helperText,
  size = 'md',
  variant = 'primary',
  showValue = false,
  indeterminate = false,
  className,
}) => {
  // Ensure value is between 0 and 100
  const progress = Math.min(Math.max(value, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    kanban: 'bg-primary/20', // Light primary color for background
  };

  const progressClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    kanban: 'bg-primary', // Solid primary color for progress
  };

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full rounded-full overflow-hidden',
          sizeClasses[size],
          variantClasses[variant]
        )}
      >
        <div
          className={clsx(
            'transition-all duration-300 ease-in-out rounded-full',
            progressClasses[variant],
            indeterminate ? 'animate-progress-indeterminate' : ''
          )}
          style={{
            width: indeterminate ? '100%' : `${progress}%`,
          }}
        />
      </div>
      {helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar'; 