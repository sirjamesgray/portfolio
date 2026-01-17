/**
 * Centralized Card System
 *
 * Provides consistent card styling across the application.
 * Each card variant has a single accent color that defines:
 * - Border color
 * - Shadow/glow color
 * - CursorGlow color
 * - Sparkle color
 *
 * Card Types:
 * - glass: Translucent cards with backdrop blur (neutral)
 * - solid: Opaque cards (neutral)
 * - interactive: Clickable cards with emerald accent
 * - cta: Primary action cards with white sparkles (special case)
 * - featured: Highlighted cards with emerald accent
 * - warning: Yellow-themed cards
 * - destructive: Red-themed cards
 * - crossed-corners: Special emerald border style
 */

// =============================================================================
// CARD COLOR DEFINITIONS
// =============================================================================

/**
 * Card accent colors - the single source of truth for each card's theming
 *
 * Each color includes:
 * - hsl: For CursorGlow component
 * - sparkle: For TwinklingSparkles component
 * - rgb: RGB values for shadows
 */
export const CARD_COLORS = {
  neutral: {
    hsl: "hsl(0, 0%, 50%)",
    sparkle: "rgba(255, 255, 255, 0.8)",
    rgb: "128, 128, 128",
  },
  emerald: {
    hsl: "hsl(160, 84%, 39%)",
    sparkle: "rgba(16, 185, 129, 0.9)",
    rgb: "16, 185, 129",
  },
  yellow: {
    hsl: "hsl(45, 93%, 47%)",
    sparkle: "rgba(234, 179, 8, 0.9)",
    rgb: "234, 179, 8",
  },
  red: {
    hsl: "hsl(0, 85%, 60%)",
    sparkle: "rgba(239, 68, 68, 0.9)",
    rgb: "239, 68, 68",
  },
  /** CTA cards use white sparkles - the only exception */
  white: {
    hsl: "hsl(160, 84%, 39%)", // CursorGlow still uses emerald
    sparkle: "white",
    rgb: "255, 255, 255",
  },
} as const;

export type CardColor = keyof typeof CARD_COLORS;

// =============================================================================
// CARD BASE STYLES
// =============================================================================

/** Base glass card - translucent with backdrop blur */
export const CARD_GLASS = {
  base: "rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl",
  shadow: "shadow-[var(--shadow-elevation-sm)]",
  full: "rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl shadow-[var(--shadow-elevation-sm)]",
  color: "neutral" as CardColor,
} as const;

/** Solid card - opaque background */
export const CARD_SOLID = {
  base: "rounded-xl border border-border bg-card",
  shadow: "shadow-[var(--shadow-elevation-sm)]",
  full: "rounded-xl border border-border bg-card shadow-[var(--shadow-elevation-sm)]",
  color: "neutral" as CardColor,
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
  color: "emerald" as CardColor,
} as const;

/** @deprecated Use CARD_INTERACTIVE_SOLID instead */
export const CARD_INTERACTIVE_GLASS = CARD_INTERACTIVE_SOLID;

// =============================================================================
// SPECIAL CARD VARIANTS
// =============================================================================

/**
 * Primary CTA card - emerald filled card
 * ONLY card type with white sparkles
 */
export const CARD_CTA = {
  base: "rounded-xl border border-emerald-600 bg-emerald-600 text-white transition-all duration-300",
  shadow: "shadow-[var(--shadow-glow-emerald)]",
  hover: "hover:bg-emerald-700 hover:shadow-[var(--shadow-glow-emerald-hover)]",
  full: "rounded-xl border border-emerald-600 bg-emerald-600 text-white transition-all duration-300 shadow-[var(--shadow-glow-emerald)] hover:bg-emerald-700 hover:shadow-[var(--shadow-glow-emerald-hover)]",
  color: "white" as CardColor, // White sparkles for CTA
} as const;

/**
 * Featured/highlighted card - white bg in light mode with emerald glow
 */
export const CARD_FEATURED = {
  base: "rounded-2xl border border-emerald-600/40 bg-white dark:bg-emerald-500/5 transition-all duration-300",
  shadow: "shadow-[var(--shadow-glow-emerald)]",
  hover: "hover:border-emerald-600/60 hover:shadow-[var(--shadow-glow-emerald-hover)]",
  full: "rounded-2xl border border-emerald-600/40 bg-white dark:bg-emerald-500/5 transition-all duration-300 shadow-[var(--shadow-glow-emerald)] hover:border-emerald-600/60 hover:shadow-[var(--shadow-glow-emerald-hover)]",
  color: "emerald" as CardColor,
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
  color: "emerald" as CardColor,
} as const;

