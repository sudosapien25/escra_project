import React from 'react';
import clsx from 'clsx';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  className,
  variant = 'primary',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium';
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-primary',
    outline: 'bg-transparent border border-primary text-primary',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={clsx(base, variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
};

Tag.displayName = 'Tag'; 