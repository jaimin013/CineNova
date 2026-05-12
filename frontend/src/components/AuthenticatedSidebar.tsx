import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface AuthenticatedSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const AuthenticatedSidebar: React.FC<AuthenticatedSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const sideLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { name: 'Explore', path: '/explore', icon: 'explore' },
    { name: 'Community', path: '/communities', icon: 'group' },
  ]

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 bg-zinc-950 border-r border-white/5 flex flex-col pt-24 pb-10 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="px-8 mb-12">
          <span className="text-2xl font-black text-amber-600 tracking-tighter font-headline uppercase">
            CineNova
          </span>
          <p className="text-[10px] tracking-widest font-bold font-label uppercase text-amber-600/60 mt-1">
            The Digital Auteur
          </p>
        </div>
        <div className="flex-grow flex flex-col space-y-1">
          {sideLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={`px-6 py-4 transition-all duration-200 ease-in-out font-label uppercase text-[10px] tracking-widest font-bold flex items-center gap-4 ${
                location.pathname === link.path
                  ? 'text-amber-600 bg-amber-600/10 border-r-4 border-amber-600'
                  : 'text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-200'
              }`}
            >
              <span
                className={`material-symbols-outlined text-lg ${
                  location.pathname === link.path ? 'fill-1' : ''
                }`}
              >
                {link.icon}
              </span>
              {link.name}
            </button>
          ))}
        </div>
        <div className="mt-auto border-t border-white/5 pt-6">
          <button
            onClick={() => handleNavigate('/')}
            className="w-full text-left text-zinc-500 px-6 py-4 hover:bg-zinc-800/30 hover:text-zinc-200 transition-all duration-200 ease-in-out font-label uppercase text-[10px] tracking-widest font-bold flex items-center gap-4"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            Settings
          </button>
        </div>
      </aside>
    </>
  )
}

export default AuthenticatedSidebar
