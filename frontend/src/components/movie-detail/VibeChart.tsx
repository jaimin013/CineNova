import React, { useState, useMemo } from 'react'

const VIBE_CATEGORIES = [
  { label: 'Drama',     color: '#7c3aed' },
  { label: 'Action',    color: '#ef4444' },
  { label: 'Thriller',  color: '#3b5bdb' },
  { label: 'Romance',   color: '#f06595' },
  { label: 'Comedy',    color: '#f59e0b' },
  { label: 'Emotional', color: '#d4d4d4' },
]

interface VibeChartProps {
  genres: string[]
}

export const VibeChart: React.FC<VibeChartProps> = React.memo(({ genres }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  
  const scores = useMemo(() => VIBE_CATEGORIES.map((cat) => {
    const isMatch = genres.some((g) => g.toLowerCase().includes(cat.label.toLowerCase()))
    const seed = cat.label.charCodeAt(0) + (cat.label.charCodeAt(1) || 0)
    return isMatch ? 30 + (seed % 35) : 5 + (seed % 22)
  }), [genres])
  
  const total = useMemo(() => scores.reduce((a, b) => a + b, 0), [scores])
  const percentages = useMemo(() => scores.map((s) => s / total), [scores, total])
  
  const segments = useMemo(() => {
    const cx = 110, cy = 110, outerR = 90, innerR = 56, GAP = 0.03, LIFT = 10
    let startAngle = -Math.PI / 2
    
    return percentages.map((pct) => {
      const sweep = pct * Math.PI * 2 - GAP
      const s = startAngle + GAP / 2, e = s + sweep, mid = s + sweep / 2
      const px = (a: number, r: number) => cx + r * Math.cos(a)
      const py = (a: number, r: number) => cy + r * Math.sin(a)
      const large = sweep > Math.PI ? 1 : 0
      const path = `M ${px(s,outerR)} ${py(s,outerR)} A ${outerR} ${outerR} 0 ${large} 1 ${px(e,outerR)} ${py(e,outerR)} L ${px(e,innerR)} ${py(e,innerR)} A ${innerR} ${innerR} 0 ${large} 0 ${px(s,innerR)} ${py(s,innerR)} Z`
      const tx = Math.cos(mid) * LIFT, ty = Math.sin(mid) * LIFT
      startAngle += pct * Math.PI * 2
      return { path, tx, ty, pct: Math.round(pct * 100) }
    })
  }, [percentages])
  
  const activeIdx = hoveredIdx ?? 0
  
  return (
    <div className="vc-wrapper">
      <svg width="220" height="220" viewBox="0 0 220 220">
        {segments.map((seg, i) => (
          <path 
            key={i} 
            d={seg.path} 
            fill={VIBE_CATEGORIES[i].color}
            style={{ 
              transform: hoveredIdx === i ? `translate(${seg.tx}px,${seg.ty}px)` : 'translate(0,0)', 
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)', 
              cursor: 'pointer',
              willChange: 'transform'
            }}
            onMouseEnter={() => setHoveredIdx(i)} 
            onMouseLeave={() => setHoveredIdx(null)} 
          />
        ))}
        <text x={110} y={100} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">
          {VIBE_CATEGORIES[activeIdx].label}
        </text>
        <text x={110} y={126} textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="900" fontFamily="Inter,sans-serif">
          {segments[activeIdx].pct}%
        </text>
      </svg>
      <div className="vc-legend">
        {VIBE_CATEGORIES.map((cat, i) => (
          <div 
            key={i} 
            className="vc-legend-row" 
            onMouseEnter={() => setHoveredIdx(i)} 
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span className="vc-dot" style={{ background: cat.color }} />
            <span className="vc-label-name">{cat.label}</span>
            <span className="vc-label-pct">{segments[i].pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
})
