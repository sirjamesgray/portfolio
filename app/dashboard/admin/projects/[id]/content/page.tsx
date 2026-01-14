"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { formatProjectType } from "@/lib/constants"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"
import { CMSEditor, CMSEditorRef } from "@/components/dashboard/cms-editor"
import { ProjectCard, ProjectCardData } from "@/components/project-card"

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
}

// Default emerald color
const DEFAULT_COLOR = "#10b981"

export default function LandingContentEditorPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Editable form state
  const [metadataForm, setMetadataForm] = useState({
    public_title: "",
    public_description: "",
    public_hero_image: "",
    public_industry: "",
    public_brand_color: DEFAULT_COLOR,
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
  })

  // Track if content has changed
  const [hasChanges, setHasChanges] = useState(false)

  // Hero image upload state
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)
  const heroImageInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

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
          }
          setMetadataForm(metadata)
          setOriginalMetadata(metadata)
          setContentHtml(project.public_content_html || "")
          setOriginalContentHtml(project.public_content_html || "")
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

    setUploadingHeroImage(true)
    try {
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
  }, [projectId])

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

  // Preview values
  const displayTitle = metadataForm.public_title || project?.title || "Untitled Project"
  const displayDescription = metadataForm.public_description || "Custom software solution built for small business needs."
  const displayIndustry = metadataForm.public_industry || formatProjectType(project?.project_type ?? null)

  // Build preview project object for ProjectCard
  const previewProject: ProjectCardData = {
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
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
            <Button variant="outline" size="sm" onClick={handleRevert} disabled={saving}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Revert
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-1"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Landing Card Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Landing Page Card Preview</CardTitle>
          <p className="text-xs text-muted-foreground">
            How this project appears on the landing page
          </p>
        </CardHeader>
        <CardContent>
          {/* Real ProjectCard Preview */}
          <div className="max-w-md mx-auto pointer-events-none">
            <ProjectCard
              project={previewProject}
              displayTitle={displayTitle}
              displayDescription={displayDescription}
              displayIndustry={displayIndustry}
            />
          </div>

          {/* Hex Color Picker */}
          <div className="mt-6 pt-4 border-t border-border">
            <label className="text-sm font-medium mb-2 block">Card Accent Color</label>
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => colorInputRef.current?.click()}
                  className="gap-1.5"
                >
                  <Pipette className="h-4 w-4" />
                  Pick
                </Button>
              </div>
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
          {/* Hidden file input */}
          <input
            ref={heroImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleHeroImageSelect}
            className="hidden"
          />

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

          <div>
            <label className="text-sm font-medium mb-1.5 block">Hero Image (for card)</label>
            {metadataForm.public_hero_image ? (
              <div className="flex items-start gap-4">
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={metadataForm.public_hero_image}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => setMetadataForm({ ...metadataForm, public_hero_image: "" })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => heroImageInputRef.current?.click()}
                  disabled={uploadingHeroImage}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Replace
                </Button>
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
