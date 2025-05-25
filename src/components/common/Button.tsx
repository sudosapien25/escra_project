import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
};

export const Button = ({
  variant = 'primary',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  const variants = {
    primary:
      'bg-primary text-white hover:bg-opacity-90 disabled:bg-primary/50',
    secondary:
      'bg-secondary text-primary border border-primary hover:bg-primary hover:text-white disabled:bg-secondary/50',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:text-primary/50 disabled:border-primary/30',
  };
  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block" />
      ) : null}
      {children}
    </button>
  );
}; 