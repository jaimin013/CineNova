import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthSplitScreenLayout from '../components/AuthSplitScreenLayout'
export default function RegisterPortal() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { register, error, isLoading, isAuthenticated, clearError } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  if (isLoading && !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="inline-block">
            <div className="h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-on-surface font-body">Loading...</p>
        </div>
      </div>
    )
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain an uppercase letter'
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must contain a lowercase letter'
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain a number'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setValidationErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) {
      return
    }

    try {
      await register(formData.email, formData.name, formData.password, formData.confirmPassword)
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <AuthSplitScreenLayout>
      {/* Glass Card */}
      <div className="w-full max-w-md glass-effect p-10 rounded-xl shadow-2xl relative overflow-hidden border border-white/5 bg-zinc-900/50 backdrop-blur-3xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50"></div>

        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter mb-2 text-white">
            BECOME AN AUTEUR
          </h1>
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-amber-500/80">
            Join the cinematic experience
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-1">
            <label className="font-label text-[9px] tracking-widest uppercase text-zinc-400 block mb-2 px-1">
              Full Name
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/10 rounded-md px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/40 transition-all outline-none"
              placeholder="Your name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1 px-1">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-label text-[9px] tracking-widest uppercase text-zinc-400 block mb-2 px-1">
              Email Address
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/10 rounded-md px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/40 transition-all outline-none"
              placeholder="your@email.com"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-label text-[9px] tracking-widest uppercase text-zinc-400 block mb-2 px-1">
              Password
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/10 rounded-md px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/40 transition-all outline-none"
              placeholder="••••••••"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1 px-1">{validationErrors.password}</p>
            )}
            <p className="text-zinc-500 text-[9px] mt-2 px-1">
              Min 8 chars • 1 uppercase • 1 lowercase • 1 number
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-label text-[9px] tracking-widest uppercase text-zinc-400 block mb-2 px-1">
              Confirm Password
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/10 rounded-md px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/40 transition-all outline-none"
              placeholder="••••••••"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 px-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-500 text-sm font-body text-center">
              {error}
            </div>
          )}

          <button
            className="w-full py-4 bg-amber-600 text-white font-headline font-bold text-sm tracking-widest uppercase rounded-md shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:bg-amber-500 active:scale-95 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10 flex items-center">
          <div className="flex-grow h-px bg-white/5"></div>
          <span className="px-4 font-label text-[9px] tracking-widest uppercase text-zinc-500">
            ALREADY REGISTERED?
          </span>
          <div className="flex-grow h-px bg-white/5"></div>
        </div>

        {/* Login Link */}
        <div className="text-center space-y-4">
          <p className="font-label text-[10px] tracking-widest text-zinc-400 uppercase">
            Have an account?
          </p>
          <a
            className="inline-block px-8 py-3 border border-amber-600/30 text-amber-500 font-headline font-bold text-sm tracking-widest uppercase rounded-md hover:bg-amber-600 hover:text-white transition-all shadow-[0_0_15px_rgba(217,119,6,0.1)] hover:shadow-[0_0_25px_rgba(217,119,6,0.3)]"
            href="/login"
          >
            LOGIN
          </a>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="font-label text-[9px] tracking-widest text-zinc-600 uppercase opacity-60">
            By registering, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </AuthSplitScreenLayout>
  )
}
