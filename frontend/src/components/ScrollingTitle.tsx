import { useRef, useEffect, useState } from 'react'

interface ScrollingTitleProps {
  title: string
  className?: string
}

/**
 * ScrollingTitle
 * 
 * Automatically detects if text overflows its container and applies a marquee effect on hover.
 * Uses a robust measurement technique to ensure even slight overflows are detected.
 */
export default function ScrollingTitle({ title, className = '' }: ScrollingTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return

      // Create a hidden canvas-based measurer for maximum precision
      const container = containerRef.current
      const style = window.getComputedStyle(container)
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      if (context) {
        // Copy relevant styles for accurate measurement
        const fontWeight = style.getPropertyValue('font-weight') || '400'
        const fontSize = style.getPropertyValue('font-size') || '16px'
        const fontFamily = style.getPropertyValue('font-family') || 'Inter, sans-serif'
        const letterSpacing = style.getPropertyValue('letter-spacing') || 'normal'
        
        context.font = `${fontWeight} ${fontSize} ${fontFamily}`
        
        // Measure text
        const metrics = context.measureText(title)
        let textWidth = metrics.width

        // Adjust for letter spacing if it's a numeric value
        if (letterSpacing !== 'normal') {
          const spacingValue = parseFloat(letterSpacing)
          if (!isNaN(spacingValue)) {
            textWidth += (title.length - 1) * spacingValue
          }
        }

        // Account for text-transform: uppercase if applied
        const textTransform = style.getPropertyValue('text-transform')
        if (textTransform === 'uppercase') {
          const upperMetrics = context.measureText(title.toUpperCase())
          textWidth = upperMetrics.width
        }

        const containerWidth = container.clientWidth

        // DEBUG: If you're running locally, you could see these values
        // console.log(`Title: "${title}", Text: ${textWidth}px, Container: ${containerWidth}px`);

        // Trigger scroll if text is wider than container
        // We use a 0.5px threshold to handle sub-pixel rendering differences
        setShouldScroll(textWidth > containerWidth - 0.5)
      }
    }

    // Initial check after a short delay to ensure font loading and layout
    const timer = setTimeout(checkOverflow, 100)
    
    // Watch for container size changes (responsive layout)
    const observer = new ResizeObserver(checkOverflow)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [title])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap relative w-full block ${className}`}
      title={title} // Native tooltip as fallback
    >
      <div className={`${shouldScroll ? 'animate-marquee-hover' : ''} inline-block`}>
        {/* Render text twice for seamless loop, but only if it overflows */}
        <span className={`inline-block ${shouldScroll ? 'pr-12' : ''}`}>
          {title}
        </span>
        {shouldScroll && (
          <span className="inline-block pr-12">
            {title}
          </span>
        )}
      </div>
    </div>
  )
}
