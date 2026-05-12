import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FeaturedContent {
  id: number
  title: string
  description: string
  type: 'movie' | 'series'
  posterUrl: string
  backdropUrl: string
  rating: number
  genre: string
  releaseYear?: number
  duration?: number
  section: string
  platform?: string
  featured: boolean
  videoUrl?: string
  casts?: string
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function DynamicFeaturedHero() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<FeaturedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/featured`)
        const data = await response.json()

        if (data.success && data.data && data.data.length > 0) {
          setFeatured(data.data[0])
        }
      } catch (error) {
        console.error('Error fetching featured content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  // Auto-play video on mobile/tablet after load
  useEffect(() => {
    if (isMobileOrTablet && featured?.videoUrl && !isVideoPlaying) {
      setIsVideoPlaying(true)
    }
  }, [featured, isMobileOrTablet, isVideoPlaying])

  if (loading || !featured) {
    return (
      <section className="relative h-96 sm:h-[500px] lg:h-[600px] w-full overflow-hidden bg-gradient-to-b from-zinc-800 to-background">
        <div className="animate-pulse h-full bg-surface-container"></div>
      </section>
    )
  }

  const genres = featured.genre.split(',').slice(0, 3)
  const youtubeId = featured.videoUrl ? extractYouTubeId(featured.videoUrl) : null
  const hasVideo = youtubeId && (isVideoPlaying || isMobileOrTablet)

  return (
    <section 
      className="relative h-[400px] sm:h-[550px] lg:h-[700px] w-full overflow-hidden group bg-black"
      onMouseEnter={() => !isMobileOrTablet && featured.videoUrl && setIsVideoPlaying(true)}
      onMouseLeave={() => !isMobileOrTablet && setIsVideoPlaying(false)}
    >
      {/* Background - Video or Image */}
      <div className="absolute inset-0 z-0">
        {hasVideo && youtubeId ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
            {/* Optimized scaling to fill screen while preserving quality */}
            <div className="w-[125%] h-[125%] lg:w-[135%] lg:h-[135%] flex-shrink-0">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&autohide=1&playsinline=1`}
                className={`w-full h-full transition-opacity duration-1000 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                allow="autoplay"
                title="Featured video"
                style={{
                  border: 'none',
                }}
              />
            </div>
            {/* Interaction Shield - Physically blocks any hover/click events */}
            <div className="absolute inset-0 z-20"></div>
          </div>
        ) : (
          <img
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            src={featured.backdropUrl}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop'
            }}
          />
        )}
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/30 z-0"></div>
      </div>

      {/* Text Content - Always on Top */}
      <div className="relative z-20 h-full flex flex-col justify-end px-6 sm:px-10 lg:px-16 pb-12 sm:pb-20 lg:pb-24 max-w-[1600px] mx-auto w-full">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 max-w-full sm:max-w-xl lg:max-w-2xl">
          {/* Badges */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <span className="px-2.5 sm:px-3 py-1 bg-amber-600/20 text-amber-600 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded">
              {featured.section}
            </span>
            <span className="px-2.5 sm:px-3 py-1 bg-surface-container-highest/60 backdrop-blur-md text-on-surface text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded">
              {featured.type === 'movie' ? 'FILM' : 'SERIES'}
            </span>
          </div>

          {/* Title - Fixed Spacing */}
          <div className="pt-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-headline tracking-tighter leading-tight text-white">
              {featured.title}
            </h1>
          </div>

          {/* Meta Info - Responsive */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 font-body text-on-surface-variant font-medium flex-wrap text-xs sm:text-sm">
            {featured.releaseYear && (
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="material-symbols-outlined text-amber-600 text-xs sm:text-sm">
                  calendar_today
                </span>
                {featured.releaseYear}
              </span>
            )}
            {featured.duration && (
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="material-symbols-outlined text-amber-600 text-xs sm:text-sm">schedule</span>
                {featured.duration} MIN
              </span>
            )}
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="material-symbols-outlined text-amber-600 text-xs sm:text-sm">star</span>
              {featured.rating.toFixed(1)} / 10
            </span>
          </div>

          {/* Description - Responsive */}
          <p className="text-xs sm:text-sm lg:text-base text-on-surface-variant leading-relaxed max-w-full sm:max-w-md lg:max-w-lg line-clamp-2 sm:line-clamp-3">
            {featured.description}
          </p>

          {/* Genres - Responsive */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {genres.map((genre, idx) => (
              <span
                key={idx}
                className="px-2 sm:px-3 lg:px-4 py-0.5 sm:py-1 rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant text-[10px] sm:text-xs font-semibold tracking-wider uppercase"
              >
                {genre.trim()}
              </span>
            ))}
          </div>

          {/* CTA Buttons - Responsive */}
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 pt-2 sm:pt-4">
            <button
              onClick={() => youtubeId ? setShowVideoModal(true) : navigate(`/movie-detail/${featured.id}`)}
              className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-md font-bold text-sm sm:text-base flex items-center gap-2 sm:gap-3 scale-100 hover:scale-105 transition-transform shadow-xl shadow-amber-600/20"
            >
              <span
                className="material-symbols-outlined fill text-base sm:text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              <span className="hidden sm:inline">Watch Now</span>
              <span className="sm:hidden">Play</span>
            </button>
            <button
              onClick={() => navigate(`/movie-detail/${featured.id}`)}
              className="bg-surface-container-highest backdrop-blur-md text-on-surface px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-md font-bold text-sm sm:text-base flex items-center gap-2 sm:gap-3 scale-100 hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">info</span>
              <span className="hidden sm:inline">More Info</span>
              <span className="sm:hidden">Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Indicator (Mobile) */}
      {isMobileOrTablet && hasVideo && youtubeId && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-amber-600/80 text-white text-xs rounded-full font-semibold">
          🎬 Video Playing
        </div>
      )}

      {/* Video Preview Modal */}
      {showVideoModal && youtubeId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-500"
            onClick={() => setShowVideoModal(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative w-full max-w-6xl aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] transform transition-all duration-500 scale-100">
            {/* Close Button */}
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-amber-600 text-white rounded-full transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
            
            {/* Loading Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            {/* Iframe */}
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full border-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={`${featured.title} Preview`}
            />
          </div>
        </div>
      )}
    </section>
  )
}
