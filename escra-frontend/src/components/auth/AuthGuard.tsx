'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (requireAdmin && !isAdmin) {
        router.push('/dashboard');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAuth, requireAdmin, router, redirectTo]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Authenticating...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// HOC version for wrapping components
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}