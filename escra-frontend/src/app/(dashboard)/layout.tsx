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
import { TbBell } from 'react-icons/tb';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { useNotifications } from '@/context/NotificationContext';

const DEFAULT_SIDEBAR_WIDTH = 220; // Expanded sidebar width for better text visibility
const COLLAPSED_SIDEBAR_WIDTH = 64; // Collapsed width - just enough for icons
const ICON_AREA_WIDTH = 64; // Fixed width for icon area
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
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();
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
      <header className="fixed top-0 left-0 right-0 z-50 p-3 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800 justify-between">
        <div className="flex items-center pl-0.5">
          <Logo theme={theme.isDark ? 'dark' : 'light'} width={36} height={36} />
        </div>
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative group"
          >
            <TbBell className="w-6 h-6 flex-shrink-0" />
            {unreadCount > 0 && (
              <div className="absolute -top-0.5 -right-1 bg-primary text-white text-xs font-medium rounded-lg px-1.5 py-0.5 min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                <span className="transform translate-y-0.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </div>
            )}
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Notifications
            </span>
          </button>
          <div ref={avatarDropdownRef} className="relative">
            <div
              className="cursor-pointer"
              onClick={() => setShowAvatarDropdown((v) => !v)}
            >
              <Avatar size="sm" alt="User" src={undefined} />
            </div>
            {showAvatarDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>

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
          <div style={{ width: `${currentSidebarWidth}px` }} className="fixed left-0 top-16 bottom-0 z-40 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-150 ease-in-out">
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
        <div className="flex flex-grow items-center justify-center pt-16 bg-gray-50 dark:bg-gray-900">Loading layout...</div>
      )}
      
      {/* Notification Dropdown */}
      <NotificationDropdown
        isOpen={showNotificationDropdown}
        onClose={() => setShowNotificationDropdown(false)}
        unreadCount={unreadCount}
      />
    </div>
  );
} 