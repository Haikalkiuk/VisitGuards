import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes yang tidak memerlukan authentication
  const publicRoutes = ['/', '/auth', '/api/auth']
  
  // Protected routes yang memerlukan authentication
  const protectedRoutes = ['/monitor', '/data', '/maps']
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )

  // Get session cookie
  const session = request.cookies.get('session')
  const isAuthenticated = session?.value === 'authenticated'

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth page, redirect to dashboard
  if (pathname === '/auth' && isAuthenticated) {
    return NextResponse.redirect(new URL('/monitor', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}