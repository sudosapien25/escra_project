import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that don't require authentication
const publicPaths = ['/', '/login', '/pricing']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value

  // If there's no token and the path is not public, redirect to login
  if (!token) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 