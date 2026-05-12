import React from 'react'

interface MovieInfoStripProps {
  content: {
    title: string
    type: 'movie' | 'series'
    posterUrl: string
    rating: number
    releaseYear?: number
    duration?: number
    section: string
    platform?: string
  }
  genres: string[]
  isWatched: boolean
  onToggleWatched: () => void
  isInCollection: boolean
  onToggleCollection: () => void
}

export const MovieInfoStrip: React.FC<MovieInfoStripProps> = ({
  content,
  genres,
  isWatched,
  onToggleWatched,
  isInCollection,
  onToggleCollection
}) => {
  return (
    <div className="md-infostrip">
      <div className="md-strip-poster-wrap">
        <img
          src={content.posterUrl}
          alt={content.title}
          className="md-strip-poster-img"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop'
          }}
        />
      </div>

      <div className="md-strip-info">
        <p className="md-strip-eyebrow">
          {content.type === 'movie' ? 'Movie' : 'Series'}
          {content.releaseYear && <> • {content.releaseYear}</>}
          {content.duration && <> • {Math.floor(content.duration / 60)}h {content.duration % 60}m</>}
        </p>
        <h1 className="md-strip-title">{content.title}</h1>
        <div className="md-strip-meta-grid">
          {genres.slice(0, 2).map((g, i) => (
            <div key={i} className="md-strip-meta-col">
              <span className="md-strip-meta-label">Genre</span>
              <span className="md-strip-meta-value">{g}</span>
            </div>
          ))}
          {content.releaseYear && (
            <div className="md-strip-meta-col">
              <span className="md-strip-meta-label">Year</span>
              <span className="md-strip-meta-value">{content.releaseYear}</span>
            </div>
          )}
          <div className="md-strip-meta-col">
            <span className="md-strip-meta-label">Rating</span>
            <span className="md-strip-meta-value md-strip-rating">
              <span 
                className="material-symbols-outlined" 
                style={{ fontSize: '13px', color: '#e5b76e', fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              {content.rating?.toFixed(1) ?? '—'}
            </span>
          </div>
          {content.section && (
            <div className="md-strip-meta-col">
              <span className="md-strip-meta-label">Section</span>
              <span className="md-strip-meta-value">{content.section}</span>
            </div>
          )}
          {content.platform && (
            <div className="md-strip-meta-col">
              <span className="md-strip-meta-label">Available on</span>
              <span className="md-strip-meta-value capitalize" style={{ color: '#4ade80' }}>{content.platform}</span>
            </div>
          )}
        </div>
      </div>

      <div className="md-strip-actions">
        <button
          className={`md-strip-btn md-strip-btn--watch ${isWatched ? 'md-strip-btn--watch-active' : ''}`}
          onClick={onToggleWatched}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isWatched ? "'FILL' 1" : "'FILL' 0", fontSize: '16px' }}
          >
            visibility
          </span>
          {isWatched ? 'Watched ✓' : 'Mark as Watched'}
        </button>
        <button
          className={`md-strip-btn md-strip-btn--collect ${isInCollection ? 'md-strip-btn--collect-active' : ''}`}
          onClick={onToggleCollection}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isInCollection ? "'FILL' 1" : "'FILL' 0", fontSize: '16px' }}
          >
            bookmark
          </span>
          {isInCollection ? 'In Collection ✓' : 'Add to Collection'}
        </button>
      </div>
    </div>
  )
}
