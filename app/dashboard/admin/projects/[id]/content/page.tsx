"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Loader2,
  Upload,
  X,
  ImageIcon,
  Pipette,
  ExternalLink,
  Check,
  Link2,
  Settings,
  Eye,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { formatProjectType } from "@/lib/constants"
import { deleteFromStorage } from "@/lib/storage"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"
import { CMSEditor, CMSEditorRef } from "@/components/dashboard/cms-editor"
import { ProjectCard, ProjectCardData } from "@/components/project-card"
import { DesignSystemCard, DesignSystemCardData } from "@/components/design-system-card"
import { ImageUpload } from "@/components/ui/image-upload"
import { ResponsiveModal } from "@/components/ui/responsive-modal"

type ProjectMetadata = {
  id: string
  title: string | null
  public_title: string | null
  public_description: string | null
  public_hero_image: string | null
  public_industry: string | null
  public_content_html: string | null
  project_type: string | null
  vercel_url: string | null
  icon_url: string | null
  public_brand_color: string | null
  public_design_system_url: string | null
  design_system_image_url: string | null
  design_system_description: string | null
  public_live_url: string | null
  show_live_link: boolean | null
  show_design_system_link: boolean | null
  show_on_landing_page: boolean | null
  show_in_design_systems_section: boolean | null
}

// Default emerald color
const DEFAULT_COLOR = "#10b981"

