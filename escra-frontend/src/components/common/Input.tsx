import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, fullWidth = true, ...props }, ref) => {
    return (
      <div className={clsx('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs',
            'autofill:bg-white autofill:text-gray-900 autofill:shadow-[0_0_0_1000px_white_inset]',
            error ? 'border-red-300' : 'border-gray-200',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={clsx('text-sm', error ? 'text-red-600' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 