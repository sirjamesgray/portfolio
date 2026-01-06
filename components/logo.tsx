"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizes = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
}

const containerSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
}

const svgSizes = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
}

/**
 * Jamie Gray Logo Component
 *
 * Uses the SVG from /public/logo.svg
 * Automatically adapts to light/dark mode:
 * - Light mode: logo is dark (inverted)
 * - Dark mode: logo is light (original white)
 */
export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClass = sizes[size]

  return (
    <img
      src="/logo.svg"
      alt="Jamie Gray"
      className={cn(
        sizeClass,
        "dark:invert-0 invert", // Invert in light mode, normal in dark mode
        className
      )}
    />
  )
}

/**
 * Inline SVG Logo Component with Gradient Background
 *
 * Logo is white on a rounded square with the accent gradient background
 * (emerald to green to teal - same as the hero "Jamie Gray" text)
 */
export function LogoSVG({ className, size = "md" }: LogoProps) {
  const containerClass = containerSizes[size]
  const svgClass = svgSizes[size]

  return (
    <div
      className={cn(
        containerClass,
        "flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 dark:from-emerald-500 dark:via-green-400 dark:to-teal-400",
        className
      )}
    >
      <svg
        viewBox="0 0 174 174"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={svgClass}
      >
        {/* J letter */}
        <path
          d="M72.5 13H15.5C49 13 72.5 34.5 72.5 64.473V13Z"
          fill="white"
        />
        <path
          d="M72.5 64.473V13H15.5C49 13 72.5 34.5 72.5 64.473ZM72.5 64.473V132.5C72.5 148.24 59.7401 161 44 161C28.2599 161 15.5 148.24 15.5 132.5V99.2569"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* G letter */}
        <path
          d="M116.79 99.2569H158.5V132.849C158.5 111.5 141 99.2569 116.79 99.2569Z"
          fill="white"
        />
        <path
          d="M158.5 55.473V41.5C158.5 25.7599 145.74 13 130 13C114.26 13 101.5 25.7599 101.5 41.5V55.473V132.5C101.5 148.24 114.436 161 130.176 161C145.723 161 158.5 148.397 158.5 132.849M158.5 132.849V99.2569H116.79C141 99.2569 158.5 111.5 158.5 132.849Z"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
