import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthSplitScreenLayout from '../components/AuthSplitScreenLayout'

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
    <AuthSplitScreenLayout>
      {/*  Glass Card  */}
      <div className="w-full max-w-md glass-effect p-10 rounded-xl shadow-2xl relative overflow-hidden border border-white/5 bg-zinc-900/50 backdrop-blur-3xl">
        {/*  Top Accents  */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50"></div>
        <div className="mb-10 text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter mb-2 text-white">
            WELCOME BACK
          </h1>
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-amber-500/80">
            Enter the screening room
          </p>
        </div>
        {/*  Form  */}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label className="font-label text-[9px] tracking-widest uppercase text-zinc-400 block mb-2 px-1">
              Email Address
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/10 rounded-md px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/40 transition-all outline-none"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setValidationErrors({ ...validationErrors, email: '' })
              }}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">{validationErrors.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="font-label text-[9px] tracking-widest uppercase text-zinc-400 block">
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
              className="w-full bg-zinc-950/50 border border-white/10 rounded-md px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/40 transition-all outline-none"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setValidationErrors({ ...validationErrors, password: '' })
              }}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1 px-1">{validationErrors.password}</p>
            )}
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-500 text-sm font-body text-center">
              {error}
            </div>
          )}
          <button
            className="w-full py-4 bg-amber-600 text-white font-headline font-bold text-sm tracking-widest uppercase rounded-md shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:bg-amber-500 active:scale-95 transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
        {/*  Divider  */}
        <div className="relative my-10 flex items-center">
          <div className="flex-grow h-px bg-white/5"></div>
          <span className="px-4 font-label text-[9px] tracking-widest uppercase text-zinc-500">
            NEW HERE?
          </span>
          <div className="flex-grow h-px bg-white/5"></div>
        </div>
        {/*  Register Link  */}
        <div className="text-center space-y-4">
          <p className="font-label text-[10px] tracking-widest text-zinc-400 uppercase">
            Don't have an account?
          </p>
          <a
            className="inline-block px-8 py-3 border border-amber-600/30 text-amber-500 font-headline font-bold text-sm tracking-widest uppercase rounded-md hover:bg-amber-600 hover:text-white transition-all shadow-[0_0_15px_rgba(217,119,6,0.1)] hover:shadow-[0_0_25px_rgba(217,119,6,0.3)]"
            href="/register"
          >
            CREATE ACCOUNT
          </a>
        </div>
      </div>
    </AuthSplitScreenLayout>
  )
}
