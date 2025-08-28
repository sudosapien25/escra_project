'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiOutlineDocumentText, HiOutlineBell } from 'react-icons/hi';
import { RiLayoutColumnLine, RiDashboardLine, RiBox3Line } from 'react-icons/ri';
import { FaSignature } from 'react-icons/fa';
import { TbSubtask, TbCubeSpark, TbLayoutDashboard, TbScript, TbLayoutBoard, TbWritingSign, TbFileText, TbTimeline, TbLogout2, TbSettingsCog, TbSunHigh, TbMoon, TbChevronsLeft, TbChevronsRight, TbDoorExit } from 'react-icons/tb';
import { IconBaseProps } from 'react-icons';
import clsx from 'clsx';


import React, { useEffect, useRef } from 'react';
import { LiaCubesSolid } from 'react-icons/lia';
import { HiCubeTransparent } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<IconBaseProps>;
}

interface Theme {
  isDark: boolean;
}

// Add props for collapse functionality
interface SidebarProps {
  width: number;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

// Helper component to render icons with className
const IconWrapper: React.FC<{ icon: React.ComponentType<IconBaseProps>; className?: string }> = ({
  icon: Icon,
  className
}) => {
  const iconProps: IconBaseProps = { className: className } as IconBaseProps;
  return <Icon {...iconProps} />;
};

export const Sidebar: React.FC<SidebarProps> = ({ width, isCollapsed, toggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(prev => ({ isDark: !prev.isDark }));
  };

  // State for Signatures sub-menu
  const [signaturesOpen, setSignaturesOpen] = React.useState(false);

  // Effect: Auto-open list when on signatures pages, auto-close when leaving
  useEffect(() => {
    if (pathname === '/signatures' || pathname.startsWith('/signatures/')) {
      setSignaturesOpen(true);
    } else {
      setSignaturesOpen(false);
    }
  }, [pathname]);

  // Helper: is signatures main page
  const isSignaturesMainPage = pathname === '/signatures';
  
  // Helper: is any signatures page (main or subpage)
  const isSignaturesPage = pathname === '/signatures' || pathname.startsWith('/signatures/');

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: TbLayoutBoard },
    { name: 'Contracts', href: '/contracts', icon: TbFileText },
    { name: 'Tasks', href: '/workflows', icon: TbSubtask },
    { name: 'Signatures', href: '/signatures', icon: TbWritingSign },
    { name: 'Blockchain', href: '/blockchain', icon: TbCubeSpark },
  ];

  const bottomNavItems: NavItem[] = [
    { name: 'Activity Monitor', href: '/activity-monitor', icon: TbTimeline },
    { name: 'Settings', href: '/admin-settings', icon: TbSettingsCog },
  ];

  return (
    <aside className="text-gray-800 dark:text-gray-200 p-4 flex flex-col bg-white dark:bg-gray-800 h-full transition-colors duration-150" style={{ width: `${width}px` }}>
      {/* Main navigation section */}
      <nav className="flex-1 flex flex-col">
        {/* Top navigation items */}
        <div className="flex-1">
          <ul>
            {navItems.map((item) => (
              <React.Fragment key={item.href}>
                <li className="mb-3">
                  {item.name === 'Signatures' && !isCollapsed ? (
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSignaturesPage) {
                            // Navigating from non-signatures page: navigate to main page
                            router.push('/signatures');
                          } else if (isSignaturesMainPage) {
                            // On main page: toggle dropdown
                            setSignaturesOpen((open) => !open);
                          } else {
                            // On subpage: navigate to main page, keep list open
                            router.push('/signatures');
                          }
                        }}
                        className={clsx(
                          'flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
                          isSignaturesPage ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400' : '',
                        )}
                      >
                        <div className="w-16 flex justify-center -ml-6">
                          <IconWrapper icon={item.icon} className="w-6 h-6 flex-shrink-0" />
                        </div>
                        <span className="text-base font-medium flex-1 text-left">{item.name}</span>
                        {isCollapsed && (
                          <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {item.name}
                          </span>
                        )}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        'flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
                        pathname === item.href ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400' : '',
                        isCollapsed ? 'justify-center' : '',
                        isCollapsed && pathname === item.href ? 'px-4' : ''
                      )}
                    >
                      <div className={clsx("flex justify-center", isCollapsed ? "w-full" : "w-16 -ml-6")}>
                        <IconWrapper icon={item.icon} className="w-6 h-6 flex-shrink-0" />
                      </div>
                      {!isCollapsed && <span className="text-base font-medium">{item.name}</span>}
                      {isCollapsed && (
                        <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ul>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <ul>
            {bottomNavItems.map((item) => (
              <li key={item.href} className="mb-3">
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
                    pathname === item.href ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400' : '',
                    isCollapsed ? 'justify-center' : '',
                    isCollapsed && pathname === item.href ? 'px-4' : ''
                  )}
                >
                  <div className={clsx("flex justify-center", isCollapsed ? "w-full" : "w-16 -ml-6")}>
                    <IconWrapper icon={item.icon} className="w-6 h-6 flex-shrink-0" />
                  </div>
                  {!isCollapsed && <span className="text-base font-medium">{item.name}</span>}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Theme Toggle Button - back to original position */}
          <div className="mt-5">
            <button
              onClick={toggleTheme}
              className={clsx(
                'flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
                isCollapsed ? 'justify-center' : ''
              )}
              aria-label={theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className={clsx("flex justify-center", isCollapsed ? "w-full" : "w-16 -ml-6")}>
                {theme.isDark ? (
                  <IconWrapper icon={TbSunHigh} className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <IconWrapper icon={TbMoon} className="w-6 h-6 flex-shrink-0" />
                )}
              </div>
              {!isCollapsed && <span className="text-base font-medium">{theme.isDark ? 'Light Mode' : 'Dark Mode'}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {theme.isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
          </div>
          
          {/* Collapse Button - back to original position */}
          <div className="mt-3">
            <button
              onClick={toggleSidebar}
              className={clsx(
                'flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <div className={clsx("flex justify-center", isCollapsed ? "w-full" : "w-16 -ml-6")}>
                {isCollapsed ? (
                  <IconWrapper icon={TbChevronsRight} className="w-7 h-7 flex-shrink-0" />
                ) : (
                  <IconWrapper icon={TbChevronsLeft} className="w-7 h-7 flex-shrink-0" />
                )}
              </div>
              {!isCollapsed && <span className="text-base font-medium">Collapse</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Expand
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Spacer to ensure logout is visible */}
        <div className="flex-1"></div>
        
        {/* Logout Button - Always at the very bottom */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              logout();
            }}
            className={clsx(
              'flex items-center w-full p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-150 relative group',
              isCollapsed ? 'justify-center' : ''
            )}
          >
            <div className={clsx("flex justify-center", isCollapsed ? "w-full" : "w-16 -ml-6")}>
              <IconWrapper icon={TbDoorExit} className="w-6 h-6 flex-shrink-0" />
            </div>
            {!isCollapsed && <span className="text-base font-medium">Logout</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Logout
              </span>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
}; 