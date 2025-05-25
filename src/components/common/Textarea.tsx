import React from 'react';
import clsx from 'clsx';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref) => {
  const base =
    'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <textarea ref={ref} className={clsx(base, className)} {...props} />
  );
});

Textarea.displayName = 'Textarea'; 