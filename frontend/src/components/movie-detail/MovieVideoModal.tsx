import React from 'react'

interface MovieVideoModalProps {
  isOpen: boolean
  youtubeId: string
  title: string
  onClose: () => void
}

export const MovieVideoModal: React.FC<MovieVideoModalProps> = ({
  isOpen,
  youtubeId,
  title,
  onClose
}) => {
  if (!isOpen || !youtubeId) return null

  return (
    <div className="md-modal-overlay" onClick={onClose}>
      <div
        className="md-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="md-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="md-modal-loading">
          <div className="md-modal-spinner" />
        </div>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          className="md-modal-iframe"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={`${title} Trailer`}
        />
      </div>
    </div>
  )
}
