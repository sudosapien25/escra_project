import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  ...props
}) => {
  const base = 'bg-secondary p-6 rounded-lg shadow-lg';

  return (
    <div className={clsx(base, className)} {...props}>
      {children}
    </div>
  );
};

Card.displayName = 'Card'; 