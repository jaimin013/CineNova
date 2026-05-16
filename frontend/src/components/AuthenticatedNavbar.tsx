import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

interface SearchResult {
  id: number
  title: string
  posterUrl: string
  releaseYear: number
  genre: string
}

const AuthenticatedNavbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus()
    }
  }, [isMobileSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/content/search?q=${encodeURIComponent(searchTerm)}`,
        )
        const data = await response.json()
        if (data.success) {
          setResults(data.data)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsSearching(false)
      }
    }

    const timer = setTimeout(fetchResults, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explore', path: '/explore' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Community', path: '/communities' },
  ]

  const handleResultClick = (id: number) => {
    navigate(`/movie-detail/${id}`)
    setShowResults(false)
    setIsMobileSearchOpen(false)
    setSearchTerm('')
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-xl px-6 md:px-8 py-3 flex justify-between items-center min-h-[72px]">
        <div className="flex items-center gap-4 md:gap-12">
          <button
            onClick={() => navigate('/dashboard')}
            aria-label="CineNova"
            className="flex items-center"
          >
            <BrandLogo
              className="relative -top-2 md:top-1"
              imgClassName="h-16 md:h-20 w-auto drop-shadow-[0_0_20px_rgba(217,119,6,0.25)]"
            />
          </button>
          <div className="hidden lg:flex gap-8 items-center text-zinc-400 font-body tracking-tight">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`${
                  location.pathname === link.path
                    ? 'text-amber-600 font-bold'
                    : 'text-zinc-400 hover:text-amber-600 transition-colors duration-300'
                } text-sm uppercase tracking-widest`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center relative" ref={searchRef}>
            <div className="flex items-center bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-full gap-3 focus-within:border-amber-600/50 transition-colors">
              <span
                className={`material-symbols-outlined text-sm ${isSearching ? 'animate-spin text-amber-600' : 'text-zinc-500'}`}
              >
                {isSearching ? 'sync' : 'search'}
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-48 lg:w-64 text-zinc-200 placeholder:text-zinc-600"
                placeholder="Search films..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => setShowResults(true)}
              />
            </div>

            {showResults && searchTerm.trim().length >= 2 && (
              <div className="absolute top-full right-0 mt-2 w-80 lg:w-96 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {results.length > 0 ? (
                    <div className="p-2">
                      <p className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Search Results
                      </p>
                      {results.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.id)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left group"
                        >
                          <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={result.posterUrl}
                              alt={result.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-zinc-100 truncate group-hover:text-amber-600 transition-colors">
                              {result.title}
                            </h4>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">
                              {result.releaseYear} • {result.genre}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      {!isSearching && (
                        <>
                          <span className="material-symbols-outlined text-zinc-700 text-4xl mb-2">
                            search_off
                          </span>
                          <p className="text-sm text-zinc-500">No films found for "{searchTerm}"</p>
                        </>
                      )}
                      {isSearching && <p className="text-sm text-zinc-500">Searching...</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/library')}
              className="scale-105 active:scale-95 transition-transform text-zinc-400 hover:text-amber-600"
            >
              <span className="material-symbols-outlined">bookmark</span>
            </button>

            {/* Search button for mobile/tablet */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="lg:hidden scale-105 active:scale-95 transition-transform text-zinc-400 hover:text-amber-600"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            {/* Profile button - Desktop only */}
            <button
              onClick={() => navigate('/profile')}
              className="hidden lg:flex w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-900 items-center justify-center hover:border-amber-600 transition-colors"
            >
              {user?.name ? (
                <span className="text-amber-600 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="material-symbols-outlined text-zinc-500">person</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center gap-4 p-6 border-b border-white/5">
            <button
              onClick={() => {
                setIsMobileSearchOpen(false)
                setSearchTerm('')
              }}
              className="text-zinc-400"
            >
              <span className="material-symbols-outlined text-3xl">arrow_back</span>
            </button>
            <div className="flex-1 flex items-center bg-zinc-900 border border-white/10 px-4 py-3 rounded-2xl gap-3">
              <span
                className={`material-symbols-outlined text-xl ${isSearching ? 'animate-spin text-amber-600' : 'text-zinc-500'}`}
              >
                {isSearching ? 'sync' : 'search'}
              </span>
              <input
                ref={mobileSearchInputRef}
                className="bg-transparent border-none focus:ring-0 text-base flex-1 text-zinc-200 placeholder:text-zinc-600"
                placeholder="Search films..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-zinc-500">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {searchTerm.trim().length >= 2 ? (
              <>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Results for "{searchTerm}"
                    </p>
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.id)}
                        className="w-full flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-left group"
                      >
                        <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                          <img
                            src={result.posterUrl}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-black text-zinc-100 group-active:text-amber-600 transition-colors">
                            {result.title}
                          </h4>
                          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">
                            {result.releaseYear} • {result.genre}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-zinc-600">
                          chevron_right
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    {!isSearching ? (
                      <>
                        <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                        <p className="text-sm font-bold uppercase tracking-widest">
                          No films found
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-bold uppercase tracking-widest">Searching...</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-8xl mb-4">search</span>
                <p className="text-sm font-black uppercase tracking-[0.2em]">
                  Start typing to search
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AuthenticatedNavbar
