import { createClient } from "@/lib/supabase/server"

export const FEATURE_FLAGS = {
  CUSTOMER_DASHBOARD: "customer-dashboard",
} as const

export type FeatureFlagName = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS]

export type FeatureFlag = {
  name: string
  enabled: boolean
  description: string | null
  updated_at: string
  updated_by: string | null
}

/**
 * Get a feature flag value from the database.
 * Returns true by default if the flag doesn't exist (fail-open for safety).
 */
export async function getFeatureFlag(name: FeatureFlagName): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("feature_flags")
      .select("enabled")
      .eq("name", name)
      .single()

    if (error || !data) {
      console.warn(`Feature flag "${name}" not found, defaulting to true`)
      return true
    }

    return data.enabled
  } catch (error) {
    console.error(`Error fetching feature flag "${name}":`, error)
    return true
  }
}

/**
 * Get all feature flags from the database.
 */
export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("name")

    if (error) {
      console.error("Error fetching feature flags:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching feature flags:", error)
    return []
  }
}

/**
 * Check if the customer dashboard feature is enabled.
 * When true: Users sign up and access dashboard
 * When false: Users go directly to Calendly, no dashboard
 */
export async function isCustomerDashboardEnabled(): Promise<boolean> {
  return getFeatureFlag(FEATURE_FLAGS.CUSTOMER_DASHBOARD)
}
