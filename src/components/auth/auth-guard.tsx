'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip auth check for public routes
    const path = window.location.pathname
    if (path === '/' || path === '/auth') {
      setIsLoading(false)
      return
    }

    // Simple auth check
    const checkAuth = () => {
      try {
        const hasSession = document.cookie.includes('session=')
        setIsAuthenticated(hasSession)
        
        if (!hasSession) {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        router.push('/auth')
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  // Show loading spinner only for protected routes
  if (isLoading && window.location.pathname !== '/' && window.location.pathname !== '/auth') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // For public routes, always show children
  if (window.location.pathname === '/' || window.location.pathname === '/auth') {
    return <>{children}</>
  }

  // For protected routes, show children only if authenticated
  return isAuthenticated ? <>{children}</> : null
}