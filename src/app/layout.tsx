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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>(undefined);

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

  const currentSidebarWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH;

  return (
    <html lang="en">
      <body className="font-sans antialiased flex flex-col">
        <header className="p-4 border-b border-gray-200 flex items-center">
          <div className={clsx(isCollapsed && "w-16 flex justify-center items-center -ml-4")}>
            <Logo />
          </div>
        </header>
        {isCollapsed !== undefined ? (
          <div className="flex flex-grow">
            <div style={{ width: `${currentSidebarWidth}px` }} className="flex-shrink-0 border-r border-gray-200 transition-width duration-150 ease-in-out">
              <Sidebar width={currentSidebarWidth} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            </div>
            <div className="flex flex-col flex-grow overflow-hidden flex-basis-0 min-w-0">
              <header className="p-4 border-b border-gray-200 flex items-center justify-end space-x-4 bg-white"></header>
              <main className="py-4 px-8 flex-grow">
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
