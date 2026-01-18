'use client'

import React, { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { VisitGuardLogo } from '@/components/layout/logo'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email harus diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    // Name validation (for register)
    if (!isLogin && !formData.name) {
      newErrors.name = 'Nama lengkap harus diisi'
    }

    // Confirm password validation (for register)
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Form submitted:', formData)
      
      // Simulate successful auth - set session cookie
      document.cookie = 'session=authenticated; path=/; max-age=86400'
      
      // Simulate successful auth
      if (isLogin) {
        setSuccessMessage('Login berhasil! Mengalihkan...')
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/monitor'
        }, 1500)
      } else {
        setSuccessMessage('Pendaftaran berhasil! Silakan login.')
        setTimeout(() => {
          setIsLogin(true)
          setSuccessMessage('')
        }, 2000)
      }
    } catch (error) {
      setErrors({ submit: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setSuccessMessage('')
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    })
  }

  // Add input focus effects
  const [focusedField, setFocusedField] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-green-50 to-blue-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <VisitGuardLogo size="lg" showText={true} className="text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">
              Selamat Datang di VisitGuard
            </h1>
            <p className="text-green-100 leading-relaxed">
              Platform IoT monitoring terpercaya untuk pemantauan perkembangan daun anggur 
              secara otomatis. Bergabunglah dengan kami dalam mendukung ketahanan pangan Kota Depok.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-300" />
              <div className="text-left">
                <h3 className="font-semibold">Keamanan Terjamin</h3>
                <p className="text-sm text-green-100">Data Anda aman dan terenkripsi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-green-300" />
              <div className="text-left">
                <h3 className="font-semibold">Akses Mudah</h3>
                <p className="text-sm text-green-100">Monitor kapan saja, di mana saja</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Branding */}
      <div className="lg:hidden bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <VisitGuardLogo size="md" showText={true} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Selamat Datang di VisitGuard
            </h1>
            <p className="text-green-100 text-sm mt-2">
              Platform IoT monitoring untuk pertanian modern
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo - Hidden on desktop, show only on mobile if needed */}
          <div className="lg:hidden"></div>

          <div className="text-center">
            <div className="transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Belum punya akun? ' 
                  : 'Sudah punya akun? '
                }
                <button
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50 underline decoration-2 hover:decoration-green-400"
                >
                  {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                </button>
              </p>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : focusedField === 'name'
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama lengkap"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : focusedField === 'email'
                      ? 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : focusedField === 'password'
                      ? 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-300'
                  }`}
                  placeholder="Masukkan password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : focusedField === 'confirmPassword'
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-300'
                    }`}
                    placeholder="Konfirmasi password"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                </label>
                <a href="#" className="text-sm text-green-600 hover:text-green-700 transition-colors">
                  Lupa password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isLogin ? 'Memproses...' : 'Mendaftar...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Masuk' : 'Daftar'}
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            {isLogin ? 'Masuk' : 'Daftar'} berarti Anda setuju dengan{' '}
            <a href="#" className="text-green-600 hover:text-green-700">Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="#" className="text-green-600 hover:text-green-700">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </div>
  )
}