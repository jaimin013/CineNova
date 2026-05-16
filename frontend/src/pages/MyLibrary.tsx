import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Content {
  id: number
  title: string
  posterUrl: string
  releaseYear: number
  genre: string
  type: string
}

export default function MyLibrary() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'collection' | 'watched'>('collection')
  const [items, setItems] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [activeTab])

  const fetchItems = async () => {
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      const endpoint = activeTab === 'collection' ? '/api/user/collection' : '/api/user/watched'
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setItems(data.data)
      }
    } catch (err) {
      console.error('Error fetching library items:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-24 min-h-screen px-6 sm:px-10 lg:px-16 pb-20 bg-zinc-950 text-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase mb-4 block">
              Personal Archives
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter text-white leading-none">
              Library
            </h1>
          </div>
        </div>

        <div className="flex gap-8 border-b border-white/10 mb-12">
          <button
            onClick={() => setActiveTab('collection')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${
              activeTab === 'collection'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            My Collection
          </button>
          <button
            onClick={() => setActiveTab('watched')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${
              activeTab === 'watched'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Watched History
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/movie-detail/${item.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600">View Details</span>
                  </div>
                </div>
                <h3 className="font-bold text-sm truncate group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                  {item.releaseYear} • {item.genre.split(',')[0]}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
            <span className="material-symbols-outlined text-zinc-700 text-6xl mb-4">
              {activeTab === 'collection' ? 'bookmark_border' : 'visibility_off'}
            </span>
            <h3 className="text-xl font-bold text-zinc-400">
              {activeTab === 'collection'
                ? 'Your collection is empty'
                : "You haven't marked anything as watched yet"}
            </h3>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 bg-amber-600 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Discover Movies
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
