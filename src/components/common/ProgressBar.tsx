import React from 'react';
import clsx from 'clsx';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number; // progress from 0 to 100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  ...props
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={clsx('w-full h-2 bg-gray-200 rounded-full overflow-hidden', className)}
      {...props}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar'; 