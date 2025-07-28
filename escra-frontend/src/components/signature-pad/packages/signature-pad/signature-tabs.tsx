import * as React from "react";
import { cn } from "../../../../lib/utils";

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  className, 
  children 
}) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || '');

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            activeTab, 
            onTabChange: handleTabChange 
          } as any);
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400",
      className
    )}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  className, 
  children, 
  activeTab, 
  onTabChange 
}) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onTabChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  className, 
  children, 
  activeTab 
}) => {
  if (activeTab !== value) return null;

  return (
    <div className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      className
    )}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 