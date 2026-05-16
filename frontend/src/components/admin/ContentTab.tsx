import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'
import { Content, Section, Genre, Platform } from '../../types/admin'
import { LoadingSkeleton } from './SharedComponents'
import ContentManagerModal from '../ContentManagerModal'

interface ContentTabProps {
  onConfirmDelete: (id: number, type: 'content') => void
}

export const ContentTab: React.FC<ContentTabProps> = ({ onConfirmDelete }) => {
  const [contents, setContents] = useState<Content[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const [genreFilter, setGenreFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([
      fetchContents(),
      fetchSections(),
      fetchGenres(),
      fetchPlatforms()
    ])
    setLoading(false)
  }

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/content`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setContents(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchSections = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setSections(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/genres`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setGenres(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPlatforms = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/platforms`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setPlatforms(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.section.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || content.type === typeFilter
    const matchesPlatform =
      platformFilter === 'all' || (content.platform && content.platform === platformFilter)
    const matchesSection = sectionFilter === 'all' || content.section === sectionFilter
    const matchesGenre =
      genreFilter === 'all' || content.genre.toLowerCase().includes(genreFilter.toLowerCase())

    return matchesSearch && matchesType && matchesPlatform && matchesSection && matchesGenre
  })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search library by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
            />
          </div>
          <button
            onClick={() => {
              setEditingContent(null)
              setShowModal(true)
            }}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} strokeWidth={3} />
            Add Content
          </button>
        </div>

        {/* Advanced Filter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white/70 focus:outline-none focus:border-blue-500 transition-all appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all">All Types</option>
              <option value="movie">Movies</option>
              <option value="series">Series</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">
              Platform
            </label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white/70 focus:outline-none focus:border-blue-500 transition-all appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all">All Platforms</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">
              Section
            </label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white/70 focus:outline-none focus:border-blue-500 transition-all appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all">All Sections</option>
              {sections.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">
              Genre
            </label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white/70 focus:outline-none focus:border-blue-500 transition-all appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setTypeFilter('all')
                setPlatformFilter('all')
                setSectionFilter('all')
                setGenreFilter('all')
                setSearchTerm('')
              }}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">
                    Feature
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">
                    Categories
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-white/30">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredContents.map((content) => (
                  <tr key={content.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <img
                          src={content.posterUrl}
                          className="w-12 h-16 object-cover rounded-lg shadow-xl"
                        />
                        <div>
                          <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                            {content.title}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase font-black mt-1">
                            {content.type} • {content.releaseYear || '2026'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase text-blue-400/80 px-2 py-0.5 bg-blue-400/10 rounded border border-blue-400/20">
                        {content.section}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${content.featured ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`}
                        />
                        <span className="text-[10px] font-black uppercase text-white/40">
                          {content.featured ? 'Featured' : 'Standard'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingContent(content)
                            setShowModal(true)
                          }}
                          className="p-2 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onConfirmDelete(content.id, 'content')}
                          className="p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <ContentManagerModal
          content={editingContent}
          onClose={() => {
            setShowModal(false)
            setEditingContent(null)
          }}
          onSave={() => {
            fetchContents()
            setShowModal(false)
            setEditingContent(null)
          }}
        />
      )}
    </div>
  )
}
