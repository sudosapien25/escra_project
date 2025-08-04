'use client';

import { Logo } from '@/components/common/Logo';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import clsx from 'clsx';
import { Avatar } from '@/components/common/Avatar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const DEFAULT_SIDEBAR_WIDTH = 175; // Extremely compact sidebar width
const COLLAPSED_SIDEBAR_WIDTH = 64; // Example collapsed width (w-16)
const LOCAL_STORAGE_COLLAPSED_KEY = 'isSidebarCollapsed';

interface Theme {
  isDark: boolean;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>(undefined);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_COLLAPSED_KEY, JSON.stringify(newCollapsedState));
    }
  };

  useEffect(() => {
    const storedCollapsed = localStorage.getItem(LOCAL_STORAGE_COLLAPSED_KEY);
    const initialCollapsed = storedCollapsed ? JSON.parse(storedCollapsed) : false;
    setIsCollapsed(initialCollapsed);
  }, []);

  // Click outside functionality for avatar dropdown
  useEffect(() => {
    if (showAvatarDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          avatarDropdownRef.current &&
          !avatarDropdownRef.current.contains(event.target as Node)
        ) {
          setShowAvatarDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAvatarDropdown]);

  const { theme, setTheme } = useTheme();
  const currentSidebarWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH;
  return (
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800 justify-between">
        <div className={clsx(isCollapsed && "w-16 flex justify-center items-center -ml-4")}>
          <Logo theme={theme.isDark ? 'dark' : 'light'} />
        </div>
        <div className="flex items-center gap-4 relative">
          <div ref={avatarDropdownRef} className="relative">
            <div
              className="cursor-pointer"
              onClick={() => setShowAvatarDropdown((v) => !v)}
            >
              <Avatar size="sm" alt="User" src={undefined} />
            </div>
            {showAvatarDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => { setShowAvatarDropdown(false); router.push('/notifications'); }}>
                  Inbox
                </button>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => { setShowAvatarDropdown(false); router.push('/admin-settings'); }}>
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setShowAvatarDropdown(false)}>
                  Billing
                </button>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 transition-colors" onClick={() => { setShowAvatarDropdown(false); logout(); }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {isCollapsed !== undefined ? (
        <div className="flex flex-grow pt-16">
          <div style={{ width: `${currentSidebarWidth}px` }} className="fixed left-0 top-16 h-full z-40 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-width duration-150 ease-in-out">
            <Sidebar 
              width={currentSidebarWidth} 
              isCollapsed={isCollapsed} 
              toggleSidebar={toggleSidebar}
            />
          </div>
          <div className="flex flex-col flex-grow overflow-hidden flex-basis-0 min-w-0 ml-0" style={{ marginLeft: `${currentSidebarWidth}px` }}>
            <main className="pt-6 pb-4 px-8 flex-grow bg-gray-50 dark:bg-gray-900">
              <div>
                <PageContentWrapper>
                  {children}
                </PageContentWrapper>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="flex flex-grow items-center justify-center pt-16">Loading layout...</div>
      )}
    </div>
  );
} 