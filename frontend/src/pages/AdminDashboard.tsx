import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, Edit2, Trash2, LogOut, Search, AlertCircle, Loader, 
  LayoutDashboard, Film, Users, Settings, TrendingUp, 
  Video, Star, Calendar, Clock, ChevronRight, Hash, Layers, Tag, Globe, Sparkles, Zap, ArrowRight, Download
} from 'lucide-react'
import ContentManagerModal from '../components/ContentManagerModal'

interface Content {
  id: number
  title: string
  description: string
  type: string
  section: string
  genre: string
  posterUrl: string
  backdropUrl?: string
  rating?: number
  releaseYear?: number
  duration?: number
  platform?: string
  featured: boolean
  videoUrl?: string
  casts?: string
  createdAt: string
}

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

interface Section {
  id: number
  name: string
  order: number
}

interface Genre {
  id: number
  name: string
}

interface Platform {
  id: number
  name: string
  imageUrl?: string
}

interface Stats {
  totalUsers: number
  totalContent: number
  featuredContent: number
  moviesCount: number
  seriesCount: number
}

type Tab = 'overview' | 'content' | 'users' | 'collections' | 'platforms' | 'pipeline'

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [contents, setContents] = useState<Content[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionOrder, setNewCollectionOrder] = useState(0)
  const [newPlatformImageUrl, setNewPlatformImageUrl] = useState('')
  const [tmdbResults, setTmdbResults] = useState<any[]>([])
  const [tmdbLoading, setTmdbLoading] = useState(false)
  const [tmdbSearch, setTmdbSearch] = useState('')
  const [tmdbFilter, setTmdbFilter] = useState<'movie' | 'tv' | 'multi'>('multi')
  const [tmdbImporting, setTmdbImporting] = useState<number | null>(null)

  // Check admin auth
  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken')
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'overview') fetchStats()
    if (activeTab === 'content') fetchContents()
    if (activeTab === 'users') fetchUsers()
    if (activeTab === 'collections') {
      fetchSections()
      fetchGenres()
    }
    if (activeTab === 'platforms') fetchPlatforms()
    if (activeTab === 'pipeline') fetchTMDBTrending()
  }, [activeTab])

  const fetchTMDBTrending = async () => {
    try {
      setTmdbLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tmdb/trending?type=movie`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setTmdbResults(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setTmdbLoading(false)
    }
  }

  const handleTMDBSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!tmdbSearch.trim()) return

    try {
      setTmdbLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tmdb/search?query=${tmdbSearch}&type=${tmdbFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setTmdbResults(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setTmdbLoading(false)
    }
  }

  const handleTMDBImport = async (tmdbId: number, type: 'movie' | 'series') => {
    try {
      setTmdbImporting(tmdbId)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tmdb/details/${type}/${tmdbId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent(data.data)
        setShowModal(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTmdbImporting(null)
    }
  }

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

  const fetchContents = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/content`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setContents(data.data || [])
      else setError(data.error || 'Failed to fetch contents')
    } catch (err) {
      setError('Failed to fetch contents')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setUsers(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSections = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setSections(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/genres`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setGenres(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlatforms = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/platforms`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setPlatforms(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (type: 'sections' | 'genres') => {
    if (!newCollectionName.trim()) return
    try {
      const token = localStorage.getItem('adminAccessToken')
      const body: any = { name: newCollectionName.trim() }
      if (type === 'sections') body.order = newCollectionOrder

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/${type}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (data.success) {
        if (type === 'sections') setSections([...sections, data.data].sort((a, b) => a.order - b.order))
        else setGenres([...genres, data.data])
        setNewCollectionName('')
        setNewCollectionOrder(0)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateSectionOrder = async (id: number, order: number) => {
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/sections/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ order })
      })
      const data = await response.json()
      if (data.success) {
        setSections(sections.map(s => s.id === id ? data.data : s).sort((a, b) => a.order - b.order))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreatePlatform = async () => {
    if (!newCollectionName.trim()) return
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/platforms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          name: newCollectionName.trim(),
          imageUrl: newPlatformImageUrl.trim()
        })
      })
      const data = await response.json()
      if (data.success) {
        setPlatforms([...platforms, data.data])
        setNewCollectionName('')
        setNewPlatformImageUrl('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCollection = async (type: 'sections' | 'genres', id: number) => {
    if (!window.confirm(`Delete this ${type.slice(0, -1)}?`)) return
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        if (type === 'sections') setSections(sections.filter(s => s.id !== id))
        else setGenres(genres.filter(g => g.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeletePlatform = async (id: number) => {
    if (!window.confirm('Delete this platform?')) return
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/platforms/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setPlatforms(platforms.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteContent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return
    try {
      setDeleting(id)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setContents(contents.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      setDeleting(id)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setUsers(users.filter((u) => u.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.section.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col sticky top-0 h-screen z-40">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-black text-xl tracking-tighter">CN</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CineNova</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Admin Console</p>
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
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={14} strokeWidth={3} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-black/60 backdrop-blur-xl px-10 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">System Online</span>
            </div>
          </div>
        </header>

        <div className="p-10">
          {activeTab === 'overview' && stats && (
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
                    <DistributionBar label="Movies" count={stats.moviesCount} total={stats.totalContent} color="bg-blue-500" />
                    <DistributionBar label="Series" count={stats.seriesCount} total={stats.totalContent} color="bg-purple-500" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 shadow-2xl shadow-blue-900/20 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tighter italic">CineNova Pro</h3>
                    <p className="text-white/70 text-sm">Welcome to your advanced administrative command center. Monitor, manage, and scale your cinema platform with ease.</p>
                  </div>
                  <button className="mt-8 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform">
                    View Platform Analytics
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                <div className="flex-1 w-full relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Filter library by title or section..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={() => { setEditingContent(null); setShowModal(true); }}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all font-bold shadow-lg shadow-blue-600/20"
                >
                  <Plus size={20} strokeWidth={3} />
                  Add Content
                </button>
              </div>

              {loading ? <LoadingSkeleton /> : (
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">Feature</th>
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">Categories</th>
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                          <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-white/30">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredContents.map((content) => (
                          <tr key={content.id} className="group hover:bg-white/[0.03] transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-5">
                                <img src={content.posterUrl} className="w-12 h-16 object-cover rounded-lg shadow-xl" />
                                <div>
                                  <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{content.title}</p>
                                  <p className="text-[10px] text-white/40 uppercase font-black mt-1">{content.type} • {content.releaseYear || '2024'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-[10px] font-black uppercase text-blue-400/80 px-2 py-0.5 bg-blue-400/10 rounded border border-blue-400/20">{content.section}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${content.featured ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`} />
                                <span className="text-[10px] font-black uppercase text-white/40">{content.featured ? 'Featured' : 'Standard'}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingContent(content); setShowModal(true); }} className="p-2 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-lg transition-all"><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteContent(content.id)} className="p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-all"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sections Management */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <Hash className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Homepage Sections</h3>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Order 1 = Top, 2 = Below it</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="New Section Name..."
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <input 
                      type="number" 
                      placeholder="Order"
                      value={newCollectionOrder}
                      onChange={(e) => setNewCollectionOrder(parseInt(e.target.value) || 0)}
                      className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-center"
                    />
                  </div>
                  <button 
                    onClick={() => handleCreateCollection('sections')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Create Section
                  </button>
                </div>

                <div className="space-y-3">
                  {sections.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-blue-400 border border-white/10">
                          {s.order}
                        </div>
                        <span className="font-bold text-sm">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          defaultValue={s.order}
                          onBlur={(e) => handleUpdateSectionOrder(s.id, parseInt(e.target.value) || 0)}
                          className="w-12 bg-transparent border-b border-white/10 text-center text-[10px] font-black focus:outline-none focus:border-blue-500"
                        />
                        <button 
                          onClick={() => handleDeleteCollection('sections', s.id)}
                          className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Genres Management */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                    <Tag className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Genre Tags</h3>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">e.g. Action, Comedy, Series</p>
                  </div>
                </div>

                <div className="flex gap-3 mb-8">
                  <input 
                    type="text" 
                    placeholder="New Genre Name..."
                    value={activeTab === 'collections' ? newCollectionName : ''}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <button 
                    onClick={() => handleCreateCollection('genres')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {genres.map(g => (
                    <div key={g.id} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full group">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-purple-400">{g.name}</span>
                      <button 
                        onClick={() => handleDeleteCollection('genres', g.id)}
                        className="text-purple-400/20 hover:text-red-400 transition-all"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'platforms' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 backdrop-blur-md">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Globe className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Streaming Platforms</h3>
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest">Manage available viewing sources</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Platform Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Netflix"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Logo URL</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={newPlatformImageUrl}
                      onChange={(e) => setNewPlatformImageUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleCreatePlatform}
                    className="md:col-span-2 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20"
                  >
                    Add Platform to Registry
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {platforms.map(p => (
                    <div key={p.id} className="relative group p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all flex flex-col items-center gap-4 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 p-4 flex items-center justify-center border border-white/10">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Globe className="text-white/10 w-8 h-8" />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-white uppercase tracking-wider">{p.name}</p>
                        <p className="text-[10px] text-white/20 font-bold uppercase mt-1">Registry ID #{p.id}</p>
                      </div>
                      <button 
                        onClick={() => handleDeletePlatform(p.id)}
                        className="absolute top-4 right-4 p-2 text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Search & Discovery Header */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 backdrop-blur-md mb-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Auto-Fetch Pipeline</h3>
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest">Discover and import content from TMDB</p>
                  </div>
                </div>

                <form onSubmit={handleTMDBSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search for movies, series, documentaries..."
                      value={tmdbSearch}
                      onChange={(e) => setTmdbSearch(e.target.value)}
                      className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                  <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                    {(['multi', 'movie', 'tv'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setTmdbFilter(f)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          tmdbFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        {f === 'multi' ? 'All' : f === 'movie' ? 'Movies' : 'TV Series'}
                      </button>
                    ))}
                  </div>
                  <button 
                    type="submit"
                    className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20"
                  >
                    Search TMDB
                  </button>
                </form>
              </div>

              {/* Results Grid */}
              {tmdbLoading ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <Loader size={48} className="text-blue-500 mb-6" />
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">Querying Global Databases...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {tmdbResults.map((item) => (
                    <div key={item.tmdbId} className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all flex flex-col shadow-2xl">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img 
                          src={item.posterUrl || 'https://via.placeholder.com/400x600?text=No+Poster'} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-blue-600 rounded text-[8px] font-black uppercase tracking-widest">{item.type}</span>
                            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest">{item.releaseYear}</span>
                          </div>
                          <h4 className="font-black text-white text-lg leading-tight line-clamp-2">{item.title}</h4>
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center">
                           <div className="flex items-center gap-2 mb-4">
                              <Star className="text-amber-500 fill-amber-500" size={16} />
                              <span className="font-black text-xl">{item.rating.toFixed(1)}</span>
                           </div>
                           <p className="text-xs text-white/60 line-clamp-4 mb-8 font-medium leading-relaxed">{item.description}</p>
                           <button 
                             onClick={() => handleTMDBImport(item.tmdbId, item.type)}
                             disabled={tmdbImporting === item.tmdbId}
                             className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
                           >
                             {tmdbImporting === item.tmdbId ? (
                               <Loader size={14} className="text-black" />
                             ) : (
                               <>
                                 <Download size={14} strokeWidth={3} />
                                 Import To Library
                               </>
                             )}
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!tmdbLoading && tmdbResults.length === 0 && (
                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
                     <Search className="text-white/10" size={40} />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No Content Found</h3>
                   <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Try searching for a different title or filter</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <ContentManagerModal
          content={editingContent}
          onClose={() => { setShowModal(false); setEditingContent(null); }}
          onSave={() => { fetchContents(); setShowModal(false); setEditingContent(null); }}
        />
      )}
    </div>
  )
}

/* Helper Components */
const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
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

const StatsCard: React.FC<{ label: string, value: string | number, icon: React.ReactNode, trend: string }> = ({ label, value, icon, trend }) => (
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

const DistributionBar: React.FC<{ label: string, count: number, total: number, color: string }> = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
        <span className="text-white/60">{label}</span>
        <span className="text-white/40">{count} Items ({Math.round(percentage)}%)</span>
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

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-white/5 rounded-3xl">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 w-6 h-6 animate-pulse" />
    </div>
    <p className="mt-6 text-white/40 font-bold uppercase tracking-widest text-xs">Syncing Command Center...</p>
  </div>
)

function X({ size, strokeWidth, className }: { size?: number, strokeWidth?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth || 2} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  )
}
