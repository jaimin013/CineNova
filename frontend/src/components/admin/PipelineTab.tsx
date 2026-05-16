import React, { useState, useEffect } from 'react'
import { Sparkles, Search, Loader, Star, Download } from 'lucide-react'
import { Genre, Content } from '../../types/admin'
import ContentManagerModal from '../ContentManagerModal'

export const PipelineTab: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [tmdbResults, setTmdbResults] = useState<any[]>([])
  const [tmdbLoading, setTmdbLoading] = useState(false)
  const [tmdbSearch, setTmdbSearch] = useState('')
  const [tmdbFilter, setTmdbFilter] = useState<'movie' | 'tv'>('movie')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [tmdbImporting, setTmdbImporting] = useState<any | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)

  useEffect(() => {
    fetchGenres()
  }, [])

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

  const handleTMDBSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!tmdbSearch.trim()) return

    try {
      setSelectedGenre('')
      setTmdbLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const baseUrl = import.meta.env.VITE_API_URL
      const omdbType = tmdbFilter === 'tv' ? 'series' : 'movie'
      const endpoint = `/api/admin/omdb/search?query=${tmdbSearch}&type=${omdbType}`

      const response = await fetch(`${baseUrl}${endpoint}`, {
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

  const handleTMDBImport = async (idOrTitle: string | number, type: 'movie' | 'series') => {
    try {
      setTmdbImporting(idOrTitle)
      const token = localStorage.getItem('adminAccessToken')
      const baseUrl = import.meta.env.VITE_API_URL
      const endpoint = `/api/admin/omdb/details/${type}/${encodeURIComponent(idOrTitle.toString())}`

      const response = await fetch(`${baseUrl}${endpoint}`, {
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 backdrop-blur-md mb-10">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Auto-Fetch Pipeline</h3>
            <p className="text-sm text-white/30 font-bold uppercase tracking-widest">
              Discover and import content from OMDB
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">
              1. Search Type
            </label>
            <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit">
              <button
                onClick={() => setTmdbFilter('movie')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  tmdbFilter === 'movie' ? 'bg-amber-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setTmdbFilter('tv')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  tmdbFilter === 'tv' ? 'bg-amber-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                Series
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">
              2. Discover by Genre (Your Tags)
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => {
                const genre = e.target.value
                setTmdbSearch(genre)
                setSelectedGenre(genre)

                const token = localStorage.getItem('adminAccessToken')
                const baseUrl = import.meta.env.VITE_API_URL
                const omdbType = tmdbFilter === 'tv' ? 'series' : 'movie'
                const endpoint = `/api/admin/omdb/search?query=${encodeURIComponent(genre)}&type=${omdbType}`

                setTmdbLoading(true)
                fetch(`${baseUrl}${endpoint}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) setTmdbResults(data.data)
                  })
                  .finally(() => setTmdbLoading(false))
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-xs font-bold text-white/70 focus:outline-none focus:border-amber-500 transition-all appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="">-- Choose a Category --</option>
              {genres.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">
            {selectedGenre
              ? `Listing ${selectedGenre} ${tmdbFilter === 'tv' ? 'Series' : 'Movies'}...`
              : `Quick Search ${tmdbFilter === 'tv' ? 'Series' : 'Movies'}`}
          </label>
          <form onSubmit={handleTMDBSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-amber-500" />
              <input
                type="text"
                placeholder={`Search for a ${tmdbFilter === 'tv' ? 'TV show' : 'Movie'} title...`}
                value={tmdbSearch}
                onChange={(e) => setTmdbSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
              />
            </div>
            <button
              type="submit"
              className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
            >
              Fetch from OMDB
            </button>
          </form>
        </div>
      </div>

      {/* Results Grid */}
      {tmdbLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader size={48} className="text-amber-500 mb-6" />
          <p className="text-white/20 font-black uppercase tracking-widest text-xs">
            Querying OMDB Databases...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tmdbResults.map((item) => (
            <div
              key={item.tmdbId}
              className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all flex flex-col shadow-2xl"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={item.posterUrl || 'https://via.placeholder.com/400x600?text=No+Poster'}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-amber-600">
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest">
                      {item.releaseYear}
                    </span>
                  </div>
                  <h4 className="font-black text-white text-lg leading-tight line-clamp-2">{item.title}</h4>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="text-amber-500 fill-amber-500" size={16} />
                    <span className="font-black text-xl">{(item.rating || 0).toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-4 mb-8 font-medium leading-relaxed">
                    {item.description || 'No description available.'}
                  </p>
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
          <p className="text-white/20 font-bold uppercase tracking-widest text-xs">
            Try searching for a different title or filter
          </p>
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
            setShowModal(false)
            setEditingContent(null)
          }}
        />
      )}
    </div>
  )
}
