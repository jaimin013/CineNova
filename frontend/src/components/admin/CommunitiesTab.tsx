import React, { useState, useEffect } from 'react'
import { Search, Plus, MessageSquare, Edit2, Trash2 } from 'lucide-react'
import { Community } from '../../types/admin'
import { LoadingSkeleton } from './SharedComponents'

interface CommunitiesTabProps {
  onConfirmDelete: (id: number, type: 'communities') => void
}

export const CommunitiesTab: React.FC<CommunitiesTabProps> = ({ onConfirmDelete }) => {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null)
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', imageUrl: '' })

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/communities`)
      const data = await response.json()
      if (data.success) setCommunities(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdateCommunity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminAccessToken')
      const method = editingCommunity ? 'PUT' : 'POST'
      const url = editingCommunity
        ? `${import.meta.env.VITE_API_URL}/api/admin/communities/${editingCommunity.id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/communities`

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCommunity),
      })

      const data = await response.json()
      if (data.success) {
        fetchCommunities()
        setShowModal(false)
        setEditingCommunity(null)
        setNewCommunity({ name: '', description: '', imageUrl: '' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>
        <button
          onClick={() => {
            setEditingCommunity(null)
            setNewCommunity({ name: '', description: '', imageUrl: '' })
            setShowModal(true)
          }}
          className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20"
        >
          <Plus size={20} strokeWidth={3} />
          New Club
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((club) => (
            <div
              key={club.id}
              className="group bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden hover:bg-white/[0.04] transition-all flex flex-col"
            >
              <div className="h-40 relative">
                <img
                  src={club.imageUrl || 'https://via.placeholder.com/800x400'}
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h4 className="text-xl font-black uppercase tracking-tight text-white">
                    {club.name}
                  </h4>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs text-white/40 line-clamp-2 mb-6 font-medium leading-relaxed">
                  {club.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      {club._count?.messages || 0} Messages
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCommunity(club)
                        setNewCommunity({
                          name: club.name,
                          description: club.description,
                          imageUrl: club.imageUrl || '',
                        })
                        setShowModal(true)
                      }}
                      className="p-2 hover:bg-white/5 text-white/20 hover:text-amber-500 rounded-xl transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onConfirmDelete(club.id, 'communities')}
                      className="p-2 hover:bg-red-500/10 text-white/20 hover:text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5">
              <h3 className="text-2xl font-black uppercase tracking-tight">
                {editingCommunity ? 'Edit Club' : 'Create New Club'}
              </h3>
            </div>
            <form onSubmit={handleCreateOrUpdateCommunity} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
                  Club Name
                </label>
                <input
                  type="text"
                  required
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="e.g. Marvel Fanatics"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
                  Description
                </label>
                <textarea
                  required
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-amber-500 transition-all h-32 resize-none"
                  placeholder="What is this club about?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={newCommunity.imageUrl}
                  onChange={(e) => setNewCommunity({ ...newCommunity, imageUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-amber-600/20"
                >
                  {editingCommunity ? 'Save Changes' : 'Create Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
