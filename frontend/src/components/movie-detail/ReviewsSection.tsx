import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { METER_OPTIONS } from './CinemaMeter'
import { useAuth } from '../../context/AuthContext'
import { ReportModal } from './ReportModal'
import { ConfirmModal } from './ConfirmModal'
import { SuccessModal } from './SuccessModal'

export interface Review {
  id: number
  author: string
  avatar: string
  text: string
  date: string
  likes: number
  comments: number
  voteType: 'Skip' | 'Timepass' | 'Go for it' | 'Perfection'
  isLikedByMe: boolean
  userId: number
}

interface ReviewsSectionProps {
  contentId: number
  onReviewPosted?: () => void
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = React.memo(({ contentId, onReviewPosted }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [draft, setDraft] = useState('')
  const [draftVote, setDraftVote] = useState<typeof METER_OPTIONS[0]['label'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const MAX = 1000

  // Modal states
  const [reportModal, setReportModal] = useState<{ isOpen: boolean; reviewId: number | null }>({
    isOpen: false,
    reviewId: null
  })
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{ isOpen: boolean; reviewId: number | null }>({
    isOpen: false,
    reviewId: null
  })
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  })

  const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
  const getToken = () => localStorage.getItem('accessToken')

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const token = getToken()
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(`${apiUrl}/api/content/${contentId}/reviews`, { headers })
      const data = await res.json()
      if (data.success) {
        setReviews(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [contentId, apiUrl])

  useEffect(() => {
    if (contentId) fetchReviews()
  }, [contentId, fetchReviews])

  const handlePost = useCallback(async () => {
    if (!draft.trim() || !draftVote) return
    const token = getToken()
    if (!token) return

    setPosting(true)
    try {
      const res = await fetch(`${apiUrl}/api/content/${contentId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: draft.trim(), voteType: draftVote }),
      })
      const data = await res.json()
      if (data.success) {
        setReviews((prev) => [data.data, ...prev])
        setDraft('')
        setDraftVote(null)
        // Notify parent so CinemaMeter can refetch
        onReviewPosted?.()
      }
    } catch (err) {
      console.error('Failed to post review:', err)
    } finally {
      setPosting(false)
    }
  }, [draft, draftVote, contentId, apiUrl])

  const toggleLike = useCallback(async (reviewId: number) => {
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`${apiUrl}/api/content/${contentId}/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, likes: r.likes + (data.liked ? 1 : -1), isLikedByMe: data.liked }
              : r
          )
        )
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }, [contentId, apiUrl])

  const handleDeleteReview = useCallback(async (reviewId: number) => {
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`${apiUrl}/api/content/${contentId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        // Notify parent so CinemaMeter can refetch (meter vote was removed)
        onReviewPosted?.()
      }
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }, [contentId, apiUrl, onReviewPosted])

  const handleReportReview = useCallback(async (reviewId: number, reason: string) => {
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`${apiUrl}/api/content/${contentId}/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Report Submitted',
          message: 'Thank you for your report. Our moderation team will investigate this review shortly.'
        })
      } else {
        throw new Error(data.error || 'Failed to report review')
      }
    } catch (err: any) {
      console.error('Failed to report review:', err)
      throw err
    }
  }, [contentId, apiUrl])

  return (
    <section className="rv-section">
      <div className="rv-inner">
        <div className="rv-header">
          <h2 className="rv-title">Reviews</h2>
          <div className="rv-filters">
            <button className="rv-filter-btn">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>swap_vert</span>
              Most Recent
            </button>
          </div>
        </div>

        {/* Review composer - only shown if logged in */}
        {user && (
          <div className="rv-composer">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
              alt="You"
              className="rv-composer-avatar"
            />
            <div className="rv-composer-body">
              <div className="rv-vote-selector">
                {METER_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    className={`rv-vote-chip ${draftVote === opt.label ? 'rv-vote-chip--active' : ''}`}
                    style={{ '--chip-color': opt.color } as React.CSSProperties}
                    onClick={() => setDraftVote(draftVote === opt.label ? null : opt.label)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <textarea
                className="rv-textarea"
                placeholder="Write your review here..."
                value={draft}
                maxLength={MAX}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
              />
              <div className="rv-composer-footer">
                <span className="rv-char-count">{draft.length}/{MAX}</span>
                <button
                  className="rv-post-btn"
                  onClick={handlePost}
                  disabled={!draft.trim() || !draftVote || posting}
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="rv-composer" style={{ opacity: 0.6, pointerEvents: 'none' }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" alt="Guest" className="rv-composer-avatar" />
            <div className="rv-composer-body">
              <p style={{ padding: '16px', color: '#888', fontSize: '13px' }}>Sign in to write a review</p>
            </div>
          </div>
        )}

        {/* Reviews list */}
        <div className="rv-list">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center py-12 text-zinc-500 text-sm">No reviews yet. Be the first to share your thoughts!</p>
          ) : (
            reviews.map((rv) => (
              <ReviewCard
                key={rv.id}
                rv={rv}
                isLiked={rv.isLikedByMe}
                onLike={toggleLike}
                onDelete={(id) => setConfirmDeleteModal({ isOpen: true, reviewId: id })}
                onReport={(id) => setReportModal({ isOpen: true, reviewId: id })}
              />
            ))
          )}
        </div>
      </div>

      {/* Custom Modals */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, reviewId: null })}
        onConfirm={async (reason) => {
          if (reportModal.reviewId) {
            await handleReportReview(reportModal.reviewId, reason)
          }
        }}
      />

      <ConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        title="Delete Review?"
        message="Are you sure you want to delete your review? This will also remove your meter vote and cannot be undone."
        confirmText="Delete Review"
        variant="danger"
        onClose={() => setConfirmDeleteModal({ isOpen: false, reviewId: null })}
        onConfirm={async () => {
          if (confirmDeleteModal.reviewId) {
            await handleDeleteReview(confirmDeleteModal.reviewId)
          }
        }}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
      />
    </section>
  )
})

