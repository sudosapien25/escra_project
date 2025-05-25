'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineDocumentText, HiOutlineBell, HiOutlineCog } from 'react-icons/hi';
import { RiLayoutColumnLine, RiDashboardLine, RiBox3Line } from 'react-icons/ri';
import { FaSignature } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import clsx from 'clsx';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<IconBaseProps>;
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
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine },
    { name: 'Contracts', href: '/contracts', icon: HiOutlineDocumentText },
    { name: 'Workflows', href: '/workflows', icon: RiLayoutColumnLine },
    { name: 'Signatures', href: '/signatures', icon: FaSignature },
    { name: 'Blockchain', href: '/blockchain', icon: RiBox3Line },
  ];

  const bottomNavItems: NavItem[] = [
    { name: 'Notifications', href: '/notifications', icon: HiOutlineBell },
    { name: 'Settings', href: '/admin-settings', icon: HiOutlineCog },
  ];

  return (
    <aside className="bg-white text-gray-800 p-4 border-r border-gray-200 flex flex-col" style={{ width: `${width}px` }}>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={clsx(
                  'flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-150',
                  pathname === item.href ? 'bg-teal-100 text-teal-800' : '',
                  isCollapsed ? 'justify-center' : '' // Center icon and text when collapsed (text will be hidden)
                )}
              >
                <IconWrapper icon={item.icon} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
                {!isCollapsed && item.name}
              </Link>
            </li>
          ))}
        </ul>
        <hr className="my-4 border-gray-200" />
        <ul>
          {bottomNavItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={clsx(
                  'flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-150',
                  pathname === item.href ? 'bg-teal-100 text-teal-800' : '',
                  isCollapsed ? 'justify-center' : '' // Center icon and text when collapsed (text will be hidden)
                )}
              >
                <IconWrapper icon={item.icon} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
                {!isCollapsed && item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Collapse Button positioned at the bottom */}
      <div className="mt-auto mb-2">
        <button
          onClick={toggleSidebar}
          className={clsx(
            'flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors duration-150',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          {isCollapsed ? (
            <IconWrapper icon={HiOutlineChevronDoubleRight} className="w-5 h-5 flex-shrink-0" />
          ) : (
            <IconWrapper icon={HiOutlineChevronDoubleLeft} className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-2')} />
          )}
        </button>
      </div>
    </aside>
  );
}; 