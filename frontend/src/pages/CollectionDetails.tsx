import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface Content {
  id: number
  title: string
  posterUrl: string
  releaseYear: number
  genre: string
}

interface Collection {
  id: number
  name: string
  description?: string
  items: {
    content: Content
  }[]
}

export default function CollectionDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCollection()
  }, [id])

  const fetchCollection = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/custom-collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setCollection(data.data)
      } else {
        setError(data.error || 'Failed to load collection')
      }
    } catch (err) {
      console.error('Error fetching collection:', err)
      setError('Failed to load collection')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (contentId: number) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/custom-collections/${id}/items/${contentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setCollection(prev => {
          if (!prev) return null
          return {
            ...prev,
            items: prev.items.filter(item => item.content.id !== contentId)
          }
        })
      }
    } catch (err) {
      console.error('Error removing item:', err)
    }
  }

  const handleDeleteCollection = async () => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/custom-collections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        navigate('/favorites')
      }
    } catch (err) {
      console.error('Error deleting collection:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{error || 'Collection not found'}</h1>
        <button onClick={() => navigate('/favorites')} className="text-amber-600 font-bold uppercase tracking-widest text-sm">Return to Favorites</button>
      </div>
    )
  }

  return (
    <main className="pt-32 pb-20 px-6 sm:px-10 lg:px-16 min-h-screen bg-zinc-950 text-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <button
                onClick={() => navigate('/favorites')}
                className="flex items-center gap-2 text-zinc-500 hover:text-amber-600 transition-colors mb-6 group"
              >
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Archive</span>
              </button>
              <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none uppercase italic mb-4">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-zinc-500 max-w-2xl text-lg font-medium">
                  {collection.description}
                </p>
              )}
            </div>
            
            <button
              onClick={handleDeleteCollection}
              className="flex items-center gap-2 text-red-900/40 hover:text-red-600 transition-colors py-2 px-4 rounded-xl hover:bg-red-950/20"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Destroy Archive</span>
            </button>
          </div>

          {collection.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
              {collection.items.map(({ content }) => (
                <div key={content.id} className="group relative">
                  <div 
                    onClick={() => navigate(`/movie-detail/${content.id}`)}
                    className="aspect-[2/3] rounded-2xl overflow-hidden mb-4 cursor-pointer bg-zinc-900 border border-white/5 group-hover:border-amber-600/50 transition-all shadow-2xl"
                  >
                    <img
                      src={content.posterUrl}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                       <span className="text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-1">View Detail</span>
                       <h4 className="text-white font-bold text-sm truncate">{content.title}</h4>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm truncate group-hover:text-amber-600 transition-colors uppercase italic">
                        {content.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                        {content.releaseYear} • {content.genre.split(',')[0]}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(content.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-500 p-1"
                      title="Remove from collection"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
              <span className="material-symbols-outlined text-zinc-800 text-7xl mb-6">movie_filter</span>
              <h3 className="text-xl font-bold mb-2">Archive is Empty</h3>
              <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto">Start adding films to this collection from their detail pages.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                Discover Films
              </button>
            </div>
          )}
        </div>
      </main>
  )
}
