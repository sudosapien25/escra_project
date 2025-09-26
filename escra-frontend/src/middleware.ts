import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that don't require authentication
const publicPaths = ['/', '/login', '/register', '/pricing', '/forgot-password']

// Add paths that require admin access
const adminPaths = ['/admin-settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get the token from localStorage (via cookies or headers in production)
  // Note: In production, you'd typically use httpOnly cookies for better security
  const token = request.cookies.get('access_token')?.value

  // If there's no token and the path is not public, redirect to login
  if (!token) {
    const url = new URL('/login', request.url)
    // Add the original URL as a redirect parameter
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // For admin paths, we'd need to decode the JWT and check the role
  // This is a simplified version - in production, you'd validate the JWT properly
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // In a real app, you would decode the JWT here and check for admin role
    // For now, we'll just check if the token exists
    // You could also make an API call to verify the user's role
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|assets).*)',
  ],
}