import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  name: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    name: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to decode JWT synchronously
  const getInitialUser = () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
          id: payload.id,
          email: payload.email,
          name: payload.name || 'User', // Fallback if name is not in token
        }
      } catch (e) {
        return null
      }
    }
    return null
  }

  const initialUser = getInitialUser()
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(!initialUser) // Skip loading if we have token user
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000'

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            setIsAuthenticated(true)
          } else if (response.status === 401 || response.status === 403) {
            // Token invalid or unauthorized, clear storage
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
          }
          // For 500 errors, we keep the token and let the user stay "authenticated"
          // although subsequent requests might still fail until the DB is back.
        } catch (err) {
          console.error('Failed to load user:', err)
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [apiUrl])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    email: string,
    name: string,
    password: string,
    confirmPassword: string,
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, confirmPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
