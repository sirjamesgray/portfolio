"use client"

import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { BeforeAfterSlider } from "./before-after-slider"

interface CMSContentRendererProps {
  html: string
  className?: string
}

export function CMSContentRenderer({ html, className }: CMSContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootsRef = useRef<Map<Element, ReturnType<typeof createRoot>>>(new Map())

  useEffect(() => {
    if (!containerRef.current) return

    // Find all before/after elements and render React components into them
    const beforeAfterElements = containerRef.current.querySelectorAll("[data-before-after]")

    beforeAfterElements.forEach((element) => {
      const beforeImage = element.getAttribute("data-before") || ""
      const afterImage = element.getAttribute("data-after") || ""
      const beforeLabel = element.getAttribute("data-before-label") || "Before"
      const afterLabel = element.getAttribute("data-after-label") || "After"
      const mode = (element.getAttribute("data-mode") || "fill") as "fill" | "fit"
      const backgroundColor = element.getAttribute("data-background-color") || "#1a1a1a"

      if (beforeImage && afterImage) {
        // Clear the placeholder content
        element.innerHTML = ""
        element.className = "my-6"

        // Create a root and render the slider
        let root = rootsRef.current.get(element)
        if (!root) {
          root = createRoot(element)
          rootsRef.current.set(element, root)
        }

        root.render(
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
    })

    // Cleanup function - defer unmount to avoid race condition with React rendering
    return () => {
      const roots = Array.from(rootsRef.current.values())
      rootsRef.current.clear()

      // Use setTimeout to defer unmount outside of React's render cycle
      setTimeout(() => {
        roots.forEach((root) => {
          try {
            root.unmount()
          } catch {
            // Ignore errors if root was already unmounted
          }
        })
      }, 0)
    }
  }, [html])

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
