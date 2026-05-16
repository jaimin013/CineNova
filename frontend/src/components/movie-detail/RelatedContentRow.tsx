import React, { useRef } from 'react'

interface RelatedItem {
  id: number
  title: string
  posterUrl: string
  releaseYear?: number
  groupOrder?: number | null
}

interface RelatedContentRowProps {
  groupName: string
  groupType: string
  items: RelatedItem[]
  activeId: number
  onSelect: (id: number) => void
}

export const RelatedContentRow: React.FC<RelatedContentRowProps> = ({
  groupName,
  groupType,
  items,
  activeId,
  onSelect,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (distance: number) => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollBy({ left: distance, behavior: 'smooth' })
  }

  if (items.length <= 1) return null

  return (
    <section className="md-related-section">
      <div className="md-related-header">
        <div>
          <p className="md-related-eyebrow">Part of {groupType}</p>
          <h2 className="md-related-title">{groupName}</h2>
        </div>
        <div className="md-related-controls">
          <button className="md-scroll-btn" onClick={() => scrollBy(-320)} aria-label="Scroll left">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="md-scroll-btn" onClick={() => scrollBy(320)} aria-label="Scroll right">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="md-related-track">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`md-related-card ${item.id === activeId ? 'is-active' : ''}`}
          >
            <div className="md-related-poster">
              <img
                src={item.posterUrl}
                alt={item.title}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x600?text=' + item.title
                }}
              />
            </div>
            <div className="md-related-meta">
              <span className="md-related-order">
                {item.groupOrder ? `${item.groupOrder}.` : ''}
              </span>
              <span className="md-related-name">{item.title}</span>
              {item.releaseYear && <span className="md-related-year">{item.releaseYear}</span>}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
