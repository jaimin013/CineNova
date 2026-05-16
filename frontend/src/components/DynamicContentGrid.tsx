import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ScrollingTitle from './ScrollingTitle'

interface Content {
  id: number
  title: string
  description: string
  type: 'movie' | 'series'
  posterUrl: string
  rating: number
  genre: string
  releaseYear?: number
  duration?: number
  section: string
  platform?: string
  featured?: boolean
  videoUrl?: string
  casts?: string
}

interface DynamicContentGridProps {
  sectionName?: string
  genreName?: string
  title: string
  subtitle?: string
  layout?: 'grid-2' | 'grid-4' | 'carousel'
  limit?: number
}

export default function DynamicContentGrid({
  sectionName,
  genreName,
  title,
  subtitle,
  layout = 'grid-4',
  limit,
}: DynamicContentGridProps) {
  const navigate = useNavigate()
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        let endpoint = ''
        const queryParams = limit ? `?limit=${limit}` : ''
        
        if (sectionName) {
          endpoint = `/api/content/section/${encodeURIComponent(sectionName)}${queryParams}`
        } else if (genreName) {
          endpoint = `/api/content/genre/${encodeURIComponent(genreName)}${queryParams}`
        } else {
          endpoint = `/api/content${queryParams}`
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`)

        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }

        const data = await response.json()
        setContent(data.data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [sectionName, genreName, limit])

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-headline font-bold tracking-tight mb-8">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-lg bg-surface-container animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-headline font-bold tracking-tight mb-8">{title}</h2>
        <p className="text-on-surface-variant">Error loading content: {error}</p>
      </section>
    )
  }

  if (content.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-headline font-bold tracking-tight mb-8">{title}</h2>
        <p className="text-on-surface-variant">No content available in this section.</p>
      </section>
    )
  }

  const gridClass = {
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'grid-4': 'grid-cols-2 md:grid-cols-4',
    carousel: 'grid-cols-1',
  }[layout]

  return (
    <section className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
      <div className="mb-10">
        <h2 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-on-surface-variant mt-3 text-lg">{subtitle}</p>}
      </div>

      <div className={`grid ${gridClass} gap-8 lg:gap-10`}>
        {content.map((item) => {
          return (
            <div
              key={item.id}
              className="group cursor-pointer transition-all duration-500 hover:scale-[1.02]"
              onClick={() => navigate(`/movie-detail/${item.id}`)}
            >
              {/* Poster Card */}
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-surface-container mb-4 shadow-xl group-hover:shadow-amber-600/30 transition-all duration-300 relative">
                <img
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={item.posterUrl}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x600?text=' + item.title
                  }}
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end z-20">
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <span className="material-symbols-outlined text-[14px] fill-1">star</span>
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="space-y-2">
                <ScrollingTitle 
                  title={item.title} 
                  className="font-bold text-sm hover:text-amber-600 transition-colors cursor-pointer" 
                />

                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold shimmer-text">
                  <span>{item.type}</span>
                  {item.releaseYear && <span>{item.releaseYear}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

