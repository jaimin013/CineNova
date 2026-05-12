import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface AuthenticatedNavbarProps {
  onMenuClick?: () => void
}

const AuthenticatedNavbar: React.FC<AuthenticatedNavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explore', path: '/explore' },
    { name: 'Community', path: '/communities' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-xl bg-gradient-to-b from-zinc-950 to-transparent shadow-none px-6 md:px-8 py-4 flex justify-between items-center h-20">
      <div className="flex items-center gap-4 md:gap-12">
        <button
          onClick={onMenuClick}
          className="md:hidden text-zinc-400 hover:text-amber-600 transition-colors"
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <span
          onClick={() => navigate('/dashboard')}
          className="text-xl md:text-2xl font-black text-amber-600 tracking-tighter font-headline cursor-pointer uppercase"
        >
          CineNova
        </span>
        <div className="hidden md:flex gap-8 items-center text-zinc-400 font-body tracking-tight">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`${
                location.pathname === link.path
                  ? 'text-amber-600 font-bold border-b-2 border-amber-600 pb-1'
                  : 'text-zinc-400 hover:text-amber-600 transition-colors duration-300'
              } text-sm uppercase tracking-widest`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-full gap-3">
          <span className="material-symbols-outlined text-zinc-500 text-sm">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-48 text-zinc-200 placeholder:text-zinc-600"
            placeholder="Search films..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="scale-105 active:scale-95 transition-transform text-zinc-400 hover:text-amber-600">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="scale-105 active:scale-95 transition-transform text-zinc-400 hover:text-amber-600">
            <span className="material-symbols-outlined">bookmark</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center">
            {user?.name ? (
              <span className="text-amber-600 font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="material-symbols-outlined text-zinc-500">person</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AuthenticatedNavbar
