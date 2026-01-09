"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  mode?: "fill" | "fit"
  backgroundColor?: string
  className?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  mode = "fill",
  backgroundColor = "#1a1a1a",
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"idle" | "expanding" | "expanded" | "collapsing">("idle")
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  // Track if user has moved the slider (to distinguish tap from drag)
  const [hasMoved, setHasMoved] = useState(false)
  const initialMousePos = useRef<{ x: number; y: number } | null>(null)

  // Store the collapsed element's position for animation
  const [collapsedRect, setCollapsedRect] = useState<DOMRect | null>(null)

  // Pan and zoom state
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const lastPanPosition = useRef({ x: 0, y: 0 })
  const lastTouchDistance = useRef<number | null>(null)

  // Track mount state for portal
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMove = useCallback((clientX: number, containerElement: HTMLDivElement | null) => {
    if (!containerElement || isAnimating) return

    const rect = containerElement.getBoundingClientRect()
    // Adjust for pan position and scale
    const adjustedX = (clientX - rect.left - position.x) / scale
    const containerWidth = rect.width / scale
    const percentage = Math.min(Math.max((adjustedX / containerWidth) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [position.x, scale, isAnimating])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isAnimating) return
    // Don't start slider drag if we're zoomed in (allow panning instead)
    if (scale > 1 && isFullscreen) {
      setIsPanning(true)
      lastPanPosition.current = { x: e.clientX, y: e.clientY }
      return
    }
    e.preventDefault()

    // Set initial position for move detection, but don't set isDragging yet
    // This allows the initial click to animate smoothly
    setHasMoved(false)
    initialMousePos.current = { x: e.clientX, y: e.clientY }
    const container = isFullscreen ? fullscreenRef.current : containerRef.current
    handleMove(e.clientX, container)

    // Set isDragging after a brief delay so initial position animates
    requestAnimationFrame(() => {
      setIsDragging(true)
    })
  }, [handleMove, isFullscreen, scale, isAnimating])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating) return
    // Handle pinch zoom with two fingers
    if (e.touches.length === 2 && isFullscreen) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      lastTouchDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      return
    }

    // Don't start slider drag if we're zoomed in (allow panning instead)
    if (scale > 1 && isFullscreen) {
      setIsPanning(true)
      lastPanPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      return
    }

    // Set initial position for move detection, but don't set isDragging yet
    // This allows the initial touch to animate smoothly
    setHasMoved(false)
    initialMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    const container = isFullscreen ? fullscreenRef.current : containerRef.current
    handleMove(e.touches[0].clientX, container)

    // Set isDragging after a brief delay so initial position animates
    requestAnimationFrame(() => {
      setIsDragging(true)
    })
  }, [handleMove, isFullscreen, scale, isAnimating])

  // Handle hover movement (works without clicking) - only when not zoomed
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isAnimating) return
    if (scale > 1 && isFullscreen) return
    const container = isFullscreen ? fullscreenRef.current : containerRef.current
    handleMove(e.clientX, container)
  }, [handleMove, isFullscreen, scale, isAnimating])

  // Handle wheel zoom in fullscreen
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isFullscreen || isAnimating) return
    e.preventDefault()

    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(scale * delta, 1), 5)

    // If zooming out to 1, reset position
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 })
    }

    setScale(newScale)
  }, [isFullscreen, scale, isAnimating])

  useEffect(() => {
    const MOVE_THRESHOLD = 5 // pixels of movement to count as a drag

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning && isFullscreen) {
        const deltaX = e.clientX - lastPanPosition.current.x
        const deltaY = e.clientY - lastPanPosition.current.y
        lastPanPosition.current = { x: e.clientX, y: e.clientY }
        setPosition(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
        return
      }
      if (isDragging) {
        // Check if we've moved enough to count as a drag
        if (initialMousePos.current) {
          const distance = Math.abs(e.clientX - initialMousePos.current.x)
          if (distance > MOVE_THRESHOLD) {
            setHasMoved(true)
          }
        }
        const container = isFullscreen ? fullscreenRef.current : containerRef.current
        handleMove(e.clientX, container)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Handle pinch zoom
      if (e.touches.length === 2 && isFullscreen && lastTouchDistance.current !== null) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
        const delta = distance / lastTouchDistance.current
        lastTouchDistance.current = distance

        const newScale = Math.min(Math.max(scale * delta, 1), 5)
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 })
        }
        setScale(newScale)
        return
      }

      if (isPanning && isFullscreen) {
        const deltaX = e.touches[0].clientX - lastPanPosition.current.x
        const deltaY = e.touches[0].clientY - lastPanPosition.current.y
        lastPanPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        setPosition(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
        return
      }

      if (isDragging) {
        // Check if we've moved enough to count as a drag
        if (initialMousePos.current) {
          const distance = Math.abs(e.touches[0].clientX - initialMousePos.current.x)
          if (distance > MOVE_THRESHOLD) {
            setHasMoved(true)
          }
        }
        const container = isFullscreen ? fullscreenRef.current : containerRef.current
        handleMove(e.touches[0].clientX, container)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
      setIsPanning(false)
      lastTouchDistance.current = null
      initialMousePos.current = null
    }

    if (isDragging || isPanning) {
      window.addEventListener("mousemove", handleGlobalMouseMove)
      window.addEventListener("mouseup", handleEnd)
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, isPanning, isFullscreen, handleMove, scale])

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen && !isAnimating) {
        closeFullscreen()
      }
    }

    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown)
      // Prevent body scroll when fullscreen is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isFullscreen, isAnimating])

  const openFullscreen = useCallback(() => {
    if (isAnimating) return

    // Capture the collapsed element's position
    if (containerRef.current) {
      setCollapsedRect(containerRef.current.getBoundingClientRect())
    }

    setIsAnimating(true)
    setAnimationPhase("expanding")
    setIsFullscreen(true)
    setScale(1)
    setPosition({ x: 0, y: 0 })

    // After a brief moment, transition to expanded state
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimationPhase("expanded")
        // Animation complete
        setTimeout(() => {
          setIsAnimating(false)
        }, 400)
      })
    })
  }, [isAnimating])

  const closeFullscreen = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    setAnimationPhase("collapsing")
    setScale(1)
    setPosition({ x: 0, y: 0 })

    // After animation completes, close
    setTimeout(() => {
      setIsFullscreen(false)
      setAnimationPhase("idle")
      setIsAnimating(false)
      setCollapsedRect(null)
    }, 400)
  }, [isAnimating])

  const isFitMode = mode === "fit"

  // Calculate animation styles
  const getAnimationStyles = (): React.CSSProperties => {
    if (!collapsedRect) {
      return {
        backgroundColor: isFitMode ? backgroundColor : "#000",
      }
    }

    const isExpanding = animationPhase === "expanding"
    const isCollapsing = animationPhase === "collapsing"

    if (isExpanding) {
      // Start from collapsed position
      return {
        backgroundColor: isFitMode ? backgroundColor : "#000",
        position: "fixed",
        top: collapsedRect.top,
        left: collapsedRect.left,
        width: collapsedRect.width,
        height: collapsedRect.height,
        borderRadius: "0.75rem",
        transition: "none",
      }
    }

    if (isCollapsing) {
      // Animate back to collapsed position
      return {
        backgroundColor: isFitMode ? backgroundColor : "#000",
        position: "fixed",
        top: collapsedRect.top,
        left: collapsedRect.left,
        width: collapsedRect.width,
        height: collapsedRect.height,
        borderRadius: "0.75rem",
        transition: "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
      }
    }

    // Expanded state
    return {
      backgroundColor: isFitMode ? backgroundColor : "#000",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      transition: "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
      transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
      transformOrigin: "center center",
    }
  }

  const renderSliderContent = (isFullscreenMode: boolean) => (
    <>
      {isFitMode ? (
        <>
          {/* Fit mode: Images with padding, rounded corners, shadows */}
          {/* After Image (Background - right side) */}
          <div className="absolute inset-0 p-6 flex items-center justify-center">
            <img
              src={afterImage}
              alt={afterLabel}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </div>

          {/* Before Image - clipped from right */}
          <div
            className="absolute inset-0 p-6 flex items-center justify-center"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              transition: isDragging ? "none" : "clip-path 0.15s ease-out",
            }}
          >
            <img
              src={beforeImage}
              alt={beforeLabel}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </div>
        </>
      ) : (
        <>
          {/* Fill mode: Images cover the entire container */}
          {/* After Image (Background) */}
          <img
            src={afterImage}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Before Image - clipped from right */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              transition: isDragging ? "none" : "clip-path 0.15s ease-out",
            }}
          >
            <img
              src={beforeImage}
              alt={beforeLabel}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </>
      )}

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
          transition: isDragging ? "none" : "left 0.15s ease-out",
        }}
      >
        {/* Handle Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-gray-600">
              <path d="M6 1L2 6L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-gray-600">
              <path d="M2 1L6 6L2 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs font-medium text-white">
        {beforeLabel}
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs font-medium text-white">
        {afterLabel}
      </div>
    </>
  )

  return (
    <>
      {/* Collapsed View (4:3 aspect ratio) - Drag/hover to slide, tap to expand */}
      <div
        ref={containerRef}
        className={cn(
          "relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none",
          isFullscreen && "invisible",
          className
        )}
        style={isFitMode ? { backgroundColor } : undefined}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => {
          if (!hasMoved && !isFullscreen) {
            openFullscreen()
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={() => {
          if (!hasMoved && !isFullscreen) {
            openFullscreen()
          }
        }}
      >
        {renderSliderContent(false)}
      </div>

      {/* Fullscreen Modal - rendered via portal to escape overflow:hidden containers */}
      {isMounted && isFullscreen && createPortal(
        <div
          ref={fullscreenRef}
          className="z-[9999] cursor-ew-resize select-none overflow-hidden"
          style={getAnimationStyles()}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          {renderSliderContent(true)}

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeFullscreen()
            }}
            className={cn(
              "absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all z-[10000]",
              animationPhase === "expanding" && "opacity-0",
              animationPhase === "expanded" && "opacity-100",
              animationPhase === "collapsing" && "opacity-0"
            )}
            style={{
              transition: "opacity 0.3s ease",
            }}
            aria-label="Close fullscreen"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Zoom indicator */}
          {scale > 1 && animationPhase === "expanded" && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm z-[10000]">
              {Math.round(scale * 100)}%
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

// Server component wrapper for rendering from HTML content
export function BeforeAfterSliderWrapper({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  mode,
  backgroundColor,
}: BeforeAfterSliderProps) {
  return (
    <BeforeAfterSlider
      beforeImage={beforeImage}
      afterImage={afterImage}
      beforeLabel={beforeLabel}
      afterLabel={afterLabel}
      mode={mode}
      backgroundColor={backgroundColor}
    />
  )
}
