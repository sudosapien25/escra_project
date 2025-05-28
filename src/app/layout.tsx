'use client';

import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Logo } from '@/components/common/Logo';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const DEFAULT_SIDEBAR_WIDTH = 288; // Corresponds to w-72
const COLLAPSED_SIDEBAR_WIDTH = 64; // Example collapsed width (w-16)
const LOCAL_STORAGE_COLLAPSED_KEY = 'isSidebarCollapsed';

interface Theme {
  isDark: boolean;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>(undefined);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return JSON.parse(savedTheme);
      }
    }
    return { isDark: false };
  });

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_COLLAPSED_KEY, JSON.stringify(newCollapsedState));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCollapsed = localStorage.getItem(LOCAL_STORAGE_COLLAPSED_KEY);
      const initialCollapsed = storedCollapsed ? JSON.parse(storedCollapsed) : false;
      setIsCollapsed(initialCollapsed);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', JSON.stringify(theme));
      if (theme.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const currentSidebarWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH;

  return (
    <html lang="en" className={theme.isDark ? 'dark' : ''}>
      <body className="font-sans antialiased flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800">
          <div className={clsx(isCollapsed && "w-16 flex justify-center items-center -ml-4")}>
            <Logo theme={theme.isDark ? 'dark' : 'light'} />
          </div>
        </header>
        {isCollapsed !== undefined ? (
          <div className="flex flex-grow">
            <div style={{ width: `${currentSidebarWidth}px` }} className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 transition-width duration-150 ease-in-out">
              <Sidebar 
                width={currentSidebarWidth} 
                isCollapsed={isCollapsed} 
                toggleSidebar={toggleSidebar}
                theme={theme}
                setTheme={setTheme}
              />
            </div>
            <div className="flex flex-col flex-grow overflow-hidden flex-basis-0 min-w-0">
              <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-4 bg-white dark:bg-gray-800"></header>
              <main className="py-4 px-8 flex-grow bg-gray-50 dark:bg-gray-900">
                <div>
                  <PageContentWrapper>
                    {children}
                  </PageContentWrapper>
                </div>
              </main>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow items-center justify-center">Loading layout...</div>
        )}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
