import React from 'react';
import clsx from 'clsx';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => {
    const base =
      'h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded';

    return (
      <div className="flex items-center">
        <input
          id={props.id || props.name}
          ref={ref}
          type="checkbox"
          className={clsx(base, className)}
          {...props}
        />
        {children && (
          <label
            htmlFor={props.id || props.name}
            className="ml-2 block text-sm text-gray-900"
          >
            {children}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox'; 