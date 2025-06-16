import React from 'react';
import clsx from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, fullWidth = true, ...props }, ref) => {
    return (
      <div className={clsx('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs min-h-[80px]',
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

Textarea.displayName = 'Textarea'; 