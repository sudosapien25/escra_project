'use client';

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Logo } from '@/components/common/Logo';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';
import { FaBell } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import { FaSearch } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const LOCAL_STORAGE_SIDEBAR_WIDTH_KEY = 'sidebarWidth'; // Keep for potential future use or cleanup, though not actively used for resizing
const DEFAULT_SIDEBAR_WIDTH = 288; // Corresponds to w-72
const COLLAPSED_SIDEBAR_WIDTH = 64; // Example collapsed width (w-16)
const LOCAL_STORAGE_COLLAPSED_KEY = 'isSidebarCollapsed';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remove state and refs related to resizing
  // const [sidebarWidth, setSidebarWidth] = useState<number | undefined>(undefined);
  // const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>(undefined);
  // const [lastWidth, setLastWidth] = useState<number | undefined>(undefined); // Remove lastWidth
  // const sidebarRef = useRef<HTMLDivElement>(null);

  // Remove resize handlers
  // const onMouseDown = (e: React.MouseEvent) => { ... };
  // const onMouseUp = () => { ... };
  // const onMouseMove = (e: MouseEvent) => { ... };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_COLLAPSED_KEY, JSON.stringify(newCollapsedState));
    }
    // Sidebar width will be controlled by the isCollapsed state and rendered width calculation below
  };

  // Remove effects related to resizing and saving variable width
  // useEffect(() => { ... }, [isResizing, onMouseMove, onMouseUp]);
  // useEffect(() => { ... }, [isCollapsed, lastWidth, isResizing]);
  // useEffect(() => { ... }, [sidebarWidth, isResizing, isCollapsed]);

  // Effect to handle initial load and hydrate collapsed state from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCollapsed = localStorage.getItem(LOCAL_STORAGE_COLLAPSED_KEY);
      const initialCollapsed = storedCollapsed ? JSON.parse(storedCollapsed) : false;
      setIsCollapsed(initialCollapsed);
      // No need to load or store variable width anymore
    }
  }, []); // Empty dependency array to run only once on client mount

  // Calculate current sidebar width based on collapsed state
  const currentSidebarWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH;

  return (
    <html lang="en">
      <body className="font-sans antialiased flex flex-col">
        <header className="p-4 border-b border-gray-200 flex items-center">
          {/* Wrap logo in a div for collapsed state alignment */}
          <div className={clsx(isCollapsed && "w-16 flex justify-center items-center -ml-4")}>
            <Logo />
          </div>
        </header>
        {/* Only check for isCollapsed being defined before rendering layout */}
        {isCollapsed !== undefined ? (
          <div className="flex flex-grow">
            {/* Use calculated currentSidebarWidth */}
            <div style={{ width: `${currentSidebarWidth}px` }} className="flex-shrink-0 border-r border-gray-200 transition-width duration-150 ease-in-out">
              {/* Pass calculated width to Sidebar */}
              <Sidebar width={currentSidebarWidth} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            </div>
            {/* Main Content Area */}
            <div className="flex flex-col flex-grow overflow-hidden flex-basis-0 min-w-0">
              <header className="p-4 border-b border-gray-200 flex items-center justify-end space-x-4">
                <div className="relative">
                  <FaBell {...{ className: "text-gray-600 text-xl" } as IconBaseProps} />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </div>
                <div className="relative flex items-center">
                  <FaSearch {...{ className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" } as IconBaseProps} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                  JD
                </div>
              </header>
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
