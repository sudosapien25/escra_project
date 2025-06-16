import React from 'react';
import clsx from 'clsx';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large';
}

export const Loading: React.FC<LoadingProps> = ({
  className,
  size = 'medium',
  ...props
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-3',
    large: 'w-8 h-8 border-4',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-t-transparent', // base styles
        sizeClasses[size], // size styles
        className // custom styles
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Loading.displayName = 'Loading'; 