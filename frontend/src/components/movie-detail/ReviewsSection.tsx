import React, { useState, useCallback, useMemo } from 'react'
import { METER_OPTIONS } from './CinemaMeter'

export interface Review {
  id: number
  author: string
  avatar: string
  text: string
  date: string
  likes: number
  comments: number
  voteType: 'Skip' | 'Timepass' | 'Go for it' | 'Perfection'
}

const MOCK_REVIEWS: Review[] = [
  { id: 1, author: 'dhrma_pvt',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dhrma',   text: 'Yes im biased towards my culture, im maratha, and he messed it up, we deserve a lot lot better than this.', date: '1 week ago', likes: 304, comments: 12, voteType: 'Skip' },
  { id: 2, author: 'BATMAN_1321',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=batman',  text: 'Yes i am biased for my culture... Movie mai kamiya hai i know isse better hona chahiye.. lekin mai apna itihaas badi screen pe dekh ke khush hota hu...', date: '1 week ago', likes: 138, comments: 28, voteType: 'Perfection' },
  { id: 3, author: 'ZenRyox',       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zenryox', text: 'Just Whyy?? Knowing the fact that the director can never capture the true essence, plot was good tho, rest characters did their job well too.', date: '1 week ago', likes: 89, comments: 14, voteType: 'Timepass' },
  { id: 4, author: 'CinematicSoul', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cinema',  text: 'Absolutely stunning visuals and a gripping storyline. One of the best films this year!', date: '2 days ago', likes: 42, comments: 7, voteType: 'Go for it' },
  { id: 5, author: 'ReelCritic',    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reel',    text: 'The character development is exceptional. Every scene feels intentional and meaningful.', date: '5 days ago', likes: 28, comments: 3, voteType: 'Timepass' },
]

export const ReviewsSection: React.FC = React.memo(() => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [draft, setDraft] = useState('')
  const [draftVote, setDraftVote] = useState<typeof METER_OPTIONS[0]['label'] | null>(null)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const MAX = 1000

  const handlePost = useCallback(() => {
    if (!draft.trim() || !draftVote) return
    setReviews((prev) => [{ 
      id: Date.now(), 
      author: 'You', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user', 
      text: draft.trim(), 
      date: 'Just now', 
      likes: 0, 
      comments: 0, 
      voteType: draftVote 
    }, ...prev])
    setDraft('')
    setDraftVote(null)
  }, [draft, draftVote])

  const toggleLike = useCallback((id: number) => {
    setLikedIds((p) => { 
      const n = new Set(p)
      const isLiked = n.has(id)
      isLiked ? n.delete(id) : n.add(id)
      return n 
    })
    setReviews((p) => p.map((r) => r.id === id ? { ...r, likes: likedIds.has(id) ? r.likes - 1 : r.likes + 1 } : r))
  }, [likedIds])

  return (
    <section className="rv-section">
      <div className="rv-inner">
        <div className="rv-header">
          <h2 className="rv-title">Reviews</h2>
          <div className="rv-filters">
            <button className="rv-filter-btn">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>swap_vert</span>
              Most Liked
            </button>
            <button className="rv-filter-btn">Show Spoilers</button>
            <button className="rv-filter-btn">Following Only</button>
          </div>
        </div>

        <div className="rv-composer">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="You" className="rv-composer-avatar" />
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
                disabled={!draft.trim() || !draftVote}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="rv-list">
          {reviews.map((rv) => (
            <ReviewCard 
              key={rv.id} 
              rv={rv} 
              isLiked={likedIds.has(rv.id)} 
              onLike={toggleLike} 
            />
          ))}
        </div>
      </div>
    </section>
  )
})

const ReviewCard: React.FC<{ rv: Review, isLiked: boolean, onLike: (id: number) => void }> = React.memo(({ rv, isLiked, onLike }) => {
  const opt = useMemo(() => METER_OPTIONS.find((o) => o.label === rv.voteType)!, [rv.voteType])
  
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
        <button className="rv-more-btn">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_horiz</span>
        </button>
      </div>
    </div>
  )
})
