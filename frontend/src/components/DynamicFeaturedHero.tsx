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
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function DynamicFeaturedHero() {
  const navigate = useNavigate()
  const [featuredItems, setFeaturedItems] = useState<FeaturedContent[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
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
          setFeaturedItems(data.data)
        }
      } catch (error) {
        console.error('Error fetching featured content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  const featured = featuredItems[currentIndex]

  // Auto-play video logic for Mobile/Tablet only
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

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsVideoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsVideoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)
  }

  const handleIndicatorClick = (idx: number) => {
    setIsVideoPlaying(false)
    setCurrentIndex(idx)
  }

  useEffect(() => {
    if (featuredItems.length <= 1) return
    const timer = setTimeout(() => {
      setIsVideoPlaying(false)
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
    }, 5000)
    return () => clearTimeout(timer)
  }, [currentIndex, featuredItems.length])

  return (
    <section
      className="relative h-[400px] sm:h-[520px] lg:h-[660px] xl:h-[720px] w-screen -mx-[calc((100vw-100%)/2)] group bg-black overflow-hidden"
      onMouseEnter={() => !isMobileOrTablet && featured.videoUrl && setIsVideoPlaying(true)}
      onMouseLeave={() => !isMobileOrTablet && setIsVideoPlaying(false)}
    >
      {/* Background - Video or Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {featuredItems.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {idx === currentIndex && hasVideo && youtubeId ? (
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&autohide=1&playsinline=1`}
                    className={`absolute transition-opacity duration-1000 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                    allow="autoplay"
                    title="Featured video"
                    style={{
                      border: 'none',
                      width: '100vw',
                      height: '56.25vw',
                      minHeight: '100%',
                      minWidth: '177.77vh',
                    }}
                  />
                </div>
                <div className="absolute inset-0 z-20"></div>
              </div>
            ) : (
              <img
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-105"
                src={item.backdropUrl}
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  if (el.src !== item.posterUrl) {
                    el.src = item.posterUrl
                  }
                }}
              />
            )}
          </div>
        ))}

        {/* Cinematic Overlays - Slightly darken on hover to emphasize buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500 z-0"></div>
      </div>

      {/* Text Content */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-16 sm:pb-24 lg:pb-32 px-6 sm:px-10 lg:px-12 xl:px-20 w-full">
        <div
          className={`space-y-3 sm:space-y-4 lg:space-y-6 max-w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl transition-all duration-700`}
        >
          {/* Badges */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <span className="px-2.5 sm:px-3 py-1 bg-amber-600/20 text-amber-600 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded border border-amber-600/30">
              {featured.section}
            </span>
            <span className="px-2.5 sm:px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded">
              {featured.type === 'movie' ? 'FILM' : 'SERIES'}
            </span>
          </div>

          {/* Title */}
          <div className="pt-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-headline tracking-tighter leading-none text-white drop-shadow-2xl">
              {featured.title}
            </h1>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 sm:gap-6 font-body text-zinc-300 font-medium flex-wrap text-xs sm:text-sm">
            {featured.releaseYear && (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-sm">
                  calendar_today
                </span>
                {featured.releaseYear}
              </span>
            )}
            {featured.duration && (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-sm">schedule</span>
                {featured.duration} MIN
              </span>
            )}
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
              {featured.rating.toFixed(1)} / 10
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-full sm:max-w-md lg:max-w-xl line-clamp-2 sm:line-clamp-3">
            {featured.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
            <button
              onClick={() =>
                youtubeId ? setShowVideoModal(true) : navigate(`/movie-detail/${featured.id}`)
              }
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-md font-bold text-sm sm:text-base flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-amber-600/20"
            >
              <span
                className="material-symbols-outlined fill"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              <span>Watch Now</span>
            </button>
            <button
              onClick={() => navigate(`/movie-detail/${featured.id}`)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 sm:px-10 py-3 sm:py-4 rounded-md font-bold text-sm sm:text-base flex items-center gap-3 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">info</span>
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Slide Indicators (Simple Dots) */}
      {featuredItems.length > 1 && (
        <div className="absolute bottom-8 right-8 sm:right-12 z-40 flex gap-2">
          {featuredItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleIndicatorClick(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === currentIndex ? 'w-8 bg-amber-600' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
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
