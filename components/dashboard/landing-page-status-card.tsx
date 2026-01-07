"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Megaphone, Pencil, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type ProjectMetadata = {
  show_on_landing_page: boolean | null
  customer_opted_out_of_landing_page: boolean | null
}

interface LandingPageStatusCardProps {
  projectId: string
  metadata: ProjectMetadata
  onToggle: (enabled: boolean) => Promise<void>
}

export function LandingPageStatusCard({ projectId, metadata, onToggle }: LandingPageStatusCardProps) {
  const [toggling, setToggling] = useState(false)

  const customerOptedOut = metadata.customer_opted_out_of_landing_page === true
  const showOnLandingPage = metadata.show_on_landing_page === true

  async function handleToggle(enabled: boolean) {
    setToggling(true)
    try {
      await onToggle(enabled)
    } finally {
      setToggling(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Landing Page
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status and Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={showOnLandingPage}
              onCheckedChange={handleToggle}
              disabled={toggling}
            />
            <div className="flex items-center gap-2">
              {showOnLandingPage ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Hidden
                </Badge>
              )}
              {customerOptedOut && (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Opted Out
                </Badge>
              )}
            </div>
          </div>

          <Link href={`/dashboard/admin/projects/${projectId}/content`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              {toggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Edit Content
            </Button>
          </Link>
        </div>

        {customerOptedOut && showOnLandingPage && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            This project is enabled but won't show because the customer has opted out.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
