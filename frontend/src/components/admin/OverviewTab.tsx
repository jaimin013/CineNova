import React, { useState, useEffect } from 'react'
import { Users, Film, Star, TrendingUp, Video } from 'lucide-react'
import { Stats } from '../../types/admin'
import { StatsCard, DistributionBar } from './SharedComponents'
import BrandLogo from '../BrandLogo'

export const OverviewTab: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setStats(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-white/5 animate-pulse rounded-3xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          label="Total Users"
          value={stats.totalUsers}
          icon={<Users className="text-blue-500" />}
          trend="+12% from last month"
        />
        <StatsCard
          label="Total Content"
          value={stats.totalContent}
          icon={<Film className="text-purple-500" />}
          trend="Across all sections"
        />
        <StatsCard
          label="Featured Items"
          value={stats.featuredContent}
          icon={<Star className="text-amber-500" />}
          trend="Active on hero section"
        />
        <StatsCard
          label="Avg. Rating"
          value="8.4"
          icon={<TrendingUp className="text-green-500" />}
          trend="Community happiness"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <Video className="text-blue-500" size={20} />
            Library Distribution
          </h3>
          <div className="space-y-6">
            <DistributionBar
              label="Movies"
              count={stats.moviesCount}
              total={stats.totalContent}
              color="bg-blue-500"
            />
            <DistributionBar
              label="Series"
              count={stats.seriesCount}
              total={stats.totalContent}
              color="bg-purple-500"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 shadow-2xl shadow-blue-900/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BrandLogo imgClassName="h-6 w-auto" />
              <span className="text-xl font-black uppercase tracking-tighter italic">Pro</span>
            </div>
            <p className="text-white/70 text-sm">
              Welcome to your advanced administrative command center. Monitor, manage, and scale
              your cinema platform with ease.
            </p>
          </div>
          <button className="mt-8 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform">
            View Platform Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