const ReviewCard: React.FC<{ rv: Review; isLiked: boolean; onLike: (id: number) => void; onDelete?: (id: number) => void; onReport?: (id: number) => void }> = React.memo(({ rv, isLiked, onLike, onDelete, onReport }) => {
  const opt = useMemo(() => METER_OPTIONS.find((o) => o.label === rv.voteType)!, [rv.voteType])
  const { user } = useAuth()
  const isOwnReview = user?.id === rv.userId

  return (
    <div className="rv-card">
      <div className="rv-card-top">
        <img src={rv.avatar} alt={rv.author} className="rv-avatar" loading="lazy" />
        <div className="rv-card-meta">
          <span className="rv-author">{rv.author}</span>
          <span className="rv-date">{rv.date}</span>
        </div>
        <span className="rv-badge" style={{ background: opt.color }}>{rv.voteType}</span>
      </div>
      <p className="rv-text">{rv.text}</p>
      <div className="rv-card-actions">
        <button
          className={`rv-like-btn ${isLiked ? 'rv-like-btn--active' : ''}`}
          onClick={() => onLike(rv.id)}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '16px', fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          {rv.likes}
        </button>
        <button className="rv-comment-btn">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat_bubble</span>
          {rv.comments}
        </button>
        {/* Delete own review */}
        {isOwnReview && onDelete && (
          <button
            className="rv-like-btn"
            onClick={() => onDelete(rv.id)}
            title="Delete your review"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
          </button>
        )}
        {/* Report other user's review */}
        {!isOwnReview && onReport && (
          <button
            className="rv-like-btn"
            onClick={() => onReport(rv.id)}
            title="Report this review"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>flag</span>
          </button>
        )}
      </div>
    </div>
  )
})
