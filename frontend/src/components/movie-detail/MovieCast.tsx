import React from 'react'

export interface Cast {
  name: string
  role: string
  image: string
}

interface MovieCastProps {
  casts: Cast[]
}

export const MovieCast: React.FC<MovieCastProps> = ({ casts }) => {
  if (!casts || casts.length === 0) return null

  return (
    <section className="md-section">
      <div className="md-section-header">
        <h2 className="md-section-title">Cast</h2>
        <div className="md-title-line" />
      </div>
      <div className="md-cast-scroll-wrap">
        <div className="md-cast-scroll">
          {casts.map((actor, idx) => (
            <div key={idx} className="md-cast-card">
              <div className="md-cast-avatar-wrap">
                <img
                  src={actor.image}
                  alt={actor.name}
                  className="md-cast-avatar"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(actor.name)}&backgroundColor=292929`
                  }}
                />
                <div className="md-cast-ring" />
              </div>
              <p className="md-cast-name">{actor.name}</p>
              <p className="md-cast-role">{actor.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
