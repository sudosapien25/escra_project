import React from 'react';
import clsx from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const base =
      'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary';

    return (
      <input
        ref={ref}
        className={clsx(base, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'; 