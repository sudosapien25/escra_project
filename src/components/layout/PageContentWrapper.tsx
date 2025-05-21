'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

interface PageContentWrapperProps {
  children: React.ReactNode;
}

export const PageContentWrapper: React.FC<PageContentWrapperProps> = ({
  children,
}) => {
  const pathname = usePathname();

  // Function to generate a user-friendly title from the pathname
  const getPageTitle = (path: string): string => {
    const segments = path.split('/').filter(segment => segment !== '');

    if (segments.length === 0) {
      return 'Home'; // Or a default title for the root
    }

    const pathSegment = segments.join('/'); // Use joined segments for specific checks

    // Handle specific titles
    if (pathSegment === 'reports-audit') {
      return 'Audit & Reports';
    }

    // Default conversion: replace hyphens with spaces and capitalize each word
    const title = pathSegment
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return title;
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <>
      {children}
    </>
  );
}; 