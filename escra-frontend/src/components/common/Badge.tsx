import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  /**
   * The content to display in the badge
   */
  children: React.ReactNode;
  /**
   * The color variant of the badge
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  /**
   * The size of the badge
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the badge is outlined
   */
  outlined?: boolean;
  /**
   * Whether the badge is rounded
   */
  rounded?: boolean;
  /**
   * Whether the badge is interactive (clickable)
   */
  interactive?: boolean;
  /**
   * Optional icon to display before the content
   */
  icon?: React.ReactNode;
  /**
   * Optional icon to display after the content
   */
  iconEnd?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  outlined = false,
  rounded = false,
  interactive = false,
  icon,
  iconEnd,
  className,
  onClick,
}) => {
  const baseClasses = 'inline-flex items-center font-medium whitespace-nowrap';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const variantClasses = {
    primary: outlined
      ? 'border border-primary text-primary bg-transparent hover:bg-primary/10'
      : 'bg-primary text-white',
    success: outlined
      ? 'border border-green-500 text-green-500 bg-transparent hover:bg-green-50'
      : 'bg-green-500 text-white',
    warning: outlined
      ? 'border border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-50'
      : 'bg-yellow-500 text-white',
    error: outlined
      ? 'border border-red-500 text-red-500 bg-transparent hover:bg-red-50'
      : 'bg-red-500 text-white',
    info: outlined
      ? 'border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50'
      : 'bg-blue-500 text-white',
    gray: outlined
      ? 'border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-50'
      : 'bg-gray-100 text-gray-700',
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer transition-colors duration-200'
    : '';

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        interactiveClasses,
        roundedClasses,
        className
      )}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {iconEnd && <span className="ml-1">{iconEnd}</span>}
    </span>
  );
};

Badge.displayName = 'Badge'; 