'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiOutlineDocumentText, HiOutlineBell, HiOutlineCog } from 'react-icons/hi';
import { RiLayoutColumnLine, RiDashboardLine, RiBox3Line } from 'react-icons/ri';
import { FaSignature } from 'react-icons/fa';
import { TbSubtask, TbCubeSpark } from 'react-icons/tb';
import { IconBaseProps } from 'react-icons';
import clsx from 'clsx';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import React, { useEffect, useRef } from 'react';
import { LiaCubesSolid } from 'react-icons/lia';
import { HiCubeTransparent } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';

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
    { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine },
    { name: 'Contracts', href: '/contracts', icon: HiOutlineDocumentText },
    { name: 'Tasks', href: '/workflows', icon: TbSubtask },
    { name: 'Signatures', href: '/signatures', icon: FaSignature },
    { name: 'Blockchain', href: '/blockchain', icon: TbCubeSpark },
  ];

  const bottomNavItems: NavItem[] = [
    { name: 'Notifications', href: '/notifications', icon: HiOutlineBell },
    { name: 'Settings', href: '/admin-settings', icon: HiOutlineCog },
  ];

  return (
    <aside className="text-gray-800 dark:text-gray-200 p-4 flex flex-col" style={{ width: `${width}px` }}>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <React.Fragment key={item.href}>
              <li className="mb-2">
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
                      <IconWrapper icon={item.icon} className={clsx('w-5 h-5 flex-shrink-0', 'mr-2')} />
                      <span className="text-sm font-medium flex-1 text-left">{item.name}</span>
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
                    <IconWrapper icon={item.icon} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
                    {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                    {isCollapsed && (
                      <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}
              </li>
              {/* Add sub-options under Signatures - HIDDEN */}
              {/* {item.name === 'Signatures' && !isCollapsed && signaturesOpen && (
                <ul className="ml-8 mb-2">
                  {[
                    { name: 'Inbox', href: '/signatures/inbox' },
                    { name: 'Outbox', href: '/signatures/sent' },
                    { name: 'Drafts', href: '/signatures/drafts' },
                    { name: 'Completed', href: '/signatures/completed' },
                    { name: 'Canceled', href: '/signatures/canceled' },
                  ].map((sub) => (
                    <li key={sub.href} className="mb-1">
                      <Link
                        href={sub.href}
                        className={clsx(
                          'block pl-4 py-1 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                          pathname === sub.href ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-semibold' : 'text-gray-600 dark:text-gray-300'
                        )}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )} */}
            </React.Fragment>
          ))}
        </ul>
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <ul>
          {bottomNavItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={clsx(
                  'flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
                  pathname === item.href ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400' : '',
                  isCollapsed ? 'justify-center' : '',
                  isCollapsed && pathname === item.href ? 'px-4' : ''
                )}
              >
                <IconWrapper icon={item.icon} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Bottom buttons */}
      <div className="mt-auto space-y-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={clsx(
            'flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
            isCollapsed ? 'justify-center' : ''
          )}
          aria-label={theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme.isDark ? (
            <IconWrapper icon={MdOutlineLightMode} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
          ) : (
            <IconWrapper icon={MdOutlineDarkMode} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
          )}
          {!isCollapsed && <span className="text-sm font-medium">{theme.isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {theme.isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative group',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          {isCollapsed ? (
            <IconWrapper icon={HiOutlineChevronDoubleRight} className="w-5 h-5 flex-shrink-0" />
          ) : (
            <IconWrapper icon={HiOutlineChevronDoubleLeft} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
          )}
          {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Expand
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}; 