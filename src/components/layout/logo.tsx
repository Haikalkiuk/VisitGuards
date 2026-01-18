import { Shield, Leaf, Camera } from 'lucide-react'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function VisitGuardLogo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src="/images/visitguard-logo.png"
          alt="VisitGuard Logo"
          width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          className="rounded-lg"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold text-gray-800 leading-tight`}>
            VisitGuard
          </span>
          <span className="text-xs text-gray-600 leading-tight">
            IoT Monitoring System
          </span>
        </div>
      )}
    </div>
  )
}