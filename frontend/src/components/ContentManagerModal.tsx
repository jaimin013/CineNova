import React, { useState, useEffect } from 'react'
import {
  X,
  AlertCircle,
  Info,
  Image as ImageIcon,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Youtube,
  Globe,
  Star,
  Tag,
  Hash,
} from 'lucide-react'

interface CastMember {
  name: string
  role: string
  image: string
}

interface Section {
  id: number
  name: string
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

interface ContentGroup {
  id: number
  name: string
  type: string
}

interface EditorsPickCategory {
  id: number
  name: string
  order: number
}

interface ContentManagerModalProps {
  content?: {
    id: number
    title: string
    description: string
    type: string
    posterUrl: string
    backdropUrl?: string
    rating?: number
    genre: string
    releaseYear?: number
    duration?: number
    section: string
    platform?: string
    featured: boolean
    editorsPick?: boolean
    editorsPickOrder?: number
    editorsPickCategoryId?: number
    groupId?: number
    groupOrder?: number
    casts?: string
    videoUrl?: string
  } | null
  onClose: () => void
  onSave: () => void
}

type TabType = 'basic' | 'media' | 'cast'

export default function ContentManagerModal({
  content,
  onClose,
  onSave,
}: ContentManagerModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [castMembers, setCastMembers] = useState<CastMember[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([])
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([])
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([])
  const [editorsPickCategories, setEditorsPickCategories] = useState<EditorsPickCategory[]>([])
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupType, setNewGroupType] = useState<'franchise' | 'series'>('franchise')
  const [newEditorsPickCategory, setNewEditorsPickCategory] = useState('')
  const [newEditorsPickCategoryOrder, setNewEditorsPickCategoryOrder] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie' as 'movie' | 'series',
    posterUrl: '',
    backdropUrl: '',
    rating: 7.5,
    genre: '',
    releaseYear: new Date().getFullYear(),
    duration: 120,
    section: '',
    platform: '',
    featured: false,
    editorsPick: false,
    editorsPickOrder: 0,
    editorsPickCategoryId: undefined as number | undefined,
    groupId: undefined as number | undefined,
    groupOrder: 0,
    videoUrl: '',
    casts: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch sections and genres
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminAccessToken')
        const [secRes, genRes, platRes, pickCatRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/sections`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/genres`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/platforms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/editors-pick-categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        const groupsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/content-groups`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const secData = await secRes.json()
        const genData = await genRes.json()
        const platData = await platRes.json()
        const pickCatData = await pickCatRes.json()
        const groupsData = await groupsRes.json()
        if (secData.success) setSections(secData.data)
        if (genData.success) setAvailableGenres(genData.data)
        if (platData.success) setAvailablePlatforms(platData.data)
        if (pickCatData.success) setEditorsPickCategories(pickCatData.data)
        if (groupsData.success) setContentGroups(groupsData.data)
      } catch (err) {
        console.error('Failed to fetch modal data', err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description,
        type: content.type as 'movie' | 'series',
        posterUrl: content.posterUrl,
        backdropUrl: content.backdropUrl || '',
        rating: content.rating || 7.5,
        genre: content.genre,
        releaseYear: content.releaseYear || new Date().getFullYear(),
        duration: content.duration || 120,
        section: content.section,
        platform: content.platform || '',
        featured: content.featured,
        editorsPick: content.editorsPick || false,
        editorsPickOrder: content.editorsPickOrder || 0,
        editorsPickCategoryId: content.editorsPickCategoryId || undefined,
        groupId: content.groupId || undefined,
        groupOrder: content.groupOrder || 0,
        videoUrl: content.videoUrl || '',
        casts: content.casts || '',
      })

      if (content.casts) {
        try {
          const parsed = JSON.parse(content.casts)
          setCastMembers(Array.isArray(parsed) ? parsed : [])
        } catch (e) {
          console.error('Failed to parse casts JSON', e)
          setCastMembers([])
        }
      }
    }
  }, [content])

  // Sync castMembers to formData.casts whenever castMembers changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      casts: JSON.stringify(castMembers),
    }))
  }, [castMembers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('adminAccessToken')
      const isUpdate = content && (content as any).id
      const method = isUpdate ? 'PUT' : 'POST'
      const url = isUpdate
        ? `${import.meta.env.VITE_API_URL}/api/admin/content/${(content as any).id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/content`

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to save content')
        return
      }

      onSave()
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleGroupChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      groupId: value === '' ? undefined : Number(value),
    }))
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return

    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/content-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newGroupName.trim(), type: newGroupType }),
      })
      const data = await response.json()
      if (data.success) {
        setContentGroups((prev) =>
          [...prev, data.data].sort((a, b) => a.name.localeCompare(b.name)),
        )
        setFormData((prev) => ({
          ...prev,
          groupId: data.data.id,
        }))
        setNewGroupName('')
      }
    } catch (err) {
      console.error('Failed to create content group', err)
    }
  }

  const handleEditorsPickCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      editorsPickCategoryId: value === '' ? undefined : Number(value),
    }))
  }

  const handleCreateEditorsPickCategory = async () => {
    if (!newEditorsPickCategory.trim()) return

    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/editors-pick-categories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newEditorsPickCategory.trim(),
            order: newEditorsPickCategoryOrder,
          }),
        },
      )
      const data = await response.json()
      if (data.success) {
        setEditorsPickCategories((prev) => [...prev, data.data].sort((a, b) => a.order - b.order))
        setFormData((prev) => ({
          ...prev,
          editorsPickCategoryId: data.data.id,
        }))
        setNewEditorsPickCategory('')
        setNewEditorsPickCategoryOrder(0)
      }
    } catch (err) {
      console.error('Failed to create editor favorite category', err)
    }
  }

  const toggleGenre = (genreName: string) => {
    const currentGenres = formData.genre ? formData.genre.split(',').map((g) => g.trim()) : []
    const index = currentGenres.indexOf(genreName)
    let newGenres = []
    if (index === -1) {
      newGenres = [...currentGenres, genreName]
    } else {
      newGenres = currentGenres.filter((g) => g !== genreName)
    }
    setFormData({ ...formData, genre: newGenres.join(', ') })
  }

  const addCastMember = () => {
    setCastMembers([...castMembers, { name: '', role: '', image: '' }])
  }

  const removeCastMember = (index: number) => {
    setCastMembers(castMembers.filter((_, i) => i !== index))
  }

  const updateCastMember = (index: number, field: keyof CastMember, value: string) => {
    const updated = [...castMembers]
    updated[index] = { ...updated[index], [field]: value }
    setCastMembers(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-[#121212] border border-white/10 rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-blue-500/5">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-purple-600/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              {content ? <CheckCircle2 className="text-white" /> : <Plus className="text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {content ? 'Update Feature' : 'Create New Feature'}
              </h2>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-0.5">
                {content ? `Reference ID: #${content.id}` : 'Drafting Production Entry'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-8 py-2 bg-white/[0.02] border-b border-white/5">
          {[
            { id: 'basic', label: 'Primary Data', icon: Info },
            { id: 'media', label: 'Media Assets', icon: ImageIcon },
            { id: 'cast', label: 'Cast & Crew', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-blue-400' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/[0.01]">
          <form id="content-form" onSubmit={handleSubmit} className="p-10">
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
                <AlertCircle className="text-red-500 w-5 h-5" />
                <p className="text-red-200 text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Tab: BASIC INFO */}
            {activeTab === 'basic' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="grid grid-cols-1 gap-8">
                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-400">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Interstellar"
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-lg font-bold text-white placeholder-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-400">
                      Narrative Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      minLength={10}
                      placeholder="Enter a compelling summary of the plot..."
                      rows={5}
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all leading-relaxed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-400">
                      Category Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="movie" className="bg-[#121212]">
                        Movie Feature
                      </option>
                      <option value="series" className="bg-[#121212]">
                        Series / Show
                      </option>
                      <option value="documentary" className="bg-[#121212]">
                        Documentary
                      </option>
                      <option value="short" className="bg-[#121212]">
                        Short Film
                      </option>
                    </select>
                  </div>

                  <div className="group lg:col-span-2">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 transition-colors">
                      Genre Tags
                    </label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white/[0.02] border border-white/10 rounded-2xl min-h-[58px]">
                      {availableGenres.length === 0 ? (
                        <p className="text-[10px] text-white/20 font-bold uppercase py-2">
                          No genres defined in system
                        </p>
                      ) : (
                        availableGenres.map((g) => {
                          const isSelected = formData.genre
                            .split(',')
                            .map((tag) => tag.trim())
                            .includes(g.name)
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => toggleGenre(g.name)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                isSelected
                                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                              }`}
                            >
                              <Tag size={10} />
                              {g.name}
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-400">
                      Release Year
                    </label>
                    <input
                      type="number"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-400">
                      Placement Section
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="" className="bg-[#121212]">
                        Select Section
                      </option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.name} className="bg-[#121212]">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-400">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                    />
                  </div>

                  <div className="lg:col-span-2 p-6 bg-white/[0.02] border border-white/10 rounded-[1.5rem] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Hash className="text-purple-400 w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-sm uppercase tracking-widest">
                            Series / Franchise Link
                          </h4>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                            Connect parts and seasons
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                          Group
                        </label>
                        <select
                          name="groupId"
                          value={formData.groupId ?? ''}
                          onChange={(e) => handleGroupChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#121212]">
                            Not Linked
                          </option>
                          {contentGroups.map((group) => (
                            <option key={group.id} value={group.id} className="bg-[#121212]">
                              {group.name} ({group.type})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                          Part / Season
                        </label>
                        <input
                          type="number"
                          name="groupOrder"
                          value={formData.groupOrder}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                          New Group Name
                        </label>
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="e.g. Harry Potter"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                          Group Type
                        </label>
                        <select
                          value={newGroupType}
                          onChange={(e) =>
                            setNewGroupType(e.target.value as 'franchise' | 'series')
                          }
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="franchise" className="bg-[#121212]">
                            Franchise
                          </option>
                          <option value="series" className="bg-[#121212]">
                            Series
                          </option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleCreateGroup}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.1em]"
                      >
                        <Plus size={12} strokeWidth={3} />
                        Create Group
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 p-6 bg-blue-500/5 border border-blue-500/10 rounded-[1.5rem] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Star className="text-blue-400 w-5 h-5 fill-blue-400/20" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm uppercase tracking-widest">
                          Public Rating
                        </h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                          Aggregate Score (0.0 - 10.0)
                        </p>
                      </div>
                    </div>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-black text-blue-400 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: MEDIA ASSETS */}
            {activeTab === 'media' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                        Poster Art URL
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                        <input
                          type="url"
                          name="posterUrl"
                          value={formData.posterUrl}
                          onChange={handleChange}
                          required
                          placeholder="https://images..."
                          className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="aspect-[2/3] w-full max-w-[200px] mx-auto bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group relative">
                      <img
                        src={formData.posterUrl}
                        alt="Poster"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/300x450?text=No+Poster'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                        Poster Preview
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                        Cinematic Backdrop URL
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                        <input
                          type="url"
                          name="backdropUrl"
                          value={formData.backdropUrl}
                          onChange={handleChange}
                          placeholder="https://images..."
                          className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="aspect-video w-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group relative">
                      <img
                        src={formData.backdropUrl}
                        alt="Backdrop"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/1280x720?text=No+Backdrop'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                        Backdrop Preview
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                      Streaming Platform
                    </label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="" className="bg-[#121212]">
                        Not Specified
                      </option>
                      {availablePlatforms.map((p) => (
                        <option key={p.id} value={p.name.toLowerCase()} className="bg-[#121212]">
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                      Primary Trailer / Video URL (YouTube)
                    </label>
                    <div className="relative">
                      <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 w-4 h-4" />
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        placeholder="Full YouTube URL..."
                        className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                        <Star className="text-amber-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-white tracking-widest uppercase text-sm">
                          Feature Status
                        </h4>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                          Promote to Hero Section
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-white/5 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/40 peer-checked:after:bg-amber-500 after:border-white/10 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-amber-500/20 peer-checked:border-amber-500/40 shadow-inner group-hover:border-white/20 transition-all" />
                    </label>
                  </div>
                </div>

                <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-[2rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                        <Star className="text-purple-400 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-white tracking-widest uppercase text-sm">
                          Editor's Favorites
                        </h4>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                          Show on admin favorites page
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="editorsPick"
                        checked={formData.editorsPick}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-white/5 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/40 peer-checked:after:bg-purple-500 after:border-white/10 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-purple-500/20 peer-checked:border-purple-500/40 shadow-inner group-hover:border-white/20 transition-all" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white text-sm uppercase tracking-widest">
                        Display Order
                      </h4>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                        Lower shows first
                      </p>
                    </div>
                    <input
                      type="number"
                      name="editorsPickOrder"
                      value={formData.editorsPickOrder}
                      onChange={handleChange}
                      min="0"
                      className="w-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-black text-purple-300 focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                        Favorites Category
                      </label>
                      <select
                        name="editorsPickCategoryId"
                        value={formData.editorsPickCategoryId ?? ''}
                        onChange={(e) => handleEditorsPickCategoryChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#121212]">
                          Uncategorized
                        </option>
                        {editorsPickCategories.map((category) => (
                          <option key={category.id} value={category.id} className="bg-[#121212]">
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                        Category Order
                      </label>
                      <input
                        type="number"
                        value={newEditorsPickCategoryOrder}
                        onChange={(e) => setNewEditorsPickCategoryOrder(Number(e.target.value))}
                        min="0"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                        New Category Name
                      </label>
                      <input
                        type="text"
                        value={newEditorsPickCategory}
                        onChange={(e) => setNewEditorsPickCategory(e.target.value)}
                        placeholder="e.g. Childhood Favorites"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleCreateEditorsPickCategory}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.1em]"
                      >
                        <Plus size={12} strokeWidth={3} />
                        Create Category
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: CAST MANAGEMENT */}
            {activeTab === 'cast' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest">
                      Ensemble Cast
                    </h3>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">
                      Add and manage production talent
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addCastMember}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl transition-all font-black text-[11px] uppercase tracking-[0.1em]"
                  >
                    <Plus size={14} strokeWidth={3} />
                    Add Talent
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {castMembers.length === 0 ? (
                    <div className="py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
                      <Users className="mx-auto text-white/10 w-12 h-12 mb-4" />
                      <p className="text-white/30 font-bold uppercase tracking-widest text-xs">
                        No cast members assigned yet
                      </p>
                    </div>
                  ) : (
                    castMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="group p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:border-white/10 hover:bg-white/[0.05] transition-all flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

                        <div className="relative flex-shrink-0">
                          <div className="w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden shadow-2xl group-hover:border-blue-500/30 transition-all duration-500 bg-white/5">
                            <img
                              src={member.image}
                              alt="Talent"
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${idx}&backgroundColor=292929`
                              }}
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-[#121212]">
                            {idx + 1}
                          </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                          <div>
                            <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                              Talent Name
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateCastMember(idx, 'name', e.target.value)}
                              placeholder="Full Name"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                              Character Role
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateCastMember(idx, 'role', e.target.value)}
                              placeholder="Role in production"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                              Profile Image URL
                            </label>
                            <input
                              type="url"
                              value={member.image}
                              onChange={(e) => updateCastMember(idx, 'image', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500/50"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCastMember(idx)}
                          className="p-3 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all self-center md:self-end mb-1"
                          title="Remove Talent"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.25em]">
            System: Verification Pending Submission
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-2xl border border-white/10 text-white/60 font-black text-[11px] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
            >
              Discard Changes
            </button>
            <button
              form="content-form"
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-10 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 text-white rounded-2xl transition-all font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Commit Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Loader({ size, className }: { size?: number; className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
