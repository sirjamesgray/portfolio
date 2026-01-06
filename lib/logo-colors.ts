/**
 * Centralized color configuration for the 3D glass logo
 * Edit these values to adjust the logo appearance in light/dark modes
 *
 * Colors use RGBA format for transparency control:
 * - rgba(r, g, b, a) where a is 0-1 for opacity
 * - Hex colors are converted to rgba in getLogoColors()
 */

export const LOGO_3D_COLORS = {
  light: {
    // Glass cube colors
    fill: {
      base: "rgba(255, 255, 255, 0.1)",      // Nearly transparent white
      attenuation: "rgba(167, 243, 208, 0.3)", // emerald-200 with 30% opacity
    },
    // Logo (JG letters) colors
    logo: {
      color: "rgba(4, 120, 87, 1)",           // emerald-700 solid
      emissive: "rgba(0, 0, 0, 0)",           // No glow
      emissiveIntensity: 0,
    },
  },
  dark: {
    // Glass cube colors
    fill: {
      base: "rgba(16, 185, 129, 0.15)",       // emerald-500 at 15% opacity
      attenuation: "rgba(52, 211, 153, 0.4)", // emerald-400 at 40% opacity
    },
    // Logo (JG letters) colors
    logo: {
      color: "rgba(110, 231, 183, 1)",        // emerald-300 solid
      emissive: "rgba(52, 211, 153, 1)",      // emerald-400 glow
      emissiveIntensity: 1.2,                 // Stronger glow for additive effect
    },
  },
} as const

// Type for theme colors used by the 3D components
export interface Logo3DThemeColors {
  cube: string
  cubeAttenuation: string
  logo: string
  logoEmissive: string
  logoEmissiveIntensity: number
}

// Helper to convert the config to the format used by 3D components
export function getLogoColors(isDark: boolean): Logo3DThemeColors {
  const theme = isDark ? LOGO_3D_COLORS.dark : LOGO_3D_COLORS.light
  return {
    cube: theme.fill.base,
    cubeAttenuation: theme.fill.attenuation,
    logo: theme.logo.color,
    logoEmissive: theme.logo.emissive,
    logoEmissiveIntensity: theme.logo.emissiveIntensity,
  }
}
