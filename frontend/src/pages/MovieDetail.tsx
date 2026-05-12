import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import AuthenticatedNavbar from '../components/AuthenticatedNavbar'
import AuthenticatedSidebar from '../components/AuthenticatedSidebar'
import '../styles/movie-detail.css'
import { VibeChart } from '../components/movie-detail/VibeChart'
import { CinemaMeter } from '../components/movie-detail/CinemaMeter'
import { ReviewsSection } from '../components/movie-detail/ReviewsSection'
import { MovieHero } from '../components/movie-detail/MovieHero'
import { MovieInfoStrip } from '../components/movie-detail/MovieInfoStrip'
import { MovieCast, Cast } from '../components/movie-detail/MovieCast'
import { MovieVideoModal } from '../components/movie-detail/MovieVideoModal'

/* ————————————————— Types ———————————————————————————————————————————————————————————————————————— */
interface ContentDetail {
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
  casts?: string
  videoUrl?: string
}

/* ————————————————— Helpers ———————————————————————————————————————————————————————————————————————— */
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  return match ? match[1] : null
}

/* ————————————————— Main Component ———————————————————————————————————————————————————————————————————————— */
export default function MovieDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [content, setContent] = useState<ContentDetail | null>(null)
  const [casts, setCasts] = useState<Cast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Video modal
  const [showVideoModal, setShowVideoModal] = useState(false)

  // User actions (frontend only)
  const [isWatched, setIsWatched] = useState(false)
  const [isInCollection, setIsInCollection] = useState(false)

  /* Fetch content */
  useEffect(() => {
    if (!id) {
      setError('No content ID provided')
      setLoading(false)
      return
    }

    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/content/${id}`
        )
        if (!response.ok) throw new Error('Failed to fetch content')

        const data = await response.json()
        if (data.success && data.data) {
          setContent(data.data)
          if (data.data.casts) {
            try {
              setCasts(JSON.parse(data.data.casts))
            } catch {
              setCasts([])
            }
          }
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching content:', err)
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [id])

  /* Close modal on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVideoModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Loading / Error / Empty states */
  if (loading) {
    return (
      <div className="md-loading-screen">
        <div className="md-spinner" />
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="md-loading-screen">
        <span className="material-symbols-outlined md-error-icon">
          error_outline
        </span>
        <p className="md-error-text">{error}</p>
        <button
          className="md-back-btn"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="md-loading-screen">
        <p className="md-error-text">Content not found</p>
        <button className="md-back-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  const youtubeId = content.videoUrl ? extractYouTubeId(content.videoUrl) : null
  const genres = content.genre ? content.genre.split(',').map((g) => g.trim()) : []

  return (
    <>
      <AuthenticatedNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <AuthenticatedSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="md-main">
        <MovieHero
          title={content.title}
          backdropUrl={content.backdropUrl}
          youtubeId={youtubeId}
          onBack={() => navigate('/dashboard')}
          onPlay={() => setShowVideoModal(true)}
        />

        <MovieInfoStrip
          content={content}
          genres={genres}
          isWatched={isWatched}
          onToggleWatched={() => setIsWatched(!isWatched)}
          isInCollection={isInCollection}
          onToggleCollection={() => setIsInCollection(!isInCollection)}
        />

        <div className="md-body">
          <div className="md-content-main">
            <section className="md-section">
              <div className="md-section-header">
                <h2 className="md-section-title">Overview</h2>
                <div className="md-title-line" />
              </div>
              <p className="md-overview-text">{content.description}</p>
              <div className="md-genre-chips">
                {genres.map((g, i) => (
                  <span key={i} className="md-genre-chip">
                    {g}
                  </span>
                ))}
              </div>
            </section>

            <MovieCast casts={casts} />
          </div>

          <aside className="md-sidebar-right">
            <div className="md-vibe-card">
              <h3 className="md-vibe-title">Vibe Chart</h3>
              <p className="md-vibe-subtitle">Community-rated emotional spectrum</p>
              <VibeChart genres={genres} />
            </div>
          </aside>
        </div>

        <CinemaMeter />
        <ReviewsSection />

        <footer className="md-footer">
          <div className="md-footer-brand">CineNova</div>
          <p className="md-footer-copy">© 2024 CineNova. Cinematic Immersion.</p>
        </footer>
      </main>

      <MovieVideoModal
        isOpen={showVideoModal}
        youtubeId={youtubeId || ''}
        title={content.title}
        onClose={() => setShowVideoModal(false)}
      />
    </>
  )
}
