'use client';

import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Create a client-only component for toolbar initialization
const StagewiseToolbar = dynamic(() => import('@/components/StagewiseToolbar'), {
  ssr: false
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return JSON.parse(savedTheme);
      }
    }
    return { isDark: false };
  });

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

  return (
    <html lang="en" className={theme.isDark ? 'dark' : ''}>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
          {process.env.NODE_ENV === 'development' && <StagewiseToolbar />}
        </AuthProvider>
      </body>
    </html>
  );
}
