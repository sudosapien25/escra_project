import React from 'react';
import clsx from 'clsx';

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  tabClassName?: string;
}

export const Tabs_new: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  className,
  tabClassName,
}) => {
  return (
    <div className={clsx('flex space-x-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={clsx(
            'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
            value === tab.value
              ? 'bg-primary text-white shadow'
              : 'bg-white text-gray-700 hover:bg-primary/10',
            tab.disabled && 'opacity-50 cursor-not-allowed',
            tabClassName
          )}
          onClick={() => !tab.disabled && onChange(tab.value)}
          disabled={tab.disabled}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}; 