export default function LandingContentEditorPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Card settings modal
  const [cardSettingsOpen, setCardSettingsOpen] = useState(false)

  // Editable form state
  const [metadataForm, setMetadataForm] = useState({
    public_title: "",
    public_description: "",
    public_hero_image: "",
    public_industry: "",
    public_brand_color: DEFAULT_COLOR,
    design_system_image_url: "",
    design_system_description: "",
  })

  // Content HTML state
  const [contentHtml, setContentHtml] = useState("")
  const [originalContentHtml, setOriginalContentHtml] = useState("")

  // Original values for revert
  const [originalMetadata, setOriginalMetadata] = useState({
    public_title: "",
    public_description: "",
    public_hero_image: "",
    public_industry: "",
    public_brand_color: DEFAULT_COLOR,
    design_system_image_url: "",
    design_system_description: "",
  })

  // Track if content has changed
  const [hasChanges, setHasChanges] = useState(false)

  // Hero image upload state
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)
  const heroImageInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  // Link settings state (managed separately since they save immediately)
  const [showLiveLink, setShowLiveLink] = useState(false)
  const [liveUrl, setLiveUrl] = useState("")
  const [showDesignSystemLink, setShowDesignSystemLink] = useState(false)
  const [designSystemUrl, setDesignSystemUrl] = useState("")
  const [savingLiveUrl, setSavingLiveUrl] = useState(false)
  const [savingDesignSystemUrl, setSavingDesignSystemUrl] = useState(false)
  const [liveUrlSaved, setLiveUrlSaved] = useState(false)
  const [designSystemUrlSaved, setDesignSystemUrlSaved] = useState(false)

  // Section visibility state (save immediately)
  const [showInProjectsSection, setShowInProjectsSection] = useState(false)
  const [showInDesignSystemsSection, setShowInDesignSystemsSection] = useState(false)

  // CMS Editor ref
  const editorRef = useRef<CMSEditorRef>(null)

  // Fetch project data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}`)
        if (response.ok) {
          const { project } = await response.json()
          setProject(project)
          const metadata = {
            public_title: project.public_title || "",
            public_description: project.public_description || "",
            public_hero_image: project.public_hero_image || "",
            public_industry: project.public_industry || "",
            public_brand_color: project.public_brand_color || DEFAULT_COLOR,
            design_system_image_url: project.design_system_image_url || "",
            design_system_description: project.design_system_description || "",
          }
          setMetadataForm(metadata)
          setOriginalMetadata(metadata)
          setContentHtml(project.public_content_html || "")
          setOriginalContentHtml(project.public_content_html || "")
          // Initialize link state
          setShowLiveLink(project.show_live_link === true)
          setLiveUrl(project.public_live_url || "")
          setShowDesignSystemLink(project.show_design_system_link === true)
          setDesignSystemUrl(project.public_design_system_url || "")
          // Initialize section visibility state
          setShowInProjectsSection(project.show_on_landing_page === true)
          setShowInDesignSystemsSection(project.show_in_design_systems_section === true)
        }
      } catch (error) {
        console.error("Failed to fetch project:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId])

  // Track changes
  useEffect(() => {
    const metadataChanged = JSON.stringify(metadataForm) !== JSON.stringify(originalMetadata)
    const contentChanged = contentHtml !== originalContentHtml
    setHasChanges(metadataChanged || contentChanged)
  }, [metadataForm, originalMetadata, contentHtml, originalContentHtml])

  // Save all changes
  async function handleSave() {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/content`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...metadataForm,
          public_content_html: contentHtml,
        }),
      })
      if (response.ok) {
        setOriginalMetadata(metadataForm)
        setOriginalContentHtml(contentHtml)
        setHasChanges(false)
      }
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  // Revert all changes
  function handleRevert() {
    setMetadataForm(originalMetadata)
    setContentHtml(originalContentHtml)
    editorRef.current?.setContent(originalContentHtml)
    setHasChanges(false)
  }

  // Hero image upload handler
  const uploadHeroImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be less than 10MB")
      return
    }

    const oldHeroImage = metadataForm.public_hero_image
    setUploadingHeroImage(true)

    try {
      // Delete old hero image from storage if exists (cleanup)
      if (oldHeroImage) {
        await deleteFromStorage(oldHeroImage)
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "image")
      formData.append("title", "Hero Image")

      const response = await fetch(`/api/admin/projects/${projectId}/assets/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { asset } = await response.json()
      setMetadataForm(prev => ({ ...prev, public_hero_image: asset.url }))
    } catch (error) {
      console.error("Failed to upload hero image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingHeroImage(false)
    }
  }, [projectId, metadataForm.public_hero_image])

  const handleHeroImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadHeroImage(file)
    e.target.value = ""
  }, [uploadHeroImage])

  const handleHeroImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) uploadHeroImage(file)
  }, [uploadHeroImage])

  // Content image upload handler for CMS editor
  const handleContentImageUpload = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "content_image")
    formData.append("title", "Content Image")

    const response = await fetch(`/api/admin/projects/${projectId}/assets/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")

    const { asset } = await response.json()
    return asset.url
  }, [projectId])

  // Link toggle handlers (save immediately)
  async function handleLiveLinkToggle(enabled: boolean) {
    setShowLiveLink(enabled)
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show_live_link: enabled }),
    })
  }

  async function handleDesignSystemLinkToggle(enabled: boolean) {
    setShowDesignSystemLink(enabled)
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show_design_system_link: enabled }),
    })
  }

  async function handleSaveLiveUrl() {
    setSavingLiveUrl(true)
    try {
      await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_live_url: liveUrl }),
      })
      setLiveUrlSaved(true)
      setTimeout(() => setLiveUrlSaved(false), 2000)
    } finally {
      setSavingLiveUrl(false)
    }
  }

  async function handleSaveDesignSystemUrl() {
    setSavingDesignSystemUrl(true)
    try {
      await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_design_system_url: designSystemUrl }),
      })
      setDesignSystemUrlSaved(true)
      setTimeout(() => setDesignSystemUrlSaved(false), 2000)
    } finally {
      setSavingDesignSystemUrl(false)
    }
  }

  // Section visibility handlers (save immediately)
  async function handleProjectsSectionToggle(enabled: boolean) {
    setShowInProjectsSection(enabled)
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show_on_landing_page: enabled }),
    })
  }

  async function handleDesignSystemsSectionToggle(enabled: boolean) {
    setShowInDesignSystemsSection(enabled)
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show_in_design_systems_section: enabled }),
    })
  }

  // Preview values
  const displayTitle = metadataForm.public_title || project?.title || "Untitled Project"
  const displayDescription = metadataForm.public_description || "Custom software solution built for small business needs."
  const displayIndustry = metadataForm.public_industry || formatProjectType(project?.project_type ?? null)

  // Build preview project object for ProjectCard (simple variant - landing page)
  const previewProjectSimple: ProjectCardData = {
    id: projectId,
    title: project?.title || null,
    public_title: metadataForm.public_title || null,
    public_description: metadataForm.public_description || null,
    public_hero_image: metadataForm.public_hero_image || null,
    public_industry: metadataForm.public_industry || null,
    project_type: project?.project_type || null,
    icon_url: project?.icon_url || null,
    public_brand_color: metadataForm.public_brand_color || null,
  }

  // Build preview project object for ProjectCard (detailed variant - projects page)
  const previewProjectDetailed: ProjectCardData = {
    ...previewProjectSimple,
    public_live_url: liveUrl || null,
    show_live_link: showLiveLink,
    public_design_system_url: designSystemUrl || null,
    show_design_system_link: showDesignSystemLink,
    public_content_html: contentHtml || null,
  }

  // Build preview object for DesignSystemCard
  // Use displayTitle for consistency with other cards (falls back to project.title)
  const previewDesignSystemCard: DesignSystemCardData = {
    id: projectId,
    public_title: displayTitle,
    public_description: metadataForm.public_description || null,
    design_system_description: metadataForm.design_system_description || null,
    icon_url: project?.icon_url || null,
    public_brand_color: metadataForm.public_brand_color || null,
    public_design_system_url: designSystemUrl || null,
    design_system_image_url: metadataForm.design_system_image_url || null,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MobileBackButton />

      {/* Header with Save/Revert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/admin/projects/${projectId}`}>
            <DashboardButton variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </DashboardButton>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Landing Page Content</h1>
            <p className="text-sm text-muted-foreground">
              {project?.title || "Project"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <DashboardButton variant="outline" size="sm" onClick={handleRevert} disabled={saving}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Revert
            </DashboardButton>
          )}
          <DashboardButton
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-1"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </DashboardButton>
        </div>
      </div>

      {/* Card Previews Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Card Previews
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              How this project appears across the site
            </p>
          </div>
          <DashboardButton
            variant="outline"
            size="sm"
            onClick={() => setCardSettingsOpen(true)}
            className="gap-1.5"
          >
            <Settings className="h-4 w-4" />
            Edit Card Settings
          </DashboardButton>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Landing Page Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Landing Page</p>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showInProjectsSection}
                    onCheckedChange={handleProjectsSectionToggle}
                    className="scale-75"
                  />
                  {showInProjectsSection ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                      Visible
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px]">
                      Hidden
                    </Badge>
                  )}
                </div>
              </div>
              <div className="pointer-events-none">
                <ProjectCard
                  project={previewProjectSimple}
                  displayTitle={displayTitle}
                  displayDescription={displayDescription}
                  displayIndustry={displayIndustry}
                  variant="simple"
                />
              </div>
            </div>

            {/* Projects Page Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Projects Page</p>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showInProjectsSection}
                    onCheckedChange={handleProjectsSectionToggle}
                    className="scale-75"
                  />
                  {showInProjectsSection ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                      Visible
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px]">
                      Hidden
                    </Badge>
                  )}
                </div>
              </div>
              <div className="pointer-events-none">
                <ProjectCard
                  project={previewProjectDetailed}
                  displayTitle={displayTitle}
                  displayDescription={displayDescription}
                  displayIndustry={displayIndustry}
                  variant="detailed"
                />
              </div>
            </div>

            {/* Design System Card Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Design Systems Section</p>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showInDesignSystemsSection}
                    onCheckedChange={handleDesignSystemsSectionToggle}
                    className="scale-75"
                  />
                  {showInDesignSystemsSection ? (
                    <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[10px]">
                      Visible
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px]">
                      Hidden
                    </Badge>
                  )}
                </div>
              </div>
              <div className="pointer-events-none">
                <DesignSystemCard project={previewDesignSystemCard} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Settings Modal */}
      <ResponsiveModal
        open={cardSettingsOpen}
        onOpenChange={setCardSettingsOpen}
        title="Card Settings"
        description="Configure how the project cards appear"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          {/* Hidden file input */}
          <input
            ref={heroImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleHeroImageSelect}
            className="hidden"
          />

          {/* Hero Image */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Hero Image</label>
            <p className="text-xs text-muted-foreground mb-3">
              Appears on the project card and page header
            </p>
            {metadataForm.public_hero_image ? (
              <div className="flex items-start gap-4">
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={metadataForm.public_hero_image}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                  <DashboardButton
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => setMetadataForm({ ...metadataForm, public_hero_image: "" })}
                  >
                    <X className="h-3 w-3" />
                  </DashboardButton>
                </div>
                <DashboardButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => heroImageInputRef.current?.click()}
                  disabled={uploadingHeroImage}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Replace
                </DashboardButton>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer max-w-xs"
                onClick={() => heroImageInputRef.current?.click()}
                onDrop={handleHeroImageDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {uploadingHeroImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Click to upload
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accent Color */}
          <div className="pt-4 border-t border-border">
            <label className="text-sm font-medium mb-2 block">Accent Color</label>
            <p className="text-xs text-muted-foreground mb-3">
              Pick a color from the hero image using your browser&apos;s color picker
            </p>
            <div className="flex items-center gap-3">
              {/* Hidden native color input */}
              <input
                ref={colorInputRef}
                type="color"
                value={metadataForm.public_brand_color}
                onChange={(e) => setMetadataForm({ ...metadataForm, public_brand_color: e.target.value })}
                className="sr-only"
              />

              {/* Color preview button that triggers picker */}
              <button
                type="button"
                onClick={() => colorInputRef.current?.click()}
                className="h-10 w-10 rounded-lg border-2 border-border transition-all hover:scale-105 hover:border-foreground/50"
                style={{ backgroundColor: metadataForm.public_brand_color }}
                title="Click to pick color"
              />

              {/* Hex input */}
              <div className="flex items-center gap-2">
                <Input
                  value={metadataForm.public_brand_color}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                      setMetadataForm({ ...metadataForm, public_brand_color: value })
                    }
                  }}
                  placeholder="#10b981"
                  className="w-28 font-mono text-sm"
                />
                <DashboardButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => colorInputRef.current?.click()}
                  className="gap-1.5"
                >
                  <Pipette className="h-4 w-4" />
                  Pick
                </DashboardButton>
              </div>
            </div>
          </div>

          {/* Design System Screenshot */}
          <div className="pt-4 border-t border-border">
            <ImageUpload
              value={metadataForm.design_system_image_url || null}
              onChange={(url) => setMetadataForm({ ...metadataForm, design_system_image_url: url || "" })}
              label="Design System Screenshot"
              helperText="Appears in the Design Systems section card"
              storagePath="design-systems"
              aspectRatio="16/10"
              allowUrl={true}
            />
          </div>

          {/* Design System Description */}
          <div className="pt-4 border-t border-border">
            <label className="text-sm font-medium mb-1.5 block">Design System Description</label>
            <p className="text-xs text-muted-foreground mb-2">
              Custom description for the Design Systems section (falls back to project description if empty)
            </p>
            <Textarea
              value={metadataForm.design_system_description}
              onChange={(e) => setMetadataForm({ ...metadataForm, design_system_description: e.target.value })}
              placeholder="Describe the design system..."
              rows={2}
            />
          </div>
        </div>
      </ResponsiveModal>

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            External Links
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Configure which links appear on the public project page
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live Site Link */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={showLiveLink}
                  onCheckedChange={handleLiveLinkToggle}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Live site link</span>
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
                onClick={handleSaveLiveUrl}
                disabled={savingLiveUrl}
                className="shrink-0"
              >
                {savingLiveUrl ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : liveUrlSaved ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  "Save"
                )}
              </DashboardButton>
            </div>
          </div>

          {/* Design System Link */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={showDesignSystemLink}
                  onCheckedChange={handleDesignSystemLinkToggle}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Design system link</span>
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
                disabled={savingDesignSystemUrl}
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

      {/* Metadata Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Page Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Public Title</label>
              <Input
                value={metadataForm.public_title}
                onChange={(e) => setMetadataForm({ ...metadataForm, public_title: e.target.value })}
                placeholder="Display title for the public page"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Industry</label>
              <Input
                value={metadataForm.public_industry}
                onChange={(e) => setMetadataForm({ ...metadataForm, public_industry: e.target.value })}
                placeholder="e.g., Home Services, E-commerce"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea
              value={metadataForm.public_description}
              onChange={(e) => setMetadataForm({ ...metadataForm, public_description: e.target.value })}
              placeholder="Brief description for the public page"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rich Content Editor */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-base">Page Content</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Type / for commands. Use H1/H2 for headings, add images inline.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <CMSEditor
            ref={editorRef}
            content={contentHtml}
            onChange={setContentHtml}
            onImageUpload={handleContentImageUpload}
            placeholder="Start writing your project content... Type / for formatting commands"
          />
        </CardContent>
      </Card>
    </div>
  )
}
