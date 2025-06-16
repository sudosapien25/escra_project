'use client';

import React from 'react';

interface PageContentWrapperProps {
  children: React.ReactNode;
}

export const PageContentWrapper: React.FC<PageContentWrapperProps> = ({
  children,
}) => {
  return (
    <>
      {children}
    </>
  );
}; 