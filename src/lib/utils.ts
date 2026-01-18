import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
      return 'text-green-600 bg-green-100'
    case 'diseased':
      return 'text-red-600 bg-red-100'
    case 'pest':
      return 'text-yellow-600 bg-yellow-100'
    case 'nutrient_deficient':
      return 'text-orange-600 bg-orange-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'healthy':
      return 'Sehat'
    case 'diseased':
      return 'Sakit'
    case 'pest':
      return 'Hama'
    case 'nutrient_deficient':
      return 'Kekurangan Nutrisi'
    default:
      return 'Tidak Diketahui'
  }
}