"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardButton } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileStack, Eye, Check, Loader2 } from "lucide-react"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"
import Link from "next/link"

interface LandingPage {
  id: string
  name: string
  description: string
}

const LANDING_PAGES: LandingPage[] = [
  {
    id: "hire-for-projects",
    name: "Hire for Projects",
    description: "Original landing page focused on hiring me for web development projects",
  },
  {
    id: "delete-figma",
    name: "Delete Figma",
    description: "Code Is the Source of Truth - a manifesto for designers who ship code",
  },
]

interface LandingPagesClientProps {
  activePage: string
}

export function LandingPagesClient({ activePage: initialActivePage }: LandingPagesClientProps) {
  const [activePage, setActivePage] = useState(initialActivePage)
  const [updating, setUpdating] = useState<string | null>(null)

  const setActive = async (pageId: string) => {
    setUpdating(pageId)
    try {
      const response = await fetch("/api/admin/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "active-landing-page",
          enabled: true,
          description: pageId,
        }),
      })

      if (response.ok) {
        setActivePage(pageId)
      }
    } catch (error) {
      console.error("Error setting active landing page:", error)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <MobileBackButton />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Landing Pages</h1>
        <p className="text-muted-foreground">
          Choose which landing page displays at the root URL
        </p>
      </div>

      <div className="space-y-4">
        {LANDING_PAGES.map((page) => {
          const isActive = activePage === page.id
          const isUpdating = updating === page.id

          return (
            <Card key={page.id} className={isActive ? "border-emerald-500/50" : ""}>
              <CardHeader className="space-y-4">
                {/* Header row with icon and text */}
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-primary/10 text-primary"
                  }`}>
                    <FileStack className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                      {page.name}
                      {isActive && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          Active
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">{page.description}</CardDescription>
                  </div>
                </div>

                {/* Action buttons - full width on mobile */}
                <div className="flex items-center gap-2 sm:justify-end">
                  <Link href={`/?preview=${page.id}`} className="flex-1 sm:flex-none">
                    <DashboardButton variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                      <Eye className="h-4 w-4" />
                      Preview
                    </DashboardButton>
                  </Link>
                  {!isActive && (
                    <DashboardButton
                      size="sm"
                      onClick={() => setActive(page.id)}
                      disabled={isUpdating}
                      className="gap-2 flex-1 sm:flex-none"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Set Active
                    </DashboardButton>
                  )}
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            The active landing page is displayed at <code className="text-xs bg-muted px-1 py-0.5 rounded">/</code> (the root URL).
            Use the Preview button to see any landing page without changing the active one.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
