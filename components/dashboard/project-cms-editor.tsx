"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Megaphone,
  Plus,
  Trash2,
  GripVertical,
  Type,
  AlignLeft,
  ImageIcon,
  ExternalLink,
  Loader2,
  Check,
  Pencil,
  Save,
  Eye,
  AlertTriangle,
  Upload,
  X,
  Clipboard,
} from "lucide-react"
import { useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

type ContentBlock = {
  id: string
  type: "header" | "text" | "image"
  content: string
  image_alt: string | null
  display_order: number
}

type ProjectMetadata = {
  public_title: string | null
  public_description: string | null
  public_hero_image: string | null
  public_industry: string | null
  show_on_landing_page: boolean | null
  customer_opted_out_of_landing_page: boolean | null
}

interface ProjectCMSEditorProps {
  projectId: string
  metadata: ProjectMetadata
  onMetadataChange: () => void
}

export function ProjectCMSEditor({ projectId, metadata, onMetadataChange }: ProjectCMSEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [togglingVisibility, setTogglingVisibility] = useState(false)

  // Metadata editing state
  const [editingMetadata, setEditingMetadata] = useState(false)
  const [metadataForm, setMetadataForm] = useState({
    public_title: metadata.public_title || "",
    public_description: metadata.public_description || "",
    public_hero_image: metadata.public_hero_image || "",
    public_industry: metadata.public_industry || "",
  })

  // Add block dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newBlockType, setNewBlockType] = useState<"header" | "text" | "image">("text")
  const [newBlockContent, setNewBlockContent] = useState("")
  const [newBlockImageAlt, setNewBlockImageAlt] = useState("")
  const [addingBlock, setAddingBlock] = useState(false)

  // Edit block dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [editBlockContent, setEditBlockContent] = useState("")
  const [editBlockImageAlt, setEditBlockImageAlt] = useState("")
  const [updatingBlock, setUpdatingBlock] = useState(false)

  // Hero image upload state
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)
  const heroImageInputRef = useRef<HTMLInputElement>(null)

  // Derived state
  const customerOptedOut = metadata.customer_opted_out_of_landing_page || false
  const showOnLandingPage = metadata.show_on_landing_page || false
  const isVisibleOnLandingPage = showOnLandingPage && !customerOptedOut

  useEffect(() => {
    fetchBlocks()
  }, [projectId])

  async function fetchBlocks() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/content`)
      if (response.ok) {
        const data = await response.json()
        setBlocks(data.blocks || [])
      }
    } catch (error) {
      console.error("Failed to fetch content blocks:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleVisibility(enabled: boolean) {
    setTogglingVisibility(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show_on_landing_page: enabled }),
      })
      if (response.ok) {
        onMetadataChange()
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error)
    } finally {
      setTogglingVisibility(false)
    }
  }

  async function handleSaveMetadata() {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/content`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadataForm),
      })
      if (response.ok) {
        setEditingMetadata(false)
        onMetadataChange()
      }
    } catch (error) {
      console.error("Failed to save metadata:", error)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddBlock() {
    if (!newBlockContent.trim()) return
    setAddingBlock(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newBlockType,
          content: newBlockContent,
          image_alt: newBlockType === "image" ? newBlockImageAlt : null,
        }),
      })
      if (response.ok) {
        setAddDialogOpen(false)
        setNewBlockType("text")
        setNewBlockContent("")
        setNewBlockImageAlt("")
        fetchBlocks()
      }
    } catch (error) {
      console.error("Failed to add block:", error)
    } finally {
      setAddingBlock(false)
    }
  }

  async function handleUpdateBlock() {
    if (!editingBlock || !editBlockContent.trim()) return
    setUpdatingBlock(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/content/${editingBlock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editBlockContent,
          image_alt: editingBlock.type === "image" ? editBlockImageAlt : null,
        }),
      })
      if (response.ok) {
        setEditDialogOpen(false)
        setEditingBlock(null)
        fetchBlocks()
      }
    } catch (error) {
      console.error("Failed to update block:", error)
    } finally {
      setUpdatingBlock(false)
    }
  }

  async function handleDeleteBlock(blockId: string) {
    if (!confirm("Are you sure you want to delete this content block?")) return
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/content/${blockId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchBlocks()
      }
    } catch (error) {
      console.error("Failed to delete block:", error)
    }
  }

  function openEditDialog(block: ContentBlock) {
    setEditingBlock(block)
    setEditBlockContent(block.content)
    setEditBlockImageAlt(block.image_alt || "")
    setEditDialogOpen(true)
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

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { asset } = await response.json()

      // Update the hero image URL
      setMetadataForm(prev => ({ ...prev, public_hero_image: asset.url }))

      // Auto-save the metadata
      const saveResponse = await fetch(`/api/admin/projects/${projectId}/content`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...metadataForm, public_hero_image: asset.url }),
      })

      if (saveResponse.ok) {
        onMetadataChange()
      }
    } catch (error) {
      console.error("Failed to upload hero image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingHeroImage(false)
    }
  }, [projectId, metadataForm, onMetadataChange])

  // Handle file input change
  const handleHeroImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadHeroImage(file)
    }
    // Reset input so same file can be selected again
    e.target.value = ""
  }, [uploadHeroImage])

  // Handle paste for hero image
  const handleHeroImagePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const imageType = item.types.find(type => type.startsWith("image/"))
        if (imageType) {
          const blob = await item.getType(imageType)
          const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: imageType })
          uploadHeroImage(file)
          return
        }
      }
      alert("No image found in clipboard")
    } catch (error) {
      console.error("Failed to paste image:", error)
      alert("Failed to paste image. Make sure you have an image copied to your clipboard.")
    }
  }, [uploadHeroImage])

  // Handle drop for hero image
  const handleHeroImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      uploadHeroImage(file)
    }
  }, [uploadHeroImage])

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "header": return <Type className="h-4 w-4" />
      case "text": return <AlignLeft className="h-4 w-4" />
      case "image": return <ImageIcon className="h-4 w-4" />
      default: return <AlignLeft className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Landing Page Content
          </CardTitle>
          {isVisibleOnLandingPage && (
            <Link href={`/projects/${projectId}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                Preview
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visibility Toggle */}
        <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-1">Show on Landing Page</h4>
              <p className="text-xs text-muted-foreground">
                Enable to display this project on the public landing page.
              </p>
            </div>
            <Switch
              checked={showOnLandingPage}
              onCheckedChange={handleToggleVisibility}
              disabled={togglingVisibility}
            />
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap gap-2">
            {showOnLandingPage ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Enabled by Admin
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Hidden
              </Badge>
            )}
            {customerOptedOut && (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1">
                <AlertTriangle className="h-3 w-3" />
                Customer Opted Out
              </Badge>
            )}
          </div>

          {customerOptedOut && showOnLandingPage && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              This project is enabled but won't show because the customer has opted out.
            </p>
          )}
        </div>

        {/* Metadata Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Page Metadata</h4>
            {!editingMetadata ? (
              <Button variant="ghost" size="sm" onClick={() => setEditingMetadata(true)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingMetadata(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveMetadata} disabled={saving} className="gap-1">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
              </div>
            )}
          </div>

          {editingMetadata ? (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
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
                  placeholder="e.g., Home Services, E-commerce, Healthcare"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea
                  value={metadataForm.public_description}
                  onChange={(e) => setMetadataForm({ ...metadataForm, public_description: e.target.value })}
                  placeholder="Brief description for the public page"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Hero Image</label>
                {/* Hidden file input */}
                <input
                  ref={heroImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageSelect}
                  className="hidden"
                />

                {/* Image preview and upload area */}
                {metadataForm.public_hero_image ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border bg-muted">
                      <Image
                        src={metadataForm.public_hero_image}
                        alt="Hero preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => setMetadataForm({ ...metadataForm, public_hero_image: "" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleHeroImagePaste}
                        disabled={uploadingHeroImage}
                      >
                        <Clipboard className="h-4 w-4 mr-1" />
                        Paste
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => heroImageInputRef.current?.click()}
                    onDrop={handleHeroImageDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {uploadingHeroImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload, drag & drop, or paste from clipboard
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              heroImageInputRef.current?.click()
                            }}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleHeroImagePaste()
                            }}
                          >
                            <Clipboard className="h-4 w-4 mr-1" />
                            Paste
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional manual URL input */}
                <div className="mt-3">
                  <label className="text-xs text-muted-foreground mb-1 block">Or enter URL manually:</label>
                  <Input
                    value={metadataForm.public_hero_image}
                    onChange={(e) => setMetadataForm({ ...metadataForm, public_hero_image: e.target.value })}
                    placeholder="https://..."
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span>{metadataForm.public_title || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry:</span>
                <span>{metadataForm.public_industry || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hero Image:</span>
                {metadataForm.public_hero_image ? (
                  <div className="mt-2 relative aspect-video w-full max-w-xs rounded-lg overflow-hidden border bg-muted">
                    <Image
                      src={metadataForm.public_hero_image}
                      alt="Hero preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="ml-2">—</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Blocks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Content Blocks</h4>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Block
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Content Block</DialogTitle>
                  <DialogDescription>
                    Add a new content block to the public project page.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Block Type</label>
                    <Select value={newBlockType} onValueChange={(v) => setNewBlockType(v as "header" | "text" | "image")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">
                          <div className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Header
                          </div>
                        </SelectItem>
                        <SelectItem value="text">
                          <div className="flex items-center gap-2">
                            <AlignLeft className="h-4 w-4" />
                            Text
                          </div>
                        </SelectItem>
                        <SelectItem value="image">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Image
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      {newBlockType === "image" ? "Image URL" : "Content"}
                    </label>
                    {newBlockType === "text" ? (
                      <Textarea
                        value={newBlockContent}
                        onChange={(e) => setNewBlockContent(e.target.value)}
                        placeholder="Enter your content..."
                        rows={5}
                      />
                    ) : (
                      <Input
                        value={newBlockContent}
                        onChange={(e) => setNewBlockContent(e.target.value)}
                        placeholder={newBlockType === "image" ? "https://..." : "Enter header text..."}
                      />
                    )}
                  </div>
                  {newBlockType === "image" && (
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Alt Text</label>
                      <Input
                        value={newBlockImageAlt}
                        onChange={(e) => setNewBlockImageAlt(e.target.value)}
                        placeholder="Describe the image..."
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={addingBlock}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBlock} disabled={!newBlockContent.trim() || addingBlock}>
                    {addingBlock ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                    Add Block
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading content blocks...
            </div>
          ) : blocks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <AlignLeft className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No content blocks yet.</p>
              <p className="text-xs">Click "Add Block" to add content to the public page.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30 group"
                >
                  <div className="text-muted-foreground mt-1">
                    <GripVertical className="h-4 w-4 opacity-50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getBlockIcon(block.type)}
                      <Badge variant="outline" className="text-xs">
                        {block.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {block.content}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(block)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteBlock(block.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Block Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Content Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {editingBlock?.type === "image" ? "Image URL" : "Content"}
              </label>
              {editingBlock?.type === "text" ? (
                <Textarea
                  value={editBlockContent}
                  onChange={(e) => setEditBlockContent(e.target.value)}
                  rows={5}
                />
              ) : (
                <Input
                  value={editBlockContent}
                  onChange={(e) => setEditBlockContent(e.target.value)}
                />
              )}
            </div>
            {editingBlock?.type === "image" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Alt Text</label>
                <Input
                  value={editBlockImageAlt}
                  onChange={(e) => setEditBlockImageAlt(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={updatingBlock}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBlock} disabled={!editBlockContent.trim() || updatingBlock}>
              {updatingBlock ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
