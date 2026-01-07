"use client"

import { useEffect, useRef, useId } from "react"
import { createRoot, Root } from "react-dom/client"
import { BeforeAfterSlider } from "./before-after-slider"

interface CMSContentRendererProps {
  html: string
  className?: string
}

export function CMSContentRenderer({ html, className }: CMSContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootsRef = useRef<Map<string, Root>>(new Map())
  const mountedRef = useRef(false)
  const instanceId = useId()

  useEffect(() => {
    if (!containerRef.current) return

    // Track which elements we're processing this render
    const currentElements = new Set<string>()

    // Find all before/after elements and render React components into them
    const beforeAfterElements = containerRef.current.querySelectorAll("[data-before-after]")

    beforeAfterElements.forEach((element, index) => {
      const elementId = `${instanceId}-ba-${index}`
      currentElements.add(elementId)

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

        // Get or create a root for this element
        let root = rootsRef.current.get(elementId)
        if (!root) {
          root = createRoot(element)
          rootsRef.current.set(elementId, root)
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

    mountedRef.current = true

    // Cleanup roots that are no longer needed
    rootsRef.current.forEach((root, id) => {
      if (!currentElements.has(id)) {
        root.unmount()
        rootsRef.current.delete(id)
      }
    })

    // Cleanup function
    return () => {
      // Only unmount if we're actually unmounting the component
      // Use a microtask to check if we're still mounted
      queueMicrotask(() => {
        if (!mountedRef.current) {
          rootsRef.current.forEach((root) => {
            try {
              root.unmount()
            } catch {
              // Ignore errors if already unmounted
            }
          })
          rootsRef.current.clear()
        }
      })
      mountedRef.current = false
    }
  }, [html, instanceId])

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
