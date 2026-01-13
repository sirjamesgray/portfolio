import React, { ComponentPropsWithoutRef, CSSProperties } from "react"

import { cn } from "@/lib/utils"

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  default: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const

const variantStyles = {
  default: {
    background: "rgba(0, 0, 0, 1)",
    shimmerColor: "#ffffff",
    textColor: "text-white",
    borderColor: "border-white/10",
  },
  primary: {
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    shimmerColor: "#34d399",
    textColor: "text-white",
    borderColor: "border-white/10",
  },
  secondary: {
    background: "rgba(255, 255, 255, 1)",
    shimmerColor: "#d1d5db",
    textColor: "text-gray-900 dark:text-gray-100",
    borderColor: "border-gray-200 dark:border-gray-700",
    darkBackground: "rgba(39, 39, 42, 1)",
  },
} as const

export interface LandingButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
  size?: keyof typeof sizeStyles
  variant?: keyof typeof variantStyles
}

export const LandingButton = React.forwardRef<
  HTMLButtonElement,
  LandingButtonProps
>(
  (
    {
      shimmerColor,
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background,
      className,
      children,
      size = "default",
      variant = "default",
      ...props
    },
    ref
  ) => {
    // Use variant defaults, but allow explicit overrides
    const variantConfig = variantStyles[variant]
    const resolvedBackground = background ?? variantConfig.background
    const resolvedShimmerColor = shimmerColor ?? variantConfig.shimmerColor

    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": resolvedShimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": resolvedBackground,
            "--bg-dark": "darkBackground" in variantConfig ? variantConfig.darkBackground : resolvedBackground,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border whitespace-nowrap font-semibold [background:var(--bg)] dark:[background:var(--bg-dark)]",
          "transform-gpu transition-all duration-300 ease-in-out active:translate-y-px",
          sizeStyles[size],
          variantConfig.textColor,
          variantConfig.borderColor,
          // Light mode: green glow on primary, subtle shadow on secondary
          // Dark mode: green glow on primary only
          // Hover: intensify green glow on primary
          variant === "primary" && "shadow-[var(--shadow-glow-emerald-strong)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_60px_rgba(16,185,129,0.3)]",
          variant === "secondary" && "shadow-[0_4px_14px_rgba(0,0,0,0.1)] dark:shadow-none",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "[container-type:size] absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",

            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",

            // transition
            "transform-gpu transition-all duration-300 ease-in-out",

            // on hover
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",

            // on click
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)] dark:[background:var(--bg-dark)]"
          )}
        />
      </button>
    )
  }
)

LandingButton.displayName = "LandingButton"
