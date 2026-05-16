import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface Platform {
  id: number
  name: string
  imageUrl: string | null
}

interface GenreWithCount {
  id: number
  name: string
  _count?: {
    content: number
  }
}

export default function ExploreCategories() {
  const navigate = useNavigate()
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [genres, setGenres] = useState<GenreWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [categorySearch, setCategorySearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [pRes, gRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/platforms`),
          fetch(`${import.meta.env.VITE_API_URL}/api/genres`)
        ])
        
        const pData = await pRes.json()
        const gData = await gRes.json()
        
        if (pData.success) setPlatforms(pData.data)
        if (gData.success) setGenres(gData.data)
      } catch (err) {
        console.error('Failed to fetch data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredGenres = genres.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  // Map of icons for common genres
  const getIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Action': 'bolt',
      'Comedy': 'comedy_mask',
      'Drama': 'theater_comedy',
      'Horror': 'skull',
      'Sci-Fi': 'rocket_launch',
      'Adventure': 'explore',
      'Animation': 'animation',
      'Documentary': 'videocam',
      'Fantasy': 'auto_stories',
      'Thriller': 'warning',
      'Mystery': 'search',
      'Romance': 'favorite',
      'Crime': 'gavel',
      'Family': 'family_restroom',
      'War': 'military_tech',
      'History': 'history_edu',
      'Music': 'music_note',
      'Western': 'star',
    }
    return icons[name] || 'label'
  }

  return (
    <main className="pt-24 min-h-screen px-6 sm:px-10 lg:px-16 pb-20">
      <div className="max-w-[1600px] mx-auto">
        {/*  Header Section  */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase mb-4 block">
                Discovery Mode
              </span>
              <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter text-on-surface leading-none">
                Explore
              </h1>
            </div>
            <div className="w-full md:w-96">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/30 to-orange-500/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-surface-container-high rounded-xl flex items-center px-4 py-4 ring-1 ring-white/5">
                  <span className="material-symbols-outlined text-zinc-400 mr-3">filter_list</span>
                  <input
                    className="bg-transparent border-none text-on-surface focus:ring-0 w-full placeholder:text-zinc-600 font-body text-sm"
                    placeholder="Search by category..."
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Streaming Platforms Section */}
          {platforms.length > 0 && !categorySearch && (
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold font-headline uppercase tracking-tight">Streaming Services</h2>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <div 
                    key={platform.id}
                    onClick={() => navigate(`/dashboard?platform=${platform.name}`)}
                    className="group relative overflow-hidden rounded-2xl bg-surface-container-low h-40 cursor-pointer border border-white/5 hover:border-amber-600/30 transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative h-full p-8 flex flex-col justify-between z-10">
                      {platform.imageUrl ? (
                        <img src={platform.imageUrl} alt={platform.name} className="h-8 w-fit object-contain opacity-70 group-hover:opacity-100 transition-opacity invert brightness-0" />
                      ) : (
                        <span className="material-symbols-outlined text-amber-600 text-3xl">tv</span>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold font-headline capitalize group-hover:text-amber-600 transition-colors">{platform.name}</h3>
                        <p className="text-xs text-on-surface-variant font-body mt-1">Explore Originals & More</p>
                      </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <span className="material-symbols-outlined text-9xl">stream</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*  Bento Category Grid  */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGenres.map((genre) => (
                <div 
                  key={genre.id}
                  onClick={() => navigate(`/dashboard?genre=${encodeURIComponent(genre.name)}`)}
                  className="category-card group rounded-2xl p-6 flex flex-col justify-between h-48 bg-surface-container-low border border-white/5 cursor-pointer relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-3xl text-amber-600">
                    {getIcon(genre.name)}
                  </span>
                  <div>
                    <h3 className="font-bold font-headline mt-4 text-xl">
                      {genre.name}
                    </h3>
                    <p className="text-xs font-body mt-1 text-on-surface-variant uppercase tracking-widest font-black">
                      {genre._count?.content || 0} Titles
                    </p>
                  </div>
                  <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-8xl">{getIcon(genre.name)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredGenres.length === 0 && !loading && (
              <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-white/10">
                <span className="material-symbols-outlined text-zinc-700 text-6xl mb-4">search_off</span>
                <h3 className="text-xl font-bold text-zinc-400">No categories found matching "{categorySearch}"</h3>
                <button 
                  onClick={() => setCategorySearch('')}
                  className="mt-4 text-amber-600 font-bold hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>
        {/*  Footer Callout  */}
        <section className="mt-32">
          <div className="relative rounded-3xl overflow-hidden p-12 bg-surface-container-low border border-white/5">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <img
                alt="Cinematic background"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADqqRqlBNzjIJl6CITn-bUcjY16ZkkFWqus0sWm1Z3lXpmKS-CG3IxQwcEh1hgXXsDJQgnsTNZmh8QOl5Pi6xlguAdRiHFwjQpPeVBRBGLmLqy1NhjY31kv7k470nJT_BUdu2KcRZKBlB6cHf2i3hOHZkZvbGI87STXNl8igtbLf9FJij5hHzf9kRuSMiHlF6D1hxvA3FvidYuPXEnoapYxfDsee_6DJOQs-HrpbK-p8O26IRX94ebzHVNfWqmso796al3W90dVozY"
              />
            </div>
            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl font-bold font-headline mb-6">
                Didn't find what you were looking for?
              </h2>
              <p className="text-on-surface-variant mb-8 text-lg">
                Our catalog is updated daily with thousands of titles across the most obscure genres
                imaginable.
              </p>
              <div className="flex gap-4">
                <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-bold tracking-tight hover:scale-105 active:scale-95 transition-all">
                  Request a Category
                </button>
                <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold tracking-tight hover:bg-surface-bright transition-all">
                  View All 250+ Tags
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
