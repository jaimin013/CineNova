import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPortal() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { login, error, isLoading, isAuthenticated, clearError } = useAuth()

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

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) {
      return
    }

    try {
      await login(email, password)
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <>
      {/*  TopAppBar Component (As mandated by JSON and instructions)  */}
      {/*  Suppression logic check: Login page usually suppresses full nav, but user explicitly requested TopAppBar for consistency. Rendering branding only.  */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center px-12 py-8 w-full font-body antialiased tracking-tight">
          <div className="text-3xl font-black tracking-tighter text-white uppercase">CINENOVA</div>
          <div className="flex items-center gap-6">
            <button className="text-zinc-500 font-medium hover:text-amber-600 transition-all duration-700 ease-out active:scale-95 transform transition-transform">
              <span className="material-symbols-outlined" data-icon="notifications">
                notifications
              </span>
            </button>
            <button className="text-zinc-500 font-medium hover:text-amber-600 transition-all duration-700 ease-out active:scale-95 transform transition-transform">
              <span className="material-symbols-outlined" data-icon="account_circle">
                account_circle
              </span>
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </header>
      {/*  Main Content Canvas  */}
      <main className="min-h-screen flex items-center justify-center cinematic-bg px-6">
        {/*  Auth Container  */}
        <div className="w-full max-w-md mt-20">
          {/*  Glass Card  */}
          <div className="glass-effect p-10 rounded-xl shadow-2xl relative overflow-hidden">
            {/*  Top Accents  */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50"></div>
            <div className="mb-10 text-center">
              <h1 className="font-headline text-4xl font-extrabold tracking-tighter mb-2 text-white">
                WELCOME BACK
              </h1>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant opacity-60">
                Enter the screening room
              </p>
            </div>
            {/*  Form  */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="font-label text-[9px] tracking-widest uppercase text-on-surface-variant block mb-2 px-1">
                  Email Address
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-md px-5 py-4 text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-amber-600/40 transition-all outline-none"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setValidationErrors({ ...validationErrors, email: '' })
                  }}
                />
                {validationErrors.email && (
                  <p className="text-error text-xs mt-1 px-1">{validationErrors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="font-label text-[9px] tracking-widest uppercase text-on-surface-variant block">
                    Password (min 8 characters)
                  </label>
                  <a
                    className="font-label text-[9px] tracking-widest uppercase text-amber-600 hover:text-white transition-colors"
                    href="#"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-md px-5 py-4 text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-amber-600/40 transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setValidationErrors({ ...validationErrors, password: '' })
                  }}
                />
                {validationErrors.password && (
                  <p className="text-error text-xs mt-1 px-1">{validationErrors.password}</p>
                )}
              </div>
              {error && (
                <div className="bg-error/10 border border-error/20 rounded-md p-3 text-error text-sm font-body text-center">
                  {error}
                </div>
              )}
              <button
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-headline font-bold text-sm tracking-widest uppercase rounded-md shadow-lg shadow-amber-600/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
              </button>
            </form>
            {/*  Divider  */}
            <div className="relative my-10 flex items-center">
              <div className="flex-grow h-px bg-white/5"></div>
              <span className="px-4 font-label text-[9px] tracking-widest uppercase text-on-surface-variant">
                NEW HERE?
              </span>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>
            {/*  Register Link  */}
            <div className="text-center space-y-4">
              <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                Don't have an account?
              </p>
              <a
                className="inline-block px-8 py-3 border-2 border-amber-600 text-amber-600 font-headline font-bold text-sm tracking-widest uppercase rounded-md hover:bg-amber-600 hover:text-white transition-all"
                href="/register"
              >
                CREATE ACCOUNT
              </a>
            </div>
          </div>
          {/*  Contextual Metadata / Brand Quote  */}
          <div className="mt-8 text-center opacity-30 px-12">
            <p className="font-headline italic text-xs leading-relaxed text-on-surface-variant">
              "Every great film should seem new every time you see it." — Robert Bresson
            </p>
          </div>
        </div>
      </main>
      {/*  Footer Component (As per JSON)  */}
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
          © 2026 CINENOVA - JAIMIN KAPADIYA INSPIRED BY - MOCTALE
        </p>
      </footer>
    </>
  )
}
