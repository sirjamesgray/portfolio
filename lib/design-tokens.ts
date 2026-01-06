/**
 * Centralized Design Tokens
 *
 * This file contains all design system constants used across the application.
 * Import from here to ensure consistency and enable easy updates.
 */

// =============================================================================
// SPACING
// =============================================================================
export const SPACING = {
  /** Page padding for mobile */
  pageMobile: "p-4",
  /** Page padding for desktop */
  pageDesktop: "p-8",
  /** Gap between cards/sections */
  cardGap: "gap-4",
  /** Standard card padding */
  cardPadding: "p-6",
  /** Compact card padding */
  cardPaddingCompact: "p-4",
} as const

// =============================================================================
// BORDER RADIUS
// =============================================================================
export const RADIUS = {
  /** Default card/container radius */
  card: "rounded-xl",
  /** Button radius */
  button: "rounded-lg",
  /** Small elements like badges */
  small: "rounded-md",
  /** Full circle */
  full: "rounded-full",
} as const

// =============================================================================
// STATUS COLORS
// =============================================================================
export const STATUS_COLORS = {
  // Project statuses
  lead: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  contacted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_progress: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  canceled: "bg-red-500/10 text-red-500 border-red-500/20",

  // Quote statuses
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  sent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-orange-500/10 text-orange-500 border-orange-500/20",

  // Invoice statuses
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  overdue: "bg-red-500/10 text-red-500 border-red-500/20",
} as const

export type StatusKey = keyof typeof STATUS_COLORS

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status as StatusKey] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

// =============================================================================
// ANIMATION
// =============================================================================
export const ANIMATION = {
  /** Spring animation for page transitions */
  pageTransition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 35,
  },
  /** Standard ease for reveals */
  reveal: {
    duration: 0.4,
    ease: "easeOut" as const,
  },
} as const

// =============================================================================
// BREAKPOINTS (matching Tailwind)
// =============================================================================
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================
export const Z_INDEX = {
  base: 0,
  dropdown: 40,
  sticky: 45,
  fixed: 50,
  modal: 60,
  popover: 70,
  toast: 80,
} as const

// =============================================================================
// ICON SIZES
// =============================================================================
export const ICON_SIZE = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
} as const

// =============================================================================
// TEXT STYLES
// =============================================================================
export const TEXT = {
  /** Section label (e.g., "MENU", "ACCOUNT") */
  sectionLabel: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
  /** Muted helper text */
  muted: "text-sm text-muted-foreground",
  /** Page title */
  pageTitle: "text-2xl font-bold tracking-tight",
  /** Card title */
  cardTitle: "text-lg font-semibold",
} as const

// =============================================================================
// COMMON CLASS COMBINATIONS
// =============================================================================
export const CLASSES = {
  /** Interactive list item */
  listItem: "flex items-center justify-between px-4 py-3 transition-colors",
  listItemActive: "bg-muted text-foreground",
  listItemInactive: "text-muted-foreground active:bg-muted/50 hover:bg-muted/50",

  /** Avatar/initial circle */
  avatar: "rounded-full bg-muted flex items-center justify-center",
  avatarSm: "h-8 w-8",
  avatarMd: "h-9 w-9",
  avatarLg: "h-10 w-10",
} as const