/**
 * Warning/highlight card - yellow-themed for important callouts
 * Light mode: Transparent with yellow outlines
 * Dark mode: Subtle yellow tint with yellow glow
 */
export const CARD_WARNING = {
  base: "rounded-2xl border border-yellow-500/40 bg-card/50 dark:bg-yellow-500/5 backdrop-blur-xl transition-all duration-300",
  shadow: "shadow-[var(--shadow-elevation-sm)] dark:shadow-[0_0_20px_rgba(234,179,8,0.15)]",
  hover: "hover:border-yellow-500/60 hover:shadow-[var(--shadow-elevation-md)] hover:bg-white/80 dark:hover:bg-yellow-500/10 dark:hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]",
  full: "rounded-2xl border border-yellow-500/40 bg-card/50 dark:bg-yellow-500/5 backdrop-blur-xl transition-all duration-300 shadow-[var(--shadow-elevation-sm)] dark:shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:border-yellow-500/60 hover:shadow-[var(--shadow-elevation-md)] hover:bg-white/80 dark:hover:bg-yellow-500/10 dark:hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]",
  color: "yellow" as CardColor,
} as const;

/**
 * Destructive card - red-themed for problem/warning sections
 * Light mode: Transparent with red outlines (no red fill)
 * Dark mode: Subtle red tint with red glow
 */
export const CARD_DESTRUCTIVE = {
  base: "rounded-2xl border border-red-500/40 bg-card/50 dark:bg-red-500/5 backdrop-blur-xl transition-all duration-300",
  shadow: "shadow-[var(--shadow-elevation-sm)] dark:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  hover: "hover:border-red-500/60 hover:shadow-[var(--shadow-elevation-md)] hover:bg-white/80 dark:hover:bg-red-500/10 dark:hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]",
  full: "rounded-2xl border border-red-500/40 bg-card/50 dark:bg-red-500/5 backdrop-blur-xl transition-all duration-300 shadow-[var(--shadow-elevation-sm)] dark:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-red-500/60 hover:shadow-[var(--shadow-elevation-md)] hover:bg-white/80 dark:hover:bg-red-500/10 dark:hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]",
  color: "red" as CardColor,
} as const;

// =============================================================================
// HELPER: Card class and color builders
// =============================================================================

export type CardVariant = "glass" | "solid" | "interactive" | "cta" | "featured" | "crossed-corners" | "warning" | "destructive";

const cardVariants = {
  "glass": CARD_GLASS,
  "solid": CARD_SOLID,
  "interactive": CARD_INTERACTIVE_SOLID,
  "cta": CARD_CTA,
  "featured": CARD_FEATURED,
  "crossed-corners": CARD_CROSSED_CORNERS,
  "warning": CARD_WARNING,
  "destructive": CARD_DESTRUCTIVE,
} as const;

/**
 * Get card classes by variant name
 */
export function getCardClasses(variant: CardVariant): string {
  return cardVariants[variant].full;
}

/**
 * Get card color configuration by variant name
 * Returns the color values for CursorGlow, TwinklingSparkles, etc.
 */
export function getCardColor(variant: CardVariant): typeof CARD_COLORS[CardColor] {
  const colorKey = cardVariants[variant].color;
  return CARD_COLORS[colorKey];
}

/**
 * Get the full card configuration including classes and colors
 */
export function getCard(variant: CardVariant) {
  const card = cardVariants[variant];
  const colors = CARD_COLORS[card.color];
  return {
    classes: card.full,
    base: card.base,
    color: card.color,
    cursorGlow: colors.hsl,
    sparkle: colors.sparkle,
    rgb: colors.rgb,
  };
}

// =============================================================================
// CSS CUSTOM PROPERTIES (if needed in globals.css)
// =============================================================================

export const cardCSSVars = {
  "--card-glass-bg": "var(--card) / 50%",
  "--card-border-default": "rgba(255, 255, 255, 0.1)",
  "--card-border-hover": "rgba(var(--primary-rgb), 0.5)",
} as const;
