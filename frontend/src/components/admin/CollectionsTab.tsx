import React, { useState, useEffect } from 'react'
import { Hash, Tag, Star, Trash2, X } from 'lucide-react'
import { Section, Genre, EditorsPickCategory } from '../../types/admin'

interface CollectionsTabProps {
  onConfirmDelete: (id: number, type: 'sections' | 'genres' | 'editors-pick-categories') => void
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({ onConfirmDelete }) => {
  const [sections, setSections] = useState<Section[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [editorsPickCategories, setEditorsPickCategories] = useState<EditorsPickCategory[]>([])
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionOrder, setNewCollectionOrder] = useState(0)
  const [newEditorsPickCategoryName, setNewEditorsPickCategoryName] = useState('')
  const [newEditorsPickCategoryOrder, setNewEditorsPickCategoryOrder] = useState(0)

  useEffect(() => {
    fetchSections()
    fetchGenres()
    fetchEditorsPickCategories()
  }, [])

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

  const fetchEditorsPickCategories = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/editors-pick-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const data = await response.json()
      if (data.success) setEditorsPickCategories(data.data || [])
    } catch (err) {
      console.error(err)
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (data.success) {
        if (type === 'sections')
          setSections([...sections, data.data].sort((a, b) => a.order - b.order))
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order }),
      })
      const data = await response.json()
      if (data.success) {
        setSections(
          sections.map((s) => (s.id === id ? data.data : s)).sort((a, b) => a.order - b.order),
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateEditorsPickCategory = async () => {
    if (!newEditorsPickCategoryName.trim()) return
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
            name: newEditorsPickCategoryName.trim(),
            order: newEditorsPickCategoryOrder,
          }),
        },
      )
      const data = await response.json()
      if (data.success) {
        setEditorsPickCategories(
          [...editorsPickCategories, data.data].sort((a, b) => a.order - b.order),
        )
        setNewEditorsPickCategoryName('')
        setNewEditorsPickCategoryOrder(0)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sections Management */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Hash className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest">Homepage Sections</h3>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest">
                Order 1 = Top, 2 = Below it
              </p>
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
            {sections.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group"
              >
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
                    onClick={() => onConfirmDelete(s.id, 'sections')}
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
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest">
                e.g. Action, Comedy, Series
              </p>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <input
              type="text"
              placeholder="New Genre Name..."
              value={newCollectionName}
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
            {genres.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full group"
              >
                <span className="font-bold text-[11px] uppercase tracking-wider text-purple-400">
                  {g.name}
                </span>
                <button
                  onClick={() => onConfirmDelete(g.id, 'genres')}
                  className="text-purple-400/20 hover:text-red-400 transition-all"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Favorites Categories */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
            <Star className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest">
              Editor Favorites Categories
            </h3>
            <p className="text-xs text-white/30 font-bold uppercase tracking-widest">
              Controls the shelves on the Favorites page
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3 mb-6">
          <input
            type="text"
            placeholder="New Category Name..."
            value={newEditorsPickCategoryName}
            onChange={(e) => setNewEditorsPickCategoryName(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all"
          />
          <input
            type="number"
            placeholder="Order"
            value={newEditorsPickCategoryOrder}
            onChange={(e) => setNewEditorsPickCategoryOrder(parseInt(e.target.value) || 0)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all text-center"
          />
        </div>
        <button
          onClick={handleCreateEditorsPickCategory}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
        >
          Create Favorites Category
        </button>

        <div className="mt-8 space-y-3">
          {editorsPickCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-amber-400 border border-white/10">
                  {category.order}
                </div>
                <span className="font-bold text-sm">{category.name}</span>
              </div>
              <button
                onClick={() => onConfirmDelete(category.id, 'editors-pick-categories')}
                className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
