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
  route: string
}

const LANDING_PAGES: LandingPage[] = [
  {
    id: "hire-for-projects",
    name: "Book a Project",
    description: "Freelance web development services for small businesses",
    route: "/landing-variants/book-a-project",
  },
  {
    id: "delete-figma",
    name: "Product Engineer",
    description: "Full-time role landing page - design systems built in code",
    route: "/landing-variants/delete-figma",
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
                                    <code className="mt-2 block text-xs text-muted-foreground/70 font-mono">{page.route}</code>
                  </div>
                </div>

                {/* Action buttons - full width on mobile */}
                <div className="flex items-center gap-2 sm:justify-end">
                  <Link href={page.route} className="flex-1 sm:flex-none">
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
            The active landing page is rendered at <code className="text-xs bg-muted px-1 py-0.5 rounded">/</code> (the root URL).
            Each variant also has its own direct URL for previewing.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
