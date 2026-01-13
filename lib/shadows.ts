/**
 * Centralized Shadow System
 *
 * This module provides a consistent shadow system used throughout the application.
 * Use these constants instead of hardcoding shadow values to ensure visual consistency.
 *
 * Shadow Categories:
 * - elevation: Floating UI elements (cards, headers, modals)
 * - glow: Accent/CTA elements with colored glow effects
 * - interactive: Hover states for clickable elements
 * - ui: Standard UI component shadows (inputs, buttons)
 */

// =============================================================================
// ELEVATION SHADOWS
// Used for floating/elevated UI elements like cards, headers, popovers
// =============================================================================

export const SHADOW_ELEVATION = {
  /** Subtle elevation for cards and containers */
  sm: {
    light: "0 4px 16px rgba(0, 0, 0, 0.08)",
    dark: "0 4px 16px rgba(0, 0, 0, 0.25)",
    class: "shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)]",
  },
  /** Medium elevation for floating headers, toggles */
  md: {
    light: "0 8px 32px rgba(0, 0, 0, 0.12)",
    dark: "0 8px 32px rgba(0, 0, 0, 0.4)",
    class: "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  },
  /** Large elevation for modals, dialogs, emphasized cards */
  lg: {
    light: "0 12px 40px rgba(0, 0, 0, 0.15)",
    dark: "0 12px 40px rgba(0, 0, 0, 0.5)",
    class: "shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
  },
} as const;

// =============================================================================
// GLOW SHADOWS
// Used for CTAs and accent elements with colored glow effects
// =============================================================================

export const SHADOW_GLOW = {
  /** Primary emerald glow for main CTAs */
  emerald: {
    default: "0 0 30px rgba(16, 185, 129, 0.3)",
    hover: "0 0 40px rgba(16, 185, 129, 0.4)",
    class: "shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]",
  },
  /** Primary button glow (stronger) */
  emeraldStrong: {
    light: "0 4px 14px rgba(16, 185, 129, 0.4)",
    dark: "0 0 24px rgba(16, 185, 129, 0.5)",
    class: "shadow-[0_4px_14px_rgba(16,185,129,0.4)] dark:shadow-[0_0_24px_rgba(16,185,129,0.5)]",
  },
  /** Subtle primary-tinted shadow for interactive cards */
  primary: {
    default: "0 8px 24px rgba(var(--primary-rgb), 0.1)",
    class: "shadow-lg shadow-primary/10",
  },
} as const;

// =============================================================================
// INTERACTIVE SHADOWS
// Used for hover states on interactive elements
// =============================================================================

export const SHADOW_INTERACTIVE = {
  /** Card hover state - subtle lift */
  cardHover: {
    class: "hover:shadow-lg hover:shadow-primary/10",
  },
  /** Timeline/list item hover */
  listItemHover: {
    class: "shadow-lg shadow-primary/10",
  },
} as const;

// =============================================================================
// UI COMPONENT SHADOWS
// Standard shadows for form elements and basic UI
// =============================================================================

export const SHADOW_UI = {
  /** Input fields, sliders */
  input: "shadow-sm",
  /** Dropdowns, popovers, dialogs */
  dropdown: "shadow-lg",
  /** Cards (default) */
  card: "shadow-sm",
} as const;

// =============================================================================
// HELPER: Combined class strings for common use cases
// =============================================================================

export const shadowClasses = {
  /** Floating glass containers (headers, toggles) */
  glass: SHADOW_ELEVATION.md.class,

  /** Project/feature cards */
  card: SHADOW_ELEVATION.md.class,

  /** Card on hover */
  cardHover: SHADOW_ELEVATION.lg.class,

  /** Primary CTA buttons with glow */
  ctaGlow: SHADOW_GLOW.emerald.class,

  /** Primary landing buttons */
  landingButtonPrimary: SHADOW_GLOW.emeraldStrong.class,

  /** Experience/timeline items on hover */
  timelineHover: SHADOW_INTERACTIVE.listItemHover.class,
} as const;

// =============================================================================
// CSS CUSTOM PROPERTY VALUES (for use in globals.css)
// =============================================================================

export const shadowCSSVars = {
  "--shadow-elevation-sm": SHADOW_ELEVATION.sm.light,
  "--shadow-elevation-sm-dark": SHADOW_ELEVATION.sm.dark,
  "--shadow-elevation-md": SHADOW_ELEVATION.md.light,
  "--shadow-elevation-md-dark": SHADOW_ELEVATION.md.dark,
  "--shadow-elevation-lg": SHADOW_ELEVATION.lg.light,
  "--shadow-elevation-lg-dark": SHADOW_ELEVATION.lg.dark,
  "--shadow-glow-emerald": SHADOW_GLOW.emerald.default,
  "--shadow-glow-emerald-hover": SHADOW_GLOW.emerald.hover,
} as const;
