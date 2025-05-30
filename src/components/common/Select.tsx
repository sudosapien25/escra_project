import React from 'react';
import clsx from 'clsx';
import { HiMiniChevronDown } from 'react-icons/hi2';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, fullWidth = true, options, placeholder, ...props }, ref) => {
    return (
      <div className={clsx('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={clsx(
              'w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs appearance-none bg-white',
              error ? 'border-red-300' : 'border-gray-200',
              fullWidth && 'w-full',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <HiMiniChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
        {(error || helperText) && (
          <p className={clsx('text-sm', error ? 'text-red-600' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select'; 