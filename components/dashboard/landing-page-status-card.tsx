"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardButton } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Pencil, ExternalLink, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

type ProjectMetadata = {
  show_on_landing_page: boolean | null
  show_in_design_systems_section: boolean | null
}

interface LandingPageStatusCardProps {
  projectId: string
  metadata: ProjectMetadata
}

export function LandingPageStatusCard({ projectId, metadata }: LandingPageStatusCardProps) {
  const showInProjects = metadata.show_on_landing_page === true
  const showInDesignSystems = metadata.show_in_design_systems_section === true
  const isVisibleAnywhere = showInProjects || showInDesignSystems

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Public Visibility
        </CardTitle>
        {isVisibleAnywhere && (
          <Link
            href={`/projects/${projectId}`}
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visibility Summary */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {isVisibleAnywhere ? (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Eye className="h-4 w-4 text-emerald-500" />
                <span>Visible in:</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <EyeOff className="h-4 w-4" />
                <span>Not visible anywhere</span>
              </div>
            )}
            {showInProjects && (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Projects
              </Badge>
            )}
            {showInDesignSystems && (
              <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                Design Systems
              </Badge>
            )}
          </div>

          <Link href={`/dashboard/admin/projects/${projectId}/content`}>
            <DashboardButton variant="outline" size="sm" className="gap-1.5">
              <Pencil className="h-4 w-4" />
              Edit Content
            </DashboardButton>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
