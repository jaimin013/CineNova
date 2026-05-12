import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center px-12 py-8 w-full font-body antialiased tracking-tight">
          <div className="text-3xl font-black tracking-tighter text-white uppercase">CINENOVA</div>
          <div className="flex items-center gap-6">
            <button className="text-zinc-500 font-medium hover:text-amber-600 transition-all duration-700 ease-out active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-zinc-500 font-medium hover:text-amber-600 transition-all duration-700 ease-out active:scale-95">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center cinematic-bg px-6 pt-20">
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="glass-effect p-10 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50"></div>

            <div className="mb-8 text-center">
              <h1 className="font-headline text-4xl font-extrabold tracking-tighter mb-2 text-white">
                BECOME AN AUTEUR
              </h1>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant opacity-60">
                Join the cinematic experience
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="space-y-1">
                <label className="font-label text-[9px] tracking-widest uppercase text-on-surface-variant block mb-2 px-1">
                  Full Name
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-md px-5 py-4 text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-amber-600/40 transition-all outline-none"
                  placeholder="Your name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {validationErrors.name && (
                  <p className="text-error text-xs mt-1 px-1">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-label text-[9px] tracking-widest uppercase text-on-surface-variant block mb-2 px-1">
                  Email Address
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-md px-5 py-4 text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-amber-600/40 transition-all outline-none"
                  placeholder="your@email.com"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {validationErrors.email && (
                  <p className="text-error text-xs mt-1 px-1">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-label text-[9px] tracking-widest uppercase text-on-surface-variant block mb-2 px-1">
                  Password
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-md px-5 py-4 text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-amber-600/40 transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {validationErrors.password && (
                  <p className="text-error text-xs mt-1 px-1">{validationErrors.password}</p>
                )}
                <p className="text-on-surface-variant text-[9px] mt-2 px-1">
                  Min 8 chars • 1 uppercase • 1 lowercase • 1 number
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-label text-[9px] tracking-widest uppercase text-on-surface-variant block mb-2 px-1">
                  Confirm Password
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-md px-5 py-4 text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-amber-600/40 transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-error text-xs mt-1 px-1">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-md p-3 text-error text-sm font-body text-center">
                  {error}
                </div>
              )}

              <button
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-headline font-bold text-sm tracking-widest uppercase rounded-md shadow-lg shadow-amber-600/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10 flex items-center">
              <div className="flex-grow h-px bg-white/5"></div>
              <span className="px-4 font-label text-[9px] tracking-widest uppercase text-on-surface-variant">
                ALREADY REGISTERED?
              </span>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>

            {/* Login Link */}
            <div className="text-center space-y-4">
              <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                Have an account?
              </p>
              <a
                className="inline-block px-8 py-3 border-2 border-amber-600 text-amber-600 font-headline font-bold text-sm tracking-widest uppercase rounded-md hover:bg-amber-600 hover:text-white transition-all"
                href="/login"
              >
                LOGIN
              </a>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="font-label text-[9px] tracking-widest text-on-surface-variant uppercase opacity-60">
                By registering, you agree to our Terms of Service
              </p>
            </div>
          </div>

          {/* Brand Quote */}
          <div className="mt-8 text-center opacity-30 px-12">
            <p className="font-headline italic text-xs leading-relaxed text-on-surface-variant">
              "Every great film should seem new every time you see it." — Robert Bresson
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 mt-32 bg-zinc-950 border-t border-white/5 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-8 mb-4">
          <a
            className="font-body text-[9px] tracking-widest uppercase text-zinc-500 hover:text-amber-600 transition-colors"
            href="#"
          >
            Manifesto
          </a>
          <a
            className="font-body text-[9px] tracking-widest uppercase text-zinc-500 hover:text-amber-600 transition-colors"
            href="#"
          >
            Privacy
          </a>
          <a
            className="font-body text-[9px] tracking-widest uppercase text-zinc-500 hover:text-amber-600 transition-colors"
            href="#"
          >
            Terms
          </a>
        </div>
        <p className="font-body text-[9px] tracking-widest uppercase opacity-40 text-zinc-500">
          © 2024 CINENOVA. THE DIGITAL AUTEUR EXPERIENCE.
        </p>
      </footer>
    </>
  )
}
