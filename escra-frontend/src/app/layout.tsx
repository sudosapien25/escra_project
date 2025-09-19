'use client';

import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import dynamic from 'next/dynamic';

// Create a client-only component for toolbar initialization
const StagewiseToolbar = dynamic(() => import('@/components/StagewiseToolbar'), {
  ssr: false
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <Toaster position="top-right" />
              {process.env.NODE_ENV === 'development' && <StagewiseToolbar />}
            </NotificationProvider>
          </AuthProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
