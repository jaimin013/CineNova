import React from 'react'
import { Loader } from 'lucide-react'

export const AdminHeader: React.FC<{ activeTab: string }> = ({ activeTab }) => (
  <header className="sticky top-0 z-30 border-b border-white/5 bg-black/60 backdrop-blur-xl px-10 py-6 flex items-center justify-between">
    <h2 className="text-2xl font-bold tracking-tight capitalize">
      {activeTab.replace('-', ' ')}
    </h2>
    <div className="flex items-center gap-4">
      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
          System Online
        </span>
      </div>
    </div>
  </header>
)

export const StatsCard: React.FC<{
  label: string
  value: string | number
  icon: React.ReactNode
  trend: string
}> = ({ label, value, icon, trend }) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md group hover:bg-white/[0.04] transition-all">
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-[10px] font-black uppercase text-white/20 tracking-widest">{label}</div>
    </div>
    <div className="text-4xl font-black mb-2 tracking-tighter">{value}</div>
    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{trend}</div>
  </div>
)

export const DistributionBar: React.FC<{
  label: string
  count: number
  total: number
  color: string
}> = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
        <span className="text-white/60">{label}</span>
        <span className="text-white/40">
          {count} Items ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-white/5 rounded-3xl">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 w-6 h-6 animate-pulse" />
    </div>
    <p className="mt-6 text-white/40 font-bold uppercase tracking-widest text-xs">
      Syncing Command Center...
    </p>
  </div>
)
