'use client';

import { Logo } from '@/components/common/Logo';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';
import { useState, useEffect, useRef } from 'react';
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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return JSON.parse(savedTheme);
      }
    }
    return { isDark: false };
  });
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showAvatarDropdown &&
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAvatarDropdown(false);
      }
    }
    if (showAvatarDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAvatarDropdown]);

  const currentSidebarWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH;

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800 justify-between">
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => { setShowAvatarDropdown(false); router.push('/admin-settings'); }}>
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => { setShowAvatarDropdown(false); router.push('/admin-settings'); }}>
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setShowAvatarDropdown(false)}>
                  Billing
                </button>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-red-50 hover:text-red-700 transition-colors" onClick={() => { setShowAvatarDropdown(false); logout(); }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
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
    </div>
  );
} 