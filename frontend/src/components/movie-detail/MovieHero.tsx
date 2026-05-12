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
  return (
    <section className="md-hero">
      <img
        src={
          youtubeId
            ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
            : backdropUrl
        }
        alt={title}
        className="md-hero-img"
        onError={(e) => {
          const el = e.target as HTMLImageElement
          const currentSrc = el.src
          if (youtubeId && currentSrc.includes('maxresdefault')) {
            el.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
          } else if (youtubeId && currentSrc.includes('hqdefault')) {
            el.src = backdropUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop'
          } else {
            el.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop'
          }
        }}
      />
      <div className="md-hero-fade" />
      <button
        className="md-hero-back"
        onClick={onBack}
        aria-label="Go back"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      {youtubeId && (
        <button
          className="md-play-circle-btn"
          onClick={onPlay}
          aria-label="Play trailer"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
        </button>
      )}
    </section>
  )
}
