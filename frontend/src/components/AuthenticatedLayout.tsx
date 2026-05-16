import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthenticatedNavbar from './AuthenticatedNavbar'
import MobileBottomNav from './MobileBottomNav'

const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <AuthenticatedNavbar />
      
      {/* Content wrapper with top padding for fixed navbar and bottom padding for mobile nav */}
      <main className="flex-grow pb-24 lg:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  )
}

export default AuthenticatedLayout
