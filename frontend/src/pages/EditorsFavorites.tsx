import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ContentItem {
  id: number
  title: string
  description: string
  type: 'movie' | 'series'
  posterUrl: string
  rating: number
  genre: string
  releaseYear?: number
  editorsPickOrder?: number
  editorsPickCategory?: {
    id: number
    name: string
    order: number
  } | null
}

interface FavoritesRowProps {
  title: string
  items: ContentItem[]
  onSelect: (id: number) => void
}

const FavoritesRow = ({ title, items, onSelect }: FavoritesRowProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (distance: number) => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollBy({ left: distance, behavior: 'smooth' })
  }

  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-white">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollBy(-360)}
            className="w-9 h-9 rounded-full border border-white/10 text-zinc-300 hover:text-white hover:border-amber-500/60 hover:bg-amber-500/10 transition-colors"
            aria-label={`Scroll ${title} left`}
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <button
            onClick={() => scrollBy(360)}
            className="w-9 h-9 rounded-full border border-white/10 text-zinc-300 hover:text-white hover:border-amber-500/60 hover:bg-amber-500/10 transition-colors"
            aria-label={`Scroll ${title} right`}
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="min-w-[180px] max-w-[180px] sm:min-w-[210px] sm:max-w-[210px] text-left group"
          >
            <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-xl group-hover:border-amber-500/40 transition-all">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x600?text=' + item.title
                }}
              />
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm font-bold text-white truncate group-hover:text-amber-500 transition-colors">
                {item.title}
              </p>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
                <span>{item.type}</span>
                {item.releaseYear && <span>{item.releaseYear}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

interface UserCollection {
  id: number
  name: string
  description?: string
  _count: {
    items: number
  }
  items: {
    content: {
      posterUrl: string
    }
  }[]
}

export default function EditorsFavorites() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'editors' | 'user'>('editors')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ContentItem[]>([])
  const [userCollections, setUserCollections] = useState<UserCollection[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollName, setNewCollName] = useState('')
  const [newCollDesc, setNewCollDesc] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (activeTab === 'editors') {
      fetchPicks()
    } else {
      fetchUserCollections()
    }
  }, [activeTab])

  const fetchPicks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/editors-picks`)
      const data = await response.json()
      if (data.success) {
        setItems(data.data || [])
      } else {
        setError('Failed to load editor favorites')
      }
    } catch (err) {
      console.error('Failed to fetch editor favorites', err)
      setError('Failed to load editor favorites')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCollections = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/custom-collections`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setUserCollections(data.data || [])
      } else {
        setError('Failed to load your collections')
      }
    } catch (err) {
      console.error('Failed to fetch user collections', err)
      setError('Failed to load your collections')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollName.trim()) return

    try {
      setCreating(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/custom-collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCollName, description: newCollDesc })
      })
      const data = await response.json()
      if (data.success) {
        setUserCollections([data.data, ...userCollections])
        setShowCreateModal(false)
        setNewCollName('')
        setNewCollDesc('')
      }
    } catch (err) {
      console.error('Error creating collection:', err)
    } finally {
      setCreating(false)
    }
  }

  const movies = useMemo(() => items.filter((item) => item.type === 'movie'), [items])
  const series = useMemo(() => items.filter((item) => item.type === 'series'), [items])
  const grouped = useMemo(() => {
    const buckets = new Map<string, { name: string; order: number; items: ContentItem[] }>()

    items.forEach((item) => {
      const categoryName = item.editorsPickCategory?.name || 'Uncategorized'
      const categoryOrder = item.editorsPickCategory?.order ?? 999
      if (!buckets.has(categoryName)) {
        buckets.set(categoryName, { name: categoryName, order: categoryOrder, items: [] })
      }
      buckets.get(categoryName)!.items.push(item)
    })

    return Array.from(buckets.values())
      .map((bucket) => ({
        ...bucket,
        items: [...bucket.items].sort(
          (a, b) => (a.editorsPickOrder ?? 0) - (b.editorsPickOrder ?? 0),
        ),
      }))
      .sort((a, b) => a.order - b.order)
  }, [items])

  return (
    <>
      <main className="pt-28 pb-16 min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500">
                {activeTab === 'editors' ? 'Admin Favorites' : 'Personal Curation'}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black text-white uppercase italic">
                {activeTab === 'editors' ? "Editor's Memory Shelf" : "My Custom Archives"}
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
                {activeTab === 'editors' 
                  ? "A curated memory wall of films and series that shaped the archive. Updated by the admin for everyone to explore."
                  : "Design your own thematic collections. Organize your favorite cinema into custom-named digital galleries."}
              </p>
            </div>

            <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setActiveTab('editors')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'editors' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Editor's Picks
              </button>
              <button
                onClick={() => setActiveTab('user')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'user' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                My Collections
              </button>
            </div>
          </header>

          {activeTab === 'user' && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 px-6 py-3 rounded-xl transition-all group"
              >
                <span className="material-symbols-outlined text-amber-600 group-hover:rotate-90 transition-transform">add</span>
                <span className="text-xs font-bold uppercase tracking-widest">New Collection</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="py-24 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Retrieving Archive...</p>
            </div>
          )}

          {error && (
            <div className="py-16 text-center text-red-300 font-bold uppercase tracking-widest text-xs">
              {error}
            </div>
          )}

          {!loading && !error && activeTab === 'editors' && items.length === 0 && (
            <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
              No favorites selected yet
            </div>
          )}

          {!loading && !error && activeTab === 'user' && userCollections.length === 0 && (
            <div className="py-32 text-center bg-zinc-900/20 border border-dashed border-white/10 rounded-3xl">
              <span className="material-symbols-outlined text-zinc-800 text-7xl mb-6">folder_open</span>
              <h3 className="text-xl font-bold mb-2">No Custom Collections</h3>
              <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto">Create your first collection to start organizing your cinematic journey.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                Get Started
              </button>
            </div>
          )}

          {!loading && !error && activeTab === 'editors' && items.length > 0 && (
            <div className="space-y-12">
              {grouped.length > 0 ? (
                grouped.map((group) => (
                  <FavoritesRow
                    key={group.name}
                    title={group.name}
                    items={group.items}
                    onSelect={(id) => navigate(`/movie-detail/${id}`)}
                  />
                ))
              ) : (
                <>
                  <FavoritesRow
                    title="Movies"
                    items={movies}
                    onSelect={(id) => navigate(`/movie-detail/${id}`)}
                  />
                  <FavoritesRow
                    title="Series"
                    items={series}
                    onSelect={(id) => navigate(`/movie-detail/${id}`)}
                  />
                </>
              )}
            </div>
          )}

          {!loading && !error && activeTab === 'user' && userCollections.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {userCollections.map((coll) => (
                <div
                  key={coll.id}
                  onClick={() => navigate(`/collection/${coll.id}`)}
                  className="group cursor-pointer bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:bg-zinc-900 transition-all hover:border-amber-600/30"
                >
                  <div className="grid grid-cols-2 gap-2 mb-6 aspect-square bg-zinc-950 rounded-2xl overflow-hidden p-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="bg-zinc-900 rounded-lg overflow-hidden">
                        {coll.items[idx]?.content?.posterUrl ? (
                          <img
                            src={coll.items[idx].content.posterUrl}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-zinc-800">movie</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-amber-600 transition-colors truncate uppercase italic">
                    {coll.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {coll._count.items} Films
                    </p>
                    <span className="material-symbols-outlined text-zinc-600 group-hover:text-amber-600 transition-all transform group-hover:translate-x-1">
                      arrow_forward_ios
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black font-headline tracking-tight uppercase italic">Create Archive</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateCollection} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Collection Name</label>
                  <input
                    autoFocus
                    type="text"
                    value={newCollName}
                    onChange={(e) => setNewCollName(e.target.value)}
                    placeholder="e.g. Neo-Noir Masterpieces"
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-amber-600/50 transition-colors outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Description (Optional)</label>
                  <textarea
                    value={newCollDesc}
                    onChange={(e) => setNewCollDesc(e.target.value)}
                    placeholder="Briefly describe the theme of this collection..."
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-amber-600/50 transition-colors outline-none min-h-[120px] resize-none"
                  />
                </div>

                <button
                  disabled={creating || !newCollName.trim()}
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-900/10"
                >
                  {creating ? 'Initializing Archive...' : 'Assemble Collection'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
