import React, { useState, useEffect, useMemo } from 'react'
import BrandLogo from '../BrandLogo'

export const METER_OPTIONS = [
  { label: 'Skip' as const, color: '#f06595' },
  { label: 'Timepass' as const, color: '#f59e0b' },
  { label: 'Go for it' as const, color: '#10b981' },
  { label: 'Perfection' as const, color: '#8b5cf6' },
]

interface CinemaMeterProps {
  contentId: number
  refreshKey?: number
}

export const CinemaMeter: React.FC<CinemaMeterProps> = React.memo(
  ({ contentId, refreshKey = 0 }) => {
    const [voteCounts, setVoteCounts] = useState<Record<string, number>>({
      Skip: 0,
      Timepass: 0,
      'Go for it': 0,
      Perfection: 0,
    })
    const [total, setTotal] = useState(0)
    const [userVote, setUserVote] = useState<string | null>(null)
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
    const [localLoading, setLocalLoading] = useState(true)

    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'

    const getToken = () => localStorage.getItem('accessToken')

    // Fetch meter data
    const fetchMeter = async () => {
      try {
        setLocalLoading(true)
        const res = await fetch(`${apiUrl}/api/content/${contentId}/meter`)
        const data = await res.json()
        if (data.success) {
          setVoteCounts(data.data.votes)
          setTotal(data.data.total)
          setUserVote(data.data.userVote)
        }
      } catch (err) {
        console.error('Failed to fetch meter:', err)
      } finally {
        setLocalLoading(false)
      }
    }

    useEffect(() => {
      if (contentId) fetchMeter()
    }, [contentId])

    // Refetch when refreshKey changes (e.g. after a review is posted)
    useEffect(() => {
      if (contentId && refreshKey > 0) fetchMeter()
    }, [refreshKey])

    const handleVote = async (idx: number) => {
      const token = getToken()
      if (!token) return

      const voteType = METER_OPTIONS[idx].label

      try {
        const res = await fetch(`${apiUrl}/api/content/${contentId}/meter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ voteType }),
        })
        const data = await res.json()
        if (data.success) {
          // Refetch to get accurate counts
          fetchMeter()
        }
      } catch (err) {
        console.error('Failed to submit vote:', err)
      }
    }

    const pcts = useMemo(() => {
      const t = total || 1
      return METER_OPTIONS.map((_, i) => {
        const label = METER_OPTIONS[i].label
        return voteCounts[label] / t
      })
    }, [voteCounts, total])

    const maxIdx = useMemo(() => {
      let max = 0
      for (let i = 1; i < METER_OPTIONS.length; i++) {
        const label = METER_OPTIONS[i].label
        const maxLabel = METER_OPTIONS[max].label
        if (voteCounts[label] > voteCounts[maxLabel]) {
          max = i
        }
      }
      return max
    }, [voteCounts])

    const segments = useMemo(() => {
      const cx = 250,
        cy = 220,
        R = 210,
        innerR = 185,
        GAP = 0.035,
        LIFT = 10
      let angle = Math.PI
      const cos = Math.cos,
        sin = Math.sin

      return pcts.map((pct) => {
        const sweep = pct * Math.PI - GAP
        const a1 = angle + GAP / 2
        const a2 = a1 + sweep
        const mid = a1 + sweep / 2
        const large = sweep > Math.PI / 2 ? 1 : 0

        const path =
          `M ${cx + R * cos(a1)} ${cy + R * sin(a1)} ` +
          `A ${R} ${R} 0 ${large} 1 ${cx + R * cos(a2)} ${cy + R * sin(a2)} ` +
          `L ${cx + innerR * cos(a2)} ${cy + innerR * sin(a2)} ` +
          `A ${innerR} ${innerR} 0 ${large} 0 ${cx + innerR * cos(a1)} ${cy + innerR * sin(a1)} Z`

        const tx = cos(mid) * LIFT
        const ty = sin(mid) * LIFT
        angle += pct * Math.PI
        return { path, tx, ty, pct: Math.round(pct * 100) }
      })
    }, [pcts])

    const displayIdx = hoveredIdx ?? maxIdx

    if (localLoading && total === 0) {
      return (
        <section className="cm-section">
          <div className="cm-inner">
            <h2 className="cm-title flex items-center gap-2">
              <BrandLogo imgClassName="h-5 w-auto" />
              <span>Meter</span>
            </h2>
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="cm-section">
        <div className="cm-inner">
          <h2 className="cm-title flex items-center gap-2">
            <BrandLogo imgClassName="h-5 w-auto" />
            <span>Meter</span>
          </h2>

          <div className="cm-gauge-wrap">
            <svg
              width="100%"
              height="240"
              viewBox="0 0 500 240"
              style={{ maxWidth: '500px', overflow: 'visible' }}
            >
              {segments.map((seg, i) => (
                <g key={i}>
                  <path
                    d={seg.path}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => handleVote(i)}
                  />
                  <path
                    d={seg.path}
                    fill={METER_OPTIONS[i].color}
                    opacity={userVote !== null && userVote !== METER_OPTIONS[i].label ? 0.35 : 1}
                    pointerEvents="none"
                    style={{
                      transition:
                        'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s',
                      transform:
                        hoveredIdx === i ? `translate(${seg.tx}px, ${seg.ty}px)` : 'translate(0,0)',
                      willChange: 'transform, opacity',
                    }}
                  />
                </g>
              ))}
              <g pointerEvents="none">
                <text
                  x="250"
                  y="185"
                  textAnchor="middle"
                  fill={METER_OPTIONS[displayIdx].color}
                  fontSize="48"
                  fontWeight="900"
                  fontFamily="Inter,sans-serif"
                  style={{ transition: 'fill 0.3s' }}
                >
                  {segments[displayIdx].pct}%
                </text>
                <text
                  x="250"
                  y="210"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="14"
                  fontWeight="500"
                  fontFamily="Inter,sans-serif"
                >
                  {hoveredIdx !== null
                    ? METER_OPTIONS[hoveredIdx].label
                    : `${total.toLocaleString()} votes`}
                </text>
              </g>
            </svg>
          </div>

          <div className="cm-legend">
            {METER_OPTIONS.map((opt, i) => (
              <div key={i} className="cm-legend-item">
                <span className="cm-dot" style={{ background: opt.color }} />
                <span className="cm-legend-label">{opt.label}</span>
                <span className="cm-legend-pct" style={{ color: opt.color }}>
                  {segments[i].pct}%
                </span>
              </div>
            ))}
          </div>

          <div className="cm-vote-btns">
            {METER_OPTIONS.map((opt, i) => (
              <button
                key={i}
                className={`cm-vote-btn ${userVote === opt.label ? 'cm-vote-btn--active' : ''}`}
                style={{ '--vote-color': opt.color } as React.CSSProperties}
                onClick={() => handleVote(i)}
              >
                {opt.label}
                {userVote === opt.label ? ' ✓' : ''}
              </button>
            ))}
          </div>

          {userVote && (
            <p className="cm-voted-msg">
              Your vote:{' '}
              <span
                style={{
                  color: METER_OPTIONS.find((o) => o.label === userVote)?.color,
                  fontWeight: 700,
                }}
              >
                {userVote}
              </span>
              . Click again to unvote.
            </p>
          )}
          {!localStorage.getItem('accessToken') && (
            <p
              className="cm-voted-msg"
              style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}
            >
              Sign in to vote on the
              <span className="inline-flex items-center gap-1 mx-1">
                <BrandLogo imgClassName="h-3 w-auto" />
                <span>Meter</span>
              </span>
            </p>
          )}
        </div>
      </section>
    )
  },
)
