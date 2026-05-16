import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface UserStats {
  libraryCount: number
  watchedCount: number
  reviewCount: number
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    libraryCount: 0,
    watchedCount: 0,
    reviewCount: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      // Fetch library count
      const libRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/collection`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const libData = await libRes.json()
      
      // Fetch watched count
      const watchRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/watched`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const watchData = await watchRes.json()

      // Assuming we have an endpoint for reviews or just count them from somewhere
      // For now let's just set some counts if available
      setStats({
        libraryCount: libData.success ? libData.data.length : 0,
        watchedCount: watchData.success ? watchData.data.length : 0,
        reviewCount: 0, // Placeholder
      })
    } catch (err) {
      console.error('Error fetching user stats:', err)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-body">
      <main className="pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Header & Info */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 sticky top-32">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-5xl font-black text-white mb-6 shadow-2xl shadow-amber-900/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-3xl font-black font-headline tracking-tight mb-2 uppercase italic">
                  {user.name}
                </h1>
                <p className="text-zinc-500 text-sm font-medium mb-8">
                  {user.email}
                </p>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => navigate('/library')}
                    className="w-full py-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-white/5"
                  >
                    <span className="material-symbols-outlined text-amber-600">bookmark</span>
                    My Collection
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 bg-red-950/20 hover:bg-red-950/40 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-red-900/20"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400">Member Since</span>
                    <span className="text-xs font-bold">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : 'May 2026'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400">Account Type</span>
                    <span className="text-xs font-bold text-amber-600 uppercase">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Activity */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <span className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase mb-4 block">
                User Overview
              </span>
              <h2 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-white leading-none uppercase italic">
                Performance
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:border-amber-600/30 transition-colors group">
                <span className="material-symbols-outlined text-amber-600 text-3xl mb-4 group-hover:scale-110 transition-transform">
                  movie
                </span>
                <p className="text-4xl font-black font-headline italic">{stats.libraryCount}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  In Collection
                </p>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:border-amber-600/30 transition-colors group">
                <span className="material-symbols-outlined text-amber-600 text-3xl mb-4 group-hover:scale-110 transition-transform">
                  visibility
                </span>
                <p className="text-4xl font-black font-headline italic">{stats.watchedCount}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  Films Watched
                </p>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:border-amber-600/30 transition-colors group">
                <span className="material-symbols-outlined text-amber-600 text-3xl mb-4 group-hover:scale-110 transition-transform">
                  rate_review
                </span>
                <p className="text-4xl font-black font-headline italic">{stats.reviewCount}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  Reviews Written
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <span className="material-symbols-outlined text-zinc-800 text-7xl mb-6">
                  history
                </span>
                <h3 className="text-xl font-bold mb-4">Activity Feed</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Your recent interactions, reviews, and watch history will appear here. Start exploring to build your digital legacy.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
