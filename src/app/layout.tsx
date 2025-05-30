'use client';

import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

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
        </AuthProvider>
      </body>
    </html>
  );
}
