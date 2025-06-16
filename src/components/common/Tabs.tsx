import React, { useState, createContext, useContext } from 'react';
import clsx from 'clsx';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  children,
  className,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={clsx('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx('-mb-px flex flex-wrap border-b border-gray-200', className)}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

TabList.displayName = 'TabList';

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tab: string;
  children: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({
  tab,
  className,
  children,
  ...props
}) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === tab;

  const baseClasses = 'inline-flex justify-center items-center py-2 px-4 border-b-2 text-sm font-medium leading-5 focus:outline-none transition-colors duration-200 ease-in-out';
  const activeClasses = 'border-primary text-primary';
  const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${tab}`}
      onClick={() => setActiveTab(tab)}
      className={clsx(
        baseClasses,
        isActive ? activeClasses : inactiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

TabButton.displayName = 'TabButton';

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tab: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tab,
  className,
  children,
  ...props
}) => {
  const { activeTab } = useTabs();
  const isActive = activeTab === tab;

  if (!isActive) return null;

  return (
    <div
      id={`panel-${tab}`}
      role="tabpanel"
      aria-labelledby={`tab-${tab}`}
      className={clsx('py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel'; 