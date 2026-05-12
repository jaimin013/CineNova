import React, { useState, useMemo } from 'react'

export const METER_OPTIONS = [
  { label: 'Skip' as const,       color: '#f06595' },
  { label: 'Timepass' as const,   color: '#f59e0b' },
  { label: 'Go for it' as const,  color: '#10b981' },
  { label: 'Perfection' as const, color: '#8b5cf6' },
]

export const CinemaMeter: React.FC = React.memo(() => {
  const [votes, setVotes] = useState([176, 213, 272, 74])
  const [userVote, setUserVote] = useState<number | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  
  const total = useMemo(() => votes.reduce((a, b) => a + b, 0), [votes])
  const pcts = useMemo(() => votes.map((v) => v / total), [votes, total])
  
  const segments = useMemo(() => {
    const cx = 250, cy = 220, R = 210, innerR = 185, GAP = 0.035, LIFT = 10
    let angle = Math.PI  // start at LEFT
    const cos = Math.cos, sin = Math.sin
    
    return pcts.map((pct, i) => {
      const sweep = pct * Math.PI - GAP
      const a1 = angle + GAP / 2
      const a2 = a1 + sweep
      const mid = a1 + sweep / 2
      const large = sweep > Math.PI / 2 ? 1 : 0

      const path =
        `M ${cx+R*cos(a1)} ${cy+R*sin(a1)} ` +
        `A ${R} ${R} 0 ${large} 1 ${cx+R*cos(a2)} ${cy+R*sin(a2)} ` +
        `L ${cx+innerR*cos(a2)} ${cy+innerR*sin(a2)} ` +
        `A ${innerR} ${innerR} 0 ${large} 0 ${cx+innerR*cos(a1)} ${cy+innerR*sin(a1)} Z`
      
      const tx = cos(mid) * LIFT
      const ty = sin(mid) * LIFT
      angle += pct * Math.PI
      return { path, tx, ty, pct: Math.round(pct * 100) }
    })
  }, [pcts])
  
  const maxIdx = useMemo(() => votes.indexOf(Math.max(...votes)), [votes])
  const displayIdx = hoveredIdx ?? maxIdx
  
  const handleVote = (idx: number) => {
    if (userVote === idx) { 
      setVotes((p) => p.map((v,i) => i===idx ? v-1 : v))
      setUserVote(null) 
    }
    else { 
      setVotes((p) => p.map((v,i) => i===idx ? v+1 : i===userVote ? v-1 : v))
      setUserVote(idx) 
    }
  }
  
  return (
    <section className="cm-section">
      <div className="cm-inner">
        <h2 className="cm-title">CineNova Meter</h2>

        <div className="cm-gauge-wrap">
          <svg width="100%" height="240" viewBox="0 0 500 240" style={{ maxWidth: '500px', overflow: 'visible' }}>
            {segments.map((seg, i) => (
              <g key={i}>
                {/* Invisible hit area */}
                <path 
                  d={seg.path} 
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => handleVote(i)}
                />
                {/* Visual segment */}
                <path 
                  d={seg.path} 
                  fill={METER_OPTIONS[i].color}
                  opacity={userVote !== null && userVote !== i ? 0.35 : 1}
                  pointerEvents="none"
                  style={{ 
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s',
                    transform: hoveredIdx === i ? `translate(${seg.tx}px, ${seg.ty}px)` : 'translate(0,0)',
                    willChange: 'transform, opacity'
                  }} 
                />
              </g>
            ))}
            <g pointerEvents="none">
              <text x="250" y="185" textAnchor="middle"
                fill={METER_OPTIONS[displayIdx].color}
                fontSize="48" fontWeight="900" fontFamily="Inter,sans-serif"
                style={{ transition: 'fill 0.3s' }}>
                {segments[displayIdx].pct}%
              </text>
              <text x="250" y="210" textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="14" fontWeight="500" fontFamily="Inter,sans-serif">
                {hoveredIdx !== null ? METER_OPTIONS[hoveredIdx].label : `${votes[maxIdx].toLocaleString()}/${total.toLocaleString()} Votes`}
              </text>
            </g>
          </svg>
        </div>

        <div className="cm-legend">
          {METER_OPTIONS.map((opt, i) => (
            <div key={i} className="cm-legend-item">
              <span className="cm-dot" style={{ background: opt.color }} />
              <span className="cm-legend-label">{opt.label}</span>
              <span className="cm-legend-pct" style={{ color: opt.color }}>{segments[i].pct}%</span>
            </div>
          ))}
        </div>

        <div className="cm-vote-btns">
          {METER_OPTIONS.map((opt, i) => (
            <button 
              key={i}
              className={`cm-vote-btn ${userVote === i ? 'cm-vote-btn--active' : ''}`}
              style={{ '--vote-color': opt.color } as React.CSSProperties}
              onClick={() => handleVote(i)}
            >
              {opt.label}{userVote === i ? ' ✓' : ''}
            </button>
          ))}
        </div>

        {userVote !== null && (
          <p className="cm-voted-msg">
            Voted{' '}
            <span style={{ color: METER_OPTIONS[userVote].color, fontWeight: 700 }}>
              {METER_OPTIONS[userVote].label}
            </span>. Click again to unvote.
          </p>
        )}
      </div>
    </section>
  )
})
