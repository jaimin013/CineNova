import React from 'react'
import { LayoutDashboard, Film, Layers, Globe, Users, Zap, AlertCircle, LogOut } from 'lucide-react'
import { Tab } from '../../types/admin'
import BrandLogo from '../BrandLogo'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
        : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </button>
)

interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  onLogout: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col sticky top-0 h-screen z-40">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BrandLogo imgClassName="h-6 w-auto" />
          </div>
          <div>
            <BrandLogo imgClassName="h-5 w-auto" />
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">
              Admin Console
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <SidebarItem
            icon={<Film size={20} />}
            label="Content Manager"
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
          />
          <SidebarItem
            icon={<Layers size={20} />}
            label="Sections & Tags"
            active={activeTab === 'collections'}
            onClick={() => setActiveTab('collections')}
          />
          <SidebarItem
            icon={<Globe size={20} />}
            label="Streaming Platforms"
            active={activeTab === 'platforms'}
            onClick={() => setActiveTab('platforms')}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Community Clubs"
            active={activeTab === 'communities'}
            onClick={() => setActiveTab('communities')}
          />
          <SidebarItem
            icon={<Zap size={20} />}
            label="Auto-Fetch Pipeline"
            active={activeTab === 'pipeline'}
            onClick={() => setActiveTab('pipeline')}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="User Management"
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <SidebarItem
            icon={<AlertCircle size={20} />}
            label="Reported Reviews"
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          />
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 p-0.5">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="Admin"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Administrator</p>
            <p className="text-[10px] text-white/40 truncate">System Master</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
        >
          <LogOut size={14} strokeWidth={3} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
