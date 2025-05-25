import React from 'react';
import clsx from 'clsx';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  children,
  ...props
}) => {
  const variantClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div
      className={clsx(
        'border p-4 rounded', // base styles
        variantClasses[variant], // variant styles
        className // custom styles
      )}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

Alert.displayName = 'Alert'; 