import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/dashboard', icon: 'grid_view' },
    { name: 'Explore', path: '/explore', icon: 'explore' },
    { name: 'Community', path: '/communities', icon: 'group' },
    { name: 'Favorites', path: '/favorites', icon: 'stars' },
    { name: 'Profile', path: '/profile', icon: 'person' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 lg:hidden px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 ${
                isActive ? 'text-amber-600' : 'text-zinc-500'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-2xl ${isActive ? 'fill-1' : ''}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {link.name}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
