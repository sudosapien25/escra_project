'use client';

import { Toaster } from "react-hot-toast";
import "../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
} 