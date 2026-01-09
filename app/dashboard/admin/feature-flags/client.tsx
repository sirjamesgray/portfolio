"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Flag, Loader2 } from "lucide-react"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"
import type { FeatureFlag } from "@/lib/feature-flags"

interface FeatureFlagsClientProps {
  flags: FeatureFlag[]
}

export function FeatureFlagsClient({ flags: initialFlags }: FeatureFlagsClientProps) {
  const [flags, setFlags] = useState(initialFlags)
  const [updating, setUpdating] = useState<string | null>(null)

  const toggleFlag = async (name: string, enabled: boolean) => {
    setUpdating(name)
    try {
      const response = await fetch("/api/admin/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, enabled }),
      })

      if (response.ok) {
        setFlags(flags.map(flag =>
          flag.name === name
            ? { ...flag, enabled, updated_at: new Date().toISOString() }
            : flag
        ))
      }
    } catch (error) {
      console.error("Error toggling feature flag:", error)
    } finally {
      setUpdating(null)
    }
  }

  const enabledCount = flags.filter(f => f.enabled).length

  return (
    <div className="space-y-6">
      <MobileBackButton />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
        <p className="text-muted-foreground">
          Control site-wide features and behavior
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flags.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Enabled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{enabledCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disabled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{flags.length - enabledCount}</div>
            </CardContent>
          </Card>
        </div>

      <div className="space-y-4">
          {flags.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No feature flags configured</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Run the database migration to create flags
                </p>
              </CardContent>
            </Card>
          ) : (
            flags.map((flag) => (
              <Card key={flag.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Flag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-mono">{flag.name}</CardTitle>
                        <CardDescription>
                          Last updated: {new Date(flag.updated_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={flag.enabled
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-muted"
                        }
                      >
                        {flag.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      {updating === flag.name ? (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      ) : (
                        <Switch
                          checked={flag.enabled}
                          onCheckedChange={(checked) => toggleFlag(flag.name, checked)}
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {flag.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
    </div>
  )
}
