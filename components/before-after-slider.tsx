"use client"

import { useState, useRef, useCallback, useEffect } from "react"
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
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    handleMove(e.clientX)
  }, [handleMove])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  // Handle hover movement (works without clicking)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX)
  }, [handleMove])

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove)
      window.addEventListener("mouseup", handleEnd)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, handleMove])

  const isFitMode = mode === "fit"

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none",
        className
      )}
      style={isFitMode ? { backgroundColor } : undefined}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMove}
    >
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
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
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
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
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
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
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
    </div>
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
