import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
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

  // For admin routes
  if (adminOnly) {
    const adminToken = localStorage.getItem('adminAccessToken')
    if (!adminToken) {
      return <Navigate to="/admin/login" replace />
    }
    return <>{children}</>
  }

  // For user routes
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
