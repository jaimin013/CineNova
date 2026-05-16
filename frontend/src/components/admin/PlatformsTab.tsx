import React, { useState, useEffect } from 'react'
import { Globe, Trash2 } from 'lucide-react'
import { Platform } from '../../types/admin'

interface PlatformsTabProps {
  onConfirmDelete: (id: number, type: 'platforms') => void
}

export const PlatformsTab: React.FC<PlatformsTabProps> = ({ onConfirmDelete }) => {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newPlatformImageUrl, setNewPlatformImageUrl] = useState('')

  useEffect(() => {
    fetchPlatforms()
  }, [])

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

  const handleCreatePlatform = async () => {
    if (!newCollectionName.trim()) return
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/platforms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCollectionName.trim(),
          imageUrl: newPlatformImageUrl.trim(),
        }),
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 backdrop-blur-md">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Globe className="text-white w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Streaming Platforms</h3>
            <p className="text-sm text-white/30 font-bold uppercase tracking-widest">
              Manage available viewing sources
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
              Platform Name
            </label>
            <input
              type="text"
              placeholder="e.g. Netflix"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
              Logo URL
            </label>
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
          {platforms.map((p) => (
            <div
              key={p.id}
              className="relative group p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all flex flex-col items-center gap-4 text-center"
            >
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
                onClick={() => onConfirmDelete(p.id, 'platforms')}
                className="absolute top-4 right-4 p-2 text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
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
