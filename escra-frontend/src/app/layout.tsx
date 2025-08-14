'use client';

import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
