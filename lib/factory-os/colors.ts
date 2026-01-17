// @ts-nocheck
// FactoryOS Home Lab - Color System

import { StageStatus, ProductStatus } from './types';

// Stage status colors
export const STAGE_STATUS_COLORS = {
  idle: {
    bg: 'bg-zinc-500/20',
    border: 'border-zinc-500/40',
    text: 'text-zinc-400',
    fill: '#71717a',
  },
  running: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/40',
    text: 'text-green-400',
    fill: '#22c55e',
  },
  completed: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    fill: '#3b82f6',
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/40',
    text: 'text-red-400',
    fill: '#ef4444',
  },
  queued: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    fill: '#eab308',
  },
} as const;

// Product status colors
export const PRODUCT_STATUS_COLORS = {
  researching: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
    fill: '#a855f7',
  },
  designing: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    fill: '#3b82f6',
  },
  printing: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    fill: '#f97316',
  },
  marketing: {
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/40',
    text: 'text-pink-400',
    fill: '#ec4899',
  },
  selling: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/40',
    text: 'text-green-400',
    fill: '#22c55e',
  },
  paused: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    fill: '#eab308',
  },
  retired: {
    bg: 'bg-zinc-500/20',
    border: 'border-zinc-500/40',
    text: 'text-zinc-400',
    fill: '#71717a',
  },
} as const;

// Pipeline stage colors (for the visual flow)
export const PIPELINE_COLORS = {
  research: '#a855f7',   // Purple
  design: '#3b82f6',     // Blue
  print: '#f97316',      // Orange
  market: '#ec4899',     // Pink
  sales: '#22c55e',      // Green
} as const;

// Marketplace colors
export const MARKETPLACE_COLORS = {
  amazon: '#ff9900',
  etsy: '#f56400',
  ebay: '#e53238',
  aliexpress: '#ff4747',
  thingiverse: '#248bfb',
} as const;

// Platform colors for marketing
export const PLATFORM_COLORS = {
  etsy: '#f56400',
  ebay: '#e53238',
  shopify: '#96bf48',
  instagram: '#e4405f',
  tiktok: '#000000',
  facebook: '#1877f2',
} as const;

// Get stage status colors
export function getStageStatusColors(status: StageStatus) {
  return STAGE_STATUS_COLORS[status];
}

// Get product status colors
export function getProductStatusColors(status: ProductStatus) {
  return PRODUCT_STATUS_COLORS[status];
}

// Get composite class string
export function getStageStatusClasses(status: StageStatus): string {
  const colors = STAGE_STATUS_COLORS[status];
  return `${colors.bg} ${colors.border} ${colors.text}`;
}

export function getProductStatusClasses(status: ProductStatus): string {
  const colors = PRODUCT_STATUS_COLORS[status];
  return `${colors.bg} ${colors.border} ${colors.text}`;
}

// Chart colors
export const CHART_COLORS = {
  revenue: '#22c55e',    // Green
  cost: '#ef4444',       // Red
  profit: '#3b82f6',     // Blue
  impressions: '#a855f7', // Purple
  conversions: '#ec4899', // Pink
  grid: '#27272a',
  axis: '#52525b',
  tooltip: '#18181b',
} as const;

// Profit margin color
export function getProfitMarginColor(margin: number): string {
  if (margin >= 50) return '#22c55e';  // Green - excellent
  if (margin >= 30) return '#3b82f6';  // Blue - good
  if (margin >= 15) return '#eab308';  // Yellow - okay
  return '#ef4444';                     // Red - poor
}

// Demand score color
export function getDemandColor(score: number): string {
  if (score >= 80) return '#22c55e';   // High demand
  if (score >= 50) return '#3b82f6';   // Medium demand
  if (score >= 30) return '#eab308';   // Low demand
  return '#71717a';                     // Very low
}

// Print progress color
export function getPrintProgressColor(progress: number): string {
  if (progress >= 90) return '#22c55e';
  if (progress >= 50) return '#3b82f6';
  if (progress >= 25) return '#f97316';
  return '#eab308';
}
