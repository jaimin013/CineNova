import React from 'react'

interface MovieHeroProps {
  title: string
  backdropUrl: string
  youtubeId: string | null
  onBack: () => void
  onPlay: () => void
}

export const MovieHero: React.FC<MovieHeroProps> = ({
  title,
  backdropUrl,
  youtubeId,
  onBack,
  onPlay
}) => {
  // Filter out the rick roll placeholder for playback
  const isRickRoll = youtubeId === 'dQw4w9WgXcQ'
  const effectiveYoutubeId = isRickRoll ? null : youtubeId

  console.log('🎥 MovieHero Props:', { title, youtubeId, effectiveYoutubeId, backdropUrl })

  // Priority: 
  // 1. YouTube maxresdefault
  // 2. YouTube hqdefault
  // 3. backdropUrl (passed from props)
  // 4. Generic fallback
  const backgroundUrl = effectiveYoutubeId 
    ? `https://img.youtube.com/vi/${effectiveYoutubeId}/maxresdefault.jpg`
    : (backdropUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop')

  return (
    <section className="md-hero">
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundUrl}
          alt={title}
          className="md-hero-img"
          onError={(e) => {
            const el = e.target as HTMLImageElement

            // Waterfall error handling:
            // maxresdefault -> sddefault -> hqdefault -> backdropUrl -> generic
            if (effectiveYoutubeId) {
              if (el.src.includes('maxresdefault')) {
                el.src = `https://img.youtube.com/vi/${effectiveYoutubeId}/sddefault.jpg`
              } else if (el.src.includes('sddefault')) {
                el.src = `https://img.youtube.com/vi/${effectiveYoutubeId}/hqdefault.jpg`
              } else if (backdropUrl && el.src !== backdropUrl) {
                el.src = backdropUrl
              } else {
                el.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop'
              }
            } else if (backdropUrl && el.src !== backdropUrl) {
              el.src = backdropUrl
            } else {
              el.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop'
            }
          }}
        />
      </div>
      <div className="md-hero-fade" />

      {/* Controls Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <button
          className="md-hero-back"
          onClick={onBack}
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        {effectiveYoutubeId && (
          <button
            className="md-play-circle-btn"
            onClick={onPlay}
            aria-label="Play trailer"
          >
            <span
              className="material-symbols-outlined"
              style={{ 
                fontVariationSettings: "'FILL' 1",
                fontSize: '32px' 
              }}
            >
              play_arrow
            </span>
          </button>
        )}
      </div>
    </section>
  )
  }

