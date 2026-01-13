/**
 * Centralized Card System
 *
 * Provides consistent card styling across the application.
 * Cards use the shadow system from lib/shadows.ts.
 *
 * Card Types:
 * - glass: Translucent cards with backdrop blur (landing page)
 * - solid: Opaque cards (dashboard, forms)
 * - interactive: Cards with hover states (clickable)
 * - static: Cards without hover effects (display only)
 *
 * Shadow behavior: sm (default) → md (hover)
 * Glass hover: becomes more opaque (white in light, brighter grey in dark)
 */

// =============================================================================
// CARD BASE STYLES
// =============================================================================

/** Base glass card - translucent with backdrop blur */
export const CARD_GLASS = {
  base: "rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl",
  shadow: "shadow-[var(--shadow-elevation-sm)]",
  full: "rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl shadow-[var(--shadow-elevation-sm)]",
} as const;

/** Solid card - opaque background */
export const CARD_SOLID = {
  base: "rounded-xl border border-border bg-card",
  shadow: "shadow-[var(--shadow-elevation-sm)]",
  full: "rounded-xl border border-border bg-card shadow-[var(--shadow-elevation-sm)]",
} as const;

// =============================================================================
// INTERACTIVE CARD STYLES (with hover)
// =============================================================================

/**
 * Interactive card - for clickable cards across the site
 * Glass-style with backdrop blur, subtle borders, and hover effects
 * Dark mode: Subtle emerald glow effect
 */
export const CARD_INTERACTIVE_SOLID = {
  base: "rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl transition-all duration-300 cursor-pointer",
  shadow: "shadow-[var(--shadow-elevation-sm)] dark:shadow-[0_0_20px_rgba(16,185,129,0.08)]",
  hover: "hover:border-primary/50 hover:shadow-[var(--shadow-elevation-md)] hover:bg-white/80 dark:hover:bg-card/80 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
  full: "rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-[var(--shadow-elevation-sm)] dark:shadow-[0_0_20px_rgba(16,185,129,0.08)] hover:border-primary/50 hover:shadow-[var(--shadow-elevation-md)] hover:bg-white/80 dark:hover:bg-card/80 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
} as const;

/** @deprecated Use CARD_INTERACTIVE_SOLID instead */
export const CARD_INTERACTIVE_GLASS = CARD_INTERACTIVE_SOLID;

// =============================================================================
// SPECIAL CARD VARIANTS
// =============================================================================

/**
 * Primary CTA card - emerald glow effect
 */
export const CARD_CTA = {
  base: "rounded-xl border border-emerald-600 bg-emerald-600 text-white transition-all duration-300",
  shadow: "shadow-[var(--shadow-glow-emerald)]",
  hover: "hover:bg-emerald-700 hover:shadow-[var(--shadow-glow-emerald-hover)]",
  full: "rounded-xl border border-emerald-600 bg-emerald-600 text-white transition-all duration-300 shadow-[var(--shadow-glow-emerald)] hover:bg-emerald-700 hover:shadow-[var(--shadow-glow-emerald-hover)]",
} as const;

/**
 * Featured/highlighted card - white bg in light mode with emerald glow
 */
export const CARD_FEATURED = {
  base: "rounded-2xl border border-emerald-600/40 bg-white dark:bg-emerald-500/5 transition-all duration-300",
  shadow: "shadow-[var(--shadow-glow-emerald)]",
  hover: "hover:border-emerald-600/60 hover:shadow-[var(--shadow-glow-emerald-hover)]",
  full: "rounded-2xl border border-emerald-600/40 bg-white dark:bg-emerald-500/5 transition-all duration-300 shadow-[var(--shadow-glow-emerald)] hover:border-emerald-600/60 hover:shadow-[var(--shadow-glow-emerald-hover)]",
} as const;

/**
 * Crossed corners card - transparent fill with emerald crosses in corners
 * No rounded corners, no background, no shadow - just thin borders with brighter corner crosses
 * Requires CrossedCornersCard component for the corner decorations
 */
export const CARD_CROSSED_CORNERS = {
  base: "relative border border-emerald-500/30 bg-transparent transition-all duration-300",
  hover: "hover:border-emerald-500/50",
  full: "relative border border-emerald-500/30 bg-transparent transition-all duration-300 hover:border-emerald-500/50",
} as const;

// =============================================================================
// HELPER: Card class builder
// =============================================================================

export type CardVariant = "glass" | "solid" | "interactive" | "cta" | "featured" | "crossed-corners";

const cardVariants = {
  "glass": CARD_GLASS.full,
  "solid": CARD_SOLID.full,
  "interactive": CARD_INTERACTIVE_SOLID.full,
  "cta": CARD_CTA.full,
  "featured": CARD_FEATURED.full,
  "crossed-corners": CARD_CROSSED_CORNERS.full,
} as const;

/**
 * Get card classes by variant name
 */
export function getCardClasses(variant: CardVariant): string {
  return cardVariants[variant];
}

// =============================================================================
// CSS CUSTOM PROPERTIES (if needed in globals.css)
// =============================================================================

export const cardCSSVars = {
  "--card-glass-bg": "var(--card) / 50%",
  "--card-border-default": "rgba(255, 255, 255, 0.1)",
  "--card-border-hover": "rgba(var(--primary-rgb), 0.5)",
} as const;
