import { Navbar } from './navbar'
import { Footer } from './footer'
import { AuthGuard } from '../auth/auth-guard'

interface LayoutProps {
  children: React.ReactNode
  showFooter?: boolean
  requireAuth?: boolean
}

export function Layout({ children, showFooter = true, requireAuth = false }: LayoutProps) {
  const content = (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )

  // Only use AuthGuard for protected routes
  if (requireAuth) {
    return (
      <AuthGuard>
        {content}
      </AuthGuard>
    )
  }

  return content
}