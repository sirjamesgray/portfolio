"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardButton } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Megaphone, Pencil, AlertTriangle, Loader2, ExternalLink, Check } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

type ProjectMetadata = {
  show_on_landing_page: boolean | null
  customer_opted_out_of_landing_page: boolean | null
  public_live_url: string | null
  show_live_link: boolean | null
  public_design_system_url: string | null
  show_design_system_link: boolean | null
}

interface LandingPageStatusCardProps {
  projectId: string
  metadata: ProjectMetadata
  onToggle: (enabled: boolean) => Promise<void>
  onLiveLinkToggle: (enabled: boolean) => Promise<void>
  onLiveUrlChange: (url: string) => Promise<void>
  onDesignSystemLinkToggle: (enabled: boolean) => Promise<void>
  onDesignSystemUrlChange: (url: string) => Promise<void>
}

export function LandingPageStatusCard({ projectId, metadata, onToggle, onLiveLinkToggle, onLiveUrlChange, onDesignSystemLinkToggle, onDesignSystemUrlChange }: LandingPageStatusCardProps) {
  const [toggling, setToggling] = useState(false)
  const [togglingLiveLink, setTogglingLiveLink] = useState(false)
  const [togglingDesignSystemLink, setTogglingDesignSystemLink] = useState(false)
  const [liveUrl, setLiveUrl] = useState(metadata.public_live_url || "")
  const [designSystemUrl, setDesignSystemUrl] = useState(metadata.public_design_system_url || "")
  const [savingUrl, setSavingUrl] = useState(false)
  const [savingDesignSystemUrl, setSavingDesignSystemUrl] = useState(false)
  const [urlSaved, setUrlSaved] = useState(false)
  const [designSystemUrlSaved, setDesignSystemUrlSaved] = useState(false)

  const customerOptedOut = metadata.customer_opted_out_of_landing_page === true
  const showOnLandingPage = metadata.show_on_landing_page === true
  const showLiveLink = metadata.show_live_link === true
  const showDesignSystemLink = metadata.show_design_system_link === true

  useEffect(() => {
    setLiveUrl(metadata.public_live_url || "")
  }, [metadata.public_live_url])

  useEffect(() => {
    setDesignSystemUrl(metadata.public_design_system_url || "")
  }, [metadata.public_design_system_url])

  async function handleToggle(enabled: boolean) {
    setToggling(true)
    try {
      await onToggle(enabled)
    } finally {
      setToggling(false)
    }
  }

  async function handleLiveLinkToggle(enabled: boolean) {
    setTogglingLiveLink(true)
    try {
      await onLiveLinkToggle(enabled)
    } finally {
      setTogglingLiveLink(false)
    }
  }

  async function handleSaveUrl() {
    if (liveUrl === (metadata.public_live_url || "")) return
    setSavingUrl(true)
    try {
      await onLiveUrlChange(liveUrl)
      setUrlSaved(true)
      setTimeout(() => setUrlSaved(false), 2000)
    } finally {
      setSavingUrl(false)
    }
  }

  async function handleDesignSystemLinkToggle(enabled: boolean) {
    setTogglingDesignSystemLink(true)
    try {
      await onDesignSystemLinkToggle(enabled)
    } finally {
      setTogglingDesignSystemLink(false)
    }
  }

  async function handleSaveDesignSystemUrl() {
    if (designSystemUrl === (metadata.public_design_system_url || "")) return
    setSavingDesignSystemUrl(true)
    try {
      await onDesignSystemUrlChange(designSystemUrl)
      setDesignSystemUrlSaved(true)
      setTimeout(() => setDesignSystemUrlSaved(false), 2000)
    } finally {
      setSavingDesignSystemUrl(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Landing Page
        </CardTitle>
        {showOnLandingPage && !customerOptedOut && (
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
            <DashboardButton variant="outline" size="sm" className="gap-1.5">
              {toggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Edit Content
            </DashboardButton>
          </Link>
        </div>

        {customerOptedOut && showOnLandingPage && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            This project is enabled but won't show because the customer has opted out.
          </p>
        )}

        {/* Live Link Section */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                checked={showLiveLink}
                onCheckedChange={handleLiveLinkToggle}
                disabled={togglingLiveLink}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show live site link</span>
                {showLiveLink && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    Visible
                  </Badge>
                )}
              </div>
            </div>
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="flex-1"
            />
            <DashboardButton
              variant="outline"
              size="sm"
              onClick={handleSaveUrl}
              disabled={savingUrl || liveUrl === (metadata.public_live_url || "")}
              className="shrink-0"
            >
              {savingUrl ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : urlSaved ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                "Save"
              )}
            </DashboardButton>
          </div>
        </div>

        {/* Design System Link Section */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                checked={showDesignSystemLink}
                onCheckedChange={handleDesignSystemLinkToggle}
                disabled={togglingDesignSystemLink}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show design system link</span>
                {showDesignSystemLink && (
                  <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                    Visible
                  </Badge>
                )}
              </div>
            </div>
            {designSystemUrl && (
              <a
                href={designSystemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/design-system"
              value={designSystemUrl}
              onChange={(e) => setDesignSystemUrl(e.target.value)}
              className="flex-1"
            />
            <DashboardButton
              variant="outline"
              size="sm"
              onClick={handleSaveDesignSystemUrl}
              disabled={savingDesignSystemUrl || designSystemUrl === (metadata.public_design_system_url || "")}
              className="shrink-0"
            >
              {savingDesignSystemUrl ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : designSystemUrlSaved ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                "Save"
              )}
            </DashboardButton>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
