'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { VisitGuardLogo } from './logo'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const hasSession = document.cookie.includes('session=authenticated')
        setIsAuthenticated(hasSession)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [pathname])

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'IoT Monitor', href: '/monitor' },
    { name: 'Data Daun', href: '/data' },
    { name: 'Peta', href: '/maps' },
  ]

  const isActive = (href: string) => pathname === href

  const handleProtectedNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      window.location.href = `/auth?redirect=${encodeURIComponent(href)}`
    }
  }

  const handleLogout = () => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <VisitGuardLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isProtected = ['/monitor', '/data', '/maps'].includes(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={isProtected ? (e) => handleProtectedNav(e, item.href) : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-green-600",
                    isActive(item.href)
                      ? "text-green-600 border-b-2 border-green-600 pb-1"
                      : "text-gray-700"
                  )}
                >
                  {item.name}
                  {isProtected && !isAuthenticated && (
                    <span className="ml-1 text-xs text-gray-500">(🔒)</span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Welcome!</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <User className="w-4 h-4" />
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const isProtected = ['/monitor', '/data', '/maps'].includes(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={isProtected ? (e) => {
                      handleProtectedNav(e, item.href)
                      setIsMenuOpen(false)
                    } : () => setIsMenuOpen(false)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-green-600 px-2 py-1",
                      isActive(item.href)
                        ? "text-green-600 bg-green-50 rounded"
                        : "text-gray-700"
                    )}
                  >
                    {item.name}
                    {isProtected && !isAuthenticated && (
                      <span className="ml-1 text-xs text-gray-500">(🔒)</span>
                    )}
                  </Link>
                )
              })}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors w-full justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-full justify-center"
                  >
                    <User className="w-4 h-4" />
                    Masuk
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}