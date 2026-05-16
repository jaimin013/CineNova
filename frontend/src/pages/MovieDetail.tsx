import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../styles/movie-detail.css'
import { VibeChart } from '../components/movie-detail/VibeChart'
import { CinemaMeter } from '../components/movie-detail/CinemaMeter'
import { ReviewsSection } from '../components/movie-detail/ReviewsSection'
import { MovieHero } from '../components/movie-detail/MovieHero'
import { MovieInfoStrip } from '../components/movie-detail/MovieInfoStrip'
import { MovieCast, Cast } from '../components/movie-detail/MovieCast'
import { MovieVideoModal } from '../components/movie-detail/MovieVideoModal'
import { RelatedContentRow } from '../components/movie-detail/RelatedContentRow'
import Footer from '../components/Footer'

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

interface RelatedGroup {
  id: number
  name: string
  type: string
}

interface RelatedItem {
  id: number
  title: string
  posterUrl: string
  releaseYear?: number
  groupOrder?: number | null
}

/* ————————————————— Helpers ———————————————————————————————————————————————————————————————————————— */
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  )
  return match ? match[1] : null
}

/* ————————————————— Main Component ———————————————————————————————————————————————————————————————————————— */
export default function MovieDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [content, setContent] = useState<ContentDetail | null>(null)
  const [casts, setCasts] = useState<Cast[]>([])
  const [platformImage, setPlatformImage] = useState<string | null>(null)
  const [relatedGroup, setRelatedGroup] = useState<RelatedGroup | null>(null)
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Video modal
  const [showVideoModal, setShowVideoModal] = useState(false)

  // User actions
  const [isWatched, setIsWatched] = useState(false)
  const [isInCollection, setIsInCollection] = useState(false)
  const [meterRefreshKey, setMeterRefreshKey] = useState(0)

  // Custom Collections Modal
  const [showCollectionsModal, setShowCollectionsModal] = useState(false)
  const [userCollections, setUserCollections] = useState<any[]>([])
  const [loadingCollections, setLoadingCollections] = useState(false)

  // Fetch user interactions (watched/collected status)
  useEffect(() => {
    const fetchInteractions = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token || !id) return

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/content/${id}/interactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const data = await response.json()
        if (data.success) {
          setIsWatched(data.data.watched)
          setIsInCollection(data.data.collected)
        }
      } catch (err) {
        console.error('Error fetching interactions:', err)
      }
    }

    fetchInteractions()
  }, [id])

  const fetchUserCollections = async () => {
    try {
      setLoadingCollections(true)
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/custom-collections`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        // We also need to know which ones already contain this contentId
        // The endpoint getUserCollections returns collections with some items, 
        // but we might need a more specific check or just fetch the collection details.
        // For simplicity, we can fetch all collections and then check each one or fetch details.
        // Actually, let's just fetch all and then the backend addItem handles upsert.
        setUserCollections(data.data || [])
      }
    } catch (err) {
      console.error('Error fetching collections:', err)
    } finally {
      setLoadingCollections(false)
    }
  }

  const handleToggleInCustomCollection = async (collectionId: number, isCurrentlyIn: boolean) => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token || !id) return

      const method = isCurrentlyIn ? 'DELETE' : 'POST'
      const url = isCurrentlyIn 
        ? `${import.meta.env.VITE_API_URL}/api/user/custom-collections/${collectionId}/items/${id}`
        : `${import.meta.env.VITE_API_URL}/api/user/custom-collections/${collectionId}/items`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: isCurrentlyIn ? undefined : JSON.stringify({ contentId: parseInt(id) })
      })

      const data = await response.json()
      if (data.success) {
        // Refresh the list to show updated status
        fetchUserCollections()
      }
    } catch (err) {
      console.error('Error toggling collection item:', err)
    }
  }

  useEffect(() => {
    if (showCollectionsModal) {
      fetchUserCollections()
    }
  }, [showCollectionsModal])

  const toggleWatched = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token || !id) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/${id}/watched`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setIsWatched(data.watched)
      }
    } catch (err) {
      console.error('Error toggling watched status:', err)
    }
  }

  const toggleCollection = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token || !id) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/${id}/collection`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setIsInCollection(data.collected)
      }
    } catch (err) {
      console.error('Error toggling collection status:', err)
    }
  }

  // When a review is posted, increment the key so CinemaMeter refetches
  const onReviewPosted = () => setMeterRefreshKey((k) => k + 1)

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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/${id}`)
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

          // Fetch platform image if platform is specified
          if (data.data.platform) {
            try {
              const platformRes = await fetch(`${import.meta.env.VITE_API_URL}/api/platforms`)
              const platformData = await platformRes.json()
              if (platformData.success && platformData.data) {
                // Find platform by name (case-insensitive)
                const matchedPlatform = platformData.data.find(
                  (p: any) => p.name.toLowerCase() === data.data.platform.toLowerCase(),
                )
                if (matchedPlatform?.imageUrl) {
                  setPlatformImage(matchedPlatform.imageUrl)
                }
              }
            } catch (err) {
              console.error('Error fetching platform image:', err)
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

  useEffect(() => {
    const fetchRelated = async () => {
      if (!id) return
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/${id}/related`)
        const data = await response.json()
        if (data.success) {
          setRelatedGroup(data.data.group)
          setRelatedItems(data.data.items || [])
        }
      } catch (err) {
        console.error('Error fetching related content:', err)
      }
    }

    fetchRelated()
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
        <span className="material-symbols-outlined md-error-icon">error_outline</span>
        <p className="md-error-text">{error}</p>
        <button className="md-back-btn" onClick={() => navigate('/dashboard')}>
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
          onToggleWatched={toggleWatched}
          isInCollection={isInCollection}
          onToggleCollection={toggleCollection}
          onManageCollections={() => setShowCollectionsModal(true)}
          platformImage={platformImage}
        />

        {relatedGroup && relatedItems.length > 1 && (
          <RelatedContentRow
            groupName={relatedGroup.name}
            groupType={relatedGroup.type}
            items={relatedItems}
            activeId={content.id}
            onSelect={(contentId) => navigate(`/movie-detail/${contentId}`)}
          />
        )}

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

        <CinemaMeter contentId={content.id} refreshKey={meterRefreshKey} />
        <ReviewsSection contentId={content.id} onReviewPosted={onReviewPosted} />

        <Footer />
      </main>

      {showVideoModal && (
        <MovieVideoModal
          isOpen={showVideoModal}
          youtubeId={youtubeId || ''}
          title={content.title}
          onClose={() => setShowVideoModal(false)}
        />
      )}

      {/* Custom Collections Modal */}
      {showCollectionsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black font-headline tracking-tight uppercase italic leading-none mb-1">Organize</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Add to your archives</p>
                </div>
                <button 
                  onClick={() => setShowCollectionsModal(false)} 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {loadingCollections ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userCollections.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {userCollections.map((coll) => {
                    const isCurrentlyIn = coll.items.some((item: any) => item.contentId === parseInt(id || '0'))
                    return (
                      <button
                        key={coll.id}
                        onClick={() => handleToggleInCustomCollection(coll.id, isCurrentlyIn)}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                          isCurrentlyIn 
                            ? 'bg-amber-600/10 border-amber-600/50 text-white' 
                            : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`material-symbols-outlined ${isCurrentlyIn ? 'text-amber-500' : 'text-zinc-600'}`}>
                            {isCurrentlyIn ? 'check_circle' : 'folder'}
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-bold uppercase italic">{coll.name}</p>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{coll._count.items} Items</p>
                          </div>
                        </div>
                        {isCurrentlyIn && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">In Archive</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-sm text-zinc-500 mb-6 px-8 leading-relaxed">You haven't created any custom collections yet.</p>
                  <button
                    onClick={() => navigate('/favorites')}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20"
                  >
                    Create Collection
                  </button>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-white/5">
                 <button
                   onClick={() => navigate('/favorites')}
                   className="w-full py-4 text-xs font-bold text-zinc-500 hover:text-amber-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                 >
                   <span className="material-symbols-outlined text-sm">settings</span>
                   Manage All Archives
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